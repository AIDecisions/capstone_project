import pandas as pd
from flask import Flask, render_template, request, jsonify
from modelHelper import ModelHelper
from modelHelper import SQLHelper
import pickle
import json

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

modelHelper = ModelHelper()
sqlHelper = SQLHelper()

#################################################
# SQL Routes
#################################################

@app.route("/api/v1.0/get_anime_names")
def get_anime_names():
    data = sqlHelper.get_anime_names()
    return (jsonify(data))

@app.route("/api/v1.0/get_anime/<anime_id>")
def get_anime(anime_id):
    data = sqlHelper.get_anime(anime_id)
    return (jsonify(data))

#################################################
# Model Routes
#################################################

# HTML Routes
@app.route("/")
def home():
    # Return template and data
    return render_template("index.html")

@app.route("/about_us")
def about_us():
    # Return template and data
    return render_template("about_us.html")

@app.route("/tableau")
def tableau():
    # Return template and data
    return render_template("tableau.html")

@app.route("/recommender")
def recommender():
    # Return template and data
    return render_template("recommender.html")

@app.route("/test")
def test():
    # Return template and data
    return render_template("test.html")

@app.route("/makePredictions_byname", methods=["POST"])
def makePredictions_byname():
    content = request.json["data"]

    # parse
    episodes = content['episodes'],
    rating = content['rating'],
    members = content['members'],
    Action = content['Action'],
    Adventure = content['Adventure'],
    Cars = content['Cars'],
    Comedy = content['Comedy'],
    Dementia = content['Dementia'],
    Demons = content['Demons'],
    Drama = content['Drama'],
    Fantasy = content['Fantasy'],
    Game = content['Game'],
    Historical = content['Historical'],
    Horror = content['Horror'],
    Josei = content['Josei'],
    Kids = content['Kids'],
    Magic = content['Magic'],
    MartialArts = content['MartialArts'],
    Mecha = content['Mecha'],
    Military = content['Military'],
    Mystery = content['Mystery'],
    Parody = content['Parody'],
    Police = content['Police'],
    Psychological = content['Psychological'],
    Romance = content['Romance'],
    Samurai = content['Samurai'],
    School = content['School'],
    SciFi = content['SciFi'],
    Seinen = content['Seinen'],
    Shoujo = content['Shoujo'],
    ShoujoAi = content['ShoujoAi'],
    Shounen = content['Shounen'],
    ShounenAi = content['ShounenAi'],
    SliceofLife = content['SliceofLife'],
    Space = content['Space'],
    Sports = content['Sports'],
    SuperPower = content['SuperPower'],
    Supernatural = content['Supernatural'],
    Thriller = content['Thriller'],
    Vampire = content['Vampire'],
    Movie = content['Movie'],
    Music = content['Music'],
    ONA = content['ONA'],
    OVA = content['OVA'],
    Special = content['Special'],
    TV = content['TV'], 
    genres = content['selectedGenres'],
    types = content['selectedTypes'],
    minRating = content['minRating'],
    maxEpisodes = content['maxEpisodes']

    preds = modelHelper.makePredictions_byname(episodes, rating, members, Action, Adventure, Cars, Comedy, Dementia, Demons, Drama, Fantasy, Game, Historical, Horror, Josei, Kids, Magic, MartialArts, Mecha, Military, Mystery, Parody, Police, Psychological, Romance, Samurai, School, SciFi, Seinen, Shoujo, ShoujoAi, Shounen, ShounenAi, SliceofLife, Space, Sports, SuperPower, Supernatural, Thriller, Vampire, Movie, Music, ONA, OVA, Special, TV, genres, types, minRating, maxEpisodes)
    return(jsonify({"ok": True, "prediction": json.dumps(preds)}))

# @app.route("/makePredictions_byname", methods=["POST"])
# def makePredictions_byname(self, payload):
#     # Extract relevant features in the correct order
#     print(f"Payload in app_py: {payload}")
#     features = {
#         'episodes': [payload.get('episodes')],
#         'rating': [payload.get('rating')],
#         'members': [payload.get('members')],
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
#         'Mystery': [payload.get('Mystery')],
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
#         'Sports': [payload.get('Sports')],
#         'SuperPower': [payload.get('SuperPower')],
#         'Supernatural': [payload.get('Supernatural')],
#         'Thriller': [payload.get('Thriller')],
#         'Vampire': [payload.get('Vampire')],
#         'Movie': [payload.get('Movie')],
#         'Music': [payload.get('Music')],
#         'ONA': [payload.get('ONA')],
#         'OVA': [payload.get('OVA')],
#         'Special': [payload.get('Special')],
#         'TV': [payload.get('TV')]
#     }

#     # Create DataFrame with the correct order of features
#     df = pd.DataFrame(features)

#     # Load the model (NearestNeighbors in this case)
#     model = pickle.load(open("anime_length_name.pkl", 'rb'))

#     # Generate recommendations using the 'kneighbors' method
#     try:
#         distances, indices = model.kneighbors(df, n_neighbors=5)
#         print(f"Distances: {distances}, Indices: {indices}")
        
#         # Translate 'indices' into actual anime recommendations
#         recommendations = [self.anime_list[idx] for idx in indices[0]]
#         return recommendations
#     except Exception as e:
#         print(f"Error generating recommendations: {str(e)}")
#         return []

# @app.route("/makePredictions_byfeatures", methods=["POST"])
# def makePredictions_byfeatures():
#     content = request.json["data"]
#     print("test")
#     print(content)

#     # parse
#     genre = content["select2-genre-container"]
#     type = content["select2-type-container"]
#     rating = content["min-rating-container"]
#     episodes = content["min-episodes-container"]
#     anime_length = 10

#     preds = modelHelper.makePredictions_byfeatures(anime_length, genre, type, rating, episodes)
#     return(jsonify({"ok": True, "prediction": str(preds)}))


#############################################################

@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    return r

#main
if __name__ == "__main__":
    app.run(debug=True) 
#    app.run(debug=True, use_reloader=False) # Disable reloader to prevent automatic restarts
