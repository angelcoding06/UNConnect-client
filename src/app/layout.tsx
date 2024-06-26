import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '../context/authContext';
import './globals.css';
import { StrictMode } from 'react';
const inter = Inter({ subsets: ['latin'] });
import { ApolloWrapper } from './ApolloWrapper';

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<StrictMode>
				<AuthProvider>
					<body className={inter.className}>
						<ApolloWrapper>{children}</ApolloWrapper>
					</body>
				</AuthProvider>
			</StrictMode>
		</html>
	);
}
