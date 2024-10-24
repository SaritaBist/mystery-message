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
        <Provider store={store}>
            <AuthProvider>
                <body className={inter.className}>
                {children}
                </body>

            </AuthProvider>
        </Provider>
        </html>
    );
}
