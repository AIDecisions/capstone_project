# Import common libraries
import pandas as pd

# Import model libraries
import pickle

# Import SQL libraries
from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine, text

class SQLHelper:
    #################################################
    # Database Setup
    #################################################

    # define properties
    def __init__(self):
        self.engine = create_engine("sqlite:///anime_list.sqlite")
        self.Base = None

        # automap Base classes
        self.init_base()

    def init_base(self):
        # reflect an existing database into a new model
        self.Base = automap_base()
        # reflect the tables
        self.Base.prepare(autoload_with=self.engine)

    #################################################
    # Database Queries
    #################################################

    def get_anime_names(self):
        # Do a Select * to get all the data from the combined_attacks table
        query = """
                SELECT 
                    anime_id, 
                    name
                FROM anime_list
                ORDER BY name;
                """

        # Save the query results as a Pandas DataFrame
        df = pd.read_sql(text(query), con=self.engine)
        data = df.to_dict(orient="records")
        return (data)

    def get_anime(self, anime_id):
        # Do a Select * to get all the data from the combined_attacks table
        query = f"""
                SELECT 
                    anime_id, 
                    name, 
                    episodes, 
                    rating, 
                    members, 
                    Action, 
                    Adventure, 
                    Cars, 
                    Comedy, 
                    Dementia, 
                    Demons, 
                    Drama, 
                    Fantasy, 
                    Game, 
                    Historical, 
                    Horror, 
                    Josei, 
                    Kids, 
                    Magic, 
                    MartialArts, 
                    Mecha, 
                    Military, 
                    Mystery, 
                    Parody, 
                    Police, 
                    Psychological, 
                    Romance, 
                    Samurai, 
                    School, 
                    SciFi, 
                    Seinen, 
                    Shoujo, 
                    ShoujoAi, 
                    Shounen, 
                    ShounenAi, 
                    SliceofLife, 
                    Space, 
                    Sports, 
                    SuperPower, 
                    Supernatural, 
                    Thriller, 
                    Vampire, 
                    Movie, 
                    Music, 
                    ONA, 
                    OVA, 
                    Special, 
                    TV 
                FROM anime_list
                WHERE anime_id = {anime_id};
                """

        # Save the query results as a Pandas DataFrame
        df = pd.read_sql(text(query), con=self.engine)
        data = df.to_dict(orient="records")
        return (data)

class ModelHelper():
    #################################################
    # Model Setup
    #################################################
    def __init__(self):
        pass

# class ModelHelper:
import pandas as pd
import pickle

