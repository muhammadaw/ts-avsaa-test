"use client";

import React from "react";
import Link from "next/link";
import { Button } from "antd";
import { WarningOutlined, HomeOutlined } from "@ant-design/icons";

export default function NotFound() {
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
        <WarningOutlined style={{ fontSize: "4rem", color: "var(--cyan-primary)", marginBottom: "1rem" }} />
        
        <h1 className="font-sora" style={{ fontSize: "3rem", fontWeight: 800, color: "#ffffff", marginBottom: "0.5rem" }}>
          404
        </h1>
        
        <h2 className="font-sora" style={{ fontSize: "1.25rem", color: "var(--cyan-primary)", marginBottom: "1rem" }}>
          NAVIGATION ROUTE NOT FOUND
        </h2>
        
        <p className="font-geist" style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "2rem" }}>
          The operational flight route or requested URL does not exist on the Astronacci Air Portal.
        </p>

        <Link href="/">
          <Button type="primary" icon={<HomeOutlined />} size="large" className="submit-btn-cyan">
            RETURN TO CREW DASHBOARD
          </Button>
        </Link>
      </div>
    </div>
  );
}
