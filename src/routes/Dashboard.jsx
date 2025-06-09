import React from 'react';
import { Typography, Box } from '@mui/material';

export default function Dashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Bem-vindo à Área do Usuário
      </Typography>
      <Typography variant="body1">
        Aqui você pode acessar todas as ferramentas profissionais da sua vidraçaria!
      </Typography>
    </Box>
  );
}
