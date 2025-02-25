'use client';

import {Shield} from "lucide-react";
import {useState} from "react";

export default function Home() {
    const [text, setText] = useState("");

    const handleAnalyze = () => {
        console.log("Analyzing:", text);
    };

    return (
        <div className="bg-gradient-to-b">
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto space-y-12">
                    <div className="text-center space-y-6">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div
                                    className="absolute inset-0 blur-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 opacity-20 rounded-full"/>
                                <Shield className="w-16 h-16 text-red-500 relative"/>
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Detect Toxic Text
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Our AI helps you identify potentially harmful language
                        </p>
                    </div>

                    <div className="bg-white/50 backdrop-blur-sm border-2 rounded-xl p-6 shadow-xl">
            <textarea
                placeholder="Type or paste your text here..."
                className="w-full h-48 p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
                        <button
                            onClick={handleAnalyze}
                            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-300"
                        >
                            Analyze Text
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}