'use client';
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar"; // Ensure the path and casing are correct

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
          <div>
           <Navbar />
            {children}
          </div>
    );
}
