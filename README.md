# 🚀 CausalChurn AI — Prescriptive Retention Intelligence Platform

> **BSc Data Science — Final Portfolio Project**  
> *Targeting High-Growth Product-Based CRM and Fintech Platforms (Zoho, Freshworks, Salesforce, Razorpay, PhonePe)*

---

## 💡 The Core Vision & Paradigm Shift

Traditional machine learning churn models are purely **predictive**; they answer **"Who is going to leave?"** but leave business growth teams stranded with the critical follow-up question: **"What is the single best action to retain this specific customer — and what is the exact financial ROI?"**

**CausalChurn AI** bridges this prescriptive gap. By ensembling **Supervised Machine Learning** with **Causal Inference and Uplift Modelling**, the platform isolates the **Conditional Average Treatment Effect (CATE)** of different retention treatments (e.g. discounts, support calls, plan upgrades) on an individual customer level. This allows companies to target interventions with surgical precision, maximizing campaign returns and strictly avoiding outreach to negative-reacting cohorts ("Do Not Disturb").

```
Customer 1543 ──(Uplift Model)──> Direct Support Call (Lift: +18.5%, Simulated Campaign ROI: 9,900%)
```

---

## 🏢 Layered System Architecture

CausalChurn is designed with a modular, 12-layer production-ready architecture, ensuring a clean separation of concerns and micro-service testability:

```
[1. Data Ingestion: IBM Telco Dataset]
       │
[2. Enrichment: 4 Behavioral Scores]
       │
[3. Churn Engine: LGBM + XGBoost Calibrated Classifiers]
       │
[4 & 5. Causal Layer: T-Learner Meta-Learners]
       │
[6. Customer Classifier: 4 Cohort Segments]
       │
[7 & 8. Financial Optimization: ROI Engine & Selector]
       │
[9 & 10. Explainability: SHAP Feature Attributions & DoWhy Counterfactuals]
       │
[11. REST Serving: FastAPI Gateway]
       │
[12. Visual Representation: Glassmorphic Single-Page App]
```

---

## 📊 Behavioral Customer Segmentation

Customers are automatically classified into four core behavioral cohorts based on their treatment CATE values:

| Segment | CATE Threshold | Description & Business Strategy |
| :--- | :--- | :--- |
| **Persuadables** | $\text{CATE} > 0.10$ | Will remain active **only** if targeted. **Primary focus of campaigns.** |
| **Sure Things** | $0 < \text{CATE} \le 0.10$ | Will stay anyway. Do not spend discount budgets on this segment. |
| **Lost Causes** | $\text{CATE} \approx 0$ | Will churn regardless of outreach. Save resources and skip. |
| **Do Not Disturb** | $\text{CATE} < -0.05$ | Outreach triggers negative emotional response and **increases** churn risk. Strictly avoid. |

---

## 🛠️ Unified Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Data Engineering** | `Pandas`, `NumPy`, `Scikit-learn` | Raw dataset ingestion, MinMax score scaling, and cleaning. |
| **Predictive ML** | `LightGBM`, `XGBoost` | Ensemble gradient boosting calibrated classifiers for $P(\text{Churn})$. |
| **Causal Inference** | Custom SCM Meta-Learners | T-Learner meta-learner isolating treatment effect differentials (CATE). |
| **Explainability** | `SHAP` | TreeExplainer risk feature attribution values. |
| **Simulations** | `DoWhy` | Causal structural graphing and $do()$-operator counterfactual projections. |
| **REST Server** | `FastAPI`, `Uvicorn` | High-performance, Pydantic-validated REST API gateway. |
| **Database ORM** | `SQLAlchemy`, `SQLite` / `PostgreSQL` | Local and production ORM schema definitions mapping. |
| **Frontend UI** | HTML5, CSS3, Vanilla ES6+ JS | Glassmorphic visual dashboard, animated circular rings, and line plots. |
| **Deployment** | `Docker`, `Docker Compose` | Service containerization and database orchestrations. |

---

## 🔌 REST API Specifications

The server exposes four high-performance endpoints:

### 1. `/predict` [POST]
Accepts raw customer telemetry features and returns calibrated churn probability.
*   **Request Payload**:
    ```json
    {
      "login_count_30d": 12, "session_duration": 150, "feature_usage": 3,
      "ticket_count": 4, "escalation_count": 2, "resolution_time": 36,
      "email_sentiment": 0.3, "ticket_sentiment": 0.4, "call_sentiment": 0.35,
      "nps_score": 4, "last_login_days": 12, "product_adoption_depth": 2
    }
    ```
*   **Response Payload**:
    ```json
    { "customer_id": "API-Transient-Query", "churn_probability": 0.3929, "status": "success" }
    ```

### 2. `/recommend` [POST]
Accepts customer ID and contract monthly charges. Evaluates CATE across 5 treatments and returns the highest-ROI action.
*   **Request Payload**:
    ```json
    { "customer_id": "C-82941", "monthly_charges": 12400.0 }
    ```
*   **Response Payload**:
    ```json
    {
      "customer_id": "C-82941",
      "churn_probability": 0.842,
      "segment": "persuadable",
      "best_action": "Call",
      "lift": 0.205,
      "cost": 100.0,
      "revenue_saved": 30504.0,
      "roi": 30404.0,
      "explanation": {
        "top_factor_1": "High Support Ticket Count",
        "top_factor_2": "Frustrated Sentiment Vector",
        "top_factor_3": "Low Login Frequency"
      }
    }
    ```

---

## 🚀 Getting Started

### 1. Local Development Launch
To start both the static dashboard server and the REST API server locally:

*   **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
*   **Launch the UI Dashboard** (runs on [http://localhost:8000](http://localhost:8000)):
    ```bash
    python server.py
    ```
*   **Launch the FastAPI Server** (runs on [http://127.0.0.1:8001](http://127.0.0.1:8001)):
    ```bash
    python api/main.py
    ```

### 2. Production Docker Build
To compile and launch the full ensembled stack (FastAPI container + PostgreSQL service) in one command:
```bash
docker-compose up --build
```

---

## 💼 Resume & Portfolio Impact

**Prescriptive Churn Intelligence Platform | Python • LightGBM • CausalML • DoWhy • FastAPI • Docker • Vanilla JS**
*   Built a production-ready prescriptive churn platform combining **supervised classifiers** (LGBM/XGBoost) and **causal meta-learners** (T-Learner) to calculate individual treatment lifts (CATE) across 5 interventions.
*   Engineered a financial optimization **ROI engine** mapping statistical lifts to at-risk contract values, maximizing budget allocation and preventing churn by ensembling treatment costs.
*   Constructed a **glassmorphic, responsive single-page visual dashboard** containing custom SVG waterfall SHAP attributions, interactive causal SCM counterfactual simulators, and a floating **natural language AI Copilot chat drawer**.
*   Exposed serving pipelines via a Pydantic-validated **4-endpoint FastAPI REST service** backed by SQLAlchemy ORM schemas, containerized completely using **Docker & Docker Compose**.
