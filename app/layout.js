import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar.jsx";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "We The Parent",
  description: "Your personal legal AI toolkit.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Sets the dark background and light text for the whole app */}
      <body className={`${inter.className} bg-darkNavy text-gray-200`}>
        <div className="flex h-screen w-full">
          <div className="hidden md:flex">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}