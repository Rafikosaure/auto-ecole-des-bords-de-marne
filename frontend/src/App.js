import { Route, Routes, Navigate } from "react-router-dom";
import Template from "./components/Template/Template";
import OneStudentPage from "./pages/OneStudentPage/OneStudentPage";
import StudentsPage from "./pages/StudentsPage/StudentsPage";
import InstructorsPage from "./pages/InstructorsPage/InstructorPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import ConnexionPage from "./pages/ConnexionPage/ConnexionPage";
import StudentPage from "./pages/StudentsPage/StudentsPage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Template />}>
        {/* Redirection de la page d'accueil vers la page connexion */}
        <Route index element={<Navigate to="/connexion" />} />

        {/* Route pour la page Connexion */}
        <Route path="/connexion" element={<ConnexionPage />} />

        {/* Autres routes */}
        <Route path="/students" element={<StudentPage />} />
        <Route path="/instructors" element={<InstructorsPage />} />
        <Route index element={<StudentsPage />} />
        <Route path="/student/:id" element={<OneStudentPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}

export default App;



// import { Route, Routes } from "react-router-dom";
// import Template from "./components/Template/Template";
// import HomePage from "./pages/HomePage/HomePage";
// import InstructorsPage from "./pages/InstructorsPage/InstructorPage";
// import AdminPage from "./pages/AdminPage/AdminPage";
// import AdminRegister from "./pages/AdminRegister/AdminRegister";
// import ConnexionPage from "./pages/ConnexionPage/ConnexionPage";
// import StudentPage from "./pages/StudentsPage/StudentsPage";
// // import "./pages/InstructorsPage/InstructorPage.css";
// import "./App.css";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';


// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Template />}>
//        <Route path="/students" element={<StudentPage />} />
//         <Route path="/connexion" element={<ConnexionPage />} />
//         <Route index element={<HomePage />} />
//         <Route path="/instructors" element={<InstructorsPage />} />
//         <Route path="/admin" element={<AdminPage />} />
//         <Route path="/adminregister" element={<AdminRegister />} />

//       </Route>
//     </Routes>
//   );
// }

// export default App;
