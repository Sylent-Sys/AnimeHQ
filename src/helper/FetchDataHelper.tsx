import { useCallback, useState } from "react";
import AxiosHelper from "./AxiosHelper";
import {
  FetchDataHelperState,
  FetchDataHelperProps,
} from "../interfaces/fetch-data-helper.interface";

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
