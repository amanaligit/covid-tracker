# **COVID-19 Tracker Project**

**About the project:**

A covid cases tracker for india using React, Flack and PostgreSQL

The project consists of a Flask backend and a React frontend, I have chosen to use a PostgreSQL database with flask_migrate library to migrate the model changes to the persistent database.

The entire project has been dockerized to make the development easier across platforms.

There are two images running for the project using docker-compose (check out docker-compose.yml in root folder for more details)

1. Flask app
2. PostgreSQL database

The database files are persistent as they are mounted as a volume in the docker container (the folder &quot;postgres-data&quot; persists the database files even after containers have been closed.

The React frontend source code is available in the /frontend directory. The latest production build is served by the Flask App and is available in the backend/build directory.

**Instructions for running the project:**

**Note: Docker and docker-compose is required in order to run this project on your computer (**[**https://docs.docker.com/compose/install/**](https://docs.docker.com/compose/install/)**). Compose is already included if you have a desktop system (windows and mac)**

1. Go to the root folder of the project where the docker-compose.yml file is located and open a terminal at this location.
2. Run command &quot;docker-compose up&quot;.
3. The project image will be built in some time and the Flask App will start running at port 5000 along with the database on port 5405. Just visit this URL in the browser to access the GUI: [http://localhost:5000/](http://localhost:5000/).
4. Here are the credentials for the PostgreSQL database if you wish to access it manually. The project image must be running to access the DB:
5. POSTGRES_USER: test
6. POSTGRES_PASSWORD: test
7. POSTGRES_DATABASE: covid
8. PORT: 5405
9. HOST: localhost
10. Any changes you make in the code will reflect live in the docker-containers as this is a dev-environment.
11. The PostgreSQL server runs as a container so there is no need to manually replicate the database locally to run the project. But if you wish to do so, I have attached three .sql files with table creation and alteration and some dummy data for the three tables: user, state and state_data. Note that all this is included in the database image anyways.
