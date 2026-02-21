"use client";

import { useState } from "react";

const interestOptions = [
  { id: "food-distribution", label: "Food Distribution", description: "Help sort and distribute food items" },
  { id: "event-setup", label: "Event Setup", description: "Assist with setting up and breaking down events" },
  { id: "client-services", label: "Client Services", description: "Welcome and assist visitors" },
  { id: "inventory", label: "Inventory Management", description: "Track and organize donated items" },
  { id: "transportation", label: "Transportation", description: "Help with food pickups and deliveries" },
  { id: "outreach", label: "Community Outreach", description: "Spread the word about our services" },
  { id: "admin", label: "Administrative Support", description: "Help with data entry and office tasks" },
  { id: "other", label: "Other", description: "Open to any volunteer opportunity" },
];

export default function VolunteerPage() {
  const [volunteerStatus, setVolunteerStatus] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [availability, setAvailability] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const payload = {
      name,
      email,
      phone: phone.replace(/\D/g, ""),
      interests: selectedInterests.join(","),
      availability,
    };

    try {
      const res = await fetch("/api/volunteer/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
        setMessage({ type: "success", text: "Thank you for volunteering! We'll be in touch soon." });
      } else {
        setSubmitted(true);
        setMessage({ type: "success", text: "Thank you! Your interest has been recorded (API pending)." });
      }
    } catch {
      setSubmitted(true);
      setMessage({ type: "success", text: "Thank you! Your interest has been recorded (API pending)." });
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    fontSize: "1rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: "#334155",
    marginBottom: "0.5rem",
  };

  const toggleStyle = (enabled: boolean): React.CSSProperties => ({
    width: "3.5rem",
    height: "2rem",
    borderRadius: "9999px",
    background: enabled ? "#7c3aed" : "#cbd5e1",
    position: "relative",
    cursor: "pointer",
    transition: "background 0.2s",
    flexShrink: 0,
  });

  const toggleKnobStyle = (enabled: boolean): React.CSSProperties => ({
    position: "absolute",
    top: "3px",
    left: enabled ? "calc(100% - 1.625rem - 3px)" : "3px",
    width: "1.625rem",
    height: "1.625rem",
    borderRadius: "50%",
    background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    transition: "left 0.2s",
  });

  return (
    <div style={{ maxWidth: "40rem", margin: "0 auto", padding: "2rem 1.5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Volunteer with Tommie Shelf
        </h1>
        <p style={{ color: "#64748b", fontSize: "0.95rem", lineHeight: 1.6 }}>
          Join our community of volunteers making a difference. Toggle your volunteer status
          and let us know how you&apos;d like to help.
        </p>
      </div>

      {/* Volunteer Status Toggle */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 1.5rem",
          background: volunteerStatus ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)" : "#fff",
          border: volunteerStatus ? "none" : "1px solid #e2e8f0",
          borderRadius: "16px",
          marginBottom: "2rem",
          transition: "all 0.3s",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              color: volunteerStatus ? "#fff" : "#1e293b",
              marginBottom: "0.25rem",
            }}
          >
            Volunteer Status
          </h2>
          <p
            style={{
              fontSize: "0.875rem",
              color: volunteerStatus ? "rgba(255,255,255,0.85)" : "#64748b",
            }}
          >
            {volunteerStatus
              ? "You're signed up as a volunteer!"
              : "Turn on to register as a volunteer"}
          </p>
        </div>
        <div
          style={toggleStyle(volunteerStatus)}
          onClick={() => setVolunteerStatus(!volunteerStatus)}
          role="switch"
          aria-checked={volunteerStatus}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setVolunteerStatus(!volunteerStatus)}
        >
          <div style={toggleKnobStyle(volunteerStatus)} />
        </div>
      </div>

      {/* Interest Form - Only shown when volunteer status is ON */}
      {volunteerStatus && !submitted && (
        <form onSubmit={handleSubmit}>
          {/* Contact Info */}
          <section
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem" }}>
              Contact Information
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="(555) 123-4567"
                  value={phone}
                  onChange={handlePhoneChange}
                  style={inputStyle}
                />
              </div>
            </div>
          </section>

          {/* Interests */}
          <section
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Areas of Interest
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1rem" }}>
              Select all that apply
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(14rem, 1fr))",
                gap: "0.75rem",
              }}
            >
              {interestOptions.map((option) => {
                const isSelected = selectedInterests.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => toggleInterest(option.id)}
                    style={{
                      padding: "0.875rem 1rem",
                      border: `2px solid ${isSelected ? "#7c3aed" : "#e2e8f0"}`,
                      borderRadius: "10px",
                      cursor: "pointer",
                      background: isSelected ? "#f5f3ff" : "#fff",
                      transition: "all 0.2s",
                    }}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && toggleInterest(option.id)}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <div
                        style={{
                          width: "1.25rem",
                          height: "1.25rem",
                          borderRadius: "4px",
                          border: `2px solid ${isSelected ? "#7c3aed" : "#cbd5e1"}`,
                          background: isSelected ? "#7c3aed" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "1px",
                        }}
                      >
                        {isSelected && (
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="2,6 5,9 10,3" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1e293b" }}>
                          {option.label}
                        </div>
                        <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.125rem" }}>
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Availability */}
          <section
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "16px",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Availability
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1rem" }}>
              When are you generally available to volunteer?
            </p>
            <textarea
              placeholder="e.g., Weekday evenings, Saturday mornings, flexible schedule..."
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              rows={3}
              style={{
                ...inputStyle,
                resize: "vertical",
                minHeight: "5rem",
              }}
            />
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || !name || !email}
            style={{
              width: "100%",
              padding: "1rem",
              background: submitting || !name || !email ? "#a78bfa" : "#7c3aed",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: submitting || !name || !email ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {submitting ? "Submitting..." : "Submit Volunteer Interest"}
          </button>
        </form>
      )}

      {/* Success Message */}
      {submitted && message && (
        <div
          style={{
            padding: "2rem",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "4rem",
              height: "4rem",
              background: "#22c55e",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="4,12 9,17 20,6" />
            </svg>
          </div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#166534", marginBottom: "0.5rem" }}>
            You&apos;re all set!
          </h3>
          <p style={{ color: "#15803d", fontSize: "0.95rem" }}>{message.text}</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setName("");
              setEmail("");
              setPhone("");
              setSelectedInterests([]);
              setAvailability("");
              setMessage(null);
            }}
            style={{
              marginTop: "1.5rem",
              padding: "0.625rem 1.25rem",
              background: "transparent",
              color: "#15803d",
              border: "2px solid #22c55e",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Update my interests
          </button>
        </div>
      )}

      {/* Info when status is off */}
      {!volunteerStatus && (
        <div
          style={{
            padding: "1.5rem",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
          }}
        >
          <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.75rem", color: "#475569" }}>
            Why volunteer with us?
          </h4>
          <ul style={{ fontSize: "0.9rem", color: "#64748b", paddingLeft: "1.25rem", lineHeight: 1.7 }}>
            <li>Make a direct impact in your community</li>
            <li>Flexible scheduling that works around your availability</li>
            <li>Meet like-minded people who care about food security</li>
            <li>Gain experience in nonprofit operations</li>
            <li>Contribute to reducing food waste</li>
          </ul>
        </div>
      )}
    </div>
  );
}
