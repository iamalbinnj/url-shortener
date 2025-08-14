import React, { useCallback, useMemo, useState } from "react";
import { Copy, Check, ExternalLink, Link2, LoaderCircle } from "lucide-react";

function App() {
const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = useMemo(
    () => import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || 'http://127.0.0.1:8000',
    []
  );

  const isValidUrl = useCallback((value: string) => {
    try {
      const u = new URL(value);
      return Boolean(u.protocol && u.host);
    } catch {
      return false;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCopied(false);
    if (!isValidUrl(longUrl)) {
      setError("Enter a valid URL starting with http:// or https://");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/shorten/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ long_url: longUrl }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with ${res.status}`);
      }

      const data = await res.json();
      // Expecting { short_url: "http://127.0.0.1:8000/Ab12Cd", ... }
      if (data?.short_url) {
        setShortUrl(data.short_url);
      } else if (data?.short_code) {
        setShortUrl(`${API_BASE}/${data.short_code}`);
      } else {
        throw new Error("Unexpected response format from server");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
      setShortUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Couldn't copy to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-800/70 px-4 py-2 shadow-lg ring-1 ring-white/10">
            <Link2 className="h-5 w-5" />
            <span className="text-sm font-medium tracking-wide">URL Shortener</span>
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold leading-tight">Shorten your links</h1>
          <p className="mt-2 text-slate-400 text-sm">Paste a long URL, get a clean short link you can copy or open.</p>
        </div>

        <div className="rounded-2xl bg-slate-800/60 backdrop-blur shadow-2xl ring-1 ring-white/10 p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label htmlFor="longUrl" className="sr-only">Long URL</label>
            <div className="flex items-center gap-3">
              <input
                id="longUrl"
                type="url"
                placeholder="https://example.com/some/very/long/path?with=params"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                className="flex-1 rounded-xl bg-slate-900/70 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-indigo-400 placeholder:text-slate-500"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-xl px-4 py-3 font-medium bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-500/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20"
              >
                {loading ? (
                  <><LoaderCircle className="h-5 w-5 animate-spin" /><span className="ml-2">Shortening…</span></>
                ) : (
                  <>Shorten</>
                )}
              </button>
            </div>
            {error && (
              <div className="text-sm text-rose-300 bg-rose-950/40 border border-rose-900/50 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </form>

          {shortUrl && (
            <div className="mt-4 grid gap-3">
              <div className="flex items-center gap-3">
                <input
                  readOnly
                  value={shortUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  className="flex-1 rounded-xl bg-slate-900/70 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-emerald-400"
                />
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center rounded-xl px-3 py-3 font-medium bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-500/90 transition-all shadow-lg shadow-emerald-500/20"
                >
                  {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                </button>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl px-3 py-3 font-medium bg-sky-500 hover:bg-sky-400 active:bg-sky-500/90 transition-all shadow-lg shadow-sky-500/20"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
              <p className="text-xs text-slate-400">Tip: the link opens in a new tab. Click the copy icon to copy it to your clipboard.</p>
            </div>
          )}
        </div>

        <footer className="mt-6 text-center text-[13px] text-slate-500">
          Powered by Django + SQLite · Frontend in React + Tailwind
        </footer>
      </div>
    </div>
  );
}

export default App
