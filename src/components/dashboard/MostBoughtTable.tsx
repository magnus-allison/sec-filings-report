'use client';

import { useState, useMemo } from 'react';
import { Table, Tag, Input, Card, Flex, Typography, Badge, Progress } from 'antd';
import { SearchOutlined, FireOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Manager, Activity } from '@/api';

interface AggregatedStock {
	key: string;
	ticker: string;
	name: string;
	holders: number;
	holderNames: string[];
	buyers: number;
	buyerNames: string[];
	price: string;
}

function aggregate(managers: Manager[], activities: Activity[]): AggregatedStock[] {
	const map = new Map<string, AggregatedStock>();

	for (const m of managers) {
		for (const t of m.stockTickers) {
			const ticker = t.ticker.toUpperCase();
			if (!ticker) continue;
			const existing = map.get(ticker);
			if (existing) {
				if (!existing.holderNames.includes(m.name)) {
					existing.holders++;
					existing.holderNames.push(m.name);
				}
				if (!existing.price && t.price) existing.price = t.price;
				if (!existing.name && t.name) existing.name = t.name;
			} else {
				map.set(ticker, {
					key: ticker,
					ticker,
					name: t.name,
					holders: 1,
					holderNames: [m.name],
					buyers: 0,
					buyerNames: [],
					price: t.price
				});
			}
		}
	}

	for (const a of activities) {
		for (const t of a.stockTickers) {
			const ticker = t.ticker.toUpperCase();
			if (!ticker) continue;
			const isAdded = t.percentage.startsWith('A');
			if (!isAdded) continue;

			const existing = map.get(ticker);
			if (existing) {
				if (!existing.buyerNames.includes(a.name)) {
					existing.buyers++;
					existing.buyerNames.push(a.name);
				}
			} else {
				map.set(ticker, {
					key: ticker,
					ticker,
					name: t.name,
					holders: 0,
					holderNames: [],
					buyers: 1,
					buyerNames: [a.name],
					price: t.price
				});
			}
		}
	}

	return Array.from(map.values()).sort((a, b) => b.holders + b.buyers - (a.holders + a.buyers));
}

export default function MostBoughtTable({
	managers,
	activities
}: {
	managers: Manager[];
	activities: Activity[];
}) {
	const [search, setSearch] = useState('');
	const stocks = useMemo(() => aggregate(managers, activities), [managers, activities]);
	const maxHolders = useMemo(() => Math.max(...stocks.map((s) => s.holders), 1), [stocks]);

	const filtered = useMemo(() => {
		if (!search) return stocks;
		const q = search.toLowerCase();
		return stocks.filter(
			(s) =>
				s.ticker.toLowerCase().includes(q) ||
				s.name.toLowerCase().includes(q) ||
				s.holderNames.some((n) => n.toLowerCase().includes(q))
		);
	}, [stocks, search]);

	const columns: ColumnsType<AggregatedStock> = [
		{
			title: 'Ticker',
			dataIndex: 'ticker',
			key: 'ticker',
			width: 100,
			sorter: (a, b) => a.ticker.localeCompare(b.ticker),
			render: (ticker: string) => (
				<Tag color='cyan' style={{ margin: 0, fontWeight: 600 }}>
					{ticker}
				</Tag>
			)
		},
		{
			title: 'Company',
			dataIndex: 'name',
			key: 'name',
			sorter: (a, b) => a.name.localeCompare(b.name),
			render: (name: string) => <Typography.Text strong>{name}</Typography.Text>
		},
		{
			title: 'Held By',
			dataIndex: 'holders',
			key: 'holders',
			width: 200,
			sorter: (a, b) => a.holders - b.holders,
			defaultSortOrder: 'descend',
			render: (holders: number, record) => (
				<Flex vertical gap={2}>
					<Flex align='center' gap={8}>
						<Progress
							percent={Math.round((holders / maxHolders) * 100)}
							showInfo={false}
							size='small'
							strokeColor='#0f766e'
							style={{ flex: 1, margin: 0 }}
						/>
						<Typography.Text style={{ fontSize: 13, minWidth: 60 }}>
							{holders} {holders === 1 ? 'fund' : 'funds'}
						</Typography.Text>
					</Flex>
				</Flex>
			)
		},
		{
			title: 'Recently Added By',
			dataIndex: 'buyers',
			key: 'buyers',
			width: 180,
			sorter: (a, b) => a.buyers - b.buyers,
			render: (buyers: number) =>
				buyers > 0 ? (
					<Badge
						count={`+${buyers} ${buyers === 1 ? 'fund' : 'funds'}`}
						style={{
							background: '#f0fdf4',
							color: '#15803d',
							fontWeight: 600,
							fontSize: 12,
							boxShadow: 'none',
							borderRadius: 6
						}}
					/>
				) : (
					<Typography.Text type='secondary' style={{ fontSize: 13 }}>
						—
					</Typography.Text>
				)
		},
		{
			title: 'Holders',
			dataIndex: 'holderNames',
			key: 'holderNames',
			render: (names: string[]) => (
				<Flex wrap gap={4}>
					{names.slice(0, 4).map((n) => (
						<Tag key={n} style={{ margin: 0, fontSize: 11 }}>
							{n.length > 20 ? n.slice(0, 20) + '…' : n}
						</Tag>
					))}
					{names.length > 4 && <Tag style={{ margin: 0 }}>+{names.length - 4}</Tag>}
				</Flex>
			)
		}
	];

	return (
		<Card
			className='surface-card'
			styles={{ body: { padding: 0 } }}
		>
			<Flex align='center' justify='space-between' style={{ padding: '16px 24px' }}>
				<Flex align='center' gap={8}>
					<FireOutlined style={{ fontSize: 18, color: '#b45309' }} />
					<Typography.Title level={5} style={{ margin: 0 }}>
						Most Popular Stocks
					</Typography.Title>
					<Badge
						count={filtered.length}
						style={{ background: '#fef3c7', color: '#b45309', boxShadow: 'none' }}
					/>
				</Flex>
				<Input.Search
					placeholder='Search tickers, companies, or managers...'
					allowClear
					style={{ width: 320 }}
					prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</Flex>
			<Table<AggregatedStock>
				columns={columns}
				rowKey='key'
				dataSource={filtered}
				pagination={{
					placement: ['bottomCenter'],
					pageSize: 15,
					hideOnSinglePage: true,
					showSizeChanger: false,
					showTotal: (total, range) => (
						<Typography.Text type='secondary' style={{ fontSize: 13 }}>
							{range[0]}–{range[1]} of {total}
						</Typography.Text>
					)
				}}
				size='middle'
				style={{ borderTop: '1px solid #f0f0f0' }}
			/>
		</Card>
	);
}
