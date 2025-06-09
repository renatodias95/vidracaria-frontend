import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Container, 
  Alert, 
  LinearProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Esquema de validação
const loginSchema = yup.object().shape({
  username: yup.string().required('Usuário é obrigatório'),
  password: yup.string().required('Senha é obrigatória')
});

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const handleLogin = async (data) => {
    try {
      setError('');
      setLoading(true);
      
      const result = await login(data.username, data.password);
      
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message || 'Falha no login. Verifique suas credenciais.');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError('Ocorreu um erro ao tentar fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        p: 2
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper 
          elevation={6}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            background: 'white'
          }}
        >
          <Box mb={3} textAlign="center">
            <Typography component="h1" variant="h4" color="primary" fontWeight="bold">
              Vidraçaria
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Faça login para continuar
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box 
            component="form" 
            onSubmit={handleSubmit(handleLogin)}
            sx={{ width: '100%', mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuário"
              name="username"
              autoComplete="username"
              autoFocus
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
              disabled={loading}
              variant="outlined"
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={loading}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {loading && <LinearProgress sx={{ my: 2 }} />}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <Box mt={2} textAlign="center">
              <Typography variant="body2" color="textSecondary">
                Esqueceu sua senha?{' '}
                <Link 
                  to="/forgot-password" 
                  style={{ color: '#1976d2', textDecoration: 'none' }}
                >
                  Clique aqui
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} Vidraçaria - Todos os direitos reservados
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default LoginPage;
