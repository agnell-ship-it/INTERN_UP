import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getCurrentUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'INTERN-UP | Structured 7-Day Task-Based Internship Program',
  description:
    'Build practical software engineering skills through a structured 7-calendar-day task-based internship. Choose from 13 domains, complete five milestones, and track your progress transparently.',
  keywords: [
    'internship',
    'task-based learning',
    'web development',
    'python programming',
    'data science',
    'intern-up',
    'student portfolio',
  ],
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
        <Navbar currentUser={currentUser} />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
