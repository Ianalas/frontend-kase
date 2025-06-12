import axios from "axios";

export const apiProduct = axios.create({
  baseURL: "http://localhost:3000",
});