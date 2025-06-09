import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, Box, CircularProgress, LinearProgress } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './contexts/AuthContext';
import { PrivateRoute } from './routes/PrivateRoute';
import LoginPage from './pages/auth/LoginPage';
import MainLayout from './layouts/MainLayout';
import Landing from './routes/Landing';
import Dashboard from './routes/Dashboard';
import Catalogo from './routes/Catalogo';

const OrcamentosList = () => <div>Orçamentos</div>;
const Projetos = () => <div>Projetos</div>;
const Estoque = () => <div>Estoque</div>;
const Relatorios = () => <div>Relatórios</div>;
const Configuracoes = () => <div>Configurações</div>;

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ width: '100vw', height: '100vh', bgcolor: 'rgba(255,255,255,0.85)', position: 'fixed', top: 0, left: 0, zIndex: 1300 }}>
        <Box sx={{ width: '100%', position: 'absolute', top: 0 }}>
          <LinearProgress color="primary" sx={{ height: 4 }} />
        </Box>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense 
        fallback={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
          >
            <CircularProgress />
          </Box>
        }
      >
        <Routes>
          {/* Landing page SEMPRE na rota '/' */}
          <Route path="/" element={<Landing />} />

          {/* Rota de login */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage />
              )
            } 
          />

          {/* Dashboard e rotas protegidas */}
          <Route element={<MainLayout />}>
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/catalogo"
              element={
                <PrivateRoute>
                  <Catalogo />
                </PrivateRoute>
              }
            />
            <Route
              path="/orcamentos"
              element={
                <PrivateRoute>
                  <OrcamentosList />
                </PrivateRoute>
              }
            />
            <Route
              path="/projetos"
              element={
                <PrivateRoute>
                  <Projetos />
                </PrivateRoute>
              }
            />
            <Route
              path="/estoque"
              element={
                <PrivateRoute>
                  <Estoque />
                </PrivateRoute>
              }
            />
            <Route
              path="/relatorios"
              element={
                <PrivateRoute>
                  <Relatorios />
                </PrivateRoute>
              }
            />
            <Route
              path="/configuracoes"
              element={
                <PrivateRoute>
                  <Configuracoes />
                </PrivateRoute>
              }
            />
          </Route>

          {/* Rota de fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
