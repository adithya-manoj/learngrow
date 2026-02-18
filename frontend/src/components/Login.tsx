import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AuthScreen.css";
import { loginUser, registerUser } from "../api/auth.api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

type AuthMode = "login" | "register";

export default function AuthForm() {
  const location = useLocation();
  const initialMode: AuthMode = location.pathname === "/register" ? "register" : "login";
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const toastId = toast.loading(mode === "register" ? "Creating your account…" : "Signing you in…");

    try {
      if (mode === "register") {
        const res = await registerUser(formData);
        login(res.user, res.accessToken, res.refreshToken);
        toast.success("Account created!", { id: toastId });
        navigate(from, { replace: true });
      } else {
        const res = await loginUser({ username: formData.username, password: formData.password });
        login(res.user, res.accessToken, res.refreshToken);
        toast.success("Welcome back!", { id: toastId });
        navigate(from, { replace: true });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    formData.username.trim() &&
    formData.password &&
    (mode === "login" || (mode === "register" && formData.email.trim()));

  return (
    <div className="auth-screen">
      <div className="auth-panel auth-panel-left">
        <div className="auth-brand">
          <span className="auth-logo">Learn Grow</span>
          <p className="auth-tagline">Track progress. Build habits. Grow every day.</p>
        </div>
        <div className="auth-decoration" aria-hidden />
      </div>

      <div className="auth-panel auth-panel-right">
        <div className="auth-form-wrapper">
          <h2 className="auth-heading">
            {mode === "login" ? "Sign in" : "Create account"}
          </h2>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                className="auth-input"
                placeholder="you"
              />
            </div>

            {mode === "register" && (
              <div className="auth-field">
                <label className="auth-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="you@example.com"
                />
              </div>
            )}

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            {mode === "register" ? (
              <>
                Already have an account?{" "}
                <button type="button" className="auth-link" onClick={() => setMode("login")}>
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <button type="button" className="auth-link" onClick={() => setMode("register")}>
                  Sign up
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
