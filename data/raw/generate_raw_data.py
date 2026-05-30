import pandas as pd
import numpy as np

def generate_telco_csv(filepath: str, num_customers: int = 100):
    np.random.seed(42)
    
    customer_ids = [f"C-{np.random.randint(10000, 99999)}" for _ in range(num_customers)]
    gender = np.random.choice(["Male", "Female"], size=num_customers)
    senior = np.random.choice([0, 1], size=num_customers, p=[0.8, 0.2])
    partner = np.random.choice(["Yes", "No"], size=num_customers)
    dependents = np.random.choice(["Yes", "No"], size=num_customers)
    tenure = np.random.randint(1, 72, size=num_customers)
    phone = np.random.choice(["Yes", "No"], size=num_customers)
    lines = np.random.choice(["No phone service", "No", "Yes"], size=num_customers)
    internet = np.random.choice(["DSL", "Fiber optic", "No"], size=num_customers)
    security = np.random.choice(["No internet service", "No", "Yes"], size=num_customers)
    backup = np.random.choice(["No internet service", "No", "Yes"], size=num_customers)
    protection = np.random.choice(["No internet service", "No", "Yes"], size=num_customers)
    support = np.random.choice(["No internet service", "No", "Yes"], size=num_customers)
    tv = np.random.choice(["No internet service", "No", "Yes"], size=num_customers)
    movies = np.random.choice(["No internet service", "No", "Yes"], size=num_customers)
    contract = np.random.choice(["Month-to-month", "One year", "Two year"], size=num_customers)
    billing = np.random.choice(["Yes", "No"], size=num_customers)
    payment = np.random.choice(["Electronic check", "Mailed check", "Bank transfer", "Credit card"], size=num_customers)
    monthly = np.random.uniform(20.0, 120.0, size=num_customers)
    total = monthly * tenure
    churn = np.random.choice(["Yes", "No"], size=num_customers, p=[0.3, 0.7])
    
    # Pack into dataframe
    df = pd.DataFrame({
        'customerID': customer_ids,
        'gender': gender,
        'SeniorCitizen': senior,
        'Partner': partner,
        'Dependents': dependents,
        'tenure': tenure,
        'PhoneService': phone,
        'MultipleLines': lines,
        'InternetService': internet,
        'OnlineSecurity': security,
        'OnlineBackup': backup,
        'DeviceProtection': protection,
        'TechSupport': support,
        'StreamingTV': tv,
        'StreamingMovies': movies,
        'Contract': contract,
        'PaperlessBilling': billing,
        'PaymentMethod': payment,
        'MonthlyCharges': np.round(monthly, 2),
        'TotalCharges': np.round(total, 2),
        'Churn': churn
    })
    
    df.to_csv(filepath, index=False)
    print(f"Generated synthetic IBM Telco Churn dataset ({num_customers} rows) at: {filepath}")

if __name__ == '__main__':
    generate_telco_csv("WA_Fn-UseC_-Telco-Customer-Churn.csv")
