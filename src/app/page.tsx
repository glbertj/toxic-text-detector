"use client";

import { Shield, AlertTriangle, CheckCircle, Zap, History, Trash2, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

interface AnalysisResult {
  isToxic: boolean;
  score: number;
  toxicWords: string[];
  nontoxicWords: string[];
}

interface HistoryItem {
  id: string;
  text: string;
  result: AnalysisResult;
  timestamp: string;
}

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // load history
  useEffect(() => {
    const savedHistory = localStorage.getItem('toxicGuardHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse history from localStorage:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('toxicGuardHistory', JSON.stringify(history));
  }, [history]);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      console.log("text:", text);

      const response = await fetch("./api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Analysis failed" }));
        throw new Error(errorData.message || "Analysis failed");
      }

      const data: AnalysisResult = await response.json();
      setResult(data);

      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        text: text.trim(),
        result: data,
        timestamp: new Date().toISOString(),
      };

      setHistory(prev => [historyItem, ...prev].slice(0, 50));
      
    } catch (error: unknown) {
      console.error("Error analyzing text:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error as { message: unknown }).message === "string"
      ) {
        setError((error as { message: string }).message);
      } else {
        setError("Failed to analyze text. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('toxicGuardHistory');
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const loadFromHistory = (item: HistoryItem) => {
    setText(item.text);
    setResult(item.result);
    setShowHistory(false);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderResult = () => {
    if (!result) return null;

    const isToxic = result.isToxic;
    const toxicWords = result.toxicWords || [];
    const nontoxicWords = result.nontoxicWords || [];

    const normalizedScore =
      Math.min(Math.max((result.score + 1) / 2, 0), 1) * 100;

    return (
      <div className="mt-8 space-y-6">
        <div
          className={`relative overflow-hidden rounded-2xl p-8 shadow-2xl backdrop-blur-sm border-2 ${
            isToxic
              ? "bg-gradient-to-br from-red-50 via-red-25 to-orange-50 border-red-200/50"
              : "bg-gradient-to-br from-green-50 via-emerald-25 to-teal-50 border-green-200/50"
          }`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            {isToxic ? (
              <AlertTriangle className="w-full h-full text-red-500" />
            ) : (
              <CheckCircle className="w-full h-full text-green-500" />
            )}
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className={`p-3 rounded-full ${
                isToxic ? "bg-red-100" : "bg-green-100"
              }`}>
                {isToxic ? (
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {isToxic ? "Toxic Content Detected" : "Content Appears Safe"}
                </h3>
                <p className={`text-sm font-medium ${
                  isToxic ? "text-red-600" : "text-green-600"
                }`}>
                  Confidence Score: {result.score.toFixed(3)}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Toxicity Level</span>
                <span className="text-sm font-bold text-gray-800">{normalizedScore.toFixed(1)}%</span>
              </div>
              <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 opacity-20"></div>
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    isToxic 
                      ? "bg-gradient-to-r from-orange-500 to-red-600" 
                      : "bg-gradient-to-r from-green-500 to-emerald-600"
                  }`}
                  style={{ width: `${normalizedScore}%` }}
                ></div>
              </div>
            </div>

            <p className={`text-sm leading-relaxed ${
              isToxic ? "text-red-700" : "text-green-700"
            }`}>
              {isToxic
                ? "⚠️ This content may contain harmful, offensive, or inappropriate language that could be hurtful to others."
                : "✅ This content appears to be respectful and appropriate for most audiences."}
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {toxicWords.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-red-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Concerning Words ({toxicWords.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {toxicWords.map((word, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-gradient-to-r from-red-100 to-red-50 text-red-800 text-sm font-medium rounded-lg border border-red-200 hover:shadow-md transition-shadow"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}

          {nontoxicWords.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Positive Words ({nontoxicWords.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {nontoxicWords.map((word, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-gradient-to-r from-green-100 to-green-50 text-green-800 text-sm font-medium rounded-lg border border-green-200 hover:shadow-md transition-shadow"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderHistory = () => {
    if (!showHistory) return null;

    return (
      <div className="mt-8 bg-white/70 backdrop-blur-lg border border-white/30 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <History className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Analysis History</h2>
            <span className="text-sm text-gray-500">({history.length} items)</span>
          </div>
          <button
            onClick={clearHistory}
            className="flex items-center space-x-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No analysis history yet</p>
            <p className="text-gray-400 text-sm">Your analysis results will appear here</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => loadFromHistory(item)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${
                        item.result.isToxic ? 'bg-red-500' : 'bg-green-500'
                      }`}></div>
                      <span className={`text-sm font-medium ${
                        item.result.isToxic ? 'text-red-700' : 'text-green-700'
                      }`}>
                        {item.result.isToxic ? 'Toxic' : 'Safe'}
                      </span>
                      <span className="text-xs text-gray-500">
                        Score: {item.result.score.toFixed(3)}
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm mb-2 line-clamp-2 group-hover:text-purple-700 transition-colors">
                      {item.text}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatTimestamp(item.timestamp)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHistoryItem(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%236366f1%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <main className="relative container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 opacity-30 rounded-full scale-110" />
                <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 p-6 rounded-2xl shadow-2xl">
                  <Shield className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-purple-900 to-violet-800 bg-clip-text text-transparent leading-tight">
                ToxicGuard AI
              </h1>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-lg border border-white/30 rounded-2xl p-8 shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <label className="block text-lg font-semibold text-gray-900">
                  Enter text to analyze
                </label>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
                >
                  <History className="w-4 h-4" />
                  <span>{showHistory ? 'Hide' : 'Show'} History</span>
                </button>
              </div>
              
              <div className="relative">
                <textarea
                  placeholder="Type or paste your text here to check for toxic content..."
                  className="w-full h-48 p-6 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 resize-none text-gray-800 placeholder-gray-400 bg-white/80 backdrop-blur-sm transition-all duration-300 text-lg leading-relaxed"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                  {text.length}/10000
                </div>
              </div>
              
              <button
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className={`w-full py-4 px-8 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg shadow-xl transition-all duration-300 transform ${
                  loading || !text.trim()
                    ? "opacity-50 cursor-not-allowed scale-100"
                    : "hover:scale-[1.02] hover:shadow-2xl hover:from-violet-700 hover:via-purple-700 hover:to-pink-700"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing Content...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <Shield className="w-5 h-5" />
                    <span>Analyze Text</span>
                  </div>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 text-red-800 rounded-xl flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="font-medium">{error}</span>
                </div>
              )}
            </div>
          </div>

          {renderHistory()}
          {renderResult()}
        </div>
      </main>
    </div>
  );
}