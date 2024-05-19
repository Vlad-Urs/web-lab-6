import React, { useState, useEffect } from 'react';
import db from '../utils/db'; // Import the database instance
import './AddMatchForm.css'; // Import the CSS file

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
    const allMatches = await db.matches.toArray();
    setMatches(allMatches);
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
      // Add the new match
      const id = await db.matches.add({
        date,
        points: Number(points),
        rebounds: Number(rebounds),
        assists: Number(assists),
        blocks: Number(blocks)
      });

      setStatus(`Match on ${date} successfully added.`);
      // Reset form fields
      setDate('');
      setPoints('');
      setRebounds('');
      setAssists('');
      setBlocks('');
      fetchMatches(); // Refresh the matches list
      updateAverages();
    } catch (error) {
      
    }
  }

  async function deleteMatch(id) {
    try {
      await db.matches.delete(id);
      setStatus(`Match with id ${id} deleted.`);
      fetchMatches(); // Refresh the matches list
    } catch (error) {
      setStatus(`Failed to delete match: ${error}`);
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
