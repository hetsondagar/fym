import { useEffect, useMemo, useRef, useState } from "react";
import { omdbAPI } from "@/lib/api";

type BackgroundCarouselProps = {
  queries: Array<{ term: string; type?: 'movie' | 'series' }>;
  intervalMs?: number;
  opacity?: number; // overlay darkness 0..1
};

const memoryCache = new Map<string, string[]>();

const unique = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)));

export default function BackgroundCarousel({ queries, intervalMs = 6000, opacity = 0.55 }: BackgroundCarouselProps) {
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  const cacheKey = useMemo(() => queries.map(q => `${q.term}:${q.type ?? 'all'}`).join("|"), [queries]);

  // Preload helper
  const preload = (src: string) => {
    const img = new Image();
    img.src = src;
  };

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        if (memoryCache.has(cacheKey)) {
          const cached = memoryCache.get(cacheKey)!;
          setImages(cached);
          cached.slice(0, 3).forEach(preload);
          return;
        }

        const results: string[] = [];
        for (const q of queries) {
          try {
            const data = await omdbAPI.search(q.term, q.type);
            const posters = (data?.Search ?? [])
              .map((m: any) => m.Poster)
              .filter((p: string) => p && p !== 'N/A');
            results.push(...posters);
          } catch {
            // ignore per-query errors
          }
        }
        const finalList = unique(results).slice(0, 20);
        if (!cancelled) {
          if (finalList.length === 0) {
            setImages(["/fym_logo.png"]);
          } else {
            memoryCache.set(cacheKey, finalList);
            setImages(finalList);
            finalList.slice(0, 3).forEach(preload);
          }
        }
      } catch {
        if (!cancelled) setImages(["/fym_logo.png"]);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, [cacheKey, queries]);

  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current && window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, intervalMs) as unknown as number;
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [images, intervalMs]);

  const current = images[index] ?? images[0] ?? "/fym_logo.png";

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: 1 }}>
        <img
          src={current}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/fym_logo.png'; }}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${opacity})` }} />
      {/* Subtle gradient edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
    </div>
  );
}


