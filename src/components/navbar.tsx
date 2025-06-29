'use client';

import Link from "next/link";
import {usePathname} from "next/navigation";
import {Shield} from "lucide-react";

const navLinks = [
    {title: "Home", href: "/"}
];

export default function NavBar() {
    const pathname = usePathname();

    return (
        <nav className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg">
            <div className="flex h-20 items-center px-8 lg:px-16 mx-auto">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="absolute inset-0 blur-xl bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 opacity-30 rounded-full"/>
                        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-3 rounded-xl relative shadow-lg">
                            <Shield className="h-7 w-7 text-white"/>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-2xl font-black bg-gradient-to-r from-gray-900 via-purple-900 to-violet-800 bg-clip-text text-transparent">
                            ToxicGuard
                        </span>
                        <div className="text-xs font-medium text-gray-500 tracking-wider uppercase">
                            AI Protection
                        </div>
                    </div>
                </div>

                <div className="ml-auto flex items-center space-x-8">
                    {navLinks.map(({title, href}) => (
                        <Link
                            key={href}
                            href={href}
                            className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
                                pathname === href
                                    ? "text-white bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg"
                                    : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
                            }`}
                        >
                            {title}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}