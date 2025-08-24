//src/api/api-client.js

import axios from "axios";
import config from "../config.js";
import { studentsRoute } from "./routes.js";


const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  withCredentials: true,
});

// Intercepteur pour gérer les erreurs d'authentification
apiClient.interceptors.response.use(
  (response) => response, // Passer les réponses réussies sans modification
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
      window.location.href = "/connexion"; // Utilisation de window.location pour rediriger vers la page de connexion
    }
    return Promise.reject(error); // Propager l'erreur pour pouvoir la gérer dans les appels individuels
  }
);

export default apiClient;

// Fonctions API pour gérer les étudiants
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