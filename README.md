# SEC Filings Report

A dashboard that tracks SEC 13F filings from the world's biggest investors — showing what they hold, where they're buying, and what they've recently added or sold.

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
