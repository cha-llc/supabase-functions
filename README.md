# C.H.A. LLC Supabase Edge Functions

## send-report
Transactional email delivery for all 6 products.
- Uses Supabase Gmail app password (hhficyaucdehazau)
- RCPT TO: cs@cjhadisa.com + customer email (required for Gmail relay)

## send-newsletter  
Slack-triggered newsletter to all subscribers.
- Uses GMAIL_APP_PASSWORD env var (Newsletter Automation password)
- Triggered by CJ posting in #newsletter Slack channel

## lookup-customer
Sprint 2 post-payment email delivery.
- Requires STRIPE_SECRET_KEY in Supabase secrets
- Products: burnout-reset, couples-clarity, firstgen-table

## App password separation
| Function | Password | Source |
|---|---|---|
| send-report | hhficyaucdehazau | Supabase app pwd (Apr 12) |
| send-newsletter | GMAIL_APP_PASSWORD env var | Newsletter Automation (Apr 11) |
| lookup-customer | hhficyaucdehazau | Supabase app pwd (Apr 12) |
