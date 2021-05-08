# This file creates the instance of the app and the db

from flask import Flask, request, jsonify, send_from_directory
import os
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__, static_folder='build')

# setup app variables from the environment variables
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
app.config['CORS_HEADERS'] = 'Content-Type'

# setup cors to make the api public for all domains:
cors = CORS(app)

# initiate the database
db = SQLAlchemy(app)


# Serve React App build from the build folder


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')
