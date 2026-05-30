import pandas as pd
import numpy as np
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.features import engineer_features

def preprocess_and_ingest(raw_path: str, processed_path: str):
    """
    Loads raw IBM Telco Churn CSV data, synthesizes telemetry score inputs based on customer 
    contract types and charges, engineers normalized composite score features, and persists to data/processed/.
    """
    if not os.path.exists(raw_path):
        raise FileNotFoundError(f"Raw data file not found at: {raw_path}")
        
    print(f"Loading raw dataset: {raw_path}")
    raw_df = pd.read_csv(raw_path)
    
    # Pre-populate realistic score inputs matching the columns expected by engineer_features()
    # using customer contract and charge telemetry to keep them consistent
    np.random.seed(42)
    n = len(raw_df)
    
    # Month-to-month contracts have higher support ticket frequency
    is_m2m = raw_df['Contract'] == 'Month-to-month'
    ticket_counts = np.where(is_m2m, np.random.randint(3, 10, size=n), np.random.randint(0, 4, size=n))
    escalations = np.where(ticket_counts > 5, np.random.randint(1, 4, size=n), 0)
    
    # Higher charges yield higher session durations and adoption
    high_charge = raw_df['MonthlyCharges'] > 70
    session_dur = np.where(high_charge, np.random.randint(400, 1000, size=n), np.random.randint(50, 400, size=n))
    logins = np.where(high_charge, np.random.randint(20, 50, size=n), np.random.randint(2, 20, size=n))
    feature_adopt = np.where(high_charge, np.random.randint(5, 10, size=n), np.random.randint(1, 5, size=n))
    
    # Ingesting mock score inputs
    raw_df['login_count_30d'] = logins
    raw_df['session_duration'] = session_dur
    raw_df['feature_usage'] = feature_adopt
    
    raw_df['ticket_count'] = ticket_counts
    raw_df['escalation_count'] = escalations
    raw_df['resolution_time'] = np.random.randint(4, 72, size=n)
    
    # Fiber optic clients have lower sentiment due to initial SLA delay roadblocks
    is_fiber = raw_df['InternetService'] == 'Fiber optic'
    raw_df['email_sentiment'] = np.where(is_fiber, np.random.uniform(0.1, 0.6, size=n), np.random.uniform(0.5, 0.9, size=n))
    raw_df['ticket_sentiment'] = np.where(is_fiber, np.random.uniform(0.1, 0.5, size=n), np.random.uniform(0.4, 0.9, size=n))
    raw_df['call_sentiment'] = np.random.uniform(0.3, 0.9, size=n)
    
    # High churn markers correlate with lower NPS ratings
    is_churn = raw_df['Churn'] == 'Yes'
    raw_df['nps_score'] = np.where(is_churn, np.random.randint(1, 6, size=n), np.random.randint(7, 11, size=n))
    raw_df['last_login_days'] = np.where(is_churn, np.random.randint(10, 30, size=n), np.random.randint(1, 10, size=n))
    raw_df['product_adoption_depth'] = feature_adopt
    
    print("Engineering normalized composite behavioral score metrics...")
    processed_df = engineer_features(raw_df)
    
    # Ensure processed directory exists
    os.makedirs(os.path.dirname(processed_path), exist_ok=True)
    
    # Save the processed data
    processed_cols = [
        'customerID', 'tenure', 'MonthlyCharges', 'Churn',
        'usage_score', 'support_score', 'sentiment_score', 'engagement_score'
    ]
    processed_df[processed_cols].to_csv(processed_path, index=False)
    print(f"Ingestion successful! Processed feature matrix ({n} rows) saved at: {processed_path}")

if __name__ == '__main__':
    raw = r"data/raw/WA_Fn-UseC_-Telco-Customer-Churn.csv"
    processed = r"data/processed/engineered_features.csv"
    preprocess_and_ingest(raw, processed)
