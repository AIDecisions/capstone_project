import pandas as pd
import pickle
import numpy as np

class ModelHelper():
    def __init__(self):
        pass

import pandas as pd
import pickle

class ModelHelper:
    def makePredictions_byname(self, anime_name):
        # create dataframe of one row for inference
        df = pd.DataFrame()
        print(f"In makePredictions_byname, anime_name is: {anime_name}")
        anime_model = 'anime_length_name.pkl'
        df["anime_model"] = [anime_model]
        df["anime_name"] = [anime_name]

        # Load the model (NearestNeighbors in this case)
        model = pickle.load(open("anime_length_name.pkl", 'rb'))

        # Generate recommendations using the 'kneighbors' method
        try:
            distances, indices = model.kneighbors(df, n_neighbors=5)  # Adjust n_neighbors to your preference
            print(f"Distances: {distances}, Indices: {indices}")
            
            # Here you can translate 'indices' into actual anime recommendations
            recommendations = [self.anime_list[idx] for idx in indices[0]]
            return recommendations
        except Exception as e:
            print(f"Error generating recommendations: {str(e)}")
            return []


    def makePredictions_byfeatures(self, response_length, genre, type, rating, episodes):
        # create dataframe of one row for inference
        df = pd.DataFrame()
        df["anime_length"] = [response_length]
        df["genre"] = [genre]
        df["type"] = [type]
        df["rating"] = [rating]
        df["episodes"] = [episodes]

        # model
        model = pickle.load(open("anime_features.pkl", 'rb'))

        # columns in order
        df = df.loc[:, ['name']]

        preds = model.predict_proba(df)
        print(preds)
        return(preds[0][1])