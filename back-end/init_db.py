from models.database import db
from models.match import Match

def init_database(app):
    with app.app_context():
        db.create_all()
    return app
