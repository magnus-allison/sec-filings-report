'use client';

import { Stock } from '@ant-design/plots';
import { useEffect, useState } from 'react';
import { fetchStockData } from '@/api/stockData';

interface StockTickerProps {
	ticker: string;
}

export default function StockTicker({ ticker }: StockTickerProps) {
	const [data, setData] = useState<unknown[]>([]);

	useEffect(() => {
		void fetchStockData(ticker).then((result) => {
			if (Array.isArray(result)) {
				setData(result);
			}
		});
	}, [ticker]);

	if (data.length === 0) return <div>Loading chart...</div>;

	return <Stock data={data} autoFit xField='date' yField={['open', 'close', 'high', 'low']} />;
}
