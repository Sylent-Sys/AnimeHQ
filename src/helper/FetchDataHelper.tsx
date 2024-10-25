import { AxiosRequestConfig } from "axios";
import { useCallback, useState } from "react";
import AxiosHelper from "./AxiosHelper";
import { ZodSchema } from "zod";

interface FetchDataHelperState<T> {
  data: T | null;
  errorResponse: Error | null;
  error: boolean;
  loading: boolean;
  success: boolean;
}

interface FetchDataHelperProps {
  url: string;
  method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH";
  schema: ZodSchema;
  apiUrl?: string;
  axiosConfig?: AxiosRequestConfig;
}

export default function FetchDataHelper<T>() {
  const [state, setState] = useState<FetchDataHelperState<T>>({
    data: null,
    error: false,
    loading: false,
    success: false,
    errorResponse: null,
  });
  const fetchData = useCallback(
    ({ url, method, apiUrl, schema, axiosConfig }: FetchDataHelperProps) => {
      const axiosHelper = new AxiosHelper(apiUrl);
      setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
      axiosHelper
        .getAxios()
        .request({
          url,
          method,
          ...axiosConfig,
        })
        .then((response) => {
          const result = schema.safeParse(response.data);
          if (result.error) {
            setState((prevState) => ({
              ...prevState,
              errorResponse: new Error("Invalid data"),
              loading: false,
              error: true,
            }));
            return;
          }
          setState((prevState) => ({
            ...prevState,
            data: response.data,
            loading: false,
            success: true,
          }));
        })
        .catch((error) => {
          setState((prevState) => ({
            ...prevState,
            errorResponse: error,
            loading: false,
            error: true,
          }));
        });
    },
    [],
  );
  return { ...state, fetchData };
}
