'use client';

import { Card, Col, Row, Statistic } from 'antd';
import { TeamOutlined, DollarOutlined, BarChartOutlined, RiseOutlined } from '@ant-design/icons';
import type { Manager, Activity } from '@/api';

interface StatsProps {
	managers: Manager[];
	activities: Activity[];
}

function parsePortfolioValue(value: string): number {
	let multiplier = 1;
	let cleaned = value;

	if (cleaned.endsWith('B')) {
		multiplier = 1e9;
		cleaned = cleaned.slice(1, -1);
	} else if (cleaned.endsWith('M')) {
		multiplier = 1e6;
		cleaned = cleaned.slice(1, -1);
	} else {
		cleaned = cleaned.slice(1);
	}

	return parseFloat(cleaned) * multiplier;
}

function formatCurrency(value: number): string {
	if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
	if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
	if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
	return `$${value.toLocaleString()}`;
}

export default function StatsOverview({ managers, activities }: StatsProps) {
	const totalManagers = managers.length;
	const totalAUM = managers.reduce((sum, m) => sum + parsePortfolioValue(m.value), 0);
	const totalStocks = new Set(managers.flatMap((m) => m.stockTickers.map((t) => t.ticker))).size;
	const activityPeriods = new Set(activities.map((a) => a.period)).size;

	const cards = [
		{
			title: 'Managers Tracked',
			value: totalManagers,
			icon: <TeamOutlined />,
			color: '#0f766e'
		},
		{
			title: 'Total AUM',
			value: formatCurrency(totalAUM),
			icon: <DollarOutlined />,
			color: '#0369a1'
		},
		{
			title: 'Unique Stocks',
			value: totalStocks,
			icon: <BarChartOutlined />,
			color: '#7c3aed'
		},
		{
			title: 'Filing Periods',
			value: activityPeriods,
			icon: <RiseOutlined />,
			color: '#b45309'
		}
	];

	return (
		<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
			{cards.map((card) => (
				<Col key={card.title} xs={24} sm={12} lg={6}>
					<Card
						className='surface-card stat-card'
						hoverable
						styles={{ body: { padding: '20px 24px' } }}
					>
						<Statistic
							title={
								<span style={{ color: '#6b7280', fontSize: 13, fontWeight: 500 }}>
									{card.title}
								</span>
							}
							value={typeof card.value === 'number' ? card.value : undefined}
							formatter={typeof card.value === 'string' ? () => card.value : undefined}
							prefix={
								<span
									style={{
										color: card.color,
										fontSize: 20,
										marginRight: 4
									}}
								>
									{card.icon}
								</span>
							}
							styles={{
								content: {
									fontSize: 28,
									fontWeight: 700,
									color: '#111827'
								}
							}}
						/>
					</Card>
				</Col>
			))}
		</Row>
	);
}
