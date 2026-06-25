document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // TEMA CLARO / ESCURO (Dark Mode Toggle)
    // ==========================================
    const body = document.body;
    const btnTheme = document.getElementById('btn-theme');

    btnTheme.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.removeAttribute('data-theme');
            btnTheme.innerText = '🌙 Modo Escuro';
        } else {
            body.setAttribute('data-theme', 'dark');
            btnTheme.innerText = '🌓 Modo Claro';
        }
    });

    // ==========================================
    // NAVEGAÇÃO DE ABAS (SPA Routing)
    // ==========================================
    const btnDashboard = document.getElementById('btn-tab-dashboard');
    const btnSimulador = document.getElementById('btn-tab-simulador');
    const btnAtivos = document.getElementById('btn-tab-ativos');
    const viewDashboard = document.getElementById('view-dashboard');
    const viewSimulador = document.getElementById('view-simulador');
    const viewAtivos = document.getElementById('view-ativos');

    btnDashboard.addEventListener('click', () => {
        btnDashboard.classList.add('active');
        btnSimulador.classList.remove('active');
        btnAtivos.classList.remove('active');
        viewDashboard.style.display = 'block';
        viewSimulador.style.display = 'none';
        viewAtivos.style.display = 'none';
        carregarDashboard(); // Refresh ao voltar
    });

    btnSimulador.addEventListener('click', () => {
        btnSimulador.classList.add('active');
        btnDashboard.classList.remove('active');
        btnAtivos.classList.remove('active');
        viewSimulador.style.display = 'block';
        viewDashboard.style.display = 'none';
        viewAtivos.style.display = 'none';
    });

    btnAtivos.addEventListener('click', () => {
        btnAtivos.classList.add('active');
        btnDashboard.classList.remove('active');
        btnSimulador.classList.remove('active');
        viewAtivos.style.display = 'block';
        viewDashboard.style.display = 'none';
        viewSimulador.style.display = 'none';
        carregarAtivos();
    });

    // ==========================================
    // LÓGICA DO DASHBOARD (ms-carteira)
    // ==========================================
    const formTransacao = document.getElementById('form-transacao');
    const saldoTotalEl = document.getElementById('saldo-total');
    const tabelaTbody = document.querySelector('#tabela-transacoes tbody');
    const btnSubmitTransacao = document.getElementById('btn-submit-transacao');
    const btnCancelTransacao = document.getElementById('btn-cancelar-transacao');
    let editandoTransacaoId = null;

    // Função para formatar moeda BRL
    const formatBRL = (valor) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    };

    // Carrega dados da API e renderiza
    async function carregarDashboard() {
        const data = await Api.getTransacoes();
        
        // Renderiza Saldo
        saldoTotalEl.innerText = formatBRL(data.saldo_total);
        saldoTotalEl.className = data.saldo_total >= 0 ? 'text-success' : 'text-danger';

        // Renderiza Tabela
        tabelaTbody.innerHTML = '';
        data.transacoes.forEach(t => {
            const tr = document.createElement('tr');
            const classeCor = t.tipo === 'RECEITA' ? 'text-success' : 'text-danger';
            
            // Formatando a data do BD (YYYY-MM-DD) para BR
            const dataArr = t.data.split('-');
            const dataBr = `${dataArr[2]}/${dataArr[1]}/${dataArr[0]}`;

            tr.innerHTML = `
                <td>${dataBr}</td>
                <td>${t.descricao}</td>
                <td class="${classeCor}">${t.tipo}</td>
                <td class="${classeCor}">${formatBRL(t.valor)}</td>
                <td>
                    <button class="btn-sm" onclick="prepararEdicaoTransacao(${t.id}, '${t.descricao}', '${t.tipo}', ${t.valor}, '${t.data}')">Editar</button>
                    <button class="btn-sm" onclick="excluirTransacao(${t.id})">Excluir</button>
                </td>
            `;
            tabelaTbody.appendChild(tr);
        });
    }

    // Ações na Tabela Transações
    window.prepararEdicaoTransacao = (id, descricao, tipo, valor, data) => {
        editandoTransacaoId = id;
        document.getElementById('t-descricao').value = descricao;
        document.getElementById('t-tipo').value = tipo;
        document.getElementById('t-valor').value = valor;
        document.getElementById('t-data').value = data;
        
        btnSubmitTransacao.innerText = 'Salvar Edição';
        btnCancelTransacao.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.excluirTransacao = async (id) => {
        if(confirm('Tem certeza que deseja excluir esta transação?')) {
            try {
                await Api.deleteTransacao(id);
                carregarDashboard();
            } catch(e) { alert(e.message); }
        }
    };

    btnCancelTransacao.addEventListener('click', () => {
        editandoTransacaoId = null;
        formTransacao.reset();
        btnSubmitTransacao.innerText = 'Cadastrar';
        btnCancelTransacao.style.display = 'none';
    });

    // Dispara Cadastro / Edição de Transação
    formTransacao.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            descricao: document.getElementById('t-descricao').value,
            tipo: document.getElementById('t-tipo').value,
            valor: parseFloat(document.getElementById('t-valor').value),
            data: document.getElementById('t-data').value
        };

        try {
            if (editandoTransacaoId) {
                await Api.updateTransacao(editandoTransacaoId, payload);
                editandoTransacaoId = null;
                btnSubmitTransacao.innerText = 'Cadastrar';
                btnCancelTransacao.style.display = 'none';
            } else {
                await Api.addTransacao(payload);
            }
            formTransacao.reset();
            carregarDashboard(); // Refresh dinâmico
        } catch (error) {
            alert(error.message);
        }
    });

    // ==========================================
    // LÓGICA DE ATIVOS (CUSTÓDIA)
    // ==========================================
    const formAtivo = document.getElementById('form-ativo');
    const tabelaAtivosTbody = document.querySelector('#tabela-ativos tbody');
    const btnSubmitAtivo = document.getElementById('btn-submit-ativo');
    const btnCancelAtivo = document.getElementById('btn-cancelar-ativo');
    let editandoAtivoId = null;

    async function carregarAtivos() {
        const ativos = await Api.getAtivos();
        
        tabelaAtivosTbody.innerHTML = '';
        ativos.forEach(a => {
            const tr = document.createElement('tr');
            
            // Formatando a data do BD (YYYY-MM-DD) para BR
            const dataArr = a.data_aquisicao.split('-');
            const dataBr = `${dataArr[2]}/${dataArr[1]}/${dataArr[0]}`;
            
            const totalInvestido = a.quantidade * parseFloat(a.preco_medio);

            tr.innerHTML = `
                <td>${dataBr}</td>
                <td><strong>${a.ticker}</strong></td>
                <td>${a.quantidade}</td>
                <td>${formatBRL(a.preco_medio)}</td>
                <td class="text-success">${formatBRL(totalInvestido)}</td>
                <td>
                    <button class="btn-sm" onclick="prepararEdicaoAtivo(${a.id}, '${a.ticker}', ${a.quantidade}, ${a.preco_medio}, '${a.data_aquisicao}')">Editar</button>
                    <button class="btn-sm" onclick="excluirAtivo(${a.id})">Excluir</button>
                </td>
            `;
            tabelaAtivosTbody.appendChild(tr);
        });
    }

    // Ações na Tabela Ativos
    window.prepararEdicaoAtivo = (id, ticker, quantidade, preco_medio, data) => {
        editandoAtivoId = id;
        document.getElementById('a-ticker').value = ticker;
        document.getElementById('a-quantidade').value = quantidade;
        document.getElementById('a-preco').value = preco_medio;
        document.getElementById('a-data').value = data;
        
        btnSubmitAtivo.innerText = 'Salvar Edição';
        btnCancelAtivo.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.excluirAtivo = async (id) => {
        if(confirm('Tem certeza que deseja excluir esta ação da sua custódia?')) {
            try {
                await Api.deleteAtivo(id);
                carregarAtivos();
            } catch(e) { alert(e.message); }
        }
    };

    if(btnCancelAtivo) {
        btnCancelAtivo.addEventListener('click', () => {
            editandoAtivoId = null;
            formAtivo.reset();
            btnSubmitAtivo.innerText = 'Adicionar Ativo';
            btnCancelAtivo.style.display = 'none';
        });
    }

    if(formAtivo) {
        formAtivo.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                ticker: document.getElementById('a-ticker').value.toUpperCase(),
                quantidade: parseInt(document.getElementById('a-quantidade').value),
                preco_medio: parseFloat(document.getElementById('a-preco').value),
                data_aquisicao: document.getElementById('a-data').value
            };

            try {
                if(editandoAtivoId) {
                    await Api.updateAtivo(editandoAtivoId, payload);
                    editandoAtivoId = null;
                    btnSubmitAtivo.innerText = 'Adicionar Ativo';
                    btnCancelAtivo.style.display = 'none';
                } else {
                    await Api.addAtivo(payload);
                }
                formAtivo.reset();
                carregarAtivos(); // Refresh dinâmico
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // ==========================================
    // LÓGICA DO SIMULADOR (ms-investimentos SOA)
    // ==========================================
    const formSimulacao = document.getElementById('form-simulacao');
    const checkUsarSaldo = document.getElementById('s-usar-saldo');
    const groupValorManual = document.getElementById('group-valor-manual');
    const inputValorManual = document.getElementById('s-valor');
    const resultadoProjecao = document.getElementById('resultado-projecao');
    const msgErroSimulacao = document.getElementById('simulacao-error');

    // Regra da Interface: Esconde ou Mostra o input manual
    checkUsarSaldo.addEventListener('change', (e) => {
        if(e.target.checked) {
            groupValorManual.style.display = 'none';
            inputValorManual.removeAttribute('required');
        } else {
            groupValorManual.style.display = 'flex';
            inputValorManual.setAttribute('required', 'true');
        }
    });

    // Dispara o Cálculo de SOA / Fallback
    formSimulacao.addEventListener('submit', async (e) => {
        e.preventDefault();
        msgErroSimulacao.innerText = '';
        resultadoProjecao.innerText = 'Calculando...';
        resultadoProjecao.className = '';

        const payload = {
            meses: parseInt(document.getElementById('s-meses').value),
            taxa_juros: parseFloat(document.getElementById('s-taxa').value),
            usar_saldo_carteira: checkUsarSaldo.checked
        };

        if(!checkUsarSaldo.checked) {
            payload.valor_utilizado = parseFloat(inputValorManual.value);
        }

        try {
            const data = await Api.simular(payload);
            resultadoProjecao.innerText = formatBRL(data.valor_projetado);
            resultadoProjecao.classList.add('text-success');
        } catch (error) {
            // Aqui é onde o FALLBACK BRILHA NA TELA!
            resultadoProjecao.innerText = 'Erro';
            resultadoProjecao.classList.add('text-danger');
            msgErroSimulacao.innerText = error.message; // Exibe o erro 400 formatado que criamos no Python!
        }
    });

    // INIT
    carregarDashboard();
});
