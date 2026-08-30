from sqlalchemy.orm import Session

from app.models.produto import Produto
from app.models.venda import Venda, ItemVenda
from app.schemas.venda import VendaCreate


def criar_venda(db: Session, dados: VendaCreate) -> Venda:
    """
    Cria uma venda completa.

    Esta função concentra as regras de negócio da venda:
    - verifica se os produtos existem;
    - verifica se há estoque suficiente;
    - calcula os subtotais;
    - calcula o total da venda;
    - baixa o estoque;
    - cria a venda;
    - cria os itens da venda.

    A API apenas recebe os dados e chama esta função.
    """

    total = 0
    itens_venda = []

    # Percorremos todos os produtos enviados na venda.
    for item in dados.itens:

        # Procuramos o produto pelo ID e verificamos
        # se ele ainda está ativo no sistema.
        produto = db.query(Produto).filter(
            Produto.id == item.produto_id,
            Produto.ativo == True
        ).first()

        # Se o produto não existir, interrompemos a venda.
        if not produto:
            raise ValueError(
                f"Produto {item.produto_id} não encontrado"
            )

        # Antes de vender, precisamos garantir que
        # existe estoque suficiente.
        if produto.estoque < item.quantidade:
            raise ValueError(
                f"Estoque insuficiente para o produto "
                f"{produto.nome}. Disponível: {produto.estoque}"
            )

        # O preço utilizado na venda vem do produto cadastrado.
        # Isso é importante porque queremos registrar
        # o preço que estava sendo praticado naquele momento.
        subtotal = produto.preco * item.quantidade

        # Somamos o subtotal ao total geral da venda.
        total += subtotal

        # Baixamos o estoque.
        produto.estoque -= item.quantidade

        # Criamos o item que será associado à venda.
        novo_item = ItemVenda(
            produto_id=produto.id,
            quantidade=item.quantidade,
            preco_unitario=produto.preco,
            subtotal=subtotal
        )

        itens_venda.append(novo_item)

    # Criamos o registro principal da venda.
    nova_venda = Venda(
        total=total,
        desconto=0,
        forma_pagamento=dados.forma_pagamento,
        status="finalizada"
    )

    # Adicionamos a venda à sessão do banco.
    db.add(nova_venda)

    # O flush envia a criação da venda ao banco
    # sem finalizar a transação.
    #
    # Precisamos disso para obter o ID da venda
    # antes de criar os itens.
    db.flush()

    # Agora podemos associar cada item à venda criada.
    for item in itens_venda:
        item.venda_id = nova_venda.id
        db.add(item)

    # Confirmamos todas as alterações:
    # venda + itens + alteração de estoque.
    db.commit()

    # Atualizamos o objeto com os dados realmente
    # gravados no banco.
    db.refresh(nova_venda)

    return nova_venda