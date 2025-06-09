import React, { useRef } from "react";
import Home from "../Home";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const { isAuthenticated, login, loading, error } = useAuth();
  const navigate = useNavigate();
  const loginRef = useRef(null);

  // Função para rolar até o login
  const scrollToLoginArea = () => {
    if (loginRef.current) {
      loginRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Botão principal
  const handleUserArea = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      scrollToLoginArea();
    }
  };

  return (
    <Home
      setCurrentScreen={() => {}}
      isAuthenticated={isAuthenticated}
      onLogin={login}
      loginLoading={loading}
      loginError={error}
      scrollToLoginArea={scrollToLoginArea}
      loginRef={loginRef}
      extraButton={
        <button
          onClick={handleUserArea}
          style={{
            marginTop: 32,
            padding: "12px 32px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 20,
            background: "#1976d2",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px #1976d255"
          }}
        >
          {isAuthenticated ? "Área do Usuário" : "Entrar"}
        </button>
      }
    />
  );
}
