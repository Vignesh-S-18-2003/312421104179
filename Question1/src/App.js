import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState(null);

  const fetchData = async () => {
    try {
      const result = await axios.get(`http://localhost:3000/numbers/${input}`);
      setResponse(result.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Average Calculator</h1>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter ID (e, p, f, r)"
        />
        <button onClick={fetchData}>Fetch Numbers</button>
        {response && (
          <div>
            <h2>Response</h2>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
