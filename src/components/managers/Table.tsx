'use client';

import { useState, useMemo } from 'react';
import { Table, Tag, Tooltip, Input, Card, Flex, Typography, Badge } from 'antd';
import { SearchOutlined, DollarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Manager, StockTicker } from '@/api';

function parseValue(value: string): number {
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

const columns: ColumnsType<Manager> = [
	{
		title: 'Manager',
		dataIndex: 'name',
		key: 'name',
		sorter: (a, b) => a.name.localeCompare(b.name),
		render: (name: string) => <Typography.Text strong>{name}</Typography.Text>
	},
	{
		title: 'Portfolio Value',
		dataIndex: 'value',
		key: 'value',
		sorter: (a, b) => parseValue(a.value) - parseValue(b.value),
		render: (value: string) => (
			<Badge
				count={value}
				style={{
					background: '#f0fdf4',
					color: '#15803d',
					fontWeight: 600,
					fontSize: 13,
					boxShadow: 'none',
					borderRadius: 6
				}}
			/>
		)
	},
	{
		title: 'Stocks',
		dataIndex: 'stockNumber',
		key: 'stockNumber',
		sorter: (a, b) => Number(a.stockNumber) - Number(b.stockNumber),
		width: 100,
		align: 'center'
	},
	{
		title: 'Top Holdings',
		dataIndex: 'stockTickers',
		key: 'stockTickers',
		render: (tickers: StockTicker[]) => (
			<Flex wrap gap={4}>
				{tickers.slice(0, 8).map((t) => (
					<Tooltip
						key={t.id}
						title={
							<>
								<strong>{t.name}</strong>
								<br />
								{t.percentage} &middot; {t.price}
							</>
						}
					>
						<Tag color='cyan' style={{ cursor: 'pointer', margin: 0 }}>
							{t.ticker.toUpperCase()}
						</Tag>
					</Tooltip>
				))}
				{tickers.length > 8 && <Tag style={{ margin: 0 }}>+{tickers.length - 8}</Tag>}
			</Flex>
		)
	}
];

export default function ManagersTable({ data }: { data: Manager[] }) {
	const [search, setSearch] = useState('');

	const filtered = useMemo(() => {
		if (!search) return data;
		const q = search.toLowerCase();
		return data.filter(
			(m) =>
				m.name.toLowerCase().includes(q) ||
				m.stockTickers.some((t) => t.ticker.toLowerCase().includes(q))
		);
	}, [data, search]);

	return (
		<Card
			className='surface-card'
			styles={{ body: { padding: 0 } }}
		>
			<Flex align='center' justify='space-between' style={{ padding: '16px 24px' }}>
				<Flex align='center' gap={8}>
					<DollarOutlined style={{ fontSize: 18, color: '#0f766e' }} />
					<Typography.Title level={5} style={{ margin: 0 }}>
						Portfolio Managers
					</Typography.Title>
					<Badge
						count={filtered.length}
						style={{ background: '#e6fffb', color: '#0f766e', boxShadow: 'none' }}
					/>
				</Flex>
				<Input.Search
					placeholder='Search managers or tickers...'
					allowClear
					style={{ width: 280 }}
					prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</Flex>
			<Table<Manager>
				columns={columns}
				rowKey={(record) => record.index}
				dataSource={filtered}
				pagination={{
					placement: ['bottomCenter'],
					pageSize: 12,
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
