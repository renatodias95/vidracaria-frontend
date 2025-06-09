import config from '../config';

const api = {
    defaults: {
        headers: {}
    },

    setAuthToken(token) {
        if (token) {
            this.defaults.headers['Authorization'] = `Bearer ${token}`;
        } else {
            delete this.defaults.headers['Authorization'];
        }
    },
  // Método genérico para fazer requisições
  async request(endpoint, options = {}) {
    const url = `${config.apiUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaults.headers,
          ...(options.headers || {}),
          ...(!options.headers || !options.headers['Content-Type'] ? { 'Content-Type': 'application/json' } : {}),
        },
        credentials: 'include', // Importante para cookies de autenticação
      });

      // Se a resposta não for bem-sucedida, lança um erro
      if (!response.ok) {
        const errorBody = await response.text();
        let errorJson;
        try {
          errorJson = JSON.parse(errorBody);
        } catch {
          errorJson = {};
        }
        console.error('[API ERROR]', {
          endpoint,
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          errorBody,
          errorJson
        });
        throw new Error(errorJson.message || `Erro na requisição (${response.status})`);
      }

      // Tenta converter a resposta para JSON, se não for possível, retorna texto
      return await response.json().catch(() => response.text());
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  },

  // Autenticação
  async login(username, password) {
    const response = await this.request('/api/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username, password })
    });
    return response;
  },

  async register(userData) {
    const response = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response;
  },

  async getCurrentUser() {
    return await this.request('/api/auth/me');
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