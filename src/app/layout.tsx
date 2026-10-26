import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getCurrentUser } from '@/lib/auth';

import { SocialProofToast } from '@/components/SocialProofToast';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://intern-up.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'INTERN-UP | Structured 7-Day Task-Based Internship Platform',
    template: '%s | INTERN-UP',
  },
  description:
    'Build practical software engineering skills through a structured 7-calendar-day task sprint. Choose from 13 domains, submit GitHub repositories, and receive verified credentials.',
  keywords: [
    'internship',
    'task-based learning',
    'web development',
    'python programming',
    'data science',
    'intern-up',
    'student portfolio',
    'certificate verification',
    'engineering sprint',
  ],
  authors: [{ name: 'INTERN-UP Technologies Private Limited' }],
  creator: 'INTERN-UP',
  publisher: 'INTERN-UP Technologies Private Limited',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'INTERN-UP',
    title: 'INTERN-UP | Structured 7-Day Task-Based Internship Platform',
    description:
      'Build practical software engineering skills through a structured 7-calendar-day task sprint. Choose from 13 domains, submit GitHub repositories, and receive verified credentials.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'INTERN-UP | Structured 7-Day Task-Based Internship Platform',
    description:
      'Build practical software engineering skills through a structured 7-calendar-day task sprint. 13 domains, real code reviews, and instant credential verification.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 antialiased">
        {/* Accessible Skip to Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-md focus:text-xs focus:font-semibold focus:outline-none"
        >
          Skip to main content
        </a>
        <Navbar currentUser={currentUser} />
        <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col focus:outline-none">
          {children}
        </main>
        <Footer />
        <SocialProofToast />
      </body>
    </html>
  );
}