class ModelHelper:
    def makePredictions_byname(self, episode, rating, members, Action, Adventure, Cars, Comedy, Dementia, Demons, Drama, Fantasy, Game, Historical, Horror, Josei, Kids, Magic, MartialArts, Mecha, Military, Mystery, Parody, Police, Psychological, Romance, Samurai, School, SciFi, Seinen, Shoujo, ShoujoAi, Shounen, ShounenAi, SliceofLife, Space, Sports, SuperPower, Supernatural, Thriller, Vampire, Movie, Music, ONA, OVA, Special, TV, genres, types, minRating, maxEpisodes):
        # Extract relevant features (remove anime_id)
        features = {
            'episodes': episode,
            'rating': rating,
            'members': members,
            'Action': Action,
            'Adventure': Adventure,
            'Cars': Cars,
            'Comedy': Comedy,
            'Dementia': Dementia,
            'Demons': Demons,
            'Drama': Drama,
            'Fantasy': Fantasy,
            'Game': Game,
            'Historical': Historical,
            'Horror': Horror,
            'Josei': Josei,
            'Kids': Kids,
            'Magic': Magic,
            'MartialArts': MartialArts,
            'Mecha': Mecha,
            'Military': Military,
            'Mystery': Mystery,
            'Parody': Parody,
            'Police': Police,
            'Psychological': Psychological,
            'Romance': Romance,
            'Samurai': Samurai,
            'School': School,
            'SciFi': SciFi,
            'Seinen': Seinen,
            'Shoujo': Shoujo,
            'ShoujoAi': ShoujoAi,
            'Shounen': Shounen,
            'ShounenAi': ShounenAi,
            'SliceofLife': SliceofLife,
            'Space': Space,
            'Sports': Sports,
            'SuperPower': SuperPower,
            'Supernatural': Supernatural,
            'Thriller': Thriller,
            'Vampire': Vampire,
            'Movie': Movie,
            'Music': Music,
            'ONA': ONA,
            'OVA': OVA,
            'Special': Special,
            'TV': TV
        }

        # Convert minRating from tuple to float
        minRating = minRating[0]

        maxEpisodes = int(maxEpisodes)

        # Convert the features dictionary into a DataFrame
        df = pd.DataFrame(features)
        # print(f"DataFrame: {df.shape}")

        # Load the model (NearestNeighbors in this case)
        model = pickle.load(open("anime_name.pkl", 'rb'))

        # Generate recommendations using the 'kneighbors' method
        try:
            distances, indices = model.kneighbors(df)
            
            # predictions
            # Return both distances and indices as a dictionary
            predictions_dict = {
                "anime_id": indices[0].tolist(),
                "distances": distances[0].tolist()
            }

            # Convert predictions_dict to a dataframe
            predictions_df = pd.DataFrame(predictions_dict)

            # Read original anime_clean.csv file
            anime_clean_df = pd.read_csv("anime_b4_scale_ml.csv")

            # Merge predictions_df with anime_clean_df
            recommendations_df = pd.merge(predictions_df, anime_clean_df, how='inner', on='anime_id')

            # Filter recommendations_df based on genres, types, minRating, and maxEpisodes
            # Filter genres if any
            # Convert genres to a list
            genres = list(genres[0])

            # Ensure there are genres selected
            if len(genres) > 0:
                # Use .loc to filter rows where any of the selected genres columns are 1
                recommendations_df = recommendations_df.loc[(recommendations_df[genres] == 1).any(axis=1)]

            # Filter types if any
            # Convert types to a list
            types = list(types[0])

            if len(types) > 0:
                recommendations_df = recommendations_df.loc[(recommendations_df[types] == 1).any(axis=1)]

            # Filter minRating if any
            if minRating > 0:
                recommendations_df = recommendations_df.loc[recommendations_df['rating'] >= minRating]


            # Filter Max Episodes if any
            if maxEpisodes > 0:
                recommendations_df = recommendations_df.loc[recommendations_df['episodes'] <= maxEpisodes]

            # Convert recommendations_df to a dictionary
            recommendations = recommendations_df.to_dict(orient="records")

            return recommendations
        except Exception as e:
            print(f"Error generating recommendations: {str(e)}")
            return []


    # def makePredictions_byname(self, payload):
    #     # Extract anime name and additional features from the payload
    #     anime_id = payload.get('anime_id')
    #     print(f"In makePredictions_byname, anime_name is: {anime_id}")
        
    #     # Create a DataFrame with the feature values from the payload
    #     features = {
    #         'anime_id': [anime_id],
    #         'name': [payload.get('name')],
    #         'Action': [payload.get('Action')],
    #         'Adventure': [payload.get('Adventure')],
    #         'Cars': [payload.get('Cars')],
    #         'Comedy': [payload.get('Comedy')],
    #         'Dementia': [payload.get('Dementia')],
    #         'Demons': [payload.get('Demons')],
    #         'Drama': [payload.get('Drama')],
    #         'Fantasy': [payload.get('Fantasy')],
    #         'Game': [payload.get('Game')],
    #         'Historical': [payload.get('Historical')],
    #         'Horror': [payload.get('Horror')],
    #         'Josei': [payload.get('Josei')],
    #         'Kids': [payload.get('Kids')],
    #         'Magic': [payload.get('Magic')],
    #         'MartialArts': [payload.get('MartialArts')],
    #         'Mecha': [payload.get('Mecha')],
    #         'Military': [payload.get('Military')],
    #         'Movie': [payload.get('Movie')],
    #         'Music': [payload.get('Music')],
    #         'Mystery': [payload.get('Mystery')],
    #         'ONA': [payload.get('ONA')],
    #         'OVA': [payload.get('OVA')],
    #         'Parody': [payload.get('Parody')],
    #         'Police': [payload.get('Police')],
    #         'Psychological': [payload.get('Psychological')],
    #         'Romance': [payload.get('Romance')],
    #         'Samurai': [payload.get('Samurai')],
    #         'School': [payload.get('School')],
    #         'SciFi': [payload.get('SciFi')],
    #         'Seinen': [payload.get('Seinen')],
    #         'Shoujo': [payload.get('Shoujo')],
    #         'ShoujoAi': [payload.get('ShoujoAi')],
    #         'Shounen': [payload.get('Shounen')],
    #         'ShounenAi': [payload.get('ShounenAi')],
    #         'SliceofLife': [payload.get('SliceofLife')],
    #         'Space': [payload.get('Space')],
    #         'Special': [payload.get('Special')],
    #         'Sports': [payload.get('Sports')],
    #         'SuperPower': [payload.get('SuperPower')],
    #         'Supernatural': [payload.get('Supernatural')],
    #         'TV': [payload.get('TV')],
    #         'Thriller': [payload.get('Thriller')],
    #         'Vampire': [payload.get('Vampire')],
    #         'episodes': [payload.get('episodes')],
    #         'members': [payload.get('members')],
    #         'rating': [payload.get('rating')]
    #     }

    #     # Convert the features dictionary into a DataFrame
    #     df = pd.DataFrame(features)

    #     # Load the model (NearestNeighbors in this case)
    #     model = pickle.load(open("anime_name.pkl", 'rb'))

    #     # Generate recommendations using the 'kneighbors' method
    #     try:
    #         distances, indices = model.kneighbors(df, n_neighbors=5)  # Adjust n_neighbors to your preference
    #         print(f"Distances: {distances}, Indices: {indices}")
            
    #         # Translate 'indices' into actual anime recommendations
    #         recommendations = [self.anime_list[idx] for idx in indices[0]]
    #         return recommendations
    #     except Exception as e:
    #         print(f"Error generating recommendations: {str(e)}")
    #         return []



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