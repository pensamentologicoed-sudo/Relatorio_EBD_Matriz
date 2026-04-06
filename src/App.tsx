import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Years from "./pages/Years";
import Quarters from "./pages/Quarters";
import Rooms from "./pages/Rooms";
import Lessons from "./pages/Lessons";
import Report from "./pages/Report";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/anos" element={<Years />} />
        <Route path="/anos/:year" element={<Quarters />} />
        <Route path="/trimestres/:id" element={<Rooms />} />
        <Route path="/trimestre/:id" element={<Lessons />} />
        <Route path="/licao/:id" element={<Report />} />
      </Routes>
    </Router>
  );
}
