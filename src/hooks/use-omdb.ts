import { useQuery } from "@tanstack/react-query";
import { omdbAPI } from "@/lib/api";

export const useOmdbTrending = () => {
  return useQuery({
    queryKey: ["omdb", "trending"],
    queryFn: () => omdbAPI.getTrending(),
  });
};

export const useOmdbSearch = (
  query: string,
  type?: "movie" | "series",
  year?: string,
  page: number = 1
) => {
  return useQuery({
    queryKey: ["omdb", "search", { query, type, year, page }],
    queryFn: async () => {
      if (!query || query.trim().length === 0) return { Search: [] } as any;
      return omdbAPI.search(query, type, year, page);
    },
  });
};

export const useOmdbDetails = (imdbId?: string) => {
  return useQuery({
    queryKey: ["omdb", "details", imdbId],
    queryFn: async () => {
      if (!imdbId) return null as any;
      return omdbAPI.getById(imdbId);
    },
    enabled: Boolean(imdbId),
  });
};


