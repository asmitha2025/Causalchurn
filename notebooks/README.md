# 📊 CausalChurn Exploratory Data Analysis Playbook

Welcome to the Exploratory Data Analysis (EDA) playbooks workspace. This folder contains documentation and guidelines for analyzing the IBM Telco Churn Dataset and calibrating the score scaling pipelines.

---

## 🔍 Key Findings from EDA

During the initial data exploration phase of the 7,043 customer accounts, several critical predictive risk factors and causal confounders were isolated:

### 1. Class Imbalance
*   **Churn Distribution**: ~26.5% of accounts have churned, creating a standard class imbalance (3:1).
*   **Ensemble Resolution**: Handled via LightGBM `scale_pos_weight=5` and Scikit-learn stratified ensembling to prevent minority class neglect.

### 2. Correlation Matrix Clusters
*   **Usage Cluster**: High monthly charges correlate positively with long session durations and adoption depth, but also slightly higher support friction (as power users run into integration edge-cases).
*   **Friction Cluster**: Customer support ticket frequency and manager escalations correlate strongly with immediate negative sentiment vectors.
*   **Tenure Cluster**: Longer tenures are strongly associated with month-over-month contract renewals and represent loyal "Sure Things" whom we should not disturb with discount offers.

### 3. Feature Distributions & Scaling
*   **Usage score**: Exhibits a standard bimodal distribution (light users vs power users).
*   **Support score**: Heavily skewed towards 0 (most customers do not submit tickets), but has a long tail of high-friction accounts.
*   **Standardization**: All engineered composite scores are successfully mapped to `[0,1]` using `MinMaxScaler` prior to ensembling, ensuring gradient descent convergence.

---

## 📈 Running Analysis Notebooks

For local experimentation or running new EDA plots:
1.  Launch your Jupyter Environment:
    ```bash
    jupyter notebook
    ```
2.  Open or construct notebooks inside this directory. You can load and visualize the preprocessed CSV feature matrix using:
    ```python
    import pandas as pd
    df = pd.read_csv('../data/processed/engineered_features.csv')
    print(df.head())
    ```
