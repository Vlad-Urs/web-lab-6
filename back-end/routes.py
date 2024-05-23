# Import necessary modules
from flask import request, jsonify
from functools import wraps
from models.database import db
from models.match import Match
from __main__ import app
from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token, get_jwt_identity,jwt_required, get_jwt, verify_jwt_in_request


@app.route('/token', methods=['GET'])
def get_token():
    if request.method == 'GET':
        role = request.args.get("role", type=str)
        access_token = create_access_token(
            identity="user", 
            expires_delta=timedelta(minutes=5),
            additional_claims={'role': role},
        )
        return jsonify({"jwt": access_token}), 200
    

def role_required(role):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if 'role' in claims and claims['role'] == role:
                return fn(*args, **kwargs)
            else:
                return jsonify({"msg": "Forbidden - You don't have access to this resource"}), 403
        return wrapper
    return decorator


@app.route('/api/matches', methods=['GET'])
@jwt_required()

def get_matches():
    matches = Match.query.all()
    return jsonify([match.serialize() for match in matches]), 200


@app.route('/api/matches', methods=['POST'])
@jwt_required()
@role_required('admin')
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
@role_required('admin')
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
@role_required('admin')
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
