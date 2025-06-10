import pandas as pd

def combine_two_tables(person: pd.DataFrame, address: pd.DataFrame) -> pd.DataFrame:
    return pd.merge(address,person, on="personId", how="right")[["firstName", "lastName", "city", "state"]]