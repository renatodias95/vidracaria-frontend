import React from "react";
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, Container, Fade } from "@mui/material";
import Inventory2Icon from '@mui/icons-material/Inventory2';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LoginForm from './LoginForm';

const heroBg =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"; // Imagem ilustrativa de vidro

const galleryImages = [
  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80"
];

const navButtons = [
  { label: 'Catálogo', icon: <Inventory2Icon sx={{ fontSize: 54 }} />, color: '#1976d2', bg: 'linear-gradient(135deg, #e3f0ff 0%, #1976d2 100%)', screen: 'catalogo' },
  { label: 'Orçamentos', icon: <RequestQuoteIcon sx={{ fontSize: 54 }} />, color: '#388e3c', bg: 'linear-gradient(135deg, #e8f5e9 0%, #388e3c 100%)', screen: 'orcamentos' },
  { label: 'Projetos', icon: <ArchitectureIcon sx={{ fontSize: 54 }} />, color: '#fbc02d', bg: 'linear-gradient(135deg, #fff9e1 0%, #fbc02d 100%)', screen: 'projetos' },
  { label: 'Estoque', icon: <WarehouseIcon sx={{ fontSize: 54 }} />, color: '#d32f2f', bg: 'linear-gradient(135deg, #ffebee 0%, #d32f2f 100%)', screen: 'estoque' },
];

import { useNavigate } from 'react-router-dom';

