'use client'
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "@/context/AuthProvider";

import {Provider} from "react-redux";
const inter = Inter({ subsets: ["latin"] });
import './globals.css';
import store from "@/app/store/page";



export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
          <body className={inter.className}>
                <AuthProvider>
                {children}
                </AuthProvider>
                </body>
        </html>
    );
}
