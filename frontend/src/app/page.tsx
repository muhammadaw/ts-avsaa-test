"use client";

import React, { useState } from "react";
import { Button } from "antd";
import { HistoryOutlined } from "@ant-design/icons";
import { VoucherForm, AssignmentResult } from "@/components/VoucherForm";
import { BoardingPassResult } from "@/components/BoardingPassResult";
import { HistoryDrawer } from "@/components/HistoryDrawer";

export default function Home() {
  const [result, setResult] = useState<AssignmentResult | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <main style={{ minHeight: "100vh", position: "relative" }}>
      <header className="app-header">
        <div className="brand-logo">
          <svg width="30" height="30" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="astronacciRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5273a" />
                <stop offset="100%" stopColor="#ffd542" />
              </linearGradient>
            </defs>
            <path
              d="M 50 12 C 28 36 14 68 32 88 C 42 98 49 84 50 72 C 51 84 58 98 68 88 C 86 68 72 36 50 12 Z"
              fill="url(#astronacciRibbonGrad)"
              style={{ filter: "drop-shadow(0 0 8px rgba(245,39,58,0.5))" }}
            />
          </svg>
          <h1 className="brand-title">ASTRONACCI AIR</h1>
          <span className="brand-badge">Crew Portal</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Button
            icon={<HistoryOutlined />}
            onClick={() => setHistoryOpen(true)}
            className="action-btn-icon"
            style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
          >
            History
          </Button>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div className="brand-pulse" style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#f5273a" }} />
            <span className="font-geist" style={{ color: "var(--text-muted)", fontSize: "0.72rem", letterSpacing: "1.2px", textTransform: "uppercase" }}>
              ONLINE
            </span>
          </div>
        </div>
      </header>

      <div className="main-container">
        <div className="portal-grid">
          <div>
            <VoucherForm
              onSuccess={(res) => setResult(res)}
              onClearResult={() => setResult(null)}
            />
          </div>
          <div>
            <BoardingPassResult result={result} />
          </div>
        </div>
      </div>

      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectRecord={(rec) => setResult(rec)}
      />

      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: -10, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "15%", right: "-10%", width: "450px", height: "450px", background: "rgba(245, 39, 58, 0.04)", borderRadius: "50%", filter: "blur(120px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "350px", height: "350px", background: "rgba(255, 213, 66, 0.03)", borderRadius: "50%", filter: "blur(100px)" }} />
      </div>
    </main>
  );
}
