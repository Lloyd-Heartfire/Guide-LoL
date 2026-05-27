import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameDataProvider } from "./context/GameDataContext";
import Header from "./components/Header";
import Home from "./pages/Home.tsx";
import Build from "./pages/Build";
import './App.css';

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <GameDataProvider>
      <BrowserRouter basename={basename}>
        <div className="app">
          <div className="app_bg" />
          <Header />
          <main className="app_main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/build" element={<Home />} />
              <Route path="/build/:champId" element={<Build />} />
              {/* <Route path="/synergies/:champId?" element={<Synergies />} /> */}
              {/* <Route path="/damage/:champId?" element={<Damage />} /> */}
              {/* <Route path="/duel" element={<Duel />} /> */}
              {/* <Route path="/history" element={<History />} /> */}
              {/* <Route path="/comparator" element={<Comparator />} /> */}
              {/* <Route path="/draft" element={<Draft />} /> */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </GameDataProvider>
  );
}