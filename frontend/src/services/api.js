import config from '../config';

const api = {
  // Método genérico para fazer requisições
  async request(endpoint, options = {}) {
    const url = `${config.apiUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      // Se a resposta não for bem-sucedida, lança um erro
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Erro na requisição');
      }

      // Tenta converter a resposta para JSON, se não for possível, retorna texto
      return await response.json().catch(() => response.text());
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  },

  // Métodos específicos para cada endpoint
  getHealth() {
    return this.request('/api/health');
  },

  // Perfis
  getPerfis() {
    return this.request('/api/perfis');
  },

  getPerfil(codigo) {
    return this.request(`/api/perfis/${codigo}`);
  },

  savePerfil(perfil) {
    const method = perfil.codigo ? 'PUT' : 'POST';
    const url = perfil.codigo 
      ? `/api/perfis/${perfil.codigo}` 
      : '/api/perfis';
    
    return this.request(url, {
      method,
      body: JSON.stringify(perfil)
    });
  },

  deletePerfil(codigo) {
    return this.request(`/api/perfis/${codigo}`, {
      method: 'DELETE'
    });
  },

  // Orçamentos
  getOrcamentos() {
    return this.request('/api/orcamentos');
  },

  // Projetos
  getProjetos() {
    return this.request('/api/projetos');
  },

  // Estoque
  getEstoque() {
    return this.request('/api/estoque');
  },

  // Outros recursos
  getAcessorios() {
    return this.request('/api/acessorios');
  },

  getVidros() {
    return this.request('/api/vidros');
  },

  // Atualização de estoque
  atualizarEstoque(estoque) {
    return this.request('/api/estoque', {
      method: 'POST',
      body: JSON.stringify(estoque)
    });
  }
};

export default api;