import { Route, Routes } from "react-router-dom";
import Template from "./components/Template/Template";
import OneStudentPage from "./pages/OneStudentPage/OneStudentPage";
import StudentsPage from "./pages/StudentsPage/StudentsPage";
import TeachersPage from "./pages/TeachersPage/TeachersPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import AdminRegister from "./pages/AdminRegister/AdminRegister";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Template />}>
        <Route index element={<StudentsPage />} />
        <Route path="/student/:id" element={<OneStudentPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/adminregister" element={<AdminRegister />} />
      </Route>
    </Routes>
  );
}

export default App;
