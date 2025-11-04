import { useEffect, useState } from "react";
import "./App.css";
import BioForm from "./components/BioForm";
import Counter from "./components/Counter";
import { fetchHealth } from "./api/client";

function App() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    fetchHealth()
      .then((data) => setStatus(`Backend: ${data.status}`))
      .catch(() => setStatus("Backend not reachable"));
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 place-items-center h-screen">
        <div>
          <h1 className="text-4xl font-bold">Connection Test</h1>
          <p>{status}</p>
        </div>
        <Counter />
        <BioForm />
      </div>
    </>
  );
}

export default App;
