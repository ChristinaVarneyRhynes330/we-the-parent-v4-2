import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "../styles/globals.css";
import { CaseProvider } from "@/contexts/CaseContext";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "We The Parent™ | AI Litigation Assistant",
  description:
    "AI-Augmented Self-Litigation Ecosystem for Pro Se Parental Defenders in Florida Juvenile Dependency Cases",
  applicationName: "We The Parent",
  themeColor: "#13293D",
  manifest: "/manifest.json",
  icons: { apple: "/icons/apple-icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
      <body className="font-sans">
        <Providers>
          <CaseProvider>
            <Sidebar />
            <div className="app-surface lg:pl-64">
              <div className="mx-auto max-w-6xl px-6 py-8">
                {children}
              </div>
            </div>
          </CaseProvider>
        </Providers>
      </body>
    </html>
  );
}
