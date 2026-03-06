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

export async function fetchManagersData(): Promise<Manager[]> {
	const url = process.env.MANAGERS_API_URL;
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
	const url = process.env.ACTIVITY_API_URL;
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
