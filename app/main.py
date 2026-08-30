from fastapi import FastAPI
from sqlalchemy import text

from app.core.database import Base, engine
from app.models.produto import Produto
from app.models.venda import Venda, ItemVenda

from app.api.produtos import router as produtos_router
from app.api.venda import router as vendas_router


app = FastAPI(
    title="Sistema de Caixa",
    description="Sistema de gerenciamento de vendas e estoque",
    version="0.1.0"
)


Base.metadata.create_all(bind=engine)

app.include_router(produtos_router)
app.include_router(vendas_router)


@app.get("/")
def inicio():
    return {
        "mensagem": "Sistema de Caixa funcionando!"
    }


@app.get("/health")
def health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        return {
            "status": "ok",
            "database": "connected"
        }

    except Exception as e:
        return {
            "status": "error",
            "database": "disconnected",
            "detail": str(e)
        }
    
   