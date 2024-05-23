# app.py
from flask import Flask, jsonify
from init_db import init_database
from models.database import db
from flask_swagger_ui import get_swaggerui_blueprint
from flask_cors import CORS
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Configure SQLAlchemy to use SQLite
    #app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://postgres:goatedpassword@localhost:5432/electro_scooterdb'
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///matches_database.db'

    # Init the JWT
    # Configuration
    app.config['SECRET_KEY'] = 'very-secret-key'
    app.config["JWT_SECRET_KEY"] = "jwt-key"
    app.config['JWT_TOKEN_LOCATION'] = ['headers']

    jwt = JWTManager(app)

    db.init_app(app)


    SWAGGER_URL = '/swagger'
    API_URL = '/static/swagger.json'
    SWAGGER_BLUEPRINT = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={
            'app-name': 'HOOPALYTIX API'
        }
    )

    app.register_blueprint(SWAGGER_BLUEPRINT, url_prefix = SWAGGER_URL)

    return app

if __name__ == "__main__":
    app = create_app()
    app = init_database(app)
    import routes
    app.run()