'use client';

import { useMemo, useState } from 'react';
import { Card, Segmented, Slider, Space, Tag, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, LineChartOutlined } from '@ant-design/icons';
import type { Activity } from '@/api';

interface MomentumRadarProps {
	activities: Activity[];
}

interface ScoreRow {
	ticker: string;
	company: string;
	adds: number;
	reds: number;
	score: number;
}

function buildRows(activities: Activity[], selectedPeriod: string): ScoreRow[] {
	const bucket = new Map<string, ScoreRow>();

	for (const activity of activities) {
		if (selectedPeriod !== 'All' && activity.period !== selectedPeriod) continue;

		for (const stock of activity.stockTickers) {
			const ticker = stock.ticker.toUpperCase();
			if (!ticker) continue;

			const row = bucket.get(ticker) ?? {
				ticker,
				company: stock.name || ticker,
				adds: 0,
				reds: 0,
				score: 0
			};

			const isAdd = stock.percentage.startsWith('A');
			if (isAdd) row.adds += 1;
			else row.reds += 1;
			row.score = row.adds - row.reds;

			if (!bucket.has(ticker)) bucket.set(ticker, row);
		}
	}

	return Array.from(bucket.values());
}

export default function MomentumRadar({ activities }: MomentumRadarProps) {
	const periods = useMemo(
		() => ['All', ...Array.from(new Set(activities.map((a) => a.period)))],
		[activities]
	);
	const [period, setPeriod] = useState<string>(periods[0] ?? 'All');
	const [minimumMentions, setMinimumMentions] = useState<number>(2);

	const rows = useMemo(() => buildRows(activities, period), [activities, period]);

	const filtered = useMemo(
		() => rows.filter((r) => r.adds + r.reds >= minimumMentions),
		[rows, minimumMentions]
	);

	const topAdds = useMemo(
		() => [...filtered].sort((a, b) => b.score - a.score).slice(0, 5),
		[filtered]
	);
	const topReds = useMemo(
		() => [...filtered].sort((a, b) => a.score - b.score).slice(0, 5),
		[filtered]
	);

	return (
		<Card className='momentum-radar-card' style={{ marginBottom: 24 }}>
			<Space orientation='vertical' size={14} style={{ width: '100%' }}>
				<Space align='center'>
					<LineChartOutlined style={{ fontSize: 18, color: '#0f766e' }} />
					<Typography.Title level={4} style={{ margin: 0 }}>
						Momentum Radar
					</Typography.Title>
					<Tag color='cyan'>{filtered.length} tickers</Tag>
				</Space>

				<Space wrap size={16} style={{ width: '100%', justifyContent: 'space-between' }}>
					<Segmented value={period} options={periods} onChange={(v) => setPeriod(String(v))} />
					<Space style={{ minWidth: 280 }}>
						<Typography.Text type='secondary'>Minimum mentions</Typography.Text>
						<Slider
							min={1}
							max={10}
							value={minimumMentions}
							onChange={setMinimumMentions}
							style={{ width: 160, margin: 0 }}
						/>
						<Tag>{minimumMentions}+</Tag>
					</Space>
				</Space>

				<div className='momentum-grid'>
					<div className='momentum-col'>
						<Typography.Text strong style={{ color: '#166534' }}>
							<ArrowUpOutlined /> Most Added
						</Typography.Text>
						{topAdds.map((row) => (
							<div key={`add-${row.ticker}`} className='momentum-item momentum-item-add'>
								<span>{row.ticker}</span>
								<span>+{row.adds}</span>
							</div>
						))}
					</div>
					<div className='momentum-col'>
						<Typography.Text strong style={{ color: '#991b1b' }}>
							<ArrowDownOutlined /> Most Reduced
						</Typography.Text>
						{topReds.map((row) => (
							<div key={`red-${row.ticker}`} className='momentum-item momentum-item-red'>
								<span>{row.ticker}</span>
								<span>-{row.reds}</span>
							</div>
						))}
					</div>
				</div>
			</Space>
		</Card>
	);
}
