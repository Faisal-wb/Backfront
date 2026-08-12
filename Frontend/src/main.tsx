import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: "100vh", background: "#0c0c0e",
          color: "white", fontFamily: "monospace", padding: "32px", gap: "16px"
        }}>
          <div style={{ fontSize: "48px" }}>⚠️</div>
          <h1 style={{ color: "#ef4444", fontSize: "24px", margin: 0 }}>Runtime Error</h1>
          <p style={{ color: "#a1a1aa", fontSize: "14px", textAlign: "center", maxWidth: "600px" }}>
            {this.state.error.message}
          </p>
          <pre style={{
            background: "#1a1a1c", padding: "16px", borderRadius: "8px",
            fontSize: "11px", color: "#71717a", maxWidth: "700px", overflow: "auto",
            whiteSpace: "pre-wrap", wordBreak: "break-all"
          }}>
            {this.state.error.stack}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 24px", background: "#dc2626", color: "white",
              border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px"
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);