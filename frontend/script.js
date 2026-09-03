// ============================================================
// CONFIGURAÇÕES
// ============================================================

// URL base da nossa API FastAPI.
const API_URL = "http://127.0.0.1:8000";

// Aqui vamos guardar todos os produtos vindos da API.
let produtos = [];

// Aqui ficam somente os produtos da venda atual.
let carrinho = [];


// ============================================================
// CARREGAR PRODUTOS
// ============================================================

async function carregarProdutos() {

    try {

        // Faz uma requisição GET para buscar os produtos.
        const resposta = await fetch(
            `${API_URL}/produtos/`
        );

        // Se a API retornar algum erro, interrompemos a execução.
        if (!resposta.ok) {
            throw new Error("Erro ao buscar produtos.");
        }

        // Converte a resposta da API para um objeto JavaScript.
        produtos = await resposta.json();

        // Depois de carregar os produtos,
        // mostramos eles na tela.
        mostrarProdutos();

    } catch (erro) {

        // Mostra o erro no console do navegador.
        console.error(
            "Erro ao carregar produtos:",
            erro
        );

        // Mostra uma mensagem para o usuário.
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
// MOSTRAR PRODUTOS NA TELA
// ============================================================

function mostrarProdutos() {

    // Pega o elemento HTML onde os produtos serão exibidos.
    const lista = document.getElementById(
        "lista-produtos"
    );

    // Se não houver produtos cadastrados,
    // mostramos uma mensagem.
    if (produtos.length === 0) {

        lista.innerHTML = `
            <p>
                Nenhum produto cadastrado.
            </p>
        `;

        return;
    }

    // Percorre todos os produtos e cria o HTML de cada um.
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
// ADICIONAR PRODUTO AO CARRINHO
// ============================================================

function adicionarAoCarrinho(produtoId) {

    // Procura o produto na lista de produtos.
    const produto = produtos.find(
        produto => produto.id === produtoId
    );

    // Se não encontrou o produto, interrompe.
    if (!produto) {

        console.error(
            "Produto não encontrado."
        );

        return;
    }

    // Verifica se esse produto já está no carrinho.
    const itemExistente = carrinho.find(
        item => item.produto_id === produtoId
    );

    // ========================================================
    // PRODUTO JÁ ESTÁ NO CARRINHO
    // ========================================================

    if (itemExistente) {

        // Verifica se já atingimos o limite do estoque.
        if (
            itemExistente.quantidade >=
            produto.estoque
        ) {

            alert(
                "Quantidade maior que o estoque disponível."
            );

            return;
        }

        // Se ainda houver estoque,
        // aumenta a quantidade em 1.
        itemExistente.quantidade++;

    } else {

        // ====================================================
        // PRODUTO AINDA NÃO ESTÁ NO CARRINHO
        // ====================================================

        carrinho.push({

            // IMPORTANTE:
            // Guardamos o ID como produto_id porque
            // é esse nome que a API espera.
            produto_id: produto.id,

            // Guardamos o nome para mostrar no carrinho.
            nome: produto.nome,

            // Guardamos o preço como número.
            preco: Number(produto.preco),

            // Quando adicionamos pela primeira vez,
            // a quantidade começa em 1.
            quantidade: 1
        });
    }

    // Atualiza o carrinho na tela.
    mostrarCarrinho();
}


// ============================================================
// MOSTRAR CARRINHO
// ============================================================

function mostrarCarrinho() {

    // Pega o elemento HTML do carrinho.
    const elementoCarrinho =
        document.getElementById("carrinho");

    // Se o carrinho estiver vazio,
    // mostramos uma mensagem.
    if (carrinho.length === 0) {

        elementoCarrinho.innerHTML = `
            <p class="empty-cart">
                Nenhum produto adicionado.
            </p>
        `;

        // Mesmo vazio, atualizamos o resumo.
        atualizarResumo();

        return;
    }

    // Cria o HTML de todos os itens do carrinho.
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

                    <button
                        onclick="diminuirQuantidade(${item.produto_id})"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantidade}
                    </span>

                    <button
                        onclick="aumentarQuantidade(${item.produto_id})"
                    >
                        +
                    </button>

                </div>

                <button
                    onclick="removerDoCarrinho(${item.produto_id})"
                >
                    Remover
                </button>

            </div>

        </div>

    `
    ).join("");

    // Atualiza quantidade, subtotal e total.
    atualizarResumo();
}


// ============================================================
// AUMENTAR QUANTIDADE
// ============================================================

function aumentarQuantidade(produtoId) {

    // Procura o item dentro do carrinho.
    const item = carrinho.find(
        item => item.produto_id === produtoId
    );

    // Se não encontrou, não faz nada.
    if (!item) {
        return;
    }

    // Procura o produto original para verificar o estoque.
    const produto = produtos.find(
        produto => produto.id === produtoId
    );

    if (!produto) {
        return;
    }

    // Não permite vender mais do que existe no estoque.
    if (item.quantidade >= produto.estoque) {

        alert(
            "Quantidade maior que o estoque disponível."
        );

        return;
    }

    // Aumenta a quantidade.
    item.quantidade++;

    // Atualiza o carrinho.
    mostrarCarrinho();
}


// ============================================================
// DIMINUIR QUANTIDADE
// ============================================================

function diminuirQuantidade(produtoId) {

    // Procura o item no carrinho.
    const item = carrinho.find(
        item => item.produto_id === produtoId
    );

    if (!item) {
        return;
    }

    // Se a quantidade for 1,
    // ao diminuir devemos remover o produto.
    if (item.quantidade === 1) {

        removerDoCarrinho(produtoId);

        return;
    }

    // Caso tenha mais de 1 unidade,
    // apenas diminui a quantidade.
    item.quantidade--;

    // Atualiza a tela.
    mostrarCarrinho();
}


// ============================================================
// REMOVER PRODUTO DO CARRINHO
// ============================================================

function removerDoCarrinho(produtoId) {

    // Cria um novo carrinho contendo
    // somente os produtos diferentes do ID informado.
    carrinho = carrinho.filter(
        item => item.produto_id !== produtoId
    );

    // Atualiza a tela.
    mostrarCarrinho();
}


// ============================================================
// ATUALIZAR RESUMO DA VENDA
// ============================================================

function atualizarResumo() {

    // Soma a quantidade de todos os produtos.
    const quantidade = carrinho.reduce(
        (total, item) =>
            total + item.quantidade,
        0
    );

    // Calcula o subtotal da venda.
    const subtotal = carrinho.reduce(
        (total, item) =>
            total +
            (item.preco * item.quantidade),
        0
    );

    // Define se devemos escrever "item" ou "itens".
    const textoItens =
        quantidade === 1 ? "item" : "itens";

    // Atualiza a quantidade exibida na tela.
    document.getElementById(
        "quantidade-itens"
    ).textContent =
        `${quantidade} ${textoItens}`;

    // Atualiza o subtotal.
    document.getElementById(
        "subtotal"
    ).textContent =
        formatarMoeda(subtotal);

    // Atualiza o total.
    document.getElementById(
        "total"
    ).textContent =
        formatarMoeda(subtotal);
}


// ============================================================
// FORMATAR VALORES EM REAL
// ============================================================

function formatarMoeda(valor) {

    // Converte um número para o formato brasileiro.
    // Exemplo:
    // 10.5 -> R$ 10,50
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

    // ========================================================
    // 1. VERIFICAR SE O CARRINHO ESTÁ VAZIO
    // ========================================================

    if (carrinho.length === 0) {

        alert(
            "O carrinho está vazio."
        );

        return;
    }


    // ========================================================
    // 2. PEGAR A FORMA DE PAGAMENTO
    // ========================================================

    const formaPagamento =
        document.getElementById(
            "forma-pagamento"
        ).value;


    // ========================================================
    // 3. MONTAR O OBJETO DA VENDA
    // ========================================================

    const venda = {

        // Aqui transformamos o nosso carrinho
        // no formato que o backend espera.
        itens: carrinho.map(item => ({

            // IMPORTANTE:
            // O carrinho possui "produto_id".
            // Antes estávamos usando "item.id",
            // mas essa propriedade não existe.
            produto_id: item.produto_id,

            quantidade: item.quantidade
        })),

        // Forma de pagamento escolhida.
        forma_pagamento: formaPagamento
    };


    // Mostra no console exatamente o que será enviado.
    // Isso ajuda bastante durante o desenvolvimento.
    console.log(
        "Venda que será enviada:",
        venda
    );


    // ========================================================
    // 4. ENVIAR A VENDA PARA A API
    // ========================================================

    try {

        // Faz uma requisição POST para o endpoint de vendas.
        const resposta = await fetch(
            `${API_URL}/vendas/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                // Converte o objeto JavaScript
                // para JSON antes de enviar.
                body: JSON.stringify(venda)
            }
        );


        // ====================================================
        // 5. VERIFICAR SE A API RETORNOU ERRO
        // ====================================================

        if (!resposta.ok) {

            // Tenta pegar os detalhes do erro
            // enviados pelo FastAPI.
            const erro = await resposta.json();

            console.error(
                "Erro retornado pela API:",
                erro
            );

            alert(
                erro.detail ||
                "Erro ao finalizar a venda."
            );

            return;
        }


        // ====================================================
        // 6. PEGAR A RESPOSTA DA API
        // ====================================================

        const resultado =
            await resposta.json();


        // ====================================================
        // 7. MOSTRAR CONFIRMAÇÃO
        // ====================================================

        alert(
            `Venda #${resultado.id} realizada com sucesso!\n` +
            `Total: ${formatarMoeda(resultado.total)}`
        );


        // ====================================================
        // 8. LIMPAR O CARRINHO
        // ====================================================

        carrinho = [];


        // Atualiza o carrinho na tela.
        mostrarCarrinho();


        // ====================================================
        // 9. RECARREGAR OS PRODUTOS
        // ====================================================

        // Isso faz o estoque mostrado na tela
        // ser atualizado depois da venda.
        carregarProdutos();


    } catch (erro) {

        // ====================================================
        // ERRO DE CONEXÃO COM A API
        // ====================================================

        console.error(
            "Erro ao finalizar venda:",
            erro
        );

        alert(
            "Não foi possível conectar com o sistema."
        );
    }
}


// ============================================================
// CONECTAR O BOTÃO "FINALIZAR VENDA"
// ============================================================

// Pegamos o botão pelo ID definido no HTML.
const botaoFinalizar =
    document.getElementById(
        "finalizar-venda"
    );

// Quando o usuário clicar no botão,
// executamos a função finalizarVenda().
botaoFinalizar.addEventListener(
    "click",
    finalizarVenda
);


// ============================================================
// INICIALIZAÇÃO DO SISTEMA
// ============================================================

// Quando a página carregar,
// buscamos os produtos na API.
carregarProdutos();

// Também iniciamos o carrinho vazio.
mostrarCarrinho();