export default function Home({ setCurrentScreen, isAuthenticated, onLogin, loginLoading, loginError, scrollToLoginArea, loginRef }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100vw', minHeight: '100vh', background: '#fff', overflowX: 'hidden' }}>
      {/* HERO SECTION FULLSCREEN */}
      <Box
        sx={{
          minHeight: { xs: '100vh', md: '100vh' },
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(rgba(20,40,80,0.7),rgba(20,40,80,0.7)), url(${heroBg}) center/cover no-repeat`,
          color: '#fff',
          textAlign: 'center',
          position: 'relative',
          boxShadow: '0 10px 40px 0 rgba(31, 38, 135, 0.15)',
        }}
      >
        <Fade in timeout={1200}>
          <Container maxWidth="lg" sx={{ zIndex: 2 }}>
            <Typography variant="h1" sx={{ fontWeight: 900, mb: 2, letterSpacing: 3, fontSize: { xs: 36, md: 64 }, textShadow: '0 4px 24px #2228' }}>
              JRGLASS WORKS
            </Typography>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 400, textShadow: '0 2px 12px #2227' }}>
              Gestão inteligente e moderna para vidraçarias
            </Typography>
            <Typography variant="h6" sx={{ mb: 6, maxWidth: 700, mx: "auto", opacity: 0.95, fontWeight: 400, fontSize: { xs: 16, md: 22 }, textShadow: '0 2px 8px #2226' }}>
              Plataforma digital completa para conectar clientes, fornecedores e empresas vidraceiras num ambiente seguro, eficiente e online.
            </Typography>
            {/* BOTÕES GRANDES DE NAVEGAÇÃO */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: { xs: 3, md: 8 }, mb: 6 }}>
              {navButtons.map((btn, idx) => (
                <Button
                  key={btn.label}
                  onClick={() => {
                    if (isAuthenticated) {
                      switch (btn.screen) {
                        case 'catalogo':
                          navigate('/catalogo');
                          break;
                        case 'orcamentos':
                          navigate('/orcamentos');
                          break;
                        case 'projetos':
                          navigate('/projetos');
                          break;
                        case 'estoque':
                          navigate('/estoque');
                          break;
                        default:
                          // Não navegue para dashboard automaticamente
                          break;
                      }
                    } else if (scrollToLoginArea) {
                      scrollToLoginArea();
                    }
                  }}
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 0,
                    minWidth: 140,
                    minHeight: 140,
                    borderRadius: '50%',
                    background: btn.bg,
                    color: btn.color,
                    boxShadow: 8,
                    mx: 2,
                    mb: 1,
                    fontWeight: 700,
                    fontSize: 20,
                    letterSpacing: 1,
                    transition: 'transform 0.25s, box-shadow 0.25s',
                    '&:hover': {
                      transform: 'scale(1.08)',
                      boxShadow: 16,
                      background: btn.bg.split('100%)')[0] + '60%)',
                    },
                    display: 'flex',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {btn.icon}
                  <span style={{ marginTop: 14 }}>{btn.label}</span>
                </Button>
              ))}
            </Box>
            <Button variant="contained" size="large" color="primary" sx={{ fontWeight: 700, fontSize: 18, px: 5, py: 1.5, borderRadius: 8, boxShadow: 3, mt: 2 }}>
              Simule seu orçamento agora
            </Button>
          </Container>
        </Fade>
        {/* Overlay escuro extra para contraste */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(20,40,80,0.15)', zIndex: 1 }} />
      </Box>


      {/* ÁREA DE LOGIN */}
      {!isAuthenticated && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200, mb: 4 }}>
          {!isAuthenticated && <LoginForm onLogin={onLogin} loading={loginLoading} error={loginError} loginRef={loginRef} />}
        </Box>
      )}

      {/* DESTAQUES EM BALÕES ALTERNADOS E COLORIDOS */}
      <Box sx={{ my: 10 }}>
        <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
          Por que escolher a JRGLASS?
        </Typography>
        <Typography align="center" sx={{ color: 'text.secondary', mb: 4, fontSize: 18 }}>
          Tudo o que sua vidraçaria precisa para crescer com tecnologia, segurança e praticidade.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center', mt: 4 }}>
          {/* Balão 1 - Azul, levemente à esquerda */}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ position: 'relative', maxWidth: 520, bgcolor: 'linear-gradient(135deg, #e3f0ff 0%, #b3d8fd 100%)', p: 3, borderRadius: 4, boxShadow: 6, ml: { md: 0, xs: 0 }, mr: { md: 12, xs: 0 }, transform: { md: 'translateX(-40px)', xs: 'none' } }}>
              <Box sx={{ position: 'absolute', top: 18, left: -54, bgcolor: 'transparent', display: { xs: 'none', md: 'block' } }}>
                <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4bb.svg" alt="Notebook" width={38} height={38} />
              </Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#1976d2' }}>Orçamento Online Instantâneo</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>Simule orçamentos em tempo real, sem instalar nada. Surpreenda seu cliente com agilidade e praticidade!</Typography>
              <Typography variant="body2" sx={{ color: '#1976d2' }}>Destaque-se da concorrência com tecnologia de ponta.</Typography>
            </Box>
          </Box>
          {/* Balão 2 - Verde, levemente à direita */}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ position: 'relative', maxWidth: 520, bgcolor: 'linear-gradient(135deg, #e6ffe3 0%, #b6f5c9 100%)', p: 3, borderRadius: 4, boxShadow: 6, mr: { md: 0, xs: 0 }, ml: { md: 12, xs: 0 }, transform: { md: 'translateX(40px)', xs: 'none' } }}>
              <Box sx={{ position: 'absolute', top: 18, right: -54, bgcolor: 'transparent', display: { xs: 'none', md: 'block' } }}>
                <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4c8.svg" alt="Gráfico" width={38} height={38} />
              </Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#2e7d32' }}>Integração Total</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>Conecte clientes, fornecedores e equipe em um só lugar. Gestão de estoque e pedidos automatizada.</Typography>
              <Typography variant="body2" sx={{ color: '#2e7d32' }}>Mais controle, menos trabalho manual e mais tempo para vender!</Typography>
            </Box>
          </Box>
          {/* Balão 3 - Amarelo, levemente à esquerda */}
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ position: 'relative', maxWidth: 520, bgcolor: 'linear-gradient(135deg, #fffbe3 0%, #fff3b0 100%)', p: 3, borderRadius: 4, boxShadow: 6, ml: { md: 0, xs: 0 }, mr: { md: 12, xs: 0 }, transform: { md: 'translateX(-40px)', xs: 'none' } }}>
              <Box sx={{ position: 'absolute', top: 18, left: -54, bgcolor: 'transparent', display: { xs: 'none', md: 'block' } }}>
                <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f512.svg" alt="Cadeado" width={38} height={38} />
              </Box>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#bc8c00' }}>Segurança e Eficiência</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>Plataforma segura, acessível de qualquer dispositivo, com relatórios completos e integração financeira.</Typography>
              <Typography variant="body2" sx={{ color: '#bc8c00' }}>Tenha tranquilidade e foco no crescimento do seu negócio.</Typography>
            </Box>
          </Box>
        </Box>
        {/* Frase final de chamada para ação */}
        <Typography align="center" sx={{ mt: 7, fontWeight: 700, fontSize: 22, color: '#1976d2' }}>
          Garanta seu acesso e transforme sua vidraçaria com a JRGLASS!
        </Typography>
      </Box>

      {/* GALERIA DE FOTOS - cards de serviços reais */}
      <Box sx={{ background: "#f4f8fb", py: 6 }}>
        <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
          Serviços Realizados
        </Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Card sx={{ width: 280, height: 180, borderRadius: 4, boxShadow: 4 }}>
              <CardMedia
                component="img"
                height="180"
                image="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                alt="Box de Banheiro em Vidro Temperado"
                sx={{ objectFit: 'cover' }}
              />
            </Card>
            <Typography align="center" sx={{ mt: 1, fontWeight: 500 }}>Box de Banheiro em Vidro Temperado</Typography>
          </Grid>
          <Grid item>
            <Card sx={{ width: 280, height: 180, borderRadius: 4, boxShadow: 4 }}>
              <CardMedia
                component="img"
                height="180"
                image="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80"
                alt="Fachada de Vidro"
                sx={{ objectFit: 'cover' }}
              />
            </Card>
            <Typography align="center" sx={{ mt: 1, fontWeight: 500 }}>Fachada de Vidro</Typography>
          </Grid>
          <Grid item>
            <Card sx={{ width: 280, height: 180, borderRadius: 4, boxShadow: 4 }}>
              <CardMedia
                component="img"
                height="180"
                image="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80"
                alt="Portas e Janelas de Alumínio"
                sx={{ objectFit: 'cover' }}
              />
            </Card>
            <Typography align="center" sx={{ mt: 1, fontWeight: 500 }}>Portas e Janelas de Alumínio</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* SOBRE */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}>
          Sobre a Plataforma
        </Typography>
        <Typography variant="body1" sx={{ fontSize: 18, maxWidth: 900, mx: "auto", textAlign: "center" }}>
          O sistema de gestão para vidraçarias JRGLASS WORKS integra e automatiza todas as etapas do setor, conectando clientes, fornecedores, empresas vidraceiras e contadores em um ambiente moderno, seguro e eficiente. Controle de estoque detalhado, integração com meios de pagamento, painel do contador, comunicação direta e recursos inovadores garantem eficiência, redução de custos e modernização para o seu negócio.
        </Typography>
      </Container>
    </Box>
  );
}
