import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router";

import Template from "./components/Template/Template";
import OneStudent from "./features/students/OneStudent";
import InstructorsPage from "./features/instructors/InstructorsPage";
import AdminPage from "./features/admins/AdminPage";
import ConnexionPage from "./features/auth/ConnexionPage";
import StudentsPage from "./features/students/StudentsPage";
import InstructorProfilPage from "./features/instructors/InstructorProfilPage";

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
        element: <StudentsPage />,
      },
      {
        path: "instructors",
        element: <InstructorsPage />,
      },
      {
        path: "student/:id",
        element: <OneStudent />,
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
