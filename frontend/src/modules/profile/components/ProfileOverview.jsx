import { ADMIN_OVERVIEW_SECTIONS, OVERVIEW_SECTIONS } from "../profile.config.js";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });
}

function displayValue(profile, item) {
  const raw = profile[item.key] || (item.fallbackKey ? profile[item.fallbackKey] : "");
  const value = item.format === "date" ? formatDate(raw) : raw;
  return value && value !== "NA" ? String(value) : "";
}

// Overview tab: About + grouped icon cards.
export function ProfileOverview({ profile }) {
  const sections = profile.role === "admin" ? ADMIN_OVERVIEW_SECTIONS : OVERVIEW_SECTIONS;
  return (
    <div className="profile-overview">
      {profile.role !== "admin" && (
        <section>
          <h6 className="profile-section-title">About</h6>
          <p className={`profile-about ${profile.about ? "" : "is-empty"}`}>{profile.about || "Nothing added yet."}</p>
        </section>
      )}
      {sections.map((section) => (
        <section key={section.title}>
          <h6 className="profile-section-title">{section.title}</h6>
          <div className="profile-info-grid">
            {section.items.map((item) => {
              const value = displayValue(profile, item);
              return (
                <div className="profile-info" key={item.key}>
                  <div className="profile-info-icon"><i className={`bi ${item.icon}`} /></div>
                  <div className="profile-info-text">
                    <span>{item.label}</span>
                    <strong className={value ? "" : "is-empty"}>{value || "Not added"}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
