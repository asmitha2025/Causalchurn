import numpy as np
import pandas as pd
from typing import Dict, Tuple

# Intervention cost configurations
INTERVENTION_COSTS = {
    "Discount": 500.0,
    "Call": 100.0,
    "Upgrade": 200.0,
    "Email": 10.0,
    "Reward": 300.0
}

def calculate_roi(cate_lift: float, monthly_charges: float, cost: float) -> Tuple[float, float]:
    """
    Computes expected revenue saved and absolute ROI % of an intervention.
    Annual revenue at risk = monthly_charges * 12
    """
    annual_revenue_at_risk = monthly_charges * 12.0
    
    # Revenue saved is CATE lift percentage times contract value
    revenue_saved = cate_lift * annual_revenue_at_risk
    
    # ROI Formula: (Revenue Saved - Cost) / Cost * 100
    net_saved = revenue_saved - cost
    roi_percent = (net_saved / cost) * 100.0
    
    return revenue_saved, roi_percent

def recommend_best_action(
    customer_id: str,
    monthly_charges: float,
    cate_dict: Dict[str, float]
) -> Dict[str, any]:
    """
    Calculates campaign ROI across all treatments and selects the single highest-ROI action.
    """
    best_action = "No Action"
    max_roi = -float('inf')
    best_lift = 0.0
    best_cost = 0.0
    best_rev_saved = 0.0
    
    roi_scores = {}
    
    for action, lift in cate_dict.items():
        cost = INTERVENTION_COSTS.get(action, 0.0)
        
        # If treatment has negative/zero lift, ROI is negative (waste of budget)
        if lift <= 0:
            rev_saved = 0.0
            roi_pct = -100.0
        else:
            rev_saved, roi_pct = calculate_roi(lift, monthly_charges, cost)
            
        roi_scores[action] = roi_pct
        
        # Select highest financial return
        if roi_pct > max_roi:
            max_roi = roi_pct
            best_action = action
            best_lift = lift
            best_cost = cost
            best_rev_saved = rev_saved
            
    # Safe checks: if no action yields a positive ROI, recommend "No Action" (or Suppression)
    if max_roi < 0:
        return {
            "customer_id": customer_id,
            "best_action": "Suppress Marketing",
            "lift": 0.0,
            "cost": 0.0,
            "revenue_saved": 0.0,
            "roi": 0.0,
            "all_rois": roi_scores
        }
        
    return {
        "customer_id": customer_id,
        "best_action": best_action,
        "lift": round(best_lift, 4),
        "cost": round(best_cost, 2),
        "revenue_saved": round(best_rev_saved, 2),
        "roi": round(max_roi, 2),
        "all_rois": {k: round(v, 2) for k, v in roi_scores.items()}
    }

if __name__ == '__main__':
    # Test for Alexandra Sterling case: C-82941, monthly charges: ₹12,400 (equivalent to value mapping)
    test_charges = 12400.0
    
    # Mock CATE uplifts per treatment
    test_cates = {
        "Discount": 0.245, # +24.5%
        "Call": 0.185,     # +18.5%
        "Upgrade": 0.159,  # +15.9%
        "Email": 0.021,    # +2.1%
        "Reward": 0.128    # +12.8%
    }
    
    recs = recommend_best_action("C-82941", test_charges, test_cates)
    print("Recommendation engine test completed successfully! Results:")
    for k, v in recs.items():
        if k != "all_rois":
            print(f"  {k.capitalize()}: {v}")
    print("\n  Calculated campaign ROIs per treatment:")
    for k, v in recs["all_rois"].items():
        print(f"    {k}: {v:+.2f}%")
