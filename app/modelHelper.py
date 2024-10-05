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