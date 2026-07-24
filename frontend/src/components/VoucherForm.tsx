"use client";

import React, { useState } from "react";
import { Form, Input, DatePicker, Select, Button, Alert } from "antd";
import { ThunderboltFilled, SendOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";

const { Option } = Select;

export interface FormValues {
  crewName: string;
  crewId: string;
  flightNumber: string;
  flightDate: Dayjs;
  aircraftType: "ATR" | "Airbus 320" | "Boeing 737 Max";
}

export interface AssignmentResult {
  crewName: string;
  crewId: string;
  flightNumber: string;
  flightDate: string;
  aircraftType: string;
  seats: string[];
}

interface VoucherFormProps {
  onSuccess: (result: AssignmentResult) => void;
  onClearResult: () => void;
}

export const VoucherForm: React.FC<VoucherFormProps> = ({ onSuccess, onClearResult }) => {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    setErrorMessage(null);
    onClearResult();

    const formattedDate = values.flightDate.format("YYYY-MM-DD");
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
      const checkRes = await axios.post(`${backendUrl}/api/check`, {
        flightNumber: values.flightNumber,
        date: formattedDate,
      });

      if (checkRes.data?.exists) {
        setErrorMessage(
          `Vouchers have already been generated for flight ${values.flightNumber} on ${values.flightDate.format("DD-MM-YYYY")}. Duplicate generation is strictly blocked.`
        );
        setLoading(false);
        return;
      }

      const genRes = await axios.post(`${backendUrl}/api/generate`, {
        name: values.crewName,
        id: values.crewId,
        flightNumber: values.flightNumber,
        date: formattedDate,
        aircraft: values.aircraftType,
      });

      if (genRes.data?.success && Array.isArray(genRes.data?.seats)) {
        onSuccess({
          crewName: values.crewName,
          crewId: values.crewId,
          flightNumber: values.flightNumber,
          flightDate: values.flightDate.format("DD-MM-YYYY"),
          aircraftType: values.aircraftType,
          seats: genRes.data.seats,
        });
      } else {
        setErrorMessage("Failed to generate voucher seats. Please check your details and try again.");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "An unexpected error occurred.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          <ThunderboltFilled style={{ color: "#f5273a" }} /> Assign Seat Voucher
        </h2>
        <p className="panel-subtitle">• IN-FLIGHT VOUCHER GENERATION ENGINE</p>
      </div>

      {errorMessage && (
        <Alert
          message="Assignment Blocked"
          description={errorMessage}
          type="error"
          showIcon
          closable
          onClose={() => setErrorMessage(null)}
          style={{ marginBottom: "1.5rem", borderRadius: "6px" }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          aircraftType: "Airbus 320",
        }}
        style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}
      >
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            <Form.Item
              label="CREW NAME"
              name="crewName"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="e.g. Capt. James" size="large" style={{ height: "46px" }} />
            </Form.Item>

            <Form.Item
              label="CREW ID"
              name="crewId"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input placeholder="AST-9902" size="large" style={{ height: "46px" }} />
            </Form.Item>
          </div>

          <Form.Item
            label="FLIGHT NUMBER"
            name="flightNumber"
            rules={[{ required: true, message: "Required (e.g. GA102)" }]}
          >
            <Input placeholder="e.g. GA102" size="large" style={{ height: "46px", textTransform: "uppercase", fontFamily: "Geist, monospace" }} />
          </Form.Item>

          <Form.Item
            label="FLIGHT DATE"
            name="flightDate"
            rules={[{ required: true, message: "Required" }]}
          >
            <DatePicker
              format="DD-MM-YYYY"
              size="large"
              style={{ width: "100%", height: "46px" }}
              placeholder="Select Date (DD-MM-YYYY)"
            />
          </Form.Item>

          <Form.Item
            label="AIRCRAFT TYPE"
            name="aircraftType"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select size="large" style={{ height: "46px" }}>
              <Option value="ATR">ATR (18 Rows • Seats A, C, D, F)</Option>
              <Option value="Airbus 320">Airbus 320 (32 Rows • Seats A-F)</Option>
              <Option value="Boeing 737 Max">Boeing 737 Max (32 Rows • Seats A-F)</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item style={{ marginTop: "1.5rem", marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SendOutlined />}
            loading={loading}
            block
            className="submit-btn-brand"
          >
            {loading ? "ASSIGNING VOUCHERS..." : "ASSIGN VOUCHER"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
