import axios, { AxiosInstance } from "axios";
import StorageHelper from "./StorageHelper";

export default class AxiosHelper {
  private axios: AxiosInstance;
  private storageHelper: StorageHelper;
  constructor(url: string | undefined) {
    this.axios = axios.create({
      baseURL: url,
    });
    this.storageHelper = new StorageHelper(localStorage);
  }
  getAxios() {
    this.axios.interceptors.request.use(
      async (config) => {
        try {
          const token = this.storageHelper.getItem("anilist_token");
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          const key = config.url + JSON.stringify(config.data);
          if (window.ongoingRequests.has(key)) {
            window.ongoingRequests.get(key)?.abort();
            window.ongoingRequests.delete(key);
          }
          const controller = new AbortController();
          config.signal = controller.signal;
          window.ongoingRequests.set(key, controller);
          return config;
        } catch (error) {
          return Promise.reject(error);
        }
      },
      (error) => {
        return Promise.reject(error);
      },
    );
    this.axios.interceptors.response.use(
      async (response) => {
        try {
          const key =
            response.config.url + JSON.stringify(response.config.data);
          window.ongoingRequests.delete(key);
          return response;
        } catch (error) {
          return Promise.reject(error);
        }
      },
      (error) => {
        if (error.config && error.config.url) {
          window.ongoingRequests.delete(
            error.config.url + JSON.stringify(error.config.data),
          );
        }
        return Promise.reject(error);
      },
    );
    return this.axios;
  }
}
