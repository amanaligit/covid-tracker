from app import db

# All database model classes definition. each model corresponds to a table in our postgres database


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # To uniquely identify a user (pk is not make public):
    public_id = db.Column(db.String(50), unique=True)
    email = db.Column(db.String(50), nullable=False)
    # stores password hash of the user, not the password itself
    password = db.Column(db.String(80), nullable=False)
    # true if the user is an admin:
    admin = db.Column(db.Boolean, nullable=False)
    phone = db.Column(db.String(20), nullable=False)


class State(db.Model):
    # Contains all the possible states in India. This is separate from StateData so that no user can specify random states which may not even exist.
    # hence this table cannot be inserted/update by any API call
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    # Back-referece from the StateData model
    data = db.relationship('StateData', backref='state', lazy=True)


class StateData(db.Model):
    # Contains the records inserted by the user. Each record contains reference (foreign key) to the State table to uniquely identify the state
    id = db.Column(db.Integer, primary_key=True)
    newcases = db.Column(db.Integer, nullable=False)
    state_id = db.Column(db.Integer, db.ForeignKey('state.id'),
                         nullable=False)
