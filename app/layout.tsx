import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Business Context Engine | AI → Execution Translator',
    description: 'Continuously translate strategic intent into prioritized, role-specific execution tasks.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <main>{children}</main>
            </body>
        </html>
    );
}
