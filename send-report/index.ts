import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GMAIL_APP_PASSWORD = 'hhficyaucdehazau';
const GMAIL_USER = 'chaholdingsltd@gmail.com';
const FROM_NAME = 'C.H.A. LLC';
const REPLY_TO = 'cs@cjhadisa.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  try {
    const { to, subject, html } = await req.json();
    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: 'Missing to, subject, or html' }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    const enc = new TextEncoder();
    const dec = new TextDecoder();
    const conn = await Deno.connectTls({ hostname: 'smtp.gmail.com', port: 465 });

    const rd = async () => {
      const b = new Uint8Array(4096);
      const n = await conn.read(b);
      return n ? dec.decode(b.subarray(0, n)) : '';
    };
    const wr = async (c: string) => {
      await conn.write(enc.encode(c + '\r\n'));
      return await rd();
    };

    await rd();
    await wr('EHLO supabase.co');
    await wr('AUTH LOGIN');
    await wr(btoa(GMAIL_USER));
    const authResp = await wr(btoa(GMAIL_APP_PASSWORD));

    if (!authResp.startsWith('235')) {
      conn.close();
      return new Response(JSON.stringify({ error: 'Gmail auth failed', detail: authResp.substring(0, 80) }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    await wr(`MAIL FROM:<${GMAIL_USER}>`);
    await wr(`RCPT TO:<${REPLY_TO}>`);
    await wr(`RCPT TO:<${to}>`);
    await wr('DATA');

    const emailBody = [
      `From: ${FROM_NAME} <${GMAIL_USER}>`,
      `Reply-To: ${REPLY_TO}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      '',
      html,
      '.'
    ].join('\r\n');

    const sendResp = await wr(emailBody);
    await wr('QUIT');
    conn.close();

    const success = sendResp.includes('250') || sendResp.includes('OK') || sendResp.includes('queued');
    console.log('send-report:', success ? 'SENT' : 'FAILED', '| to:', to);

    if (success) {
      return new Response(JSON.stringify({ success: true, to }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    } else {
      return new Response(JSON.stringify({ error: 'SMTP send rejected', detail: sendResp.substring(0, 100) }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

  } catch(err) {
    console.error('SMTP exception:', err.message);
    return new Response(JSON.stringify({ error: 'SMTP failed', detail: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
