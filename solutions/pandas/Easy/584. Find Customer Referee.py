import pandas as pd

def find_customer_referee(customer: pd.DataFrame) -> pd.DataFrame:
    return customer[customer["referee_id"].ne(2)|customer["referee_id"].isnull()][['name']]