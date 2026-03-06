'use client';

import type { ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';

const customTheme = {
	token: {
		colorPrimary: '#4f46e5',
		colorSuccess: '#10b981',
		colorError: '#ef4444',
		colorWarning: '#f59e0b',
		colorInfo: '#3b82f6',
		borderRadius: 10,
		fontFamily:
			"'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
		colorBgContainer: '#ffffff',
		colorBgLayout: '#f5f5f7',
		wireframe: false
	},
	algorithm: theme.defaultAlgorithm
};

export default function ThemeProvider({ children }: { children: ReactNode }) {
	return <ConfigProvider theme={customTheme}>{children}</ConfigProvider>;
}
