from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any

# --- REQUEST SCHEMAS ---

class CustomerFeaturesInput(BaseModel):
    login_count_30d: float = Field(..., description="Number of logins in the last 30 days")
    session_duration: float = Field(..., description="Total login session duration in minutes")
    feature_usage: float = Field(..., description="Count of distinct features accessed")
    ticket_count: float = Field(..., description="Number of open customer support tickets")
    escalation_count: float = Field(..., description="Number of manager level ticket escalations")
    resolution_time: float = Field(..., description="Average ticket resolution time in hours")
    email_sentiment: float = Field(..., description="Customer email sentiment score [0-1]")
    ticket_sentiment: float = Field(..., description="Customer support ticket sentiment [0-1]")
    call_sentiment: float = Field(..., description="Customer phone call sentiment [0-1]")
    nps_score: float = Field(..., description="Net Promoter Score [0-10]")
    last_login_days: float = Field(..., description="Days since last user activity")
    product_adoption_depth: float = Field(..., description="Count of active product licenses used")

class RecommendationRequest(BaseModel):
    customer_id: str = Field(..., description="Unique customer ID string")
    monthly_charges: float = Field(..., description="Customer monthly bill in rupees")

class ExplainRequest(BaseModel):
    customer_id: str = Field(..., description="Unique customer ID string")

class SimulationRequest(BaseModel):
    customer_id: str = Field(..., description="Unique customer ID string")
    proposed_action: str = Field(..., description="Discount, Call, Upgrade, Email, or Reward")
    intensity: float = Field(..., description="Outreach action intensity [10-100]")

# --- RESPONSE SCHEMAS ---

class ChurnResponse(BaseModel):
    customer_id: str
    churn_probability: float
    status: str = "success"

class RecommendationResponse(BaseModel):
    customer_id: str
    churn_probability: float
    segment: str
    best_action: str
    lift: float
    cost: float
    revenue_saved: float
    roi: float
    explanation: Dict[str, str]

class SHAPResponse(BaseModel):
    customer_id: str
    local_risk_attributions: Dict[str, float]

class ROIResponse(BaseModel):
    customer_id: str
    simulation_results: Dict[str, Any] = Field(..., description="Detailed SCM simulation outputs")
