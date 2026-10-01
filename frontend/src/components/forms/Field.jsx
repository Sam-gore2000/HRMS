// Renders one form control from a field definition: { name, label, type, options }.
// Optional UI props: readOnly (locked, filled automatically), list (datalist id for suggestions), hint.
export function Field({ field, value, onChange, readOnly = false, list, hint, hintTone }) {
  const { name, label, type = "text", options = [] } = field;
  const handleChange = (event) => onChange(name, event.target.value);
  const className = `form-control${readOnly ? " field-locked" : ""}`;

  let control;
  if (type === "textarea") {
    control = <textarea className={className} name={name} value={value || ""} onChange={handleChange} rows="3" readOnly={readOnly} />;
  } else if (type === "select") {
    control = (
      <select className={`${className} form-select`} name={name} value={value || ""} onChange={handleChange} disabled={readOnly}>
        <option value="">Select</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    );
  } else {
    control = <input className={className} type={type} name={name} value={value || ""} onChange={handleChange} readOnly={readOnly} list={list} autoComplete={list ? "off" : undefined} />;
  }

  return (
    <label className="col-md-6">
      <span>{label}{readOnly && <i className="bi bi-lock-fill field-lock-icon" aria-label="read-only" />}</span>
      {control}
      {hint && <small className={`field-hint ${hintTone || ""}`.trim()}>{hint}</small>}
    </label>
  );
}
