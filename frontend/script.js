// ============================================================
// CONFIGURAÇÕES
// ============================================================

// URL base da nossa API.
const API_URL = "http://127.0.0.1:8000";

// Lista de produtos recebidos da API.
let produtos = [];

// Produtos adicionados à venda atual.
let carrinho = [];


// ============================================================
// CARREGAR PRODUTOS
// ============================================================

async function carregarProdutos() {

    try {

        // Busca os produtos no backend.
        const resposta = await fetch(
            `${API_URL}/produtos/`
        );

        // Verifica se a API respondeu com erro.
        if (!resposta.ok) {
            throw new Error("Erro ao buscar produtos.");
        }

        // Converte a resposta para JavaScript.
        produtos = await resposta.json();

        // Mostra os produtos na tela.
        mostrarProdutos();

    } catch (erro) {

        console.error(
            "Erro ao carregar produtos:",
            erro
        );

        document.getElementById(
            "lista-produtos"
        ).innerHTML = `
            <p>
                Não foi possível carregar os produtos.
            </p>
        `;
    }
}


// ============================================================
// MOSTRAR PRODUTOS
// ============================================================

function mostrarProdutos() {

    const lista = document.getElementById(
        "lista-produtos"
    );

    if (produtos.length === 0) {

        lista.innerHTML = `
            <p>
                Nenhum produto cadastrado.
            </p>
        `;

        return;
    }

    lista.innerHTML = produtos.map(produto => `

        <div class="product-card">

            <h3>
                ${produto.nome}
            </h3>

            <p class="price">
                ${formatarMoeda(Number(produto.preco))}
            </p>

            <p>
                Estoque: ${produto.estoque}
            </p>

            <button
                onclick="adicionarAoCarrinho(${produto.id})"
                ${produto.estoque <= 0 ? "disabled" : ""}
            >
                Adicionar
            </button>

        </div>

    `).join("");
}


// ============================================================
// ADICIONAR AO CARRINHO
// ============================================================

function adicionarAoCarrinho(produtoId) {

    // Procura o produto na lista que veio da API.
    const produto = produtos.find(
        produto => produto.id === produtoId
    );

    if (!produto) {

        console.error(
            "Produto não encontrado."
        );

        return;
    }

    // Verifica se o produto já está no carrinho.
    const itemExistente = carrinho.find(
        item => item.produto_id === produtoId
    );

    if (itemExistente) {

        // Não deixa colocar mais produtos
        // do que existe no estoque.
        if (
            itemExistente.quantidade >=
            produto.estoque
        ) {

            alert(
                "Quantidade maior que o estoque disponível."
            );

            return;
        }

        // Se já existe, aumenta a quantidade.
        itemExistente.quantidade++;

    } else {

        // Se ainda não existe, adiciona ao carrinho.
        carrinho.push({

            produto_id: produto.id,
            nome: produto.nome,
            preco: Number(produto.preco),
            quantidade: 1

        });
    }

    // Atualiza a tela.
    mostrarCarrinho();
}


// ============================================================
// MOSTRAR CARRINHO
// ============================================================

// ============================================================
// MOSTRAR CARRINHO
// ============================================================

// Desenha os produtos que estão atualmente
// dentro do carrinho.
function mostrarCarrinho() {

    const elementoCarrinho =
        document.getElementById("carrinho");

    // Se o carrinho estiver vazio,
    // mostramos a mensagem padrão.
    if (carrinho.length === 0) {

        elementoCarrinho.innerHTML = `
            <p class="empty-cart">
                Nenhum produto adicionado.
            </p>
        `;

        atualizarResumo();

        return;
    }

    // Cria visualmente cada item do carrinho.
    elementoCarrinho.innerHTML = carrinho.map(
        item => `

        <div class="cart-item">

            <div>

                <strong>
                    ${item.nome}
                </strong>

                <p>
                    ${formatarMoeda(item.preco)}
                    x ${item.quantidade}
                </p>

            </div>


            <div>

                <strong>
                    ${formatarMoeda(
                        item.preco *
                        item.quantidade
                    )}
                </strong>

                <div>

                    <!-- Diminui uma unidade -->
                    <button
                        onclick="diminuirQuantidade(${item.produto_id})"
                    >
                        −
                    </button>

                    <!-- Mostra a quantidade atual -->
                    <span>
                        ${item.quantidade}
                    </span>

                    <!-- Aumenta uma unidade -->
                    <button
                        onclick="aumentarQuantidade(${item.produto_id})"
                    >
                        +
                    </button>

                </div>

                <!-- Remove o produto inteiro -->
                <button
                    onclick="removerDoCarrinho(${item.produto_id})"
                >
                    Remover
                </button>

            </div>

        </div>

    `
    ).join("");

    // Atualiza subtotal, total e quantidade.
    atualizarResumo();
}
// ============================================================
// AUMENTAR QUANTIDADE
// ============================================================

