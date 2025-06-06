import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Typography, Paper } from '@mui/material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`projetos-tabpanel-${index}`}
      aria-labelledby={`projetos-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Projetos() {
  const [tab, setTab] = useState(0);
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/projetos")
      .then(res => res.json())
      .then(data => {
        setProjetos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5" gutterBottom>Projetos</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth" sx={{ mb: 2 }}>
        <Tab label="Esquadrias" />
        <Tab label="Vidro Temperado" />
        <Tab label="Outros" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <Typography variant="subtitle1">Projetos de Esquadrias</Typography>
        {loading ? (
          <Typography>Carregando projetos...</Typography>
        ) : (
          projetos.filter(p => p.tipo === 'esquadria').length === 0 ? (
            <Typography color="text.secondary">Nenhum projeto de esquadria cadastrado.</Typography>
          ) : (
            <ul>
              {projetos.filter(p => p.tipo === 'esquadria').map(proj => (
                <li key={proj.id}>
                  <strong>{proj.nome}</strong> <br />
                  <span style={{ color: '#555' }}>{proj.descricao}</span>
                  <br /><span style={{ fontSize: 12, color: '#888' }}>Criado em: {proj.data_criacao?.split('T')[0]}</span>
                </li>
              ))}
            </ul>
          )
        )}
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <Typography variant="subtitle1">Projetos de Vidro Temperado</Typography>
        {loading ? (
          <Typography>Carregando projetos...</Typography>
        ) : (
          projetos.filter(p => p.tipo === 'vidro temperado').length === 0 ? (
            <Typography color="text.secondary">Nenhum projeto de vidro temperado cadastrado.</Typography>
          ) : (
            <ul>
              {projetos.filter(p => p.tipo === 'vidro temperado').map(proj => (
                <li key={proj.id}>
                  <strong>{proj.nome}</strong> <br />
                  <span style={{ color: '#555' }}>{proj.descricao}</span>
                  <br /><span style={{ fontSize: 12, color: '#888' }}>Criado em: {proj.data_criacao?.split('T')[0]}</span>
                </li>
              ))}
            </ul>
          )
        )}
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <Typography variant="subtitle1">Outros Projetos</Typography>
        {loading ? (
          <Typography>Carregando projetos...</Typography>
        ) : (
          projetos.filter(p => p.tipo !== 'esquadria' && p.tipo !== 'vidro temperado').length === 0 ? (
            <Typography color="text.secondary">Nenhum outro projeto cadastrado.</Typography>
          ) : (
            <ul>
              {projetos.filter(p => p.tipo !== 'esquadria' && p.tipo !== 'vidro temperado').map(proj => (
                <li key={proj.id}>
                  <strong>{proj.nome}</strong> <br />
                  <span style={{ color: '#555' }}>{proj.descricao}</span>
                  <br /><span style={{ fontSize: 12, color: '#888' }}>Criado em: {proj.data_criacao?.split('T')[0]}</span>
                </li>
              ))}
            </ul>
          )
        )}
      </TabPanel>
    </Paper>
  );
}
