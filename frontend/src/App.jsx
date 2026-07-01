import { useEffect, useState } from "react";

function App() {

  const [message, setMessage] = useState("");

  useEffect(() => {

    fetch("http://localhost:5001/api/resume")
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
      });

  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <h1>Smart Resume Analyzer</h1>

      <h2>{message}</h2>
    </div>
  );
}

export default App;