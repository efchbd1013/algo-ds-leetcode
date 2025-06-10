import pandas as pd

def employee_bonus(employee: pd.DataFrame, bonus: pd.DataFrame) -> pd.DataFrame:
    merged_df= pd.merge(employee, bonus, on="empId", how="left")
    return merged_df[(merged_df['bonus']<1000) | (merged_df['bonus'].isnull())][["name", "bonus"]]