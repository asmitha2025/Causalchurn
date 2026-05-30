import streamlit as st
import pandas as pd
import numpy as np
import urllib.request
import json
import plotly.graph_objects as go
import plotly.express as px

# Set up page configurations
st.set_page_config(
    page_title="CausalChurn AI | Prescriptive Retention Intelligence",
    page_icon="🧠",
    layout="wide"
)

API_URL = "http://127.0.0.1:8001"

# --- HELPER FUNCTION FOR API CALLS ---
def query_api(endpoint: str, payload: dict) -> dict:
    url = f"{API_URL}{endpoint}"
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        url, data=data, headers={'Content-Type': 'application/json'}, method='POST'
    )
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        return {}

# --- CORE MOCK CUSTOMERS LIST ---
# In case the API is offline, fallback gracefully
MOCK_CUSTOMERS = {
    "C-82941": {"name": "Alexandra Sterling", "monthly_charges": 12400.0, "risk": 84.2, "segment": "Persuadable"},
    "C-90123": {"name": "Marcus Vance", "monthly_charges": 4200.0, "risk": 32.1, "segment": "Sure Thing"},
    "C-77412": {"name": "Elena Rostova", "monthly_charges": 18500.0, "risk": 92.5, "segment": "Lost Cause"},
    "C-12984": {"name": "Nolan Briggs", "monthly_charges": 22100.0, "risk": 68.4, "segment": "Do Not Disturb"}
}

# --- STYLING HEADER ---
st.markdown("""
<style>
    .main-title { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 38px; color: #4f46e5; margin-bottom: 2px; }
    .subtitle { font-size: 16px; color: #64748b; margin-bottom: 24px; }
    .kpi-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; text-align: center; }
    .kpi-val { font-size: 24px; font-weight: 700; color: #1e293b; }
    .kpi-lbl { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; }
</style>
""", unsafe_allow_allowed_tags=True, unsafe_allow_html=True)

# --- SIDEBAR NAVIGATION ---
st.sidebar.image("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120", width=80)
st.sidebar.title("CausalChurn AI")
st.sidebar.caption("PRESCRIPTIVE retention INTELLIGENCE")

page = st.sidebar.radio(
    "NAVIGATION",
    ["Dashboard", "Explainability Center", "Uplift Analytics", "Counterfactual Lab"]
)

# Active Customer selector across pages
active_cust_id = st.sidebar.selectbox(
    "Active Account Target",
    list(MOCK_CUSTOMERS.keys())
)
active_cust = MOCK_CUSTOMERS[active_cust_id]

# --- 1. DASHBOARD PAGE ---
if page == "Dashboard":
    st.markdown('<div class="main-title">Predict Churn. Prescribe Actions. Maximize Revenue.</div>', unsafe_allow_html=True)
    st.markdown('<div class="subtitle">Ensembling machine learning and causal meta-learners to isolate campaign ROI.</div>', unsafe_allow_html=True)
    
    # KPI Grid
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown('<div class="kpi-card"><div class="kpi-val">18,430</div><div class="kpi-lbl">At-Risk Accounts</div></div>', unsafe_allow_html=True)
    with col2:
        st.markdown('<div class="kpi-card"><div class="kpi-val">INR 4.2 Cr</div><div class="kpi-lbl">Revenue at Risk</div></div>', unsafe_allow_html=True)
    with col3:
        st.markdown('<div class="kpi-card"><div class="kpi-val">INR 3.1 Cr</div><div class="kpi-lbl">Revenue Protected</div></div>', unsafe_allow_html=True)
    with col4:
        st.markdown('<div class="kpi-card"><div class="kpi-val">8,941</div><div class="kpi-lbl">Persuadables</div></div>', unsafe_allow_html=True)
        
    st.write("")
    
    # Interactive recommendation grid
    st.subheader("Customer Recommendation Matrix")
    
    table_rows = []
    for cid, info in MOCK_CUSTOMERS.items():
        # Query recommendation API
        res = query_api("/recommend", {"customer_id": cid, "monthly_charges": info["monthly_charges"]})
        if res:
            table_rows.append({
                "Customer ID": cid,
                "Name": info["name"],
                "Archetype": res.get("segment").upper(),
                "Calibrated Risk": f"{res.get('churn_probability')*100:.1f}%",
                "Best Action": res.get("best_action"),
                "Uplift Lift": f"+{res.get('lift')*100:.1f}%",
                "Expected ROI": f"{res.get('roi'):+,.1f}%"
            })
        else:
            table_rows.append({
                "Customer ID": cid,
                "Name": info["name"],
                "Archetype": info["segment"].upper(),
                "Calibrated Risk": f"{info['risk']}%",
                "Best Action": "Email Campaign",
                "Uplift Lift": "+2.1%",
                "Expected ROI": "+31,148.0%"
            })
            
    df_recs = pd.DataFrame(table_rows)
    st.dataframe(df_recs, use_container_width=True)

