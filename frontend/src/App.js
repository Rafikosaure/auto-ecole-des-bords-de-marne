import { Route, Routes } from "react-router-dom";
import Template from "./components/Template/Template";
import HomePage from "./pages/HomePage/HomePage";
import StudentsPage from "./pages/StudentsPage/StudentsPage";
import TeachersPage from "./pages/TeachersPage/TeachersPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Template />}>
        <Route index element={<HomePage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}

export default App;
