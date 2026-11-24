import type { Metadata } from 'next';
import { Fredoka, Plus_Jakarta_Sans } from 'next/font/google';
import { AppProvider } from '@/context/AppContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import './globals.css';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

export const metadata: Metadata = {
  title: 'BIXUS.PT | O melhor de Nós para Eles — Cães e Gatos',
  description:
    'Snacks e biscoitos 100% naturais, roupas confortáveis e objetos 3D para cães e gatos. Feito com amor em Portugal.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning className={`${fredoka.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <AppProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
