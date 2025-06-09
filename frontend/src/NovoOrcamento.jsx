import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const NovoOrcamento = ({ onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    cliente_nome: '',
    cliente_endereco: '',
    cliente_contato: '',
    itens: [{
      tipo_esquadria: '',
      largura: '',
      altura: '',
      cor: 'Branco',
      vidro_selecionado: 'Vidro Comum',
      valor_venda_item: '0.00'
    }]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItens = [...formData.itens];
    newItens[index] = {
      ...newItens[index],
      [name]: value
    };
    
    // Calcular valor do item se for necessário
    if (['largura', 'altura'].includes(name)) {
      // Aqui você pode adicionar a lógica de cálculo do valor
      // Por enquanto, vamos apenas atualizar o valor com base na área
      const largura = parseFloat(newItens[index].largura) || 0;
      const altura = parseFloat(newItens[index].altura) || 0;
      const area = (largura * altura) / 10000; // Convertendo para m²
      newItens[index].valor_venda_item = (area * 150).toFixed(2); // Exemplo: R$ 150 por m²
    }

    setFormData(prev => ({
      ...prev,
      itens: newItens
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      itens: [
        ...prev.itens,
        {
          tipo_esquadria: '',
          largura: '',
          altura: '',
          cor: 'Branco',
          vidro_selecionado: 'Vidro Comum',
          valor_venda_item: '0.00'
        }
      ]
    }));
  };

  const removeItem = (index) => {
    if (formData.itens.length === 1) return; // Não remove o último item
    const newItens = [...formData.itens];
    newItens.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      itens: newItens
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para salvar o orçamento
    console.log('Dados do orçamento:', formData);
    // onSave(formData);
  };

  return (
    <Container component="main" maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Novo Orçamento
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Nome do Cliente"
                name="cliente_nome"
                value={formData.cliente_nome}
                onChange={handleChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Endereço"
                name="cliente_endereco"
                value={formData.cliente_endereco}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Contato"
                name="cliente_contato"
                value={formData.cliente_contato}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Itens do Orçamento</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addItem}
            >
              Adicionar Item
            </Button>
          </Box>

          {formData.itens.map((item, index) => (
            <Paper key={index} sx={{ p: 2, mb: 2, position: 'relative' }}>
              <IconButton 
                onClick={() => removeItem(index)}
                disabled={formData.itens.length === 1}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: 'error.main',
                  display: formData.itens.length === 1 ? 'none' : 'inline-flex'
                }}
              >
                <DeleteIcon />
              </IconButton>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Tipo de Esquadria"
                    name="tipo_esquadria"
                    value={item.tipo_esquadria}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField
                    fullWidth
                    label="Largura (cm)"
                    name="largura"
                    type="number"
                    value={item.largura}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <TextField
                    fullWidth
                    label="Altura (cm)"
                    name="altura"
                    type="number"
                    value={item.altura}
                    onChange={(e) => handleItemChange(index, e)}
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6} md={2}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Cor</InputLabel>
                    <Select
                      name="cor"
                      value={item.cor}
                      onChange={(e) => handleItemChange(index, e)}
                      label="Cor"
                    >
                      <MenuItem value="Branco">Branco</MenuItem>
                      <MenuItem value="Preto">Preto</MenuItem>
                      <MenuItem value="Marrom">Marrom</MenuItem>
                      <MenuItem value="Cinza">Cinza</MenuItem>
                      <MenuItem value="Personalizado">Personalizado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={2}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Vidro</InputLabel>
                    <Select
                      name="vidro_selecionado"
                      value={item.vidro_selecionado}
                      onChange={(e) => handleItemChange(index, e)}
                      label="Vidro"
                    >
                      <MenuItem value="Vidro Comum">Vidro Comum</MenuItem>
                      <MenuItem value="Vidro Temperado">Vidro Temperado</MenuItem>
                      <MenuItem value="Vidro Laminado">Vidro Laminado</MenuItem>
                      <MenuItem value="Espelho">Espelho</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Valor do Item"
                    name="valor_venda_item"
                    value={item.valor_venda_item}
                    InputProps={{
                      readOnly: true,
                      startAdornment: 'R$ ',
                    }}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={onCancel}
              sx={{ mr: 1 }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Salvar Orçamento
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default NovoOrcamento;
