from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.produto import Produto
from app.models.venda import Venda, ItemVenda
from app.schemas.venda import VendaCreate


router = APIRouter(
    prefix="/vendas",
    tags=["Vendas"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/")
def criar_venda(
    dados: VendaCreate,
    db: Session = Depends(get_db)
):
    total = 0
    itens_venda = []

    for item in dados.itens:

        produto = db.query(Produto).filter(
            Produto.id == item.produto_id,
            Produto.ativo == True
        ).first()

        if not produto:
            raise HTTPException(
                status_code=404,
                detail=f"Produto {item.produto_id} não encontrado"
            )

        if produto.estoque < item.quantidade:
            raise HTTPException(
                status_code=400,
                detail=f"Estoque insuficiente para o produto {produto.nome}"
            )

        subtotal = produto.preco * item.quantidade
        total += subtotal

        produto.estoque -= item.quantidade

        novo_item = ItemVenda(
            produto_id=produto.id,
            quantidade=item.quantidade,
            preco_unitario=produto.preco,
            subtotal=subtotal
        )

        itens_venda.append(novo_item)

    nova_venda = Venda(
        total=total,
        desconto=0,
        forma_pagamento=dados.forma_pagamento,
        status="finalizada"
    )

    db.add(nova_venda)
    db.flush()

    for item in itens_venda:
        item.venda_id = nova_venda.id
        db.add(item)

    db.commit()
    db.refresh(nova_venda)

    return {
        "id": nova_venda.id,
        "total": nova_venda.total,
        "forma_pagamento": nova_venda.forma_pagamento,
        "status": nova_venda.status
    }