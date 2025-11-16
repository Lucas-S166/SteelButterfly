import pandas as pd

def xlsx_parser(filename, month):
    df = pd.read_excel(filename)
    df['USD/mt'] = df['USD/mt'].dt.strftime('%Y-%m-%d')
    return dict(zip(df['USD/mt'], df[df.columns[month]]))