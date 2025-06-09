import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('@Vidracaria:token'));

  useEffect(() => {
    async function loadUserFromStorage() {
      const storedToken = localStorage.getItem('@Vidracaria:token');
      const storedUser = localStorage.getItem('@Vidracaria:user');
      
      if (storedToken) {
        api.setAuthToken(storedToken); // Garante header Authorization em toda inicialização
        setToken(storedToken);
      }
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          setUser(null);
          localStorage.removeItem('@Vidracaria:user');
        }
      }
      setLoading(false);
    }
    
    loadUserFromStorage();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await api.login(username, password);
      // FastAPI retorna { access_token, token_type }
      const token = response.access_token || response.token;
      if (token) {
        api.setAuthToken(token); // <-- Garante envio do token
        setToken(token);
        localStorage.setItem('@Vidracaria:token', token);
        // Buscar dados do usuário autenticado
        try {
          const userData = await api.getCurrentUser();
          setUser(userData);
          localStorage.setItem('@Vidracaria:user', JSON.stringify(userData));
        } catch (e) {
          setUser(null);
        }
        setLoading(false); // Atualizar loading após login bem-sucedido
        return { success: true };
      } else {
        setLoading(false); // Atualizar loading após login mal-sucedido
        return { success: false, message: 'Falha no login. Resposta inesperada do servidor.' };
      }
    } catch (error) {
      setLoading(false); // Atualizar loading após erro no login
      return { 
        success: false, 
        message: error.response?.data?.message || 'Falha no login. Verifique suas credenciais.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('@Vidracaria:token');
    localStorage.removeItem('@Vidracaria:user');
    setUser(null);
    setToken(null);
    delete api.defaults.headers.Authorization;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated: !!user, 
        user, 
        loading, 
        login, 
        logout, 
        token 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
