from flask import Flask, request, jsonify
from functools import wraps
from models import User
import jwt
from app import app

# a utility decorator to verify the JWT in the header. This is used in protected routes like POST: /api/data etc


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        # if token is not present, the user is not logged in, so they cannot access the protected route
        if not token:
            return jsonify({'message': 'Please login!'}), 401

        # decode the token using the secret key and get the public id of the user from it. if no user found, token is invalid
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = User.query.filter_by(
                public_id=data['public_id']).first()
        except:
            return jsonify({'message': 'invalid token!'}), 401

        # if all tests pass, forward the current user data to the envoloped function route
        return f(current_user, *args, **kwargs)

    return decorated
