import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, TextField, Table, TableHead, TableRow, TableCell, TableBody, MenuItem, Select, FormControl, InputLabel, ListSubheader } from '@mui/material';

export default function Estoque() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [novo, setNovo] = useState({ nome_item: '', tipo_item: '', quantidade: 0, unidade: 'un', localizacao: '', observacao: '' });
  const [salvando, setSalvando] = useState(false);
  const [catalogo, setCatalogo] = useState({ perfis: [], acessorios: [], vidros: [] });

  // Busca catálogo ao carregar
  useEffect(() => {
    async function fetchCatalogo() {
      try {
        const [perfisRes, acessoriosRes, vidrosRes] = await Promise.all([
          fetch('http://localhost:8000/api/perfis'),
          fetch('http://localhost:8000/api/acessorios'),
          fetch('http://localhost:8000/api/vidros'),
        ]);
        const [perfis, acessorios, vidros] = await Promise.all([
          perfisRes.json(),
          acessoriosRes.json(),
          vidrosRes.json(),
        ]);
        setCatalogo({ perfis, acessorios, vidros });
      } catch (e) {
        setCatalogo({ perfis: [], acessorios: [], vidros: [] });
      }
    }
    fetchCatalogo();
  }, []);

  const carregarEstoque = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/estoque')
      .then(res => res.json())
      .then(data => setItens(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarEstoque();
  }, []);

  // Quando seleciona um nome do catálogo, preenche tipo automaticamente
  const handleNomeChange = (e) => {
    const value = e.target.value;
    let tipo = '';
    if (catalogo.perfis.some(p => p.descricao === value)) tipo = 'Perfil';
    else if (catalogo.acessorios.some(a => a.nome === value)) tipo = 'Acessório';
    else if (catalogo.vidros.some(v => v.nome === value)) tipo = 'Vidro';
    setNovo({ ...novo, nome_item: value, tipo_item: tipo });
  };

  const handleTipoChange = (e) => {
    setNovo({ ...novo, tipo_item: e.target.value });
  };

  const handleChange = e => {
    setNovo({ ...novo, [e.target.name]: e.target.value });
  };

  const handleSalvar = e => {
    e.preventDefault();
    setSalvando(true);
    fetch('http://localhost:8000/api/estoque', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novo)
    })
      .then(res => res.json())
      .then(() => {
        setNovo({ nome_item: '', tipo_item: '', quantidade: 0, unidade: 'un', localizacao: '', observacao: '' });
        carregarEstoque();
      })
      .finally(() => setSalvando(false));
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h5" gutterBottom>Controle de Estoque</Typography>
      <Box component="form" onSubmit={handleSalvar} sx={{ display: 'flex', gap: 2.5, mb: 3, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 220, maxWidth: 300, flexBasis: '220px' }}>
          <InputLabel id="nome-item-label" shrink>Nome do Item</InputLabel>
          <Select
            labelId="nome-item-label"
            id="nome-item-select"
            name="nome_item"
            value={novo.nome_item || ''}
            label="Nome do Item"
            onChange={handleNomeChange}
            required
            displayEmpty
            variant="outlined"
          >
            <MenuItem value="" disabled>
              <em>Selecione...</em>
            </MenuItem>
            <ListSubheader key="ls-perfis">Perfis</ListSubheader>
            {catalogo.perfis.map((p) => (
              <MenuItem key={`perfil-${p.codigo}`} value={p.descricao}>{p.descricao}</MenuItem>
            ))}
            <ListSubheader key="ls-acessorios">Acessórios</ListSubheader>
            {catalogo.acessorios.map((a, idx) => (
              <MenuItem key={`acessorio-${a.id ?? a.nome ?? idx}`} value={a.nome}>{a.nome}</MenuItem>
            ))}
            <ListSubheader key="ls-vidros">Vidros</ListSubheader>
            {catalogo.vidros.map((v) => (
              <MenuItem key={`vidro-${v.id}`} value={v.nome}>{v.nome}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160, maxWidth: 220, flexBasis: '160px' }}>
          <InputLabel id="tipo-item-label" shrink>Tipo</InputLabel>
          <Select
            labelId="tipo-item-label"
            id="tipo-item-select"
            name="tipo_item"
            value={novo.tipo_item || ''}
            label="Tipo"
            onChange={handleTipoChange}
            required
            displayEmpty
            variant="outlined"
          >
            <MenuItem value="" disabled>
              <em>Selecione...</em>
            </MenuItem>
            <MenuItem value="Perfil">Perfil</MenuItem>
            <MenuItem value="Acessório">Acessório</MenuItem>
            <MenuItem value="Vidro">Vidro</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Quantidade" name="quantidade" type="number" value={novo.quantidade} onChange={handleChange} required size="small" sx={{ maxWidth: 120 }} />
        <TextField label="Unidade" name="unidade" value={novo.unidade} onChange={handleChange} required size="small" sx={{ maxWidth: 100 }} />
        <TextField label="Localização" name="localizacao" value={novo.localizacao} onChange={handleChange} size="small" />
        <TextField label="Observação" name="observacao" value={novo.observacao} onChange={handleChange} size="small" />
        <Button type="submit" variant="contained" disabled={salvando}>Adicionar</Button>
      </Box>
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Itens em Estoque</Typography>
      {loading ? (
        <Typography>Carregando...</Typography>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Qtd</TableCell>
              <TableCell>Unidade</TableCell>
              <TableCell>Localização</TableCell>
              <TableCell>Observação</TableCell>
              <TableCell>Atualização</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itens.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.nome_item}</TableCell>
                <TableCell>{item.tipo_item}</TableCell>
                <TableCell>{item.quantidade}</TableCell>
                <TableCell>{item.unidade}</TableCell>
                <TableCell>{item.localizacao}</TableCell>
                <TableCell>{item.observacao}</TableCell>
                <TableCell>{item.data_atualizacao?.split('T')[0]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
