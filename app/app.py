from flask import Flask, render_template, request, jsonify
from modelHelper import ModelHelper
from modelHelper import SQLHelper
import json

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

modelHelper = ModelHelper()
sqlHelper = SQLHelper()

#################################################
# HTML routes
#################################################

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

@app.route("/presentation")
def presentation():
    # Return template and data
    return render_template("presentation.html")

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
