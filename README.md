# SEC Filings Report

A dashboard that tracks SEC 13F filings from the world's biggest investors — showing what they hold, where they're buying, and what they've recently added or sold.

<img width="1199" height="834" alt="Screenshot 2026-03-06 at 13 24 24" src="https://github.com/user-attachments/assets/6a730349-2896-437f-8dfa-46a75bb13bd6" />

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Environment

Set `DATA_API_URL` to the DataRoma base URL used by this app (for example `https://www.dataroma.com`).

- Managers endpoint: `${DATA_API_URL}/m/managers.php`
- Activity endpoint: `${DATA_API_URL}/m/allact.php?typ=a`
- S&P Grid endpoint: pulled directly from `https://www.dataroma.com/m/grid.php`
