# 🔄 Keep-Alive Setup — Render Free Tier

## How it works

Render's free tier spins down services after **15 minutes of inactivity**.
Two layers are in place to prevent this:

---

## Layer 1 — Vercel Cron (Primary)

Every **5 minutes**, Vercel automatically calls:
```
GET https://safarnama-khaki.vercel.app/api/ping
```

This `/api/ping` endpoint:
1. Returns `200 OK` (confirming Next.js is alive)
2. Immediately pings `https://safarnama-gmpm.onrender.com/ping` to wake Render

### Setup (already done ✅)
- `app/api/ping/route.ts` — the ping handler
- `vercel.json` — cron schedule `*/5 * * * *`

> **Note:** Vercel Cron jobs require the **Hobby plan or above**. The Hobby plan is free.
> After deploying, confirm crons are active at: Vercel Dashboard → Project → Settings → Cron Jobs

---

## Layer 2 — Free External Monitor (Backup / Recommended)

Use **[cron-job.org](https://cron-job.org)** (100% free, no credit card) as a backup:

1. Sign up at https://cron-job.org
2. Create a new cron job:
   - **URL:** `https://safarnama-khaki.vercel.app/api/ping`
   - **Schedule:** Every 5 minutes
   - **Notifications:** Enable failure alerts (email)
3. Save — done!

Alternative free monitors:
- **UptimeRobot** — https://uptimerobot.com (free tier, 5-min intervals)
- **Freshping** — https://freshping.io (free, 1-min intervals)

---

## Ping Response

```json
{
  "status": "ok",
  "timestamp": "2026-09-05T00:00:00.000Z",
  "backend": "ok",
  "message": "Safarnama is alive 🚀"
}
```

`backend: "ok"` → Render responded successfully  
`backend: "error"` → Render was cold-starting (will be warm in ~30s)  
`backend: "skipped"` → `BACKEND_URL` env var not set

---

## Vercel Environment Variables Required

Make sure these are set in **Vercel → Settings → Environment Variables**:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://safarnama-gmpm.onrender.com` |
