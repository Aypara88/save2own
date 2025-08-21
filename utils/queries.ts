import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/utils/api";
import type { Product } from "@/data/products";

export function useProductsQuery(search?: string, category?: string) {
  return useQuery({
    queryKey: ["products", { search: search ?? "", category: category ?? "All" }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search && search.length > 0) params.set("q", search);
      if (category && category !== "All") params.set("category", category);
      const { data, error } = await apiGet<Product[]>(`/products?${params.toString()}`);
      if (error) throw new Error(error);
      return data ?? [];
    },
    staleTime: 60_000,
    retry: 1,
  });
}
