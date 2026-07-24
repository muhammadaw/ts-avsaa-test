"use client";

import React from "react";
import { Button, Tag, message } from "antd";
import {
  CopyOutlined,
  PrinterOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  CloudSyncOutlined
} from "@ant-design/icons";
import { AssignmentResult } from "./VoucherForm";
import confetti from "canvas-confetti";

interface BoardingPassResultProps {
  result: AssignmentResult | null;
}

export const BoardingPassResult: React.FC<BoardingPassResultProps> = ({ result }) => {
  React.useEffect(() => {
    if (result) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#f5273a", "#ffd542", "#ffffff", "#ff8c00"],
      });
    }
  }, [result]);

  const handleCopy = () => {
    if (!result) return;
    const text = `ASTRONACCI AIR VOUCHER ASSIGNMENT\nFlight: ${result.flightNumber}\nDate: ${result.flightDate}\nAircraft: ${result.aircraftType}\nCrew: ${result.crewName} (${result.crewId})\nAssigned Seats: ${result.seats.join(", ")}`;
    navigator.clipboard.writeText(text);
    message.success("Voucher summary copied!");
  };

  const handlePrint = () => {
    window.print();
  };

  if (!result) {
    return (
      <div className="glass-panel" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <SafetyCertificateOutlined style={{ fontSize: "3.5rem", color: "rgba(245, 39, 58, 0.3)", marginBottom: "1rem" }} />
          <h3 className="font-sora" style={{ color: "#ffffff", marginBottom: "0.5rem", fontSize: "1.25rem" }}>
            Ready for Voucher Generation
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", maxWidth: "340px", margin: "0 auto", fontFamily: "Geist, monospace" }}>
            Input operational flight details on the left console to generate 3 non-repeating seats.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel" id="printable-boarding-passes">
      <div className="panel-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 className="panel-title" style={{ color: "#ffffff", fontSize: "1.2rem" }}>
            <CheckCircleFilled style={{ color: "#f5273a" }} /> Active Vouchers Issued
          </h2>
          <p className="panel-subtitle" style={{ fontSize: "0.74rem" }}>3 SEATS ALLOCATED • SYSTEM VERIFIED</p>
        </div>
        <div className="print-hide-controls" style={{ display: "flex", gap: "0.5rem" }}>
          <Button icon={<CopyOutlined />} onClick={handleCopy} className="action-btn-icon" size="middle">
            Copy
          </Button>
          <Button icon={<PrinterOutlined />} onClick={handlePrint} className="action-btn-icon" size="middle">
            Print
          </Button>
        </div>
      </div>

      <div className="crew-meta-bar" style={{ background: "rgba(0, 0, 0, 0.35)", border: "0.5px solid var(--border-metallic)", padding: "0.75rem 1.15rem", borderRadius: "8px", marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.88rem" }}>
          <div>
            <span className="font-geist" style={{ color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase" }}>CREW: </span>
            <strong style={{ color: "#fff" }}>{result.crewName}</strong> <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>({result.crewId})</span>
          </div>
          <div>
            <span className="font-geist" style={{ color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase" }}>FLIGHT: </span>
            <strong style={{ color: "var(--brand-yellow)", fontFamily: "Geist, monospace", fontSize: "0.95rem" }}>
              {result.flightNumber} • {result.flightDate}
            </strong>
          </div>
        </div>
      </div>

      <div className="tickets-container">
        {result.seats.map((seat, index) => (
          <div key={index} className="metallic-card">
            <div className="metallic-indicator" />

            <div className="pass-seat-display">
              <span className="seat-big-num">{seat}</span>
              <span className="seat-sublabel">SEAT</span>
            </div>

            <div className="pass-main-info">
              <div className="pass-badge-crew">
                <ThunderboltOutlined /> WINNER VOUCHER #{index + 1}
              </div>
              <div className="pass-crew-name">{result.crewName}</div>

              <div className="pass-meta-grid">
                <div className="pass-meta-item">
                  <label>FLIGHT CODE</label>
                  <span>{result.flightNumber}</span>
                </div>
                <div className="pass-meta-item">
                  <label>AIRCRAFT TYPE</label>
                  <span>{result.aircraftType}</span>
                </div>
              </div>
            </div>

            <div className="pass-actions print-hide-controls">
              <Button
                icon={<CopyOutlined />}
                size="middle"
                className="action-btn-icon"
                onClick={() => {
                  navigator.clipboard.writeText(`Flight ${result.flightNumber} - Seat ${seat}`);
                  message.success(`Seat ${seat} copied!`);
                }}
                title="Copy Seat Code"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="sync-footer print-hide-controls" style={{ marginTop: "1rem", paddingTop: "0.6rem", borderTop: "0.5px solid rgba(255, 213, 66, 0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      </div>
    </div>
  );
};
