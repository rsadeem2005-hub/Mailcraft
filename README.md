# MailCraft AI (v2)
Personalized email copy from a short brief. Pick an email type and audience segment, get five subject lines, preview text and a full body, check it for deliverability problems, preview it in an inbox and on a phone, then export plain text or HTML with merge tags for Klaviyo, Mailchimp or a generic format.

## Two modes
1. **Template mode (default).** A copy engine in your browser. No account or key needed.
2. **Live AI mode (optional).** Paste your own Anthropic API key and the app asks Claude to write the email. The key is held in memory only, is never saved, and is sent only to Anthropic. A key typed into a public web page is visible to anyone with access to your browser, so use a key with a low spend limit, and never put a key in the code. Check the current API docs if the request fails.

## Checks
Subject length (about 40 characters show on phones), spam-trigger words, ALL CAPS, exclamation marks, one clear call to action, personalization and reading time. These are guidelines, not a guarantee of inbox placement.

## Run
`npm install` then `npm run dev`. Build with `npm run build`. Deploy with Vercel or `npm run deploy` for GitHub Pages.
