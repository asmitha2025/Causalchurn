import os
import pickle
import pandas as pd
import numpy as np
from sklearn.model_selection import StratifiedKFold
from sklearn.preprocessing import StandardScaler
from sklearn.calibration import CalibratedClassifierCV

# Robust imports with clean fallback options
try:
    from lightgbm import LGBMClassifier
    HAS_LGBM = True
except ImportError:
    HAS_LGBM = False

try:
    from xgboost import XGBClassifier
    HAS_XGB = True
except ImportError:
    HAS_XGB = False

from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier

class ChurnPredictor:
    def __init__(self, model_type="ensemble"):
        self.model_type = model_type
        self.scaler = StandardScaler()
        self.model = None
        self.is_trained = False
        
    def _initialize_base_model(self):
        """
        Initializes the classifier based on what modules are available.
        """
        if self.model_type == "lgbm" and HAS_LGBM:
            return LGBMClassifier(n_estimators=100, learning_rate=0.05, class_weight='balanced', random_state=42)
        elif self.model_type == "xgboost" and HAS_XGB:
            return XGBClassifier(n_estimators=100, learning_rate=0.05, eval_metric="logloss", random_state=42)
        else:
            # Safe, premium fallback for standard system environments
            return GradientBoostingClassifier(n_estimators=100, learning_rate=0.05, random_state=42)

    def fit(self, X: pd.DataFrame, y: pd.Series):
        """
        Fits the ensemble predictive model and applies probability calibration.
        """
        # Standardize features
        X_scaled = self.scaler.fit_transform(X)
        
        base_clf = self._initialize_base_model()
        
        # We apply probability calibration (Platt scaling / Isotonic regression) 
        # to ensure predictions represent true empirical probabilities [0-1]
        self.model = CalibratedClassifierCV(estimator=base_clf, method='sigmoid', cv=3)
        self.model.fit(X_scaled, y)
        self.is_trained = True
        
    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        """
        Returns the calibrated probability of churn P(Churn) per customer.
        """
        if not self.is_trained:
            raise ValueError("Predictor model has not been trained. Run fit() first.")
        
        X_scaled = self.scaler.transform(X)
        # Class 1 represents the probability of Churn
        return self.model.predict_proba(X_scaled)[:, 1]

    def save_model(self, filepath: str):
        """
        Persists the trained model and scaler to a serialized pickle file.
        """
        if not self.is_trained:
            raise ValueError("Cannot save an untrained model.")
        
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'wb') as f:
            pickle.dump({
                'model': self.model,
                'scaler': self.scaler,
                'model_type': self.model_type
            }, f)
        print(f"Model saved successfully to: {filepath}")

    def load_model(self, filepath: str):
        """
        Loads the serialized model and feature scaler.
        """
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"No saved model found at: {filepath}")
            
        with open(filepath, 'rb') as f:
            data = pickle.load(f)
            self.model = data['model']
            self.scaler = data['scaler']
            self.model_type = data['model_type']
            self.is_trained = True
        print(f"Model loaded successfully from: {filepath}")

if __name__ == '__main__':
    # Generate mock training set (100 customers, 4 score features)
    np.random.seed(42)
    X_train = pd.DataFrame({
        'usage_score': np.random.uniform(0.1, 0.9, 100),
        'support_score': np.random.uniform(0.1, 0.9, 100),
        'sentiment_score': np.random.uniform(0.1, 0.9, 100),
        'engagement_score': np.random.uniform(0.1, 0.9, 100),
    })
    
    # 30% baseline churn y-outcome labels
    y_train = pd.Series(np.random.choice([0, 1], size=100, p=[0.7, 0.3]))
    
    predictor = ChurnPredictor()
    print("Training ChurnPredictor model...")
    predictor.fit(X_train, y_train)
    
    probs = predictor.predict_proba(X_train[:5])
    print(f"Model Training complete. Simulated P(Churn) for first 5 customers: {probs}")
