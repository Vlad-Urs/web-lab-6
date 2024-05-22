# models/match.py
from models.database import db

class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    points = db.Column(db.Integer, nullable=False)
    rebounds = db.Column(db.Integer, nullable=False)
    assists = db.Column(db.Integer, nullable=False)
    blocks = db.Column(db.Integer, nullable=False)

    def __init__(self, date, points, rebounds, assists, blocks):
        self.date = date
        self.points = points
        self.rebounds = rebounds
        self.assists = assists
        self.blocks = blocks

    def serialize(self):
        return {
            'id': self.id,
            'date': self.date,
            'points': self.points,
            'rebounds': self.rebounds,
            'assists': self.assists,
            'blocks': self.blocks
        }
