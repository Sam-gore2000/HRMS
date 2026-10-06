import { useEffect, useState } from "react";
import { useDialog } from "../../components/feedback/DialogProvider.jsx";
import { attendanceApi } from "../attendance/attendanceApi.js";

const shortDate = (value) => new Date(value).toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });
const signed = (value) => (value > 0 ? `+${value}` : String(value));

// Admin form: set the balance to a number, or add / remove days, with a reason.
function AdjustForm({ balance, onSaved, onCancel }) {
  const [mode, setMode] = useState("set");
  const [days, setDays] = useState(balance.balance ?? "");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const dialog = useDialog();

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const result = await attendanceApi.adjustLeaveBalance({ emp_id: balance.empid, mode, days, reason });
      onSaved(result.data);
      dialog.success("Leave balance updated", `Available balance is now ${result.data.balance} days.`);
    } catch (error) {
      dialog.error("Couldn't update balance", error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="lb-adjust" onSubmit={submit}>
      <div className="lb-modes" role="radiogroup" aria-label="Adjustment type">
        <button type="button" role="radio" aria-checked={mode === "set"} className={mode === "set" ? "active" : ""} onClick={() => { setMode("set"); setDays(balance.balance ?? ""); }}>Set balance to</button>
        <button type="button" role="radio" aria-checked={mode === "add"} className={mode === "add" ? "active" : ""} onClick={() => { setMode("add"); setDays(""); }}>Add / remove days</button>
      </div>
      <label>
        <span>{mode === "set" ? "New available balance (days)" : "Days to add (use - to remove, e.g. -1.5)"}</span>
        <input className="form-control" type="number" step="0.5" min={mode === "set" ? 0 : undefined} value={days} onChange={(event) => setDays(event.target.value)} required />
      </label>
      <label>
        <span>Reason</span>
        <input className="form-control" value={reason} onChange={(event) => setReason(event.target.value)} placeholder="e.g. Carry forward from previous HRM" maxLength={300} required />
      </label>
      <div className="lb-adjust-actions">
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel} disabled={saving}>Cancel</button>
        <button type="submit" className="btn btn-success" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
      </div>
    </form>
  );
}

// Paid leave: earned (1.5 per month from joining) + admin adjustments - used (approved) = available.
// empId: whose balance (blank = the signed-in user). editable: admin may adjust it.
export function LeaveBalanceCard({ empId = "", refreshKey = 0, compact = false, editable = false }) {
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");
  const [adjusting, setAdjusting] = useState(false);

  useEffect(() => {
    let alive = true;
    setAdjusting(false);
    attendanceApi.leaveBalance(empId)
      .then((result) => { if (alive) { setBalance(result.data); setError(""); } })
      .catch((err) => alive && setError(err.message));
    return () => { alive = false; };
  }, [empId, refreshKey]);

  if (error) return compact ? null : <p className="lb-note">{error}</p>;
  if (!balance) return null;

  const adjustButton = editable && !adjusting && (
    <button type="button" className="btn btn-outline-secondary btn-sm lb-adjust-btn" onClick={() => setAdjusting(true)}><i className="bi bi-pencil-square" /> Adjust</button>
  );
  const form = adjusting && <AdjustForm balance={balance} onSaved={(next) => { setBalance(next); setAdjusting(false); }} onCancel={() => setAdjusting(false)} />;

  if (balance.balance === null) {
    return (
      <div className={`lb-card ${compact ? "compact" : ""}`}>
        <div className="lb-head"><strong>Paid Leave Balance</strong>{adjustButton}</div>
        <p className="lb-note"><i className="bi bi-info-circle" /> {balance.note}.{editable ? " Add the joining date in Employee Details, or set a balance with Adjust." : " HR can add it in Employee Details."}</p>
        {form}
      </div>
    );
  }

  const items = [
    { label: "Available", value: balance.balance, main: true },
    { label: "Earned", value: balance.earned },
    ...(balance.adjusted ? [{ label: "Adjusted", value: signed(balance.adjusted) }] : []),
    { label: "Used", value: balance.used },
    { label: compact ? "Pending" : "Pending approval", value: balance.pending }
  ];
  return (
    <div className={`lb-card ${compact ? "compact" : ""}`}>
      <div className="lb-head">
        <div>
          <strong>Paid Leave Balance</strong>
          <span>{balance.joined ? `${balance.per_month} days per month since ${shortDate(`${balance.joined}T00:00:00`)}` : "Set manually (no joining date)"}</span>
        </div>
        {adjustButton}
      </div>
      <div className="lb-grid">
        {items.map((item) => (
          <div key={item.label} className={item.main ? "lb-main" : ""}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
      {form}
      {editable && balance.adjustments?.length > 0 && (
        <details className="lb-history">
          <summary>Adjustment history ({balance.adjustments.length})</summary>
          <ul>
            {balance.adjustments.map((item) => (
              <li key={item._id}>
                <strong className={item.days > 0 ? "plus" : "minus"}>{signed(item.days)}</strong>
                <span>{item.reason}</span>
                <small>{item.balance_before} → {item.balance_after} · {item.by} · {shortDate(item.createdAt)}</small>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
