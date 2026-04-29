'use client';

import { useState, useMemo } from 'react';
import { Table, Tag, Tooltip, Input, Card, Flex, Typography, Badge } from 'antd';
import { SearchOutlined, SwapOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Activity, StockTicker } from '@/api';

const columns: ColumnsType<Activity> = [
	{
		title: 'Manager',
		dataIndex: 'name',
		key: 'name',
		sorter: (a, b) => a.name.localeCompare(b.name),
		render: (name: string) => <Typography.Text strong>{name}</Typography.Text>
	},
	{
		title: 'Filing Period',
		dataIndex: 'period',
		key: 'period',
		width: 140,
		render: (period: string) => (
			<Tag color='geekblue' style={{ margin: 0 }}>
				{period}
			</Tag>
		)
	},
	{
		title: 'Stock Activity',
		dataIndex: 'stockTickers',
		key: 'stockTickers',
		render: (tickers: StockTicker[]) => (
			<Flex wrap gap={4}>
				{tickers.slice(0, 10).map((t) => {
					const isAdded = t.percentage.startsWith('A');
					return (
						<Tooltip
							key={t.id}
							title={
								<>
									<strong>{t.name}</strong>
									<br />
									{isAdded ? 'Added' : 'Reduced'} &middot; {t.price}
								</>
							}
						>
							<Tag
								color={isAdded ? 'success' : 'error'}
								style={{ cursor: 'pointer', margin: 0 }}
							>
								{isAdded ? '+' : '-'} {t.ticker.toUpperCase()}
							</Tag>
						</Tooltip>
					);
				})}
				{tickers.length > 10 && <Tag style={{ margin: 0 }}>+{tickers.length - 10}</Tag>}
			</Flex>
		)
	}
];

export default function ActivityTable({ data }: { data: Activity[] }) {
	const [search, setSearch] = useState('');

	const filtered = useMemo(() => {
		if (!search) return data;
		const q = search.toLowerCase();
		return data.filter(
			(a) =>
				a.name.toLowerCase().includes(q) ||
				a.stockTickers.some((t) => t.ticker.toLowerCase().includes(q))
		);
	}, [data, search]);

	return (
		<Card
			className='surface-card'
			styles={{ body: { padding: 0 } }}
		>
			<Flex align='center' justify='space-between' style={{ padding: '16px 24px' }}>
				<Flex align='center' gap={8}>
					<SwapOutlined style={{ fontSize: 18, color: '#0369a1' }} />
					<Typography.Title level={5} style={{ margin: 0 }}>
						Recent Activity
					</Typography.Title>
					<Badge
						count={filtered.length}
						style={{ background: '#e0f2fe', color: '#0369a1', boxShadow: 'none' }}
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
			<Table<Activity>
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
