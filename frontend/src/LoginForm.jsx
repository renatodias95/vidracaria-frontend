import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function LoginForm({ onLogin, loading, error, loginRef }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin(username, password);
    }
  };

  return (
    <Paper
      ref={loginRef}
      elevation={6}
      sx={{ maxWidth: 370, width: '100%', mx: 'auto', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 4 }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <LockOutlinedIcon color="primary" sx={{ fontSize: 44, mb: 1 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Acesso Exclusivo às Ferramentas Profissionais JRGLASS
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          Desbloqueie agora o sistema completo para sua vidraçaria. Solicite seu acesso e transforme sua gestão!
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Usuário"
          variant="outlined"
          fullWidth
          required
          margin="normal"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
        />
        <TextField
          label="Senha"
          variant="outlined"
          fullWidth
          required
          type="password"
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 3, fontWeight: 700, fontSize: 18, borderRadius: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={26} color="inherit" /> : "Entrar"}
        </Button>
      </form>
    </Paper>
  );
}
