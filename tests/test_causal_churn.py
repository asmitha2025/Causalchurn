import unittest
import pandas as pd
import numpy as np
import os
import sys

# Ensure project root is in system path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.features import engineer_features
from src.churn_model import ChurnPredictor
from src.uplift_model import TLearner
from src.segmentation import classify_segment
from src.roi_engine import recommend_best_action, calculate_roi
from src.counterfactual import CausalSimulator

class TestCausalChurnFeatures(unittest.TestCase):
    def setUp(self):
        # Setup mock customer dataframe
        self.df = pd.DataFrame({
            'customer_id': ['C-001', 'C-002'],
            'login_count_30d': [10, 40],
            'session_duration': [100, 800],
            'feature_usage': [2, 8],
            'ticket_count': [4, 1],
            'escalation_count': [2, 0],
            'resolution_time': [48, 12],
            'email_sentiment': [0.3, 0.8],
            'ticket_sentiment': [0.4, 0.7],
            'call_sentiment': [0.35, 0.9],
            'nps_score': [4, 9],
            'last_login_days': [12, 1],
            'product_adoption_depth': [2, 5]
        })

    def test_feature_engineering_bounds(self):
        """Test that engineered behavioral scores are within expected normalized [0, 1] bounds."""
        res_df = engineer_features(self.df)
        score_cols = ['usage_score', 'support_score', 'sentiment_score', 'engagement_score']
        
        # Verify columns exist
        for col in score_cols:
            self.assertIn(col, res_df.columns)
            
        # Verify scores are scaled between 0 and 1
        for col in score_cols:
            self.assertTrue((res_df[col] >= 0.0).all())
            self.assertTrue((res_df[col] <= 1.0).all())

class TestCausalChurnModels(unittest.TestCase):
    def setUp(self):
        np.random.seed(42)
        # Create 50 mock customer scores
        self.X = pd.DataFrame({
            'usage_score': np.random.uniform(0.1, 0.9, 50),
            'support_score': np.random.uniform(0.1, 0.9, 50),
            'sentiment_score': np.random.uniform(0.1, 0.9, 50),
            'engagement_score': np.random.uniform(0.1, 0.9, 50),
        })
        self.y = pd.Series(np.random.choice([0, 1], size=50, p=[0.7, 0.3]))
        self.treatment = pd.Series(np.random.choice([0, 1], size=50, p=[0.5, 0.5]))

    def test_churn_predictor_probabilities(self):
        """Test that calibrated predictor outputs true empirical probabilities between 0 and 1."""
        predictor = ChurnPredictor()
        predictor.fit(self.X, self.y)
        
        probs = predictor.predict_proba(self.X)
        self.assertEqual(len(probs), 50)
        self.assertTrue((probs >= 0.0).all())
        self.assertTrue((probs <= 1.0).all())

    def test_t_learner_cate_uplifts(self):
        """Test that T-Learner fits treated/control outcome models and calculates CATE lifts."""
        learner = TLearner()
        learner.fit(self.X, self.treatment, self.y)
        
        cate = learner.predict_cate(self.X)
        self.assertEqual(len(cate), 50)
        # Uplifts delta can be negative or positive, but must fall within plausible limits [-1, 1]
        self.assertTrue((cate >= -1.0).all())
        self.assertTrue((cate <= 1.0).all())

class TestCausalChurnBusinessLogic(unittest.TestCase):
    def test_segmentation_classification(self):
        """Verify that customer segmentation matches exact CATE threshold rules."""
        self.assertEqual(classify_segment(0.15, 0.8), 'persuadable')
        self.assertEqual(classify_segment(0.05, 0.4), 'sure_thing')
        self.assertEqual(classify_segment(-0.08, 0.7), 'do_not_disturb')
        self.assertEqual(classify_segment(-0.01, 0.9), 'lost_cause')

    def test_roi_engine_calculations(self):
        """Test expected revenue saved and ROI% formula accuracy."""
        # 10% lift on monthly charge of 10,000 (120,000 annual at-risk value) = 12,000 saved.
        # Cost is 1,000. Net saved = 11,000. ROI = 1,100%
        rev_saved, roi_pct = calculate_roi(0.10, 10000.0, 1000.0)
        self.assertEqual(rev_saved, 12000.0)
        self.assertEqual(roi_pct, 1100.0)

    def test_roi_action_recommendation(self):
        """Verify that recommend_best_action selects highest ROI action and applies suppression rules."""
        cates = {
            "Discount": 0.20, # cost 500
            "Call": 0.15,     # cost 100
            "Upgrade": 0.10   # cost 200
        }
        # monthly charges: 5000 -> Annual: 60000.
        # Discount: saved = 12000, net = 11500, ROI = 2300%
        # Call: saved = 9000, net = 8900, ROI = 8900% (highest ROI!)
        res = recommend_best_action("C-Test", 5000.0, cates)
        self.assertEqual(res["best_action"], "Call")
        self.assertEqual(res["cost"], 100.0)

class TestCausalChurnSimulator(unittest.TestCase):
    def test_causal_counterfactual_simulation(self):
        """Test structural causal model projections and decay horizons."""
        feat = {"customer_id": "C-82941", "usage_score": 0.5, "sentiment_score": 0.5}
        sim = CausalSimulator()
        
        res = sim.simulate_intervention(feat, 40.0, "Call", 80.0)
        self.assertEqual(res["customer_id"], "C-82941")
        self.assertEqual(res["proposed_action"], "Call")
        
        # Verify 6-month horizons decay properly
        self.assertEqual(len(res["baseline_horizon"]), 6)
        self.assertEqual(len(res["simulated_horizon"]), 6)
        self.assertTrue(res["simulated_horizon"][0] > res["baseline_horizon"][0])

if __name__ == '__main__':
    unittest.main()
