const API_CARTEIRA = 'http://localhost:8000/api';
const API_INVEST = 'http://localhost:8001/api';

class Api {
    // Busca saldo e histórico de transações
    static async getTransacoes() {
        try {
            const res = await fetch(`${API_CARTEIRA}/transacoes/`);
            if (!res.ok) throw new Error('Falha de rede ao buscar transações');
            return await res.json();
        } catch (error) {
            console.error(error);
            return { saldo_total: 0, transacoes: [] };
        }
    }

    // Cadastra nova receita/despesa
    static async addTransacao(data) {
        const res = await fetch(`${API_CARTEIRA}/transacoes/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Erro ao salvar transação');
        return await res.json();
    }

    // Busca lista de ativos
    static async getAtivos() {
        try {
            const res = await fetch(`${API_CARTEIRA}/ativos/`);
            if (!res.ok) throw new Error('Falha de rede ao buscar ativos');
            return await res.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    // Cadastra novo ativo
    static async addAtivo(data) {
        const res = await fetch(`${API_CARTEIRA}/ativos/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Erro ao salvar ativo');
        return await res.json();
    }

    // Aciona a Inteligência SOA do Motor Analítico
    static async simular(data) {
        const res = await fetch(`${API_INVEST}/simulacoes/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const json = await res.json();
        
        if (!res.ok) {
            // Trata o erro amigável de Fallback (Status 400)
            const erroMsg = json.solucao || json.erro || 'Erro na API de Investimentos';
            throw new Error(erroMsg);
        }
        
        return json;
    }
}
