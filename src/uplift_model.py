import numpy as np
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler

class TLearner:
    """
    T-Learner (Two-Learner) Causal Inference Meta-Learner.
    Trains two separate outcome estimators:
      - mu_1: trained exclusively on customers who received the intervention (Treatment)
      - mu_0: trained exclusively on customers who did not receive it (Control)
      
    CATE (Conditional Average Treatment Effect) = mu_1(X) - mu_0(X)
    """
    def __init__(self, base_estimator=None):
        self.scaler = StandardScaler()
        self.model_treated = base_estimator or GradientBoostingClassifier(n_estimators=100, learning_rate=0.05, random_state=42)
        self.model_control = base_estimator or GradientBoostingClassifier(n_estimators=100, learning_rate=0.05, random_state=42)
        self.is_trained = False

    def fit(self, X: pd.DataFrame, treatment: pd.Series, y: pd.Series):
        """
        Fits the T-Learner models.
        - treatment: binary Series (1 = treated, 0 = control)
        - y: outcome label (1 = retained, 0 = churned)
        """
        X_scaled = self.scaler.fit_transform(X)
        
        # Partition data into treated and control cohorts
        X_treated = X_scaled[treatment == 1]
        y_treated = y[treatment == 1]
        
        X_control = X_scaled[treatment == 0]
        y_control = y[treatment == 0]
        
        # Safety checks for sample sizes
        if len(X_treated) == 0 or len(X_control) == 0:
            raise ValueError("Uplift training requires both treated and control samples.")
            
        # Fit treatment outcome model mu_1
        self.model_treated.fit(X_treated, y_treated)
        
        # Fit control outcome model mu_0
        self.model_control.fit(X_control, y_control)
        
        self.is_trained = True
        print("T-Learner ensembled successfully!")

    def predict_cate(self, X: pd.DataFrame) -> np.ndarray:
        """
        Estimates the CATE (uplift delta) = P(Retained|Treated) - P(Retained|Control)
        Note: P(Retained) is 1.0 - P(Churn) or directly the retention outcome prob.
        """
        if not self.is_trained:
            raise ValueError("T-Learner has not been trained yet.")
            
        X_scaled = self.scaler.transform(X)
        
        # Predict retention probability under Treatment (Class 1)
        p_treated = self.model_treated.predict_proba(X_scaled)[:, 1]
        
        # Predict retention probability under Control (Class 1)
        p_control = self.model_control.predict_proba(X_scaled)[:, 1]
        
        # CATE is the treatment uplift delta
        cate = p_treated - p_control
        return cate

from src.segmentation import classify_segment

if __name__ == '__main__':
    # Generate mock treatment dataset (100 customers)
    np.random.seed(42)
    X = pd.DataFrame({
        'usage_score': np.random.uniform(0.1, 0.9, 120),
        'support_score': np.random.uniform(0.1, 0.9, 120),
        'sentiment_score': np.random.uniform(0.1, 0.9, 120),
        'engagement_score': np.random.uniform(0.1, 0.9, 120),
    })
    
    # 50/50 treatment splits
    treatment = pd.Series(np.random.choice([0, 1], size=120, p=[0.5, 0.5]))
    
    # Outcomes: mock retention (1=retained, 0=churned)
    y = pd.Series(np.random.choice([0, 1], size=120, p=[0.6, 0.4]))
    
    learner = TLearner()
    print("Fitting T-Learner on synthetic treatment split...")
    learner.fit(X, treatment, y)
    
    cate = learner.predict_cate(X[:5])
    print(f"CATE predictions for first 5 customers: {cate}")
    
    # Test segment assignments
    print("\nSegment Classification Test:")
    test_cates = [0.18, 0.05, -0.08, -0.01]
    for tc in test_cates:
        seg = classify_segment(tc, 0.8)
        print(f"CATE: {tc:+.2f} -> Segment: {seg.upper()}")
