# contains all the routes relating to autherization and authentication

from app import app, db, cors
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps
from models import User, State, StateData
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from utils.check_token import token_required
from flask_cors import CORS, cross_origin
import re


# Get all users. Requesting user must be an admin.
@app.route('/auth/user', methods=['GET'])
@token_required
def get_all_users(current_user):

    if not current_user.admin:
        return jsonify({'message': 'Cannot perform that function!'})

    users = User.query.all()

    output = []

    for user in users:
        user_data = {}
        user_data['public_id'] = user.public_id
        user_data['email'] = user.email
        user_data['password'] = user.password
        user_data['admin'] = user.admin
        output.append(user_data)

    return jsonify({'users': output})

# fetch a particular user from the database of a unique public id. requesting user must be an admin.


@app.route('/auth/user/<public_id>', methods=['GET'])
@token_required
def get_one_user(current_user, public_id):

    if not current_user.admin:
        return jsonify({'message': 'Cannot perform that function!'})

    user = User.query.filter_by(public_id=public_id).first()

    if not user:
        return jsonify({'message': 'No user found!'})

    user_data = {}
    user_data['public_id'] = user.public_id
    user_data['email'] = user.email
    user_data['password'] = user.password
    user_data['admin'] = user.admin

    return jsonify({'user': user_data})


# used to register a new user.
@app.route('/auth/user', methods=['POST'])
def create_user():
    # convert the request data from raw json to a python dictionary:
    data = request.get_json()

    # if a user with the email alreadyt exists, return error:
    if User.query.filter_by(email=data['email']).count() != 0:
        return jsonify({'message': 'The email is already taken!'}), 409

    # server side verification of the user credentials, we also have client side verification in frotend
    try:
        # verify all credentials using regular expressions and throw an error if any of them does not match
        assert(re.search(
            "^([a-zA-Z0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[*.!@$%^&(){}[])[A-Za-z\d@$!%*#?&]{8,24}$", data['password']) is not None)
        assert(re.search(
            "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$", data['email']) is not None)
        assert(re.search(
            "^[6-9]\d{9}$", data['phone']) is not None)
        assert(data['passwordConfirmation'] == data['password'])
    except:
        return jsonify({'message': 'invalid request!'}), 400

    # create new hashed password. Hashed password is saved in database not the actual password for security reasons.
    hashed_password = generate_password_hash(data['password'], method='sha256')

    # create the new user and commit changes to database.
    new_user = User(public_id=str(uuid.uuid4()),
                    email=data['email'], password=hashed_password, phone=data['phone'], admin=False)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'New user created!'}), 200


# give admin priviledges to a user from their public_id
@app.route('/auth/user/<public_id>', methods=['PUT'])
@token_required
def promote_user(current_user, public_id):
    if not current_user.admin:
        return jsonify({'message': 'Cannot perform that function!'})

    user = User.query.filter_by(public_id=public_id).first()

    if not user:
        return jsonify({'message': 'No user found!'})

    user.admin = True
    db.session.commit()

    return jsonify({'message': 'The user has been promoted!'})


# delete a user
@app.route('/auth/user/<public_id>', methods=['DELETE'])
@token_required
def delete_user(current_user, public_id):
    if not current_user.admin:
        return jsonify({'message': 'Cannot perform that function!'})

    user = User.query.filter_by(public_id=public_id).first()

    if not user:
        return jsonify({'message': 'No user found!'})

    db.session.delete(user)
    db.session.commit()

    return jsonify({'message': 'The user has been deleted!'})


# login an existing user;
@app.route('/auth/login', methods=['POST'])
def login():

    auth = request.get_json()

    # if email or password is not in request, its an invalid request
    if not auth or not auth['email'] or not auth['password']:
        return jsonify({'message': "Information not complete"}), 403

    # query for the user and if the user does not exist, return 404 error
    user = User.query.filter_by(email=auth['email']).first()

    if not user:
        return jsonify({'message': "user does not exist"}), 404

    # verify the password hash witht the stored hash, if the match create a token and return.
    #  Token will be used for authentication in subsequent requests for protected routes.
    if check_password_hash(user.password, auth['password']):
        token = jwt.encode({'public_id': user.public_id, 'exp': datetime.datetime.utcnow(
        ) + datetime.timedelta(minutes=200)}, app.config['SECRET_KEY'])

        return jsonify({'token': token.decode('UTF-8')}), 200

    return jsonify({'message': "Incorrect Password!"}), 403


if __name__ == '__main__':
    app.run(debug=True)
