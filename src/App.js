import React, { useState } from 'react';
import UserProfile from './components/UserProfile';
import './App.css';
import './UserProfile.css';

function App() {
    const [username, setUsername] = useState("");
  
    return (
      <div className="app-container">
        <h1>GitHub Dashboard</h1>
        <input
          type="text"
          placeholder="Enter GitHub username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}  // Ενημέρωση του username στο state
          className="search-input"
        />
        
        {/* Εμφάνιση του προφίλ και των repositories μόνο αν υπάρχει username */}
        {username && <UserProfile username={username} />}  
      </div>
    );
  }
  
  export default App;

  