# file for managing migrations from SQLAlchemy to the database, this is not in use when the server is running
import os
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from app import app, db
from models import User, State, StateData


migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)


if __name__ == '__main__':
    manager.run()
