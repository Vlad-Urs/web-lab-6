# Import necessary modules
from flask import request, jsonify
from models.database import db
from models.match import Match
from __main__ import app
from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token, get_jwt_identity,jwt_required, get_jwt


@app.route('/token', methods=['GET'])
def get_token():
    if request.method == 'GET':
        access_token = create_access_token(
            identity="admin", 
            expires_delta=timedelta(minutes=5),
            additional_claims={'role': request.args.get("role", type=str)},
        )
        return jsonify({"jwt": access_token}), 200


@app.route('/api/matches', methods=['GET'])
@jwt_required()
def get_matches():
    matches = Match.query.all()
    return jsonify([match.serialize() for match in matches]), 200


@app.route('/api/matches', methods=['POST'])
@jwt_required()
def create_match():
    try:
        # Get data from the request body
        data = request.get_json()
        # Validate and extract required parameters
        date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        points = data['points']
        rebounds = data['rebounds']
        assists = data['assists']
        blocks = data['blocks']
        # Create a new Match
        match = Match(date=date, points=points, rebounds=rebounds, assists=assists, blocks=blocks)
        # Add the Match to the database
        db.session.add(match)
        db.session.commit()
        return jsonify({"message": "Match created successfully"}), 201
    except KeyError:
        return jsonify({"error": "Invalid request data"}), 400
    

@app.route('/api/matches/<int:match_id>', methods=['GET'])
@jwt_required()
def get_match_by_id(match_id):
    # Find the Match by ID
    match = Match.query.get(match_id)
    if match is not None:
        return jsonify(match.serialize()), 200
    else:
        return jsonify({"error": "Match not found"}), 404
    

@app.route('/api/matches/<int:match_id>', methods=['PUT'])
@jwt_required()
def update_match(match_id):
    try:
        # Find the Match by ID
        match = Match.query.get(match_id)
        if match is not None:
            # Get data from the request body
            data = request.get_json()
            # Update the Match properties
            match.date = datetime.strptime(data.get('date',match.date), '%Y-%m-%d').date()
            match.points = data.get('points', match.points)
            match.rebounds = data.get('rebounds', match.rebounds)
            match.assists = data.get('assists', match.assists)
            match.blocks = data.get('blocks', match.blocks)
            db.session.commit()
            return jsonify({"message": "Match updated successfully"}), 200
        else:
            return jsonify({"error": "Match not found"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/matches/<int:match_id>', methods=['DELETE'])
@jwt_required()
def delete_match(match_id):
    try:
        # Find the Match by ID
        match = Match.query.get(match_id)
        if match is not None:
            db.session.delete(match)
            db.session.commit()
            return jsonify({"message": "Match deleted successfully"}), 200
        else:
            return jsonify({"error": "Match not found"}), 404
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
