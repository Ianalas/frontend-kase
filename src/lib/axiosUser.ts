import axios from "axios";

export const apiUser = axios.create({
  baseURL: "http://localhost:8080",
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiUser.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {

    delete apiUser.defaults.headers.common["Authorization"];
  }
};