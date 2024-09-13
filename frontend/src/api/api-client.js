import axios from "axios";
import config from "../config.js";
import { studentsRoute } from "./routes.js";

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  withCredentials: true,
});

export default apiClient;

export const GetAllStudents = () => apiClient.get(`${studentsRoute}getall`);