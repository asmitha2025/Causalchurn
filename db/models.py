from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
import datetime
import os

# Default to SQLite for easy local runs; supports PostgreSQL via env variable
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./causalchurn.db")

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Customer(Base):
    __tablename__ = "customers"
    
    customer_id = Column(String(50), primary_key=True, index=True)
    tenure = Column(Float, nullable=False)
    monthly_charges = Column(Float, nullable=False)
    features_json = Column(Text, nullable=True) # Serialized full feature maps
    
    # Composite behavioral scores
    usage_score = Column(Float, default=0.0)
    support_score = Column(Float, default=0.0)
    sentiment_score = Column(Float, default=0.0)
    engagement_score = Column(Float, default=0.0)
    
    predictions = relationship("Prediction", back_populates="customer")
    recommendations = relationship("Recommendation", back_populates="customer")

class Intervention(Base):
    __tablename__ = "interventions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(String(50), index=True)
    action_type = Column(String(50), nullable=False) # Discount, Call, Upgrade, Email, Reward
    treatment_date = Column(DateTime, default=datetime.datetime.utcnow)
    outcome = Column(Integer, nullable=True) # 1 if retained, 0 if churned

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(String(50), ForeignKey("customers.customer_id"), index=True)
    churn_prob = Column(Float, nullable=False)
    score_date = Column(DateTime, default=datetime.datetime.utcnow)
    model_version = Column(String(20), default="v1.0")
    
    customer = relationship("Customer", back_populates="predictions")

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    customer_id = Column(String(50), ForeignKey("customers.customer_id"), primary_key=True, index=True)
    best_action = Column(String(50), nullable=False)
    lift = Column(Float, nullable=False)
    cost = Column(Float, nullable=False)
    revenue_saved = Column(Float, nullable=False)
    roi = Column(Float, nullable=False)
    segment = Column(String(30), nullable=False) # persuadable, sure_thing, lost_cause, dnd
    
    customer = relationship("Customer", back_populates="recommendations")

class RevenueMetric(Base):
    __tablename__ = "revenue_metrics"
    
    date = Column(Date, primary_key=True, index=True)
    at_risk_revenue = Column(Float, default=0.0)
    saved_revenue = Column(Float, default=0.0)
    total_interventions = Column(Integer, default=0)

# Helper function to create all tables
def init_db():
    Base.metadata.create_all(bind=engine)

if __name__ == '__main__':
    print("Initializing Database tables...")
    init_db()
    print("Database tables initialized successfully!")
