from flask import Flask, render_template, request, jsonify
from modelHelper import ModelHelper

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

modelHelper = ModelHelper()

#################################################
# Flask Routes
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
    return render_template("tableau2.html")

@app.route('/makePredictions_byname', methods=['POST'])
def make_predictions_byname():
    try:
        data = request.get_json()
        print("Request JSON data received from client:", data)  # Log input data
        
        # Log specific sections to identify where the failure is happening
        if 'data' not in data:
            raise ValueError("The 'data' field is missing in the request JSON")
        anime_name = data['data'].get('anime_name')
        if not anime_name:
            raise ValueError("Anime name is missing in the request")
        
        print("Anime Name to predict:", anime_name)  # Log the anime name

        # Call the method from the instantiated model_helper
        recommendations = modelHelper.makePredictions_byname(anime_name)  

        # Log the recommendations
        print(f"Recommendations generated: {recommendations}")

        response = {
            'prediction': recommendations  # Return the model output
        }

        return jsonify(response), 200

    except Exception as e:
        # Log the full error stack trace and message
        print(f"Error occurred: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route("/makePredictions_byfeatures", methods=["POST"])
def makePredictions_byfeatures():
    content = request.json["data"]
    print("test")
    print(content)

    # parse
    genre = content["select2-genre-container"]
    type = content["select2-type-container"]
    rating = content["min-rating-container"]
    episodes = content["min-episodes-container"]
    anime_length = 10

    preds = modelHelper.makePredictions_byfeatures(anime_length, genre, type, rating, episodes)
    return(jsonify({"ok": True, "prediction": str(preds)}))


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
