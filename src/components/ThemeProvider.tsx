'use client';

import type { ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';

const customTheme = {
	token: {
		colorPrimary: '#0f766e',
		colorSuccess: '#15803d',
		colorError: '#b91c1c',
		colorWarning: '#b45309',
		colorInfo: '#0369a1',
		borderRadius: 14,
		fontFamily:
			"'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
		colorBgContainer: '#ffffff',
		colorBgLayout: '#f3f6f8',
		colorText: '#0f172a',
		colorTextSecondary: '#475569',
		boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
		wireframe: false
	},
	components: {
		Card: {
			borderRadiusLG: 16
		},
		Tabs: {
			inkBarColor: '#0f766e',
			itemSelectedColor: '#0f766e',
			itemHoverColor: '#0f766e'
		},
		Table: {
			headerBg: '#f8fafc',
			headerColor: '#475569',
			rowHoverBg: '#f0fdfa'
		}
	},
	algorithm: theme.defaultAlgorithm
};

export default function ThemeProvider({ children }: { children: ReactNode }) {
	return <ConfigProvider theme={customTheme}>{children}</ConfigProvider>;
}
