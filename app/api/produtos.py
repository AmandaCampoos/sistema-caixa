from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.produto import Produto
from app.schemas.produto import (
    ProdutoCreate,
    ProdutoResponse,
    ProdutoUpdate,
)


router = APIRouter(
    prefix="/produtos",
    tags=["Produtos"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=ProdutoResponse)
def criar_produto(
    produto: ProdutoCreate,
    db: Session = Depends(get_db)
):
    novo_produto = Produto(
        nome=produto.nome,
        preco=produto.preco,
        estoque=produto.estoque,
        tamanho=produto.tamanho,
        cor=produto.cor
    )

    db.add(novo_produto)
    db.commit()
    db.refresh(novo_produto)

    return novo_produto


@router.get("/", response_model=list[ProdutoResponse])
def listar_produtos(
    db: Session = Depends(get_db)
):
    return db.query(Produto).all()


@router.get("/{produto_id}", response_model=ProdutoResponse)
def buscar_produto(
    produto_id: int,
    db: Session = Depends(get_db)
):
    produto = db.query(Produto).filter(
        Produto.id == produto_id
    ).first()

    if not produto:
        raise HTTPException(
            status_code=404,
            detail="Produto não encontrado"
        )

    return produto


@router.put("/{produto_id}", response_model=ProdutoResponse)
def atualizar_produto(
    produto_id: int,
    dados: ProdutoUpdate,
    db: Session = Depends(get_db)
):
    produto = db.query(Produto).filter(
        Produto.id == produto_id
    ).first()

    if not produto:
        raise HTTPException(
            status_code=404,
            detail="Produto não encontrado"
        )

    dados_atualizacao = dados.model_dump(
        exclude_unset=True
    )

    for campo, valor in dados_atualizacao.items():
        setattr(produto, campo, valor)

    db.commit()
    db.refresh(produto)

    return produto