import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Button,
  Tabs,
  Tab
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from '@mui/icons-material/Add';
import NovoOrcamento from "./NovoOrcamento";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`orcamentos-tabpanel-${index}`}
      aria-labelledby={`orcamentos-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function OrcamentosList() {
  const [tabValue, setTabValue] = useState(0);
  const [orcamentos, setOrcamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCancelarNovo = () => {
    setTabValue(0);
  };

  const handleSalvarOrcamento = (novoOrcamento) => {
    // Aqui você pode adicionar a lógica para salvar o novo orçamento
    console.log('Novo orçamento:', novoOrcamento);
    setTabValue(0);
    carregarOrcamentos();
  };

  const carregarOrcamentos = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/orcamentos");
      const data = await response.json();
      setOrcamentos(data);
    } catch (error) {
      console.error('Erro ao carregar orçamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarOrcamentos();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="abas de orçamentos">
          <Tab label="Lista de Orçamentos" id="orcamentos-tab-0" aria-controls="orcamentos-tabpanel-0" />
          <Tab label={<span><AddIcon sx={{ verticalAlign: 'middle', mr: 1 }} />Novo Orçamento</span>} id="orcamentos-tab-1" aria-controls="orcamentos-tabpanel-1" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h4" gutterBottom>
          Lista de Orçamentos
        </Typography>
        {loading ? (
          <Typography>Carregando orçamentos...</Typography>
        ) : (
          <>
            {orcamentos.length === 0 && (
              <Typography>Nenhum orçamento encontrado.</Typography>
            )}
            {orcamentos.map((orc) => (
              <Accordion key={orc.id} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography>#{orc.numero_orcamento} - {orc.cliente_nome}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Valor Venda: R$ {orc.valor_total_venda}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle2" gutterBottom>
                    Data: {orc.data_hora} | Endereço: {orc.cliente_endereco} | Contato: {orc.cliente_contato}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Detalhes Otimização:<br />
                    <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{orc.detalhes_otimizacao}</pre>
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Itens do Orçamento:
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Tipo Esquadria</TableCell>
                          <TableCell>Largura</TableCell>
                          <TableCell>Altura</TableCell>
                          <TableCell>Cor</TableCell>
                          <TableCell>Vidro</TableCell>
                          <TableCell>Valor Venda Item</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orc.itens.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.tipo_esquadria}</TableCell>
                            <TableCell>{item.largura}</TableCell>
                            <TableCell>{item.altura}</TableCell>
                            <TableCell>{item.cor}</TableCell>
                            <TableCell>{item.vidro_selecionado}</TableCell>
                            <TableCell>R$ {item.valor_venda_item}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </>
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <NovoOrcamento onCancel={handleCancelarNovo} onSave={handleSalvarOrcamento} />
      </TabPanel>
    </Container>
  );
}
