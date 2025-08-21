import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useMemo, useState } from "react";
import { config } from "@/utils/config";
import { apiGet } from "@/utils/api";

interface BackendInfoState {
  apiHealthy: boolean;
  apiBaseUrl: string;
  lastCheckedAt?: string;
  refresh: () => Promise<void>;
}

export const [BackendProvider, useBackend] = createContextHook<BackendInfoState>(() => {
  const [apiHealthy, setApiHealthy] = useState<boolean>(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | undefined>(undefined);

  const check = async () => {
    const { data } = await apiGet<{ ok: boolean; time: string }>("/health");
    setApiHealthy(Boolean(data?.ok));
    setLastCheckedAt(data?.time ?? new Date().toISOString());
  };

  useEffect(() => {
    check();
  }, []);

  const value: BackendInfoState = useMemo(() => ({
    apiHealthy,
    apiBaseUrl: config.apiBaseUrl,
    lastCheckedAt,
    refresh: check,
  }), [apiHealthy, lastCheckedAt]);

  return value;
});
