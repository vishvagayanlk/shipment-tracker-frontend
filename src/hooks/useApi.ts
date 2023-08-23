import { useState, useCallback } from "react";
import axios, { AxiosResponse } from "axios";
import { useCookies } from "react-cookie";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiOptions {
  method: HttpMethod;
  headers?: HeadersInit;
  data?: unknown;
  queryParams?: Record<string, string>;
}

const useApi = <T>() => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [data, setData] = useState<T | undefined>(undefined);
  const axiosInstance = axios.create();
  const [cookie] = useCookies(["token"]);
  axiosInstance.interceptors.request.use((config) => {
    config.baseURL = "http://localhost:3000";
    if (cookie.token) {
      config.headers.Authorization = `Bearer ${cookie.token}`;
    }
    return config;
  });

  const makeApiCall = useCallback(
    async (
      url: string,
      options: ApiOptions = { method: "GET" },
    ): Promise<void> => {
      setIsLoading(true);
      setError(undefined);

      try {
        const queryParamsString = options.queryParams
          ? new URLSearchParams(options.queryParams).toString()
          : "";
        const fullUrl = queryParamsString ? `${url}?${queryParamsString}` : url;
        const response: AxiosResponse = await axiosInstance({
          method: options.method,
          url: fullUrl,
          data: options.data,
        });

        const responseData = response.data as T;
        setData(responseData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { isLoading, error, data, makeApiCall };
};

export default useApi;
