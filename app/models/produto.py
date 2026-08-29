from sqlalchemy import Boolean, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Produto(Base):
    __tablename__ = "produtos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String(150), nullable=False)
    preco: Mapped[float] = mapped_column(Float, nullable=False)
    estoque: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    tamanho: Mapped[str | None] = mapped_column(String(20), nullable=True)
    cor: Mapped[str | None] = mapped_column(String(50), nullable=True)
    ativo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)