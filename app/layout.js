import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar"; // Corrected import path

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "We The Parent",
  description: "Your personal legal AI toolkit.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0B1A2A] text-[#F5F5F5]`}>
        <div className="flex h-screen w-full">
          {/* Sidebar - visible on medium screens and up */}
          <div className="hidden md:flex md:w-64">
            <Sidebar />
          </div>
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}