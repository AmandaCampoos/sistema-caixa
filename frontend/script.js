// ========================================
// CONFIGURAÇÃO DA API
// ========================================

// Endereço onde nosso FastAPI está rodando.
const API_URL = "http://127.0.0.1:8000";


// ========================================
// ELEMENTOS DA TELA
// ========================================

const listaProdutos = document.getElementById("lista-produtos");
const busca = document.getElementById("busca");


// ========================================
// CARREGAR PRODUTOS
// ========================================

async function carregarProdutos() {

    try {

        // Fazemos uma requisição GET para nossa API.
        const resposta = await fetch(`${API_URL}/produtos/`);

        // Transformamos a resposta em JSON.
        const produtos = await resposta.json();

        // Limpamos a mensagem "Carregando..."
        listaProdutos.innerHTML = "";

        // Criamos um card para cada produto.
        produtos.forEach(produto => {

            const card = document.createElement("div");

            card.classList.add("product-card");

            card.innerHTML = `
                <div class="product-name">
                    ${produto.nome}
                </div>

                <div class="product-price">
                    R$ ${Number(produto.preco).toFixed(2)}
                </div>

                <div class="product-stock">
                    Estoque: ${produto.estoque}
                </div>
            `;

            // Quando clicarmos no produto,
            // futuramente ele será adicionado ao carrinho.
            card.addEventListener("click", () => {

                console.log("Produto selecionado:", produto);

            });

            listaProdutos.appendChild(card);
        });

    } catch (erro) {

        console.error("Erro ao carregar produtos:", erro);

        listaProdutos.innerHTML = `
            <p>
                Não foi possível carregar os produtos.
            </p>
        `;
    }
}


// ========================================
// INICIALIZAÇÃO
// ========================================

// Assim que a página carregar,
// buscamos os produtos no backend.
carregarProdutos();