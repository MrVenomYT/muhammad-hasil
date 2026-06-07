import "./globals.css";
import { DataProvider } from "@/components/DataProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import PageTransition from "@/components/PageTransition";
import CursorGlow from "@/components/CursorGlow";

export const metadata = {
  title: "Muhammad Hasil | Developer Portfolio",
  description: "Modern developer portfolio with projects, testimonials, contact, and a hidden admin dashboard.",
  keywords: ["Muhammad Hasil", "Next.js developer", "React developer", "portfolio", "frontend engineer"],
  openGraph: {
    title: "Muhammad Hasil | Developer Portfolio",
    description: "Modern developer portfolio and dynamic project management system.",
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-ink text-paper antialiased">
        <DataProvider>
          <ScrollProgress />
          <CursorGlow />
          <Navbar />
          <PageTransition>
            <main>{children}</main>
          </PageTransition>
          <Footer />
        </DataProvider>
      </body>
    </html>
  );
}
