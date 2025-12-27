import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Header from "./components/header";
import Footer from "./components/footer";

import AboutPage from "./pages/about";
import AuthPage from "./pages/auth";
import GamePage from "./pages/game";
import LeaderboardPage from "./pages/leaderboard";
import HistoryPage from "./pages/history";
import ProfilePage from "./pages/profile";
import TempoPage from "./pages/temp";

import { useAuth } from "./providers/AuthProvider";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route
              path="/auth"
              element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" />}
            />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/"
              element={isAuthenticated ? <GamePage /> : <Navigate to="/auth" />}
            />
            <Route
              path="/leaderboard"
              element={
                isAuthenticated ? <LeaderboardPage /> : <Navigate to="/auth" />
              }
            />
            <Route
              path="/history"
              element={
                isAuthenticated ? <HistoryPage /> : <Navigate to="/auth" />
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" />
              }
            />
            <Route path="/temp" element={<TempoPage />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}

export default App;
