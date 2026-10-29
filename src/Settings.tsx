import { useState } from "react";
import { call, clearKey, DEFAULT_MODELS, loadSettings, saveSettings, type Provider } from "./api";

export default function Settings({ onClose }: { onClose: () => void }) {
  const [s, setS] = useState(loadSettings());
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const update = (patch: Partial<typeof s>) => { const n = { ...s, ...patch }; setS(n); saveSettings(n); setMsg(null); };

  async function test() {
    setBusy(true); setMsg(null);
    try { const r = await call<{ model: string }>("/llm-check"); setMsg({ ok: true, text: `Key works with ${r.model}.` }); }
    catch (e) { setMsg({ ok: false, text: (e as Error).message }); }
    finally { setBusy(false); }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Settings">
      <div className="panel">
        <h2>AI settings</h2>
        <p className="hint">Your key stays in this browser. The server uses it for one request at a time and never saves it.</p>
        <label>Provider
          <select value={s.provider} onChange={(e) => update({ provider: e.target.value as Provider, model: "" })}>
            <option value="gemini">Google Gemini</option>
            <option value="openrouter">OpenRouter</option>
            <option value="anthropic">Anthropic (Claude)</option>
          </select>
        </label>
        <label>API key
          <input type="password" autoComplete="off" value={s.key} onChange={(e) => update({ key: e.target.value })} placeholder="Paste your key" />
        </label>
        <label>Model
          <input value={s.model} onChange={(e) => update({ model: e.target.value })} placeholder={DEFAULT_MODELS[s.provider]} />
        </label>
        <div className="row">
          <button onClick={test} disabled={busy || !s.key}>{busy ? "Testing..." : "Test key"}</button>
          <button className="ghost" onClick={() => { clearKey(); setS(loadSettings()); setMsg(null); }}>Clear key</button>
          <button className="ghost" onClick={onClose}>Close</button>
        </div>
        {msg && <p role="status" className={msg.ok ? "good" : "bad"}>{msg.text}</p>}
      </div>
    </div>
  );
}
