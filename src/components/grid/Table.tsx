'use client';

import { useMemo, useState } from 'react';
import { Badge, Card, Flex, Input, Table, Tag, Typography } from 'antd';
import { AppstoreOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { SPGridEntry } from '@/api';

const columns: ColumnsType<SPGridEntry> = [
	{
		title: '#',
		dataIndex: 'index',
		key: 'index',
		width: 64,
		render: (_: number, __: SPGridEntry, idx: number) => idx + 1
	},
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
		title: 'Sector',
		dataIndex: 'sector',
		key: 'sector',
		width: 220,
		sorter: (a, b) => a.sector.localeCompare(b.sector)
	},
	{
		title: 'Ownership',
		dataIndex: 'ownership',
		key: 'ownership',
		width: 120,
		defaultSortOrder: 'descend',
		sorter: (a, b) => a.ownership - b.ownership,
		render: (ownership: number) => (
			<Badge count={ownership} style={{ background: '#e0f2fe', color: '#0369a1', boxShadow: 'none' }} />
		)
	},
	{
		title: 'Hold Price',
		dataIndex: 'holdPrice',
		key: 'holdPrice',
		width: 140
	}
];

export default function SPGridTable({ data }: { data: SPGridEntry[] }) {
	const [search, setSearch] = useState('');

	const filtered = useMemo(() => {
		if (!search) return data;
		const q = search.toLowerCase();
		return data.filter(
			(row) =>
				row.ticker.toLowerCase().includes(q) ||
				row.name.toLowerCase().includes(q) ||
				row.sector.toLowerCase().includes(q)
		);
	}, [data, search]);

	return (
		<Card className='surface-card' styles={{ body: { padding: 0 } }}>
			<Flex align='center' justify='space-between' style={{ padding: '16px 24px' }}>
				<Flex align='center' gap={8}>
					<AppstoreOutlined style={{ fontSize: 18, color: '#0f766e' }} />
					<Typography.Title level={5} style={{ margin: 0 }}>
						S&P 500 List
					</Typography.Title>
					<Badge
						count={filtered.length}
						style={{ background: '#e6fffb', color: '#0f766e', boxShadow: 'none' }}
					/>
				</Flex>
				<Input.Search
					placeholder='Search ticker, company, or sector...'
					allowClear
					style={{ width: 320 }}
					prefix={<SearchOutlined style={{ color: '#9ca3af' }} />}
					onChange={(e) => setSearch(e.target.value)}
				/>
			</Flex>
			<Table<SPGridEntry>
				columns={columns}
				rowKey={(record) => `${record.ticker}-${record.index}`}
				dataSource={filtered}
				pagination={{
					placement: ['bottomCenter'],
					pageSize: 20,
					hideOnSinglePage: true,
					showSizeChanger: false
				}}
				size='middle'
				style={{ borderTop: '1px solid #f0f0f0' }}
			/>
		</Card>
	);
}
