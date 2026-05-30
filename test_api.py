import urllib.request
import urllib.error
import json
import sys

API_URL = "http://127.0.0.1:7860"

def make_post_request(endpoint: str, payload: dict) -> dict:
    url = f"{API_URL}{endpoint}"
    data = json.dumps(payload).encode('utf-8')
    
    req = urllib.request.Request(
        url, 
        data=data, 
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode('utf-8')
            return json.loads(res_data)
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code} on {endpoint}: {e.read().decode('utf-8')}")
        return {}
    except urllib.error.URLError as e:
        print(f"URL Connection Error on {endpoint}: {e.reason}")
        print("Make sure your FastAPI server is running! Start it via: python api/main.py")
        return {}

def run_verification_tests():
    print("=" * 60)
    print("        CAUSALCHURN API AUTOMATED VERIFICATION TESTS")
    print("=" * 60)
    
    # 1. Test /predict endpoint
    print("\n[1/4] Testing Churn Prediction Endpoint (/predict)...")
    predict_payload = {
        "login_count_30d": 12,
        "session_duration": 150,
        "feature_usage": 3,
        "ticket_count": 4,
        "escalation_count": 2,
        "resolution_time": 36,
        "email_sentiment": 0.3,
        "ticket_sentiment": 0.4,
        "call_sentiment": 0.35,
        "nps_score": 4,
        "last_login_days": 12,
        "product_adoption_depth": 2
    }
    pred_res = make_post_request("/predict", predict_payload)
    if pred_res:
        print("  Status: SUCCESS")
        print(f"  Calibrated P(Churn): {pred_res.get('churn_probability')}")
        
    # 2. Test /recommend endpoint
    print("\n[2/4] Testing Prescriptive Action Recommendation (/recommend)...")
    rec_payload = {
        "customer_id": "1543",
        "monthly_charges": 87.5
    }
    rec_res = make_post_request("/recommend", rec_payload)
    if rec_res:
        print("  Status: SUCCESS")
        print(f"  Causal Archetype : {rec_res.get('segment').upper()}")
        print(f"  Prescribed Action: {rec_res.get('best_action')}")
        print(f"  Uplift Lift Delta: {rec_res.get('lift')}")
        print(f"  Annual Cost / ROI: INR {rec_res.get('cost')} / {rec_res.get('roi')}%")
        
    # 3. Test /explain endpoint
    print("\n[3/4] Testing Local SHAP Attribution Explorer (/explain)...")
    explain_payload = {
        "customer_id": "1543"
    }
    exp_res = make_post_request("/explain", explain_payload)
    if exp_res:
        print("  Status: SUCCESS")
        print("  Risk Attributions:")
        for feat, val in exp_res.get("local_risk_attributions", {}).items():
            sign = "+" if val > 0 else ""
            print(f"    {feat}: {sign}{val:.4f}")
            
    # 4. Test /roi causal counterfactual simulator
    print("\n[4/4] Testing Causal Counterfactual Simulator (/roi)...")
    sim_payload = {
        "customer_id": "1543",
        "proposed_action": "Call",
        "intensity": 80.0
    }
    sim_res = make_post_request("/roi", sim_payload)
    if sim_res:
        results = sim_res.get("simulation_results", {})
        print("  Status: SUCCESS")
        print(f"  Proposed Intervention: {results.get('proposed_action')} ({results.get('intensity')}% Intensity)")
        print(f"  Baseline Retention   : {results.get('baseline_retention')}%")
        print(f"  Simulated Retention  : {results.get('simulated_retention')}%")
        print(f"  Projection Lift Delta: {results.get('projection_delta'):+.2f}%")
        print(f"  6-Month Horizon Base : {results.get('baseline_horizon')}")
        print(f"  6-Month Horizon Sim  : {results.get('simulated_horizon')}")
        
    print("\n" + "=" * 60)
    print("                VERIFICATION COMPLETE")
    print("=" * 60)

if __name__ == '__main__':
    run_verification_tests()