// Aumenta em 1 a quantidade de um produto
// que já está no carrinho.
function aumentarQuantidade(produtoId) {

    // Procura o produto no carrinho.
    const item = carrinho.find(
        item => item.produto_id === produtoId
    );

    // Se não encontrou, não fazemos nada.
    if (!item) {
        return;
    }

    // Procura o produto original para descobrir
    // quanto existe disponível no estoque.
    const produto = produtos.find(
        produto => produto.id === produtoId
    );

    if (!produto) {
        return;
    }

    // Impede que o carrinho ultrapasse o estoque.
    if (item.quantidade >= produto.estoque) {

        alert(
            "Quantidade maior que o estoque disponível."
        );

        return;
    }

    // Aumenta uma unidade.
    item.quantidade++;

    // Atualiza a tela.
    mostrarCarrinho();
}
// ============================================================
// DIMINUIR QUANTIDADE
// ============================================================

// Diminui em 1 a quantidade de um produto
// que está no carrinho.
function diminuirQuantidade(produtoId) {

    // Procura o produto no carrinho.
    const item = carrinho.find(
        item => item.produto_id === produtoId
    );

    if (!item) {
        return;
    }

    // Se tiver apenas 1 unidade,
    // removemos o produto do carrinho.
    if (item.quantidade === 1) {

        removerDoCarrinho(produtoId);

        return;
    }

    // Caso tenha mais de uma unidade,
    // apenas diminuímos a quantidade.
    item.quantidade--;

    // Atualiza a tela.
    mostrarCarrinho();
}


// ============================================================
// REMOVER DO CARRINHO
// ============================================================

function removerDoCarrinho(produtoId) {

    // Mantém todos os produtos,
    // menos aquele que queremos remover.
    carrinho = carrinho.filter(
        item => item.produto_id !== produtoId
    );

    mostrarCarrinho();
}


// ============================================================
// ATUALIZAR RESUMO
// ============================================================

function atualizarResumo() {

    // Soma as quantidades.
    const quantidade = carrinho.reduce(
        (total, item) =>
            total + item.quantidade,
        0
    );

    // Soma o valor da venda.
    const subtotal = carrinho.reduce(
        (total, item) =>
            total +
            (item.preco * item.quantidade),
        0
    );

    document.getElementById(
        "quantidade-itens"
    ).textContent =
        `${quantidade} ${quantidade === 1 ? "item" : "itens"}`;

    document.getElementById(
        "subtotal"
    ).textContent =
        formatarMoeda(subtotal);

    document.getElementById(
        "total"
    ).textContent =
        formatarMoeda(subtotal);
}


// ============================================================
// FORMATAR MOEDA
// ============================================================

function formatarMoeda(valor) {

    return valor.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


// ============================================================
// FINALIZAR VENDA
// ============================================================

async function finalizarVenda() {
    // Verifica se existe algum produto no carrinho
    if (carrinho.length === 0) {
        alert("O carrinho está vazio.");
        return;
    }

    // Pega a forma de pagamento escolhida na tela
    const formaPagamento = document.getElementById("forma-pagamento").value;

    // Monta os dados exatamente no formato que a API espera
    const venda = {
        itens: carrinho.map(item => ({
            produto_id: item.id,
            quantidade: item.quantidade
        })),

        forma_pagamento: formaPagamento
    };

    try {
        // Envia a venda para o backend
        const resposta = await fetch(`${API_URL}/vendas/`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(venda)
        });

        // Se a API retornar erro, mostramos a mensagem
        if (!resposta.ok) {
            const erro = await resposta.json();

            alert(erro.detail || "Erro ao finalizar a venda.");
            return;
        }

        // Converte a resposta da API para objeto JavaScript
        const resultado = await resposta.json();

        // Mostra confirmação para o usuário
        alert(
            `Venda #${resultado.id} realizada com sucesso!\n` +
            `Total: ${formatarMoeda(resultado.total)}`
        );

        // Limpa o carrinho depois da venda
        carrinho = [];

        // Atualiza a tela
        mostrarCarrinho();

        // Recarrega os produtos para atualizar o estoque exibido
        carregarProdutos();

    } catch (erro) {
        // Erro de comunicação com a API
        console.error("Erro ao finalizar venda:", erro);

        alert("Não foi possível conectar com o sistema.");
    }
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

// Carrega os produtos apenas uma vez.
carregarProdutos();

// Começa com o carrinho vazio.
mostrarCarrinho();