# --- 2. EXPLAINABILITY CENTER PAGE ---
elif page == "Explainability Center":
    st.markdown(f'<div class="main-title">Explainability Center &bull; {active_cust_id}</div>', unsafe_allow_html=True)
    st.markdown('<div class="subtitle">SHAP local feature risk contributions and core telemetry explanations.</div>', unsafe_allow_html=True)
    
    # Query Explain API
    explain_res = query_api("/explain", {"customer_id": active_cust_id})
    attributions = explain_res.get("local_risk_attributions", {
        "usage_score": -0.15, "support_score": 0.32, "sentiment_score": 0.28, "engagement_score": -0.08
    })
    
    col1, col2 = st.columns([1.2, 0.8])
    
    with col1:
        st.subheader("Risk Explanation narrative")
        st.info(
            f"Account **{active_cust['name']} ({active_cust_id})** is categorized in the **{active_cust['segment'].upper()}** segment. "
            f"The primary risk multiplier is **Support Ticket SLA latency**, adding incremental weight. "
            f"Applying the recommended treatment stabilizes retention index by ensembling campaign cost values."
        )
        
        # Plot SHAP Waterfall Chart
        st.write("")
        st.subheader("SHAP Feature Risk Waterfall")
        
        y_feats = list(attributions.keys())
        x_vals = list(attributions.values())
        
        fig = go.Figure(go.Waterfall(
            name="SHAP Waterfall",
            orientation="h",
            y=y_feats,
            x=x_vals,
            connector={"line": {"color": "rgb(63, 63, 63)", "width": 1.5, "dash": "dash"}},
            decreasing={"marker": {"color": "#10b981"}},
            increasing={"marker": {"color": "#ef4444"}},
            totals={"marker": {"color": "#4f46e5"}}
        ))
        fig.update_layout(height=300, margin=dict(l=20, r=20, t=20, b=20))
        st.plotly_chart(fig, use_container_width=True)

    with col2:
        st.subheader("Local Risk Weights")
        for feat, val in attributions.items():
            sign = "+" if val > 0 else ""
            color = "red" if val > 0 else "green"
            st.metric(label=feat.replace("_", " ").upper(), value=f"{sign}{val:.4f}", delta=f"{val:+.4f}", delta_color="inverse")

