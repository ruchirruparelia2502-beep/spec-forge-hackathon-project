import { useEffect, useState } from "react";
import { call } from "./api";
import Settings from "./Settings";

export default function App() {
  const [open, setOpen] = useState(false);
  const [health, setHealth] = useState("checking...");
  useEffect(() => { call<{ status: string }>("/health").then((d) => setHealth(d.status)).catch(() => setHealth("server not reachable")); }, []);

  return (
    <>
      <header className="bar">
        <h1>SpecForge</h1>
        <span className="pill">Server: {health}</span>
        <button className="ghost" onClick={() => setOpen(true)} aria-label="Settings">Settings (gear)</button>
      </header>
      <main>
        <p>Level 0 is done: the server runs and the AI key panel works. Build Level 1 here.</p>
      </main>
      {open && <Settings onClose={() => setOpen(false)} />}
    </>
  );
}
