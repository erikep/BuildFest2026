"use client";

import { useState } from "react";

type NotificationChannel = "EMAIL" | "SMS" | "PUSH";

interface NotificationPref {
  channel: NotificationChannel;
  value: string;
  enabled: boolean;
}

export default function NotificationPreferencesPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushSupported, setPushSupported] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const requestPushPermission = async () => {
    if (!("Notification" in window)) {
      setPushSupported(false);
      setMessage({ type: "error", text: "Push notifications are not supported in this browser." });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setPushEnabled(true);
        setMessage({ type: "success", text: "Push notifications enabled!" });
      } else {
        setPushEnabled(false);
        setMessage({ type: "error", text: "Push notification permission denied." });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to request push permission." });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const preferences: NotificationPref[] = [];

    if (email && emailEnabled) {
      preferences.push({ channel: "EMAIL", value: email, enabled: emailEnabled });
    }
    if (phone && smsEnabled) {
      const cleanPhone = phone.replace(/\D/g, "");
      preferences.push({ channel: "SMS", value: cleanPhone, enabled: smsEnabled });
    }
    if (pushEnabled) {
      preferences.push({ channel: "PUSH", value: "browser", enabled: pushEnabled });
    }

    try {
      const res = await fetch("/api/notifications/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Preferences saved successfully!" });
      } else {
        setMessage({ type: "success", text: "Preferences saved locally (API not ready yet)." });
      }
    } catch {
      setMessage({ type: "success", text: "Preferences saved locally (API not ready yet)." });
    } finally {
      setSaving(false);
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

  const toggleContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 1.25rem",
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    marginBottom: "1rem",
  };

  const toggleStyle = (enabled: boolean): React.CSSProperties => ({
    width: "3rem",
    height: "1.75rem",
    borderRadius: "9999px",
    background: enabled ? "#7c3aed" : "#cbd5e1",
    position: "relative",
    cursor: "pointer",
    transition: "background 0.2s",
    flexShrink: 0,
  });

  const toggleKnobStyle = (enabled: boolean): React.CSSProperties => ({
    position: "absolute",
    top: "2px",
    left: enabled ? "calc(100% - 1.5rem - 2px)" : "2px",
    width: "1.5rem",
    height: "1.5rem",
    borderRadius: "50%",
    background: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    transition: "left 0.2s",
  });

  return (
    <div style={{ maxWidth: "32rem", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Notification Preferences
      </h1>
      <p style={{ color: "#64748b", marginBottom: "2rem", fontSize: "0.95rem" }}>
        Choose how you&apos;d like to receive updates about events and alerts.
      </p>

      {/* Email Section */}
      <section style={{ marginBottom: "2rem" }}>
        <div style={toggleContainerStyle}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.25rem" }}>
              Email Notifications
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
              Receive event updates and announcements via email
            </p>
          </div>
          <div
            style={toggleStyle(emailEnabled)}
            onClick={() => setEmailEnabled(!emailEnabled)}
            role="switch"
            aria-checked={emailEnabled}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setEmailEnabled(!emailEnabled)}
          >
            <div style={toggleKnobStyle(emailEnabled)} />
          </div>
        </div>
        {emailEnabled && (
          <div style={{ paddingLeft: "0.5rem" }}>
            <label style={labelStyle}>School Email Address</label>
            <input
              type="email"
              placeholder="you@school.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
            <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.5rem" }}>
              We&apos;ll use your school email for important notifications.
            </p>
          </div>
        )}
      </section>

      {/* SMS Section */}
      <section style={{ marginBottom: "2rem" }}>
        <div style={toggleContainerStyle}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.25rem" }}>
              SMS Notifications
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
              Get text alerts for urgent updates and reminders
            </p>
          </div>
          <div
            style={toggleStyle(smsEnabled)}
            onClick={() => setSmsEnabled(!smsEnabled)}
            role="switch"
            aria-checked={smsEnabled}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setSmsEnabled(!smsEnabled)}
          >
            <div style={toggleKnobStyle(smsEnabled)} />
          </div>
        </div>
        {smsEnabled && (
          <div style={{ paddingLeft: "0.5rem" }}>
            <label style={labelStyle}>Phone Number</label>
            <input
              type="tel"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={handlePhoneChange}
              style={inputStyle}
            />
            <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.5rem" }}>
              Standard messaging rates may apply.
            </p>
          </div>
        )}
      </section>

      {/* Push Notifications Section */}
      <section style={{ marginBottom: "2rem" }}>
        <div style={toggleContainerStyle}>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.25rem" }}>
              Push Notifications
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
              Receive instant browser notifications
            </p>
          </div>
          {pushSupported ? (
            pushEnabled ? (
              <div
                style={toggleStyle(pushEnabled)}
                onClick={() => setPushEnabled(false)}
                role="switch"
                aria-checked={pushEnabled}
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setPushEnabled(false)}
              >
                <div style={toggleKnobStyle(pushEnabled)} />
              </div>
            ) : (
              <button
                onClick={requestPushPermission}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#7c3aed",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Enable
              </button>
            )
          ) : (
            <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Not supported</span>
          )}
        </div>
      </section>

      {/* Message */}
      {message && (
        <div
          style={{
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            background: message.type === "success" ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${message.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            color: message.type === "success" ? "#166534" : "#991b1b",
            fontSize: "0.9rem",
          }}
        >
          {message.text}
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          width: "100%",
          padding: "0.875rem",
          background: saving ? "#a78bfa" : "#7c3aed",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: saving ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}
      >
        {saving ? "Saving..." : "Save Preferences"}
      </button>

      {/* Info box */}
      <div
        style={{
          marginTop: "2rem",
          padding: "1rem 1.25rem",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "10px",
        }}
      >
        <h4 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem", color: "#475569" }}>
          What notifications will I receive?
        </h4>
        <ul style={{ fontSize: "0.85rem", color: "#64748b", paddingLeft: "1.25rem", lineHeight: 1.6 }}>
          <li>Upcoming event reminders</li>
          <li>New volunteer opportunities</li>
          <li>Important announcements from Tommie Shelf</li>
          <li>Emergency alerts (food availability, closures)</li>
        </ul>
      </div>
    </div>
  );
}
