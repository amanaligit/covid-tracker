# this is the main file that gets called when we run the server. it just imports the app and database from other files and runs the server
# run server by "python main.py"

from app import app, db
import routes.auth
import routes.stateData

# if this file is main fie, run the server
if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')
