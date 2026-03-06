import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import ThemeProvider from '@/components/ThemeProvider';
import AppShell from '@/components/AppShell';
import './globals.css';

export const metadata: Metadata = {
	title: 'Super Investors — 13F Portfolio Tracker',
	description: 'Track the portfolios and activity of top investment managers via SEC 13F filings'
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en'>
			<body>
				<AntdRegistry>
					<ThemeProvider>
						<AppShell>{children}</AppShell>
					</ThemeProvider>
				</AntdRegistry>
			</body>
		</html>
	);
}
