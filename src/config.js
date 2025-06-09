// Configurações da aplicação
const config = {
  // URL base da API - usa a variável de ambiente VITE_API_URL se disponível
  // ou 'http://localhost:8000' como fallback para desenvolvimento
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000'
};

// Para depuração - mostra a URL da API que está sendo usada
console.log('API URL:', config.apiUrl);

// Verifica se a URL da API está configurada corretamente
if (!config.apiUrl) {
  console.warn('A variável de ambiente VITE_API_URL não está definida. Usando URL padrão.');
}

export default config;
