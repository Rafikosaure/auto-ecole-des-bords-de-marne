//src/api/apiClient.js

import config from "../config.js";
import { studentsRoute } from "./routes.js";

// Construit les headers de la requête, en JSON par défaut sauf pour les FormData
const buildHeaders = (body, extraHeaders) => {
  const headers = { ...extraHeaders };
  if (body !== undefined && !(body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

// Tente de parser le corps de la réponse en JSON, sinon en texte brut
const parseBody = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  const text = await response.text();
  return text.length ? text : null;
};

const request = async (method, url, body, extraHeaders) => {
  const response = await fetch(`${config.apiBaseUrl}${url}`, {
    method,
    credentials: "include",
    headers: buildHeaders(body, extraHeaders),
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
        ? body
        : JSON.stringify(body),
  });

  const data = await parseBody(response);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
      window.location.href = "/connexion";
    }
    const error = new Error(`Request failed with status ${response.status}`);
    error.response = { status: response.status, data, headers: response.headers };
    throw error; // Propager l'erreur pour pouvoir la gérer dans les appels individuels
  }

  return { data, status: response.status, headers: response.headers };
};

const apiClient = {
  get: (url, options) => request("GET", url, undefined, options?.headers),
  post: (url, body, options) => request("POST", url, body, options?.headers),
  put: (url, body, options) => request("PUT", url, body, options?.headers),
  delete: (url, options) => request("DELETE", url, undefined, options?.headers),
};

export default apiClient;

// Fonctions API pour gérer les étudiants
export const getStudents = () => apiClient.get(`${studentsRoute}get`);

export const getAllStudents = (page, limit) =>
  apiClient.get(`${studentsRoute}get-all?page=${page}&limit=${limit}`);

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