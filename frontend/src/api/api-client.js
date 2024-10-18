import axios from "axios";
import config from "../config.js";
import { studentsRoute } from "./routes.js";

const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  // withCredentials: true,
});

export default apiClient;

export const getStudents = () => apiClient.get(`${studentsRoute}get`);

export const getAllStudents = (page, limit) =>
  apiClient.get(`${studentsRoute}getall?page=${page}&limit=${limit}`);

export const getStudentById = (id) =>
  apiClient.get(`${studentsRoute}get/${id}`);

export const addStudent = (student) =>
  apiClient.post(`${studentsRoute}add`, student);

export const deleteStudent = async (id) => {
  const response = await apiClient.delete(`${studentsRoute}delete/${id}`, {});
  return response.data;
};

export const updateStudent = async (student) => {
  const response = await apiClient.put(
    `${studentsRoute}update/${student.id}`,
    student
  );
  return response.data;
};
