import React, { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@mui/material";

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

export default function Catalogo() {
  const [tab, setTab] = useState(0);
  const [perfis, setPerfis] = useState([]);
  const [acessorios, setAcessorios] = useState([]);
  const [vidros, setVidros] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- CRUD Perfis ---
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPerfil, setEditingPerfil] = useState(null);
  const [perfilForm, setPerfilForm] = useState({
    codigo: '', descricao: '', preco_barra: '', peso_kg_por_metro: '', unidade_medida: '', fornecedor: ''
  });

  // Atualiza formulário ao editar
  useEffect(() => {
    if (editingPerfil) {
      setPerfilForm(editingPerfil);
    } else {
      setPerfilForm({ codigo: '', descricao: '', preco_barra: '', peso_kg_por_metro: '', unidade_medida: '', fornecedor: '' });
    }
  }, [editingPerfil]);

  // Atualiza lista de perfis
  const fetchPerfis = () => {
    setLoading(true);
    fetch("http://localhost:8000/api/perfis")
      .then(res => res.json())
      .then(data => { setPerfis(data); setLoading(false); });
  };

  // Submissão do formulário (criar ou editar)
  const handleSubmitPerfil = async (e) => {
    e.preventDefault();
    const method = editingPerfil ? 'PUT' : 'POST';
    const url = editingPerfil
      ? `http://localhost:8000/api/perfis/${perfilForm.codigo}`
      : 'http://localhost:8000/api/perfis';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(perfilForm)
    });
    if (res.ok) {
      setModalOpen(false);
      fetchPerfis();
    } else {
      alert('Erro ao salvar perfil.');
    }
  };

  // Excluir perfil
  const handleDeletePerfil = async (codigo) => {
    if (!window.confirm('Tem certeza que deseja excluir este perfil?')) return;
    const res = await fetch(`http://localhost:8000/api/perfis/${codigo}`, { method: 'DELETE' });
    if (res.ok) {
      fetchPerfis();
    } else {
      alert('Erro ao excluir perfil.');
    }
  };

  useEffect(() => {
    console.log('Iniciando carregamento do catálogo...');
    setLoading(true);
    
    const fetchData = async () => {
      try {
        console.log('Fazendo requisições para a API...');
        const [perfisRes, acessoriosRes, vidrosRes] = await Promise.all([
          fetch("http://localhost:8000/api/perfis"),
          fetch("http://localhost:8000/api/acessorios"),
          fetch("http://localhost:8000/api/vidros"),
        ]);

        console.log('Respostas recebidas:', {
          perfisStatus: perfisRes.status,
          acessoriosStatus: acessoriosRes.status,
          vidrosStatus: vidrosRes.status,
        });

        if (!perfisRes.ok) throw new Error(`Erro ao carregar perfis: ${perfisRes.status}`);
        if (!acessoriosRes.ok) throw new Error(`Erro ao carregar acessórios: ${acessoriosRes.status}`);
        if (!vidrosRes.ok) throw new Error(`Erro ao carregar vidros: ${vidrosRes.status}`);

        const [perfisData, acessoriosData, vidrosData] = await Promise.all([
          perfisRes.json(),
          acessoriosRes.json(),
          vidrosRes.json(),
        ]);

        console.log('Dados recebidos:', {
          perfis: perfisData,
          acessorios: acessoriosData,
          vidros: vidrosData,
        });

        setPerfis(perfisData);
        setAcessorios(acessoriosData);
        setVidros(vidrosData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        alert(`Erro ao carregar o catálogo: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /><Typography>Carregando catálogo...</Typography></Box>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>Catálogo</Typography>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth" sx={{ mb: 2 }}>
          <Tab label="Perfis" />
          <Tab label="Acessórios" />
          <Tab label="Vidros" />
        </Tabs>
        <TabPanel value={tab} index={0}>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
  <Typography variant="h6">Perfis</Typography>
  <button style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', cursor: 'pointer' }}
    onClick={() => { setEditingPerfil(null); setModalOpen(true); }}>
    Novo Perfil
  </button>
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
    </Container>
  );
}
