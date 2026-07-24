"use client";

import React, { useEffect, useState } from "react";
import { Drawer, Table, Tag, Button, Spin, Empty, message } from "antd";
import { HistoryOutlined, ReloadOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios";
import { AssignmentResult } from "./VoucherForm";

export interface HistoryRecord {
  id: number;
  crewName: string;
  crewId: string;
  flightNumber: string;
  flightDate: string;
  aircraftType: string;
  seats: string[];
  createdAt: string;
}

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelectRecord: (record: AssignmentResult) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ open, onClose, onSelectRecord }) => {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const res = await axios.get(`${backendUrl}/api/history`);
      if (res.data?.success && Array.isArray(res.data?.history)) {
        setHistory(res.data.history);
      }
    } catch (err: any) {
      message.error("Failed to load voucher assignment history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchHistory();
    }
  }, [open]);

  const columns = [
    {
      title: "FLIGHT & DATE",
      key: "flight",
      render: (_: any, record: HistoryRecord) => (
        <div>
          <strong style={{ color: "var(--brand-yellow)", fontFamily: "Geist, monospace" }}>{record.flightNumber}</strong>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "Geist, monospace" }}>{record.flightDate}</div>
        </div>
      ),
    },
    {
      title: "CREW",
      key: "crew",
      render: (_: any, record: HistoryRecord) => (
        <div>
          <div style={{ color: "#ffffff", fontWeight: 600 }}>{record.crewName}</div>
          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>ID: {record.crewId}</div>
        </div>
      ),
    },
    {
      title: "AIRCRAFT",
      dataIndex: "aircraftType",
      key: "aircraftType",
      render: (text: string) => <Tag color="volcano" style={{ borderColor: "rgba(255, 213, 66, 0.3)", color: "#ffd542" }}>{text}</Tag>,
    },
    {
      title: "ASSIGNED SEATS",
      key: "seats",
      render: (_: any, record: HistoryRecord) => (
        <div style={{ display: "flex", gap: "0.3rem" }}>
          {record.seats.map((seat, i) => (
            <span
              key={i}
              style={{
                background: "rgba(245, 39, 58, 0.15)",
                border: "1px solid rgba(255, 213, 66, 0.35)",
                color: "var(--brand-yellow)",
                fontFamily: "Geist, monospace",
                fontWeight: 700,
                fontSize: "0.75rem",
                padding: "0.1rem 0.4rem",
                borderRadius: "3px",
              }}
            >
              {seat}
            </span>
          ))}
        </div>
      ),
    },
    {
      title: "ACTION",
      key: "action",
      render: (_: any, record: HistoryRecord) => (
        <Button
          size="small"
          type="primary"
          icon={<EyeOutlined />}
          style={{ background: "var(--brand-gradient)", border: "none", color: "#000", fontWeight: 700 }}
          onClick={() => {
            onSelectRecord({
              crewName: record.crewName,
              crewId: record.crewId,
              flightNumber: record.flightNumber,
              flightDate: record.flightDate,
              aircraftType: record.aircraftType,
              seats: record.seats,
            });
            onClose();
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Drawer
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#ffffff", fontFamily: "Sora, sans-serif" }}>
            <HistoryOutlined style={{ color: "#f5273a", marginRight: "0.5rem" }} /> Flight Assignment History
          </span>
          <Button icon={<ReloadOutlined />} onClick={fetchHistory} size="small" className="action-btn-icon">
            Refresh
          </Button>
        </div>
      }
      placement="right"
      width={680}
      onClose={onClose}
      open={open}
      styles={{
        header: { background: "#141824", borderBottom: "0.5px solid rgba(255, 213, 66, 0.2)" },
        body: { background: "#0a0d14", color: "#e2e8f0", padding: "1.25rem" },
      }}
    >
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <Spin size="large" />
        </div>
      ) : history.length === 0 ? (
        <Empty description="No historical voucher assignments found." style={{ margin: "4rem 0" }} />
      ) : (
        <Table
          dataSource={history}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 8 }}
          size="small"
          style={{ background: "transparent" }}
        />
      )}
    </Drawer>
  );
};