# --- 3. UPLIFT ANALYTICS PAGE ---
elif page == "Uplift Analytics":
    st.markdown('<div class="main-title">Uplift Performance Analytics</div>', unsafe_allow_html=True)
    st.markdown('<div class="subtitle">Efficacy tracking of causal ensembled estimators against control baselines.</div>', unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("Qini Performance Curve")
        # Generate dummy Qini curve plot
        steps = np.arange(0, 101, 10)
        random_line = steps * 0.5
        model_line = np.array([0, 10, 28, 48, 62, 70, 75, 78, 80, 81, 82])
        
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=steps, y=model_line, name="CausalML Model v2", line=dict(color="#4f46e5", width=3)))
        fig.add_trace(go.Scatter(x=steps, y=random_line, name="Random Baseline", line=dict(color="#94a3b8", dash="dash")))
        fig.update_layout(xaxis_title="% Population Targeted", yaxis_title="Cumulative Uplift Delta", height=300)
        st.plotly_chart(fig, use_container_width=True)
        
    with col2:
        st.subheader("ITE Distribution (Treatment density)")
        # Density distribution
        x_ite = np.linspace(-0.2, 0.6, 100)
        y_ite = np.exp(-((x_ite - 0.15) ** 2) / (2 * 0.15 ** 2))
        
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=x_ite, y=y_ite, fill='tozeroy', fillcolor='rgba(16, 185, 129, 0.1)', line=dict(color="#10b981", width=2)))
        fig.update_layout(xaxis_title="Individual Treatment Effect (CATE)", yaxis_title="Population Density", height=300)
        st.plotly_chart(fig, use_container_width=True)

# --- 4. COUNTERFACTUAL LAB PAGE ---
elif page == "Counterfactual Lab":
    st.markdown('<div class="main-title">Causal Counterfactual Lab</div>', unsafe_allow_html=True)
    st.markdown('<div class="subtitle">Simulate prescriptive do-interventions under varying intensities in real-time.</div>', unsafe_allow_html=True)
    
    col1, col2 = st.columns([1, 1.8])
    
    with col1:
        st.subheader("Simulation Parameters")
        treatment = st.selectbox(
            "Proposed Intervention",
            ["Discount", "Call", "Upgrade", "Email", "Reward"]
        )
        intensity = st.slider("Outreach Intensity", min_value=10, max_value=100, value=50, step=5)
        
        st.write("")
        st.subheader("Active Context Profile")
        st.success(f"Name: **{active_cust['name']}**\n\nCharges: **{active_cust['monthly_charges']} INR/mo**\n\nBaseline Churn Risk: **{active_cust['risk']}%**")
        
        run_sim = st.button("Run Counterfactual Simulation", type="primary")

    with col2:
        st.subheader("Causal Simulation Output")
        
        # Trigger query to /roi
        sim_res = query_api("/roi", {
            "customer_id": active_cust_id,
            "proposed_action": treatment,
            "intensity": float(intensity)
        })
        
        if sim_res:
            results = sim_res.get("simulation_results", {})
            delta = results.get("projection_delta", 14.0)
            base_ret = results.get("baseline_retention", 40.0)
            sim_ret = results.get("simulated_retention", 54.0)
            
            st.metric(
                label="PROJECTION RETENTION DELTA", 
                value=f"+{delta:.2f}%" if delta > 0 else f"{delta:.2f}%", 
                delta=f"{delta:+.2f}%"
            )
            
            # Show progress rings mock
            c1, c2 = st.columns(2)
            with c1:
                st.metric("Organic Retention", f"{base_ret:.1f}%")
            with c2:
                st.metric("Simulated Retention", f"{sim_ret:.1f}%")
                
            st.write("")
            st.subheader("6-Month Projected Cohort Decay Horizon")
            
            months = ["M1", "M2", "M3", "M4", "M5", "M6"]
            y_base = results.get("baseline_horizon", [35.2, 31.0, 27.3, 24.0, 21.1, 18.6])
            y_sim = results.get("simulated_horizon", [51.8, 49.8, 47.8, 45.9, 44.0, 42.3])
            
            fig = go.Figure()
            fig.add_trace(go.Scatter(x=months, y=y_base, name="Organic Baseline", line=dict(color="#ef4444", width=2, dash="dash")))
            fig.add_trace(go.Scatter(x=months, y=y_sim, name="Simulated Outreach", line=dict(color="#10b981", width=3.5)))
            fig.update_layout(yaxis_title="% Active Retention", height=280, margin=dict(t=10, b=10))
            st.plotly_chart(fig, use_container_width=True)
            
        else:
            st.warning("Please query the local FastAPI server. Start it via `python api/main.py` to activate live calculations!")
