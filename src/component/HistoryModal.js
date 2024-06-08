import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HistoryModal.css';

function HistoryModal({ workspaceId, onClose }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await axios.get(`/api/workspace/${workspaceId}/history`);
        setHistory(response.data);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    }

    fetchHistory();
  }, [workspaceId]);

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>History</h2>
        <ul>
          {history.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HistoryModal;