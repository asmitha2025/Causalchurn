def classify_segment(cate: float, churn_prob: float) -> str:
    """
    Classifies a customer into one of four behavioral segments based on CATE:
    - persuadable (CATE > 0.10): Will stay IF contacted (highest priority)
    - sure_thing (0 < CATE <= 0.10): Stay regardless (low priority)
    - do_not_disturb (CATE < -0.05): Contact increases churn risk (strictly avoid)
    - lost_cause (otherwise): Churn regardless of intervention (skip)
    """
    if cate > 0.10:
        return 'persuadable'
    elif cate > 0.0:
        return 'sure_thing'
    elif cate < -0.05:
        return 'do_not_disturb'
    else:
        return 'lost_cause'
