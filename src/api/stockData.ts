'use server';

export async function fetchStockData(ticker: string): Promise<unknown> {
	const API_KEY = process.env.IEXAPI_KEY;

	try {
		const rawRes = await fetch(
			`https://sandbox.iexapis.com/stable/stock/${ticker}/chart?token=${API_KEY}`
		);
		return await rawRes.json();
	} catch (error) {
		console.error('Failed to fetch stock data:', error);
		return null;
	}
}
