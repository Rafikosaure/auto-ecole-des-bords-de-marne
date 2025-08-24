import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";

import Template from "./components/Template/Template";
import OneStudentPage from "./pages/OneStudentPage/OneStudentPage";
import InstructorsPage from "./pages/InstructorsPage/InstructorPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import ConnexionPage from "./pages/ConnexionPage/ConnexionPage";
import StudentPage from "./pages/StudentsPage/StudentsPage";
import InstructorProfilPage from "./pages/InstructorProfilPage/InstructorProfilPage";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Template />,
    children: [
      {
        index: true,
        element: <Navigate to="/connexion" />,
      },
      {
        path: "connexion",
        element: <ConnexionPage />,
      },
      {
        path: "instructor/:id",
        element: <InstructorProfilPage />,
      },
      {
        path: "students",
        element: <StudentPage />,
      },
      {
        path: "instructors",
        element: <InstructorsPage />,
      },
      {
        path: "student/:id",
        element: <OneStudentPage />,
      },
      {
        path: "admin",
        element: <AdminPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
