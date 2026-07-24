"use client";

import React from "react";
import { Button } from "antd";
import { ExclamationCircleOutlined, ReloadOutlined } from "@ant-design/icons";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-dark)",
        color: "var(--text-silver)",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div className="glass-panel" style={{ maxWidth: "540px", padding: "3rem 2rem" }}>
        <ExclamationCircleOutlined style={{ fontSize: "4rem", color: "#ff4d4f", marginBottom: "1rem" }} />

        <h2 className="font-sora" style={{ fontSize: "1.35rem", color: "#ffffff", marginBottom: "0.5rem" }}>
          SYSTEM EXCEPTION DETECTED
        </h2>

        <p className="font-geist" style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
          {error.message || "An unexpected system runtime error occurred on the portal."}
        </p>

        <Button
          type="primary"
          icon={<ReloadOutlined />}
          size="large"
          className="submit-btn-cyan"
          onClick={() => reset()}
        >
          RETRY SYSTEM PROTOCOL
        </Button>
      </div>
    </div>
  );
}
