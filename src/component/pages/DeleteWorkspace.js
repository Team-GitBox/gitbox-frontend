import React from 'react';
import { useParams } from 'react-router-dom';

function DeleteWorkspace() {
  const { workspace } = useParams(); // URL에서 workspace 파라미터 값을 가져옵니다.

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3030/workspace/${workspace}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Something went wrong with the delete request');
      }

      alert("Workspace successfully deleted");
    } catch (error) {
      console.error('Error:', error);
      alert("Failed to delete the workspace");
    }
  };

  return (
    <div>
      <h2>Delete Workspace</h2>
      <p>Are you sure you want to delete this workspace?</p>
      <button onClick={handleDelete}>Delete Workspace</button>
    </div>
  );
}

export default DeleteWorkspace;