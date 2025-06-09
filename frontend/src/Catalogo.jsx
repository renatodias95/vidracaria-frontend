import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  CircularProgress,
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar
} from "@mui/material";
import api from './services/api';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`catalogo-tabpanel-${index}`}
      aria-labelledby={`catalogo-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export default function Catalogo({ perfis: initialPerfis = [] }) {
  const [tab, setTab] = useState(0);
  const [perfis, setPerfis] = useState(initialPerfis);
  const [acessorios, setAcessorios] = useState([]);
  const [vidros, setVidros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // --- CRUD Perfis ---
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState(null);
  const [perfilForm, setPerfilForm] = useState({
    codigo: '', 
    descricao: '', 
    preco_barra: '', 
    peso_kg_por_metro: '', 
    unidade_medida: '', 
    fornecedor: ''
  });

  // Atualiza formulário ao editar
  useEffect(() => {
    if (editingPerfil) {
      setPerfilForm(editingPerfil);
    } else {
      setPerfilForm({ 
        codigo: '', 
        descricao: '', 
        preco_barra: '', 
        peso_kg_por_metro: '', 
        unidade_medida: '', 
        fornecedor: '' 
      });
    }
  }, [editingPerfil]);

  // Função para mostrar notificação
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Fechar notificação
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Carrega os dados do catálogo
  const fetchCatalogo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Se já temos os perfis (passados como prop), não precisamos carregar novamente
      const [acessoriosData, vidrosData] = await Promise.all([
        api.getAcessorios().catch(() => []),
        api.getVidros().catch(() => [])
      ]);
      
      setAcessorios(acessoriosData);
      setVidros(vidrosData);
    } catch (err) {
      console.error('Erro ao carregar catálogo:', err);
      setError('Não foi possível carregar o catálogo. Tente novamente mais tarde.');
      showSnackbar('Erro ao carregar o catálogo', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualiza lista de perfis
  const fetchPerfis = useCallback(async () => {
    try {
      const data = await api.getPerfis();
      setPerfis(data);
    } catch (err) {
      console.error('Erro ao carregar perfis:', err);
      showSnackbar('Erro ao carregar perfis', 'error');
    }
  }, []);

  // Carrega os dados iniciais
  useEffect(() => {
    fetchCatalogo();
    // Se não recebemos perfis como prop, carregamos
    if (initialPerfis.length === 0) {
      fetchPerfis();
    }
  }, [fetchCatalogo, fetchPerfis, initialPerfis]);

  // Submissão do formulário (criar ou editar)
  const handleSubmitPerfil = async (e) => {
    e.preventDefault();
    try {
      await api.savePerfil(perfilForm);
      setModalOpen(false);
      await fetchPerfis();
      showSnackbar('Perfil salvo com sucesso!');
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      showSnackbar(err.message || 'Erro ao salvar perfil', 'error');
    }
  };

  // Excluir perfil
  const handleDeletePerfil = async (codigo) => {
    if (!window.confirm('Tem certeza que deseja excluir este perfil?')) return;
    
    try {
      await api.deletePerfil(codigo);
      await fetchPerfis();
      showSnackbar('Perfil excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir perfil:', err);
      showSnackbar('Erro ao excluir perfil', 'error');
    }
  };

  // Renderização condicional para loading e erros
  if (loading && perfis.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Carregando catálogo...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={fetchCatalogo}
          sx={{ mt: 2 }}
        >
          Tentar novamente
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, position: 'relative' }}>
        {/* Overlay de carregamento */}
        {loading && (
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            zIndex: 1
          }}>
            <CircularProgress />
          </Box>
        )}
        
        {/* Cabeçalho */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Catálogo de Produtos
          </Typography>
          
          <Box>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => { 
                setEditingPerfil(null); 
                setModalOpen(true); 
              }}
              sx={{ ml: 2 }}
            >
              Novo Perfil
            </Button>
          </Box>
        </Box>
        
        {/* Abas */}
        <Tabs 
          value={tab} 
          onChange={(_, v) => setTab(v)} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            mb: 3,
            '& .MuiTabs-indicator': {
              height: 4,
              borderRadius: '4px 4px 0 0',
            },
          }}
        >
          <Tab label="Perfis" sx={{ fontWeight: 'medium' }} />
          <Tab label="Acessórios" sx={{ fontWeight: 'medium' }} />
          <Tab label="Vidros" sx={{ fontWeight: 'medium' }} />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2, color: 'text.secondary', fontWeight: 'medium' }}>
              Perfis Disponíveis
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Gerencie os perfis disponíveis para orçamentos e projetos.
            </Typography>
          </Box>
<Box sx={{ overflowX: 'auto' }}>
  {Object.entries(perfis.reduce((acc, perfil) => {
    acc[perfil.fornecedor] = acc[perfil.fornecedor] || [];
    acc[perfil.fornecedor].push(perfil);
    return acc;
  }, {})).map(([fornecedor, lista]) => (
    <Box key={fornecedor} sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', mr: 2 }}>
          Fornecedor:
        </Typography>
        <button
          onClick={() => alert(`Fornecedor: ${fornecedor}`)}
          style={{
            background: 'none',
            border: 'none',
            color: '#1976d2',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '1rem',
            padding: 0
          }}
        >
          {fornecedor}
        </button>
      </Box>
      <Table size="small" sx={{ minWidth: 700 }} stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell><b>Código</b></TableCell>
            <TableCell><b>Descrição</b></TableCell>
            <TableCell align="right"><b>Preço Barra</b></TableCell>
            <TableCell align="right"><b>Peso (kg/m)</b></TableCell>
            <TableCell><b>Unidade</b></TableCell>
            <TableCell><b>Ações</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {lista.map((perfil, idx) => (
    <TableRow key={perfil.codigo} sx={{ backgroundColor: idx % 2 ? '#f5f5f5' : 'white' }}>
      <TableCell>{perfil.codigo}</TableCell>
      <TableCell>{perfil.descricao}</TableCell>
      <TableCell align="right">{Number(perfil.preco_barra).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
      <TableCell align="right">{perfil.peso_kg_por_metro}</TableCell>
      <TableCell>{perfil.unidade_medida}</TableCell>
      <TableCell>
        {perfil.origem === 'usuario' && (
          <>
            <button style={{ marginRight: 8, background: '#ffc107', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}
              onClick={() => { setEditingPerfil(perfil); setModalOpen(true); }}>
              Editar
            </button>
            <button style={{ background: '#d32f2f', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 8px', cursor: 'pointer' }}
              onClick={() => handleDeletePerfil(perfil.codigo)}>
              Excluir
            </button>
          </>
        )}
      </TableCell>
    </TableRow>
  ))}
</TableBody>
      </Table>
    </Box>
  ))}
</Box>

{/* Modal de Cadastro/Edição de Perfil */}
{modalOpen && (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <form onSubmit={handleSubmitPerfil} style={{ background: '#fff', padding: 32, borderRadius: 8, minWidth: 350, boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>{editingPerfil ? 'Editar Perfil' : 'Novo Perfil'}</Typography>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input required placeholder="Código" value={perfilForm.codigo} onChange={e => setPerfilForm(f => ({ ...f, codigo: e.target.value }))} disabled={!!editingPerfil} style={{ padding: 8 }} />
        <input required placeholder="Descrição" value={perfilForm.descricao} onChange={e => setPerfilForm(f => ({ ...f, descricao: e.target.value }))} style={{ padding: 8 }} />
        <input required placeholder="Preço Barra" type="number" value={perfilForm.preco_barra} onChange={e => setPerfilForm(f => ({ ...f, preco_barra: e.target.value }))} style={{ padding: 8 }} />
        <input required placeholder="Peso (kg/m)" value={perfilForm.peso_kg_por_metro} onChange={e => setPerfilForm(f => ({ ...f, peso_kg_por_metro: e.target.value }))} style={{ padding: 8 }} />
        <input required placeholder="Unidade" value={perfilForm.unidade_medida} onChange={e => setPerfilForm(f => ({ ...f, unidade_medida: e.target.value }))} style={{ padding: 8 }} />
        <input required placeholder="Fornecedor" value={perfilForm.fornecedor} onChange={e => setPerfilForm(f => ({ ...f, fornecedor: e.target.value }))} style={{ padding: 8 }} />
      </div>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <button type="button" onClick={() => setModalOpen(false)} style={{ background: '#888', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>Cancelar</button>
        <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}>{editingPerfil ? 'Salvar' : 'Cadastrar'}</button>
      </Box>
    </form>
  </div>
)}

</TabPanel>
        <TabPanel value={tab} index={1}>
  <Typography variant="h6" sx={{ mb: 2 }}>Acessórios</Typography>
  <Box sx={{ overflowX: 'auto' }}>
    <Table size="small" sx={{ minWidth: 500 }} stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell><b>Código</b></TableCell>
          <TableCell><b>Descrição</b></TableCell>
          <TableCell align="right"><b>Preço Unitário</b></TableCell>
          <TableCell><b>Unidade</b></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {acessorios.map((acessorio, idx) => (
          <TableRow key={acessorio.codigo} sx={{ backgroundColor: idx % 2 ? '#f5f5f5' : 'white' }}>
            <TableCell>{acessorio.codigo}</TableCell>
            <TableCell>{acessorio.descricao}</TableCell>
            <TableCell align="right">{Number(acessorio.preco_unitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
            <TableCell>{acessorio.unidade_medida}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
</TabPanel>
        <TabPanel value={tab} index={2}>
  <Typography variant="h6" sx={{ mb: 2 }}>Vidros</Typography>
  <Box sx={{ overflowX: 'auto' }}>
    <Table size="small" sx={{ minWidth: 500 }} stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell><b>ID</b></TableCell>
          <TableCell><b>Descrição</b></TableCell>
          <TableCell align="right"><b>Preço m²</b></TableCell>
          <TableCell><b>Unidade</b></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {vidros.map((vidro, idx) => (
          <TableRow key={vidro.id} sx={{ backgroundColor: idx % 2 ? '#f5f5f5' : 'white' }}>
            <TableCell>{vidro.id}</TableCell>
            <TableCell>{vidro.descricao}</TableCell>
            <TableCell align="right">{Number(vidro.preco_m2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
            <TableCell>{vidro.unidade_medida}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
</TabPanel>
      </Paper>
          {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
