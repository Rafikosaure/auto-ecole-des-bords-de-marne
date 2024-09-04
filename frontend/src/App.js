import { Route, Routes } from "react-router-dom";
import Template from "./components/Template/Template";
import HomePage from "./pages/HomePage/HomePage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Template/>}>
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  );
}

export default App;
