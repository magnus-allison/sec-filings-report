'use client';

import { Layout, Typography, Space } from 'antd';
import type { ReactNode } from 'react';

const { Header, Content } = Layout;

export default function AppShell({ children }: { children: ReactNode }) {
	return (
		<Layout className='app-shell-layout'>
			<Header
				className='app-shell-header'
				style={{ padding: '0 32px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
			>
				<Space orientation='vertical' size={2} className='app-shell-title-stack'>
					<Typography.Text strong className='app-shell-title'>
						SEC FILINGS REPORT
					</Typography.Text>
					<Typography.Text type='secondary' className='app-shell-subtitle'>
						Live view of 13F manager positioning
					</Typography.Text>
				</Space>
				<Typography.Text type='secondary' style={{ fontSize: 13 }}>
					SEC 13F
				</Typography.Text>
			</Header>
			<Content style={{ padding: '28px 24px 36px', maxWidth: 1400, width: '100%', margin: '0 auto' }}>
				{children}
			</Content>
		</Layout>
	);
}
