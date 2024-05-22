import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddMatchForm.css'; // Import the CSS file


const BASE_URL = 'http://127.0.0.1:5000/api/matches';

export default function AddMatchForm() {
  const [date, setDate] = useState('');
  const [points, setPoints] = useState('');
  const [rebounds, setRebounds] = useState('');
  const [assists, setAssists] = useState('');
  const [blocks, setBlocks] = useState('');
  const [status, setStatus] = useState('');
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    try {
      const response = await axios.get(BASE_URL);
      setMatches(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching matches:', error);
      setStatus('Failed to fetch matches.');
    }
  }

  function validateForm() {
    if (!date) {
      setStatus('Date is required.');
      return false;
    }
    if (points < 0 || rebounds < 0 || assists < 0 || blocks < 0) {
      setStatus('Points, rebounds, assists, and blocks cannot be negative.');
      return false;
    }
    return true;
  }

  async function addMatch() {
    if (!validateForm()) {
      return;
    }

    try {
      const newMatch = {
        date,
        points: Number(points),
        rebounds: Number(rebounds),
        assists: Number(assists),
        blocks: Number(blocks),
      };

      await axios.post(BASE_URL, newMatch);

      setStatus(`Match on ${date} successfully added.`);
      // Reset form fields
      setDate('');
      setPoints('');
      setRebounds('');
      setAssists('');
      setBlocks('');
      fetchMatches(); // Refresh the matches list
    } catch (error) {
      setStatus('Failed to add match.');
    }
  }

  async function deleteMatch(id) {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setStatus(`Match with id ${id} deleted.`);
      fetchMatches(); // Refresh the matches list
    } catch (error) {
      setStatus(`Failed to delete match: ${error.message}`);
    }
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Add a New Match</h2>
      <p className="status-message">{status}</p>
      <div className="form-horizontal">
        <div className="form-group">
          <label>Match Date:</label>
          <input
            type="date"
            value={date}
            onChange={(ev) => setDate(ev.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Points:</label>
          <input
            type="number"
            min="0"
            value={points}
            onChange={(ev) => setPoints(ev.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Rebounds:</label>
          <input
            type="number"
            min="0"
            value={rebounds}
            onChange={(ev) => setRebounds(ev.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Assists:</label>
          <input
            type="number"
            min="0"
            value={assists}
            onChange={(ev) => setAssists(ev.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Blocks:</label>
          <input
            type="number"
            min="0"
            value={blocks}
            onChange={(ev) => setBlocks(ev.target.value)}
          />
        </div>
      </div>
      <button onClick={addMatch}>Add Match</button>
      <h2 className="form-title">Matches</h2>
      <table className="matches-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Points</th>
            <th>Rebounds</th>
            <th>Assists</th>
            <th>Blocks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((match) => (
            <tr key={match.id}>
              <td>{match.date}</td>
              <td>{match.points}</td>
              <td>{match.rebounds}</td>
              <td>{match.assists}</td>
              <td>{match.blocks}</td>
              <td>
                <button onClick={() => deleteMatch(match.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
