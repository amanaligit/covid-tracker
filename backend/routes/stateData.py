from app import app, db
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
from models import User, State, StateData
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from utils.check_token import token_required

# all api routes relating to state data are in this file


# route used to get all states names to show in the UI in a dropdown. This route is protected:
@app.route('/api/states', methods=['GET'])
@token_required
def get_states(current_user):
    # order by state name in descending order:
    states = State.query.order_by(State.name.asc()).all()

    # convert query data to array of python dictionaries.
    response = []
    for state in states:
        response.append({"state_id": state.id, "name": state.name})

    # jsonify response and send with status 200

    return jsonify(response), 200


# route to post state data and insert in database. This route is protected.
@app.route('/api/data', methods=['POST'])
@token_required
def add_data(current_user):
    statedata = request.get_json()

    print(f"inserting: \n {statedata}")

    # initialize new array to keep model objects
    objects = []
    try:
        # loop throught the JSON array of data, create new objects for each and add them to objects array.
        for data in statedata:
            newdata = StateData(
                newcases=data['newcases'], state_id=data['state_id'])
            objects.append(newdata)

        # finally, bulk insert all the objects in the database in one go and commit the database to save changes.
        db.session.bulk_save_objects(objects)
        db.session.commit()
    except:
        # if the insert results in an error (example type errors, null errors), return error
        return jsonify({'message': 'invalid request!'}), 400

    return jsonify({'message': "done!"}), 200


# get total cases in all states.
@app.route('/api/data', methods=['GET'])
def get_data():

    states = State.query.all()

    response = []

    # LOOP through all states, computer their total case count and add their total cases to the response.
    for state in states:
        stateData = {"state_id": state.id}
        stateData['total_cases'] = 0
        for data in state.data:
            stateData['total_cases'] += data.newcases
        response.append(stateData)

    return jsonify(response), 200
