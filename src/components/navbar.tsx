'use client';

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Shield} from "lucide-react";

const navLinks = [
    {title: "Home", href: "/"},
    {title: "History", href: "/history"},
];

export default function NavBar() {
    const pathname = usePathname();

    return (
        <nav className="bg-white/70 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
            <div className="flex h-16 items-center px-16 mx-auto">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div
                            className="absolute inset-0 blur-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 opacity-20 rounded-full"/>
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-lg relative">
                            <Shield className="h-6 w-6 text-white"/>
                        </div>
                    </div>
                    <span
                        className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              ToxicGuard
            </span>
                </div>
                <div className="ml-auto flex items-center space-x-6">
                    {navLinks.map(({title, href}) => (
                        <Link
                            key={href}
                            href={href}
                            className={`text-sm font-medium ${
                                pathname === href
                                    ? "text-red-500 duration-0"
                                    : "text-gray-700"
                            } hover:text-red-500 transition-colors duration-250`}
                        >
                            {title}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}