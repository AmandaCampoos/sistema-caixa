from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.venda import Venda
from app.schemas.venda import VendaCreate
from app.services.venda_service import criar_venda


router = APIRouter(
    prefix="/vendas",
    tags=["Vendas"]
)


def get_db():
    """
    Cria uma sessão com o banco de dados para cada requisição.

    O 'yield' entrega a sessão para a função da API.
    O 'finally' garante que a conexão seja fechada
    depois que a requisição terminar.
    """
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/")
def criar_venda_api(
    dados: VendaCreate,
    db: Session = Depends(get_db)
):
    """
    Endpoint responsável por receber uma nova venda.

    A API não contém mais as regras de negócio.
    Ela apenas recebe os dados e chama o service.
    """

    try:
        # O service concentra toda a lógica da venda.
        venda = criar_venda(db, dados)

        return {
            "id": venda.id,
            "total": venda.total,
            "forma_pagamento": venda.forma_pagamento,
            "status": venda.status
        }

    except ValueError as erro:
        # Erros de regra de negócio, como:
        # produto inexistente ou estoque insuficiente.
        #
        # Transformamos o ValueError em uma resposta
        # HTTP compreensível para quem está consumindo a API.
        raise HTTPException(
            status_code=400,
            detail=str(erro)
        )


@router.get("/")
def listar_vendas(
    db: Session = Depends(get_db)
):
    """
    Retorna todas as vendas cadastradas.
    """

    vendas = db.query(Venda).all()

    return vendas


@router.get("/{venda_id}")
def buscar_venda(
    venda_id: int,
    db: Session = Depends(get_db)
):
    """
    Busca uma venda específica pelo ID.
    """

    venda = db.query(Venda).filter(
        Venda.id == venda_id
    ).first()

    if not venda:
        raise HTTPException(
            status_code=404,
            detail="Venda não encontrada"
        )

    return {
        "id": venda.id,
        "total": venda.total,
        "desconto": venda.desconto,
        "forma_pagamento": venda.forma_pagamento,
        "status": venda.status,

        # Aqui usamos o relacionamento que criamos
        # no modelo Venda para acessar seus itens.
        "itens": [
            {
                "produto_id": item.produto_id,
                "quantidade": item.quantidade,
                "preco_unitario": item.preco_unitario,
                "subtotal": item.subtotal
            }
            for item in venda.itens
        ]
    }