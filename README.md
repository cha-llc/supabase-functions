# C.H.A. LLC Supabase Edge Functions

## send-report (v8)
Transactional email for all 6 products.
- Gmail app password: hhficyaucdehazau (Supabase app pwd)
- RCPT TO: cs@cjhadisa.com + customer (Gmail relay requirement)

## send-newsletter (v10)
Slack-triggered newsletter to subscribers.
- Uses GMAIL_APP_PASSWORD env var (Newsletter Automation app pwd — DO NOT replace)
- Triggered by CJ posting in #newsletter

## internal-alert (v3)
Error reporting for all 3 digital tools.
- Email: cs@cjhadisa.com (CONFIRMED WORKING)
- Slack: requires SLACK_BOT_TOKEN in Supabase Function secrets
  → go to supabase.com/dashboard/project/vzzzqsmqqaoilkmskadl/settings/functions

## lookup-customer (v1)
Sprint 2 delivery emails (burnout-reset, couples-clarity, firstgen-table).
- Requires STRIPE_SECRET_KEY in Supabase Function secrets

## Error routing
| Type | Slack Channel | Email |
|---|---|---|
| error | #technical-alerts C0ARTQ4USMV | cs@cjhadisa.com ✅ |
| payment | #sales-log C0ASCQV5RNY | — |
| critical | #escalations C0AT3NDG5BJ | cs@cjhadisa.com ✅ |
| technical | #technical-alerts C0ARTQ4USMV | — |
