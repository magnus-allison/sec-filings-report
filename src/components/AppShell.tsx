'use client';

import { Layout, Typography, Flex } from 'antd';
import type { ReactNode } from 'react';

const { Header, Content } = Layout;

export default function AppShell({ children }: { children: ReactNode }) {
	return (
		<Layout style={{ minHeight: '100vh', background: '#f5f5f7' }}>
			<Header
				style={{
					background: '#fff',
					padding: '0 32px',
					height: 56,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					borderBottom: '1px solid #e5e7eb'
				}}
			>
				<Typography.Text strong style={{ fontSize: 16 }}>
					SEC Filings Report
				</Typography.Text>
				<Typography.Text type='secondary' style={{ fontSize: 13 }}>
					13F Filings
				</Typography.Text>
			</Header>
			<Content style={{ padding: '24px 32px', maxWidth: 1400, width: '100%', margin: '0 auto' }}>
				{children}
			</Content>
		</Layout>
	);
}
