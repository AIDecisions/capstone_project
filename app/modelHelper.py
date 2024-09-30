import pandas as pd
import pickle
import numpy as np

class ModelHelper():
    def __init__(self):
        pass

    def makePredictions(self, response_length, anime_name):
        # create dataframe of one row for inference
        df = pd.DataFrame()
        df["anime_length"] = [response_length]
        df["anime_name"] = [anime_name]

        # model
        model = pickle.load(open("anime_name.pkl", 'rb'))

        # columns in order
        df = df.loc[:, ['name']]

        preds = model.predict_proba(df)
        console.log(preds)
        return(preds[0][1])
