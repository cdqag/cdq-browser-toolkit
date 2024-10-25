import { getSettings } from "src/settings";

export const getApiKey = () => {
  return getSettings("apiKey").trim();
}

export const getHeaders = () => {
  return {
    "Content-Type": "application/json",
    "X-API-KEY": getApiKey()
  };
}
