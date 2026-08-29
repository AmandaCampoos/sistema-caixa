from pydantic import BaseModel, Field


class ProdutoCreate(BaseModel):
    nome: str = Field(min_length=1, max_length=150)
    preco: float = Field(gt=0)
    estoque: int = Field(ge=0)
    tamanho: str | None = None
    cor: str | None = None


class ProdutoResponse(BaseModel):
    id: int
    nome: str
    preco: float
    estoque: int
    tamanho: str | None
    cor: str | None
    ativo: bool

    model_config = {
        "from_attributes": True
    }