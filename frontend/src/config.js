// Configurações da aplicação
const config = {
  // URL base da API - será definida automaticamente com base no ambiente
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://vidracaria-backend.onrender.com'  // URL do backend no Render
    : 'http://localhost:8000'                    // URL local para desenvolvimento
};

// Para depuração - remover em produção
console.log('API URL:', config.apiUrl);

export default config;
