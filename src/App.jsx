import { useEffect, useState, useRef } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, AppBar, Toolbar, Button, Box } from '@mui/material';
import OrcamentosList from "./OrcamentosList";
import Catalogo from "./Catalogo";
import Projetos from "./Projetos";
import Estoque from "./Estoque";
import Home from "./Home";

function App() {
  const [status, setStatus] = useState('');
  const [perfis, setPerfis] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    fetch('http://localhost:8000/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.status));
    fetch('http://localhost:8000/api/perfis')
      .then(res => res.json())
      .then(data => setPerfis(data));
  }, []);

  // Função fake de login (substitua por chamada real à API depois)
  const handleLogin = (username, password) => {
    setLoginLoading(true);
    setLoginError("");
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        setIsAuthenticated(true);
        setCurrentScreen('catalogo');
        setLoginLoading(false);
      } else {
        setLoginError('Usuário ou senha inválidos.');
        setLoginLoading(false);
      }
    }, 1000);
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
        <Paper sx={{ p: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
          <Typography>
            Status do Backend: <b>{status}</b>
          </Typography>
        </Paper>
        <Home
          setCurrentScreen={setCurrentScreen}
          isAuthenticated={isAuthenticated}
          onLogin={handleLogin}
          loginLoading={loginLoading}
          loginError={loginError}
          scrollToLoginArea={scrollToLoginArea}
          loginRef={loginRef}
        />
        {currentScreen === 'catalogo' && isAuthenticated && <Catalogo />}
        {currentScreen === 'orcamentos' && isAuthenticated && <OrcamentosList />}
        {currentScreen === 'projetos' && isAuthenticated && <Projetos />}
        {currentScreen === 'estoque' && isAuthenticated && <Estoque />}
      </Container>
    </Box>
  );
}

export default App;

