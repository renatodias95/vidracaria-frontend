import { useEffect, useState, useRef, useCallback } from 'react';
import { Container, Typography, Paper, AppBar, Toolbar, Button, Box, CircularProgress } from '@mui/material';
import OrcamentosList from "./OrcamentosList";
import Catalogo from "./Catalogo";
import Projetos from "./Projetos";
import Estoque from "./Estoque";
import Home from "./Home";
import api from './services/api';

function App() {
  const [status, setStatus] = useState('Carregando...');
  const [perfis, setPerfis] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega os dados iniciais
  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Faz as requisições em paralelo
      const [healthData, perfisData] = await Promise.all([
        api.getHealth().catch(() => ({ status: 'Offline' })),
        api.getPerfis().catch(() => [])
      ]);
      
      setStatus(healthData.status || 'Online');
      setPerfis(perfisData);
    } catch (err) {
      console.error('Erro ao carregar dados iniciais:', err);
      setError('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
      setStatus('Erro de conexão');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Função de login
  const handleLogin = async (username, password) => {
    setLoginLoading(true);
    setLoginError("");
    
    try {
      // Aqui você faria a chamada real para a API de autenticação
      // Exemplo: await api.login(username, password);
      
      // Por enquanto, mantemos o login fake para demonstração
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (username === 'admin' && password === 'admin') {
        setIsAuthenticated(true);
        setCurrentScreen('catalogo');
      } else {
        throw new Error('Usuário ou senha inválidos.');
      }
    } catch (err) {
      setLoginError(err.message || 'Erro ao fazer login. Tente novamente.');
      console.error('Erro no login:', err);
    } finally {
      setLoginLoading(false);
    }
  };

  const loginRef = useRef(null);
  const scrollToLoginArea = () => {
    if (loginRef.current) {
      const APPBAR_HEIGHT = 64; // altura padrão do AppBar
      const y = loginRef.current.getBoundingClientRect().top + window.scrollY - APPBAR_HEIGHT;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar> 
          <Typography
            variant="h5"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 2, cursor: 'pointer', userSelect: 'none' }}
            onClick={() => setCurrentScreen('home')}
            tabIndex={0}
            role="button"
            aria-label="Página inicial"
          >
            JRGLASS WORKS, soluções para vidraçaria
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              color="inherit" 
              onClick={() => setCurrentScreen('catalogo')}
              variant={currentScreen === 'catalogo' ? 'outlined' : 'text'}
            >
              Catálogo
            </Button>
            <Button 
              color="inherit" 
              onClick={() => setCurrentScreen('orcamentos')}
              variant={currentScreen === 'orcamentos' ? 'outlined' : 'text'}
            >
              Orçamentos
            </Button>
            <Button 
              color="inherit" 
              onClick={() => setCurrentScreen('projetos')}
              variant={currentScreen === 'projetos' ? 'outlined' : 'text'}
            >
              Projetos
            </Button>
            <Button 
              color="inherit" 
              onClick={() => setCurrentScreen('estoque')}
              variant={currentScreen === 'estoque' ? 'outlined' : 'text'}
            >
              Estoque
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Espaço para o AppBar fixo */}
      <Container component="main" sx={{ flex: 1, py: 3, mt: 2 }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#fff8f8' }}>
            <Typography color="error">
              {error}
            </Typography>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={loadInitialData}
              sx={{ mt: 2 }}
            >
              Tentar novamente
            </Button>
          </Paper>
        ) : (
          <>
            {(!isAuthenticated || currentScreen === 'home') && (
              <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
                <Typography>
                  Status do Backend: <b>{status}</b>
                </Typography>
              </Paper>
            )}
            {(!isAuthenticated || currentScreen === 'home') && (
              <Home
                setCurrentScreen={setCurrentScreen}
                isAuthenticated={isAuthenticated}
                onLogin={handleLogin}
                loginLoading={loginLoading}
                loginError={loginError}
                scrollToLoginArea={scrollToLoginArea}
                loginRef={loginRef}
              />
            )}
            {(isAuthenticated && currentScreen === 'catalogo') && <Catalogo perfis={perfis} />}
            {(isAuthenticated && currentScreen === 'orcamentos') && <OrcamentosList />}
            {(isAuthenticated && currentScreen === 'projetos') && <Projetos />}
            {(isAuthenticated && currentScreen === 'estoque') && <Estoque />}
          </>
        )}
      </Container>
  </Box>
);
}

export default App;
