import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthForm from "./components/Login";
import Navbar from "./global/Navbar";
import Counter from "./components/Counter";
import AIChat from "./components/AIChat";
import { fetchHealth } from "./api/health.api";
import "./App.css";

function Home() {
  const [status, setStatus] = useState("Checking...");
  const { user } = useAuth();

  useEffect(() => {
    fetchHealth()
      .then((data) => setStatus(`Backend: ${data.status}`))
      .catch(() => setStatus("Backend not reachable"));
  }, []);

  return (
    <div className="app-page">
      <div className="app-hero">
        <h1 className="app-title">Welcome, {user?.username}</h1>
        <p className="app-status">{status}</p>
      </div>
      <div className="app-grid">
        <Link to="/apps/tally" className="app-tile app-tile-tally">
          <span className="app-tile-icon" aria-hidden>📊</span>
          <h2 className="app-tile-name">Tally</h2>
          <p className="app-tile-desc">Quick count up or down</p>
        </Link>
        <Link to="/apps/spark" className="app-tile app-tile-spark">
          <span className="app-tile-icon" aria-hidden>✨</span>
          <h2 className="app-tile-name">Spark</h2>
          <p className="app-tile-desc">Ask anything - AI-powered answers</p>
        </Link>
      </div>
    </div>
  );
}

function TallyApp() {
  return (
    <div className="app-page app-page-single">
      <Link to="/" className="app-back">← Back to apps</Link>
      <div className="app-tile-content">
        <h2 className="app-single-title">Tally</h2>
        <Counter />
      </div>
    </div>
  );
}

function SparkApp() {
  return (
    <div className="app-page app-page-single">
      <Link to="/" className="app-back">← Back to apps</Link>
      <div className="app-tile-content">
        <h2 className="app-single-title">Spark</h2>
        <AIChat />
      </div>
    </div>
  );
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="animate-pulse text-slate-400 text-lg">Loading…</div>
      </div>
    );
  }
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AuthLayout() {
  return (
    <PublicOnlyRoute>
      <AuthForm />
    </PublicOnlyRoute>
  );
}

function ProtectedLayout() {
  return (
    <>
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apps/tally" element={<TallyApp />} />
          <Route path="/apps/spark" element={<SparkApp />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AuthLayout />} />
        <Route path="/register" element={<AuthLayout />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
