import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddMatchForm.css'; // Import the CSS file

const BASE_URL = 'http://127.0.0.1:5000/api/matches';
const TOKEN_URL = 'http://127.0.0.1:5000/token';

export default function AddMatchForm() {
  const [date, setDate] = useState('');
  const [points, setPoints] = useState('');
  const [rebounds, setRebounds] = useState('');
  const [assists, setAssists] = useState('');
  const [blocks, setBlocks] = useState('');
  const [status, setStatus] = useState('');
  const [matches, setMatches] = useState([]);
  const [role, setRole] = useState('guest');
  const [token, setToken] = useState('');

  useEffect(() => {
    fetchToken(role);
  }, [role]);

  useEffect(() => {
    if (token) {
      fetchMatches();
    }
  }, [token]);

  async function fetchToken(role) {
    try {
      const response = await axios.get(TOKEN_URL, {
        params: { role },
      });
      setToken(response.data.jwt);
    } catch (error) {
      console.error('Error fetching token:', error);
      console.error('Error response:', error.response);
      setStatus('Failed to fetch token.');
    }
  }

  async function fetchMatches() {
    try {
      const response = await axios.get(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      console.error('Error response:', error.response);
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

      await axios.post(BASE_URL, newMatch, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      await axios.delete(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus(`Match with id ${id} deleted.`);
      fetchMatches(); // Refresh the matches list
    } catch (error) {
      setStatus(`Failed to delete match: ${error.message}`);
    }
  }

  return (
    <div className="form-container">
      <div className="role-switch">
        <label>Role: </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="guest">Guest</option>
        </select>
      </div>
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
      <button onClick={addMatch} disabled={role !== 'admin'}>
        Add Match
      </button>
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
                {role === 'admin' && (
                  <button onClick={() => deleteMatch(match.id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
