import uuid
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
from sqlalchemy import (
    String, Text, Boolean, Integer, Float, DateTime, ForeignKey, Index
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.types import TypeDecorator, CHAR, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base


# Universal UUID and JSON types supporting PostgreSQL and SQLite (for testing)
class GUID(TypeDecorator):
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        elif dialect.name == 'postgresql':
            return str(value)
        else:
            if not isinstance(value, uuid.UUID):
                return str(uuid.UUID(str(value)))
            return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        else:
            if not isinstance(value, uuid.UUID):
                return uuid.UUID(str(value))
            return value


class UniversalJSON(TypeDecorator):
    impl = JSON
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(JSONB())
        else:
            return dialect.type_descriptor(JSON())


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    industry: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    currency: Mapped[str] = mapped_column(String(10), default="INR", nullable=False)
    timezone: Mapped[str] = mapped_column(String(50), default="Asia/Kolkata", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    users: Mapped[List["User"]] = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    products: Mapped[List["Product"]] = relationship("Product", back_populates="organization", cascade="all, delete-orphan")
    crises: Mapped[List["Crisis"]] = relationship("Crisis", back_populates="organization", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="manager", nullable=False)  # admin, manager, analyst, viewer
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    organization: Mapped["Organization"] = relationship("Organization", back_populates="users")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    sku: Mapped[str] = mapped_column(String(100), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    cost: Mapped[float] = mapped_column(Float, nullable=False)
    expiry_days: Mapped[int] = mapped_column(Integer, default=90, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    organization: Mapped["Organization"] = relationship("Organization", back_populates="products")
    inventory_snapshots: Mapped[List["InventorySnapshot"]] = relationship("InventorySnapshot", back_populates="product", cascade="all, delete-orphan")
    sales_records: Mapped[List["SalesRecord"]] = relationship("SalesRecord", back_populates="product", cascade="all, delete-orphan")
    crises: Mapped[List["Crisis"]] = relationship("Crisis", back_populates="product")


class InventorySnapshot(Base):
    __tablename__ = "inventory_snapshots"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    region: Mapped[str] = mapped_column(String(100), nullable=False)
    units_available: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    units_committed: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    units_in_transit: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    snapshot_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)

    product: Mapped["Product"] = relationship("Product", back_populates="inventory_snapshots")


class SalesRecord(Base):
    __tablename__ = "sales_records"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    region: Mapped[str] = mapped_column(String(100), nullable=False)
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, index=True)
    units_sold: Mapped[int] = mapped_column(Integer, nullable=False)
    revenue: Mapped[float] = mapped_column(Float, nullable=False)
    average_price: Mapped[float] = mapped_column(Float, nullable=False)

    product: Mapped["Product"] = relationship("Product", back_populates="sales_records")


class Crisis(Base):
    __tablename__ = "crises"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    crisis_type: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    product_id: Mapped[Optional[uuid.UUID]] = mapped_column(GUID, ForeignKey("products.id", ondelete="SET NULL"), nullable=True, index=True)
    severity: Mapped[str] = mapped_column(String(50), default="high", nullable=False)  # low, medium, high, critical
    status: Mapped[str] = mapped_column(String(50), default="analyzing", nullable=False)  # analyzing, recommendation_ready, decision_made, resolved, archived
    input_data: Mapped[Dict[str, Any]] = mapped_column(UniversalJSON, default=dict, nullable=False)
    created_by: Mapped[Optional[uuid.UUID]] = mapped_column(GUID, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    organization: Mapped["Organization"] = relationship("Organization", back_populates="crises")
    product: Mapped[Optional["Product"]] = relationship("Product", back_populates="crises")
    decisions: Mapped[List["Decision"]] = relationship("Decision", back_populates="crisis", cascade="all, delete-orphan")
    simulations: Mapped[List["Simulation"]] = relationship("Simulation", back_populates="crisis", cascade="all, delete-orphan")
    recommendations: Mapped[List["Recommendation"]] = relationship("Recommendation", back_populates="crisis", cascade="all, delete-orphan")
    reports: Mapped[List["Report"]] = relationship("Report", back_populates="crisis", cascade="all, delete-orphan")


class Strategy(Base):
    __tablename__ = "strategies"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    type: Mapped[str] = mapped_column(String(100), nullable=False)  # discount, bundle, promotion, redistribution, channel_shift, hold, liquidation, sales_incentive, custom
    description: Mapped[str] = mapped_column(Text, nullable=False)
    parameters_schema: Mapped[Dict[str, Any]] = mapped_column(UniversalJSON, default=dict, nullable=False)


class Decision(Base):
    __tablename__ = "decisions"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    crisis_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("crises.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    strategy_type: Mapped[str] = mapped_column(String(100), nullable=False)
    parameters: Mapped[Dict[str, Any]] = mapped_column(UniversalJSON, default=dict, nullable=False)
    expected_outcome: Mapped[Dict[str, Any]] = mapped_column(UniversalJSON, default=dict, nullable=False)
    actual_outcome: Mapped[Optional[Dict[str, Any]]] = mapped_column(UniversalJSON, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="pending", nullable=False)  # pending, executed, completed, cancelled
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    executed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    crisis: Mapped["Crisis"] = relationship("Crisis", back_populates="decisions")
    outcomes: Mapped[List["Outcome"]] = relationship("Outcome", back_populates="decision", cascade="all, delete-orphan")


class Simulation(Base):
    __tablename__ = "simulations"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    crisis_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("crises.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    parameters: Mapped[Dict[str, Any]] = mapped_column(UniversalJSON, default=dict, nullable=False)
    projected_inventory_clearance: Mapped[float] = mapped_column(Float, nullable=False)
    projected_revenue: Mapped[float] = mapped_column(Float, nullable=False)
    projected_margin: Mapped[float] = mapped_column(Float, nullable=False)
    projected_time_to_clear: Mapped[int] = mapped_column(Integer, nullable=False)
    risk_score: Mapped[str] = mapped_column(String(50), default="moderate", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    crisis: Mapped["Crisis"] = relationship("Crisis", back_populates="simulations")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    crisis_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("crises.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    strategy_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    recommendation_text: Mapped[str] = mapped_column(String(255), nullable=False)
    reasoning: Mapped[str] = mapped_column(Text, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, nullable=False)
    expected_impact: Mapped[Dict[str, Any]] = mapped_column(UniversalJSON, default=dict, nullable=False)
    risks: Mapped[List[Any]] = mapped_column(UniversalJSON, default=list, nullable=False)
    historical_evidence: Mapped[List[Any]] = mapped_column(UniversalJSON, default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    crisis: Mapped["Crisis"] = relationship("Crisis", back_populates="recommendations")


class Outcome(Base):
    __tablename__ = "outcomes"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    decision_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("decisions.id", ondelete="CASCADE"), nullable=False, index=True)
    organization_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    inventory_cleared: Mapped[float] = mapped_column(Float, nullable=False)
    revenue: Mapped[float] = mapped_column(Float, nullable=False)
    margin: Mapped[float] = mapped_column(Float, nullable=False)
    customer_response: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    time_to_clear: Mapped[int] = mapped_column(Integer, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    decision: Mapped["Decision"] = relationship("Decision", back_populates="outcomes")


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    crisis_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("crises.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[Dict[str, Any]] = mapped_column(UniversalJSON, default=dict, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    crisis: Mapped["Crisis"] = relationship("Crisis", back_populates="reports")


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(GUID, primary_key=True, default=uuid.uuid4)
    organization_id: Mapped[uuid.UUID] = mapped_column(GUID, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(GUID, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(String(50), default="alert", nullable=False)  # alert, memory, simulation, strategy
    read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    related_crisis_id: Mapped[Optional[uuid.UUID]] = mapped_column(GUID, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
