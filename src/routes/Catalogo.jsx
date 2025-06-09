import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Catalogo() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Catálogo
      </Typography>
      <Typography variant="body1">
        Aqui você poderá consultar e gerenciar todos os produtos do seu catálogo de vidraçaria.
      </Typography>
      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        (Esta página é apenas um exemplo. Personalize conforme sua necessidade!)
      </Typography>
    </Box>
  );
}
