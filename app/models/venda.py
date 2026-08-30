from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Venda(Base):
    __tablename__ = "vendas"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    data: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    total: Mapped[float] = mapped_column(
        Float,
        default=0,
        nullable=False
    )

    desconto: Mapped[float] = mapped_column(
        Float,
        default=0,
        nullable=False
    )

    forma_pagamento: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="finalizada",
        nullable=False
    )

    itens: Mapped[list["ItemVenda"]] = relationship(
        back_populates="venda"
    )


class ItemVenda(Base):
    __tablename__ = "itens_venda"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    venda_id: Mapped[int] = mapped_column(
        ForeignKey("vendas.id"),
        nullable=False
    )

    produto_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    quantidade: Mapped[int] = mapped_column(
        Integer,
        nullable=False
    )

    preco_unitario: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    subtotal: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    venda: Mapped["Venda"] = relationship(
        back_populates="itens"
    )