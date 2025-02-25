import type {Metadata} from "next";
import "../styles/globals.css";
import React from "react";
import NavBar from "@/components/navbar";

export const metadata: Metadata = {
    title: "Toxic Detector",
    description: "Group 3 - Toxic Detector",
};

export default function RootLayout({children}: { children: React.ReactNode; }) {
    return (
        <html lang="en">
        <body className={`antialiased`}>
        <NavBar/>
        <main className={"mx-auto p-4"}>{children}</main>
        </body>
        </html>
    );
}
