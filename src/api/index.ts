import { load } from 'cheerio';

export interface StockTicker {
	id: number;
	ticker: string;
	name: string;
	percentage: string;
	price: string;
}

export interface Manager {
	index: number;
	name: string;
	value: string;
	stockNumber: string;
	stockTickers: StockTicker[];
}

export interface Activity {
	index: number;
	name: string;
	period: string;
	stockTickers: StockTicker[];
}

export interface SPGridEntry {
	index: number;
	ticker: string;
	name: string;
	sector: string;
	ownership: number;
	holdPrice: string;
}

function buildDataUrl(path: string): string | null {
	const baseUrl = process.env.DATA_API_URL;
	if (!baseUrl) return null;
	return `${baseUrl.replace(/\/$/, '')}${path}`;
}

export async function fetchManagersData(): Promise<Manager[]> {
	const url = buildDataUrl('/m/managers.php');
	if (!url) return [];

	const rawResponse = await fetch(url);
	const data = await rawResponse.text();
	const $ = load(data);

	const managers: Manager[] = [];

	$('#grid > tbody > tr').each((rowIdx, row) => {
		const name = $(row).find('td').eq(0).text();
		const value = $(row).find('td').eq(1).text();
		const stockNumber = $(row).find('td').eq(2).text();
		const stockTickers: StockTicker[] = [];

		$(row)
			.find('.sym')
			.each((colIdx, cell) => {
				const parts = $(cell).find('div').html()?.split('<br>') ?? [];

				stockTickers.push({
					id: colIdx,
					ticker: $(cell).find('a').text(),
					name: parts[0] ?? '',
					percentage: parts[1] ?? '',
					price: parts[2] ?? ''
				});
			});

		managers.push({ index: rowIdx, name, value, stockNumber, stockTickers });
	});

	return managers;
}

export async function fetchActivityData(): Promise<Activity[]> {
	const url = buildDataUrl('/m/allact.php?typ=a');
	if (!url) return [];

	const rawResponse = await fetch(url);
	const data = await rawResponse.text();
	const $ = load(data);

	const activities: Activity[] = [];

	$('#grid > tbody > tr').each((rowIdx, row) => {
		const name = $(row).find('td').eq(0).text();
		const period = $(row).find('td').eq(1).text();
		const stockTickers: StockTicker[] = [];

		$(row)
			.find('.sym')
			.each((colIdx, cell) => {
				const parts = $(cell).find('div').html()?.split('<br>') ?? [];

				stockTickers.push({
					id: colIdx,
					ticker: $(cell).find('a').text(),
					name: parts[0] ?? '',
					percentage: parts[1] ?? '',
					price: parts[2] ?? ''
				});
			});

		activities.push({ index: rowIdx, name, period, stockTickers });
	});

	return activities;
}

export async function fetchSPGridData(): Promise<SPGridEntry[]> {
	try {
		const rawResponse = await fetch('https://www.dataroma.com/m/grid.php');
		const data = await rawResponse.text();
		const $ = load(data);
		const rows: SPGridEntry[] = [];

		$('#grid td .tit_ctl').each((idx, cell) => {
			const ticker = $(cell).find('a').first().text().trim();
			const detailsHtml = $(cell).find('div').first().html() ?? '';
			const details = detailsHtml.split('<br>').map((part) => load(`<x>${part}</x>`)('x').text().trim());
			const name = details[0] || '';
			const sector = details[1]?.replace(/^\(|\)$/g, '') || '';
			const ownershipMatch = details[2]?.match(/(\d+)/);
			const holdPriceText = $(cell).find('.hp').first().text().trim();

			if (!ticker) return;

			rows.push({
				index: idx,
				ticker,
				name,
				sector,
				ownership: ownershipMatch ? Number(ownershipMatch[1]) : 0,
				holdPrice: holdPriceText.replace(/^Hold Price:\s*/i, '')
			});
		});

		return rows;
	} catch (error) {
		console.error('Failed to fetch S&P grid data:', error);
		return [];
	}
}
