export type AppConfig = {
  apiBaseUrl: string;
};

const defaultApi = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export const config: AppConfig = {
  apiBaseUrl: defaultApi,
};
