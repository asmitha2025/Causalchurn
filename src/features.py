import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler

def compute_usage_score(df: pd.DataFrame) -> pd.Series:
    """
    Computes Usage Score normalized between [0, 1] based on logins, duration, and feature adoption.
    Expected columns: login_count_30d, session_duration, feature_usage
    """
    usage_cols = ['login_count_30d', 'session_duration', 'feature_usage']
    
    # Fill missing values if any
    temp_df = df[usage_cols].fillna(0)
    
    scaler = MinMaxScaler()
    scaled_features = scaler.fit_transform(temp_df)
    
    # Combined weighted average: 40% logins, 30% duration, 30% feature usage
    weights = np.array([0.4, 0.3, 0.3])
    score = np.dot(scaled_features, weights)
    
    return pd.Series(score, index=df.index)

def compute_support_score(df: pd.DataFrame) -> pd.Series:
    """
    Computes Support friction score normalized between [0, 1].
    Expected columns: ticket_count, escalation_count, resolution_time
    """
    support_cols = ['ticket_count', 'escalation_count', 'resolution_time']
    
    temp_df = df[support_cols].fillna(0)
    
    scaler = MinMaxScaler()
    scaled_features = scaler.fit_transform(temp_df)
    
    # Combined weighted average: 40% ticket counts, 40% escalations, 20% resolution times
    weights = np.array([0.4, 0.4, 0.2])
    score = np.dot(scaled_features, weights)
    
    return pd.Series(score, index=df.index)

def compute_sentiment_score(df: pd.DataFrame) -> pd.Series:
    """
    Computes Sentiment Score as mean of sentiment vectors.
    Expected columns: email_sentiment, ticket_sentiment, call_sentiment
    """
    sentiment_cols = ['email_sentiment', 'ticket_sentiment', 'call_sentiment']
    
    # Fill missing values with neutral (0.5)
    temp_df = df[sentiment_cols].fillna(0.5)
    
    # Average across the three channels
    score = temp_df.mean(axis=1)
    
    # Clamp to [0, 1] range
    score = np.clip(score, 0.0, 1.0)
    
    return score

def compute_engagement_score(df: pd.DataFrame) -> pd.Series:
    """
    Computes Engagement Score normalized between [0, 1].
    Expected columns: nps_score (0-10 scale), last_login_days (inverse), product_adoption_depth
    """
    # 1. Normalize NPS Score (0-10) to [0, 1]
    nps_norm = df['nps_score'].fillna(7) / 10.0
    
    # 2. Invert last_login_days: fewer days since login means higher engagement
    last_login = df['last_login_days'].fillna(30)
    # Scaling last login: 0 days -> 1.0, 30+ days -> 0.0
    last_login_norm = np.clip(1.0 - (last_login / 30.0), 0.0, 1.0)
    
    # 3. Scale product adoption depth
    adoption = df['product_adoption_depth'].fillna(1)
    scaler = MinMaxScaler()
    adoption_norm = scaler.fit_transform(adoption.values.reshape(-1, 1)).flatten()
    
    # Weighted average: 40% NPS, 30% login recency, 30% product adoption depth
    score = 0.4 * nps_norm + 0.3 * last_login_norm + 0.3 * adoption_norm
    
    return pd.Series(score, index=df.index)

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Master function to ingest a raw customer DataFrame and append the four engineered scores.
    """
    processed_df = df.copy()
    
    # Compute and assign scores
    processed_df['usage_score'] = compute_usage_score(df)
    processed_df['support_score'] = compute_support_score(df)
    processed_df['sentiment_score'] = compute_sentiment_score(df)
    processed_df['engagement_score'] = compute_engagement_score(df)
    
    return processed_df

if __name__ == '__main__':
    # Simple Mock Data Test
    mock_data = pd.DataFrame({
        'customer_id': ['C-82941', 'C-90123'],
        'login_count_30d': [10, 45],
        'session_duration': [120, 950],
        'feature_usage': [2, 8],
        'ticket_count': [5, 1],
        'escalation_count': [3, 0],
        'resolution_time': [48, 12],
        'email_sentiment': [0.2, 0.8],
        'ticket_sentiment': [0.3, 0.7],
        'call_sentiment': [0.4, 0.9],
        'nps_score': [3, 9],
        'last_login_days': [15, 1],
        'product_adoption_depth': [2, 5]
    })
    
    result = engineer_features(mock_data)
    print("Mock Ingestion Successful! Engineered Scores:")
    print(result[['customer_id', 'usage_score', 'support_score', 'sentiment_score', 'engagement_score']])
