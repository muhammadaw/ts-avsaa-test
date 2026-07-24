"use client";

import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme } from "antd";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            colorPrimary: "#f5273a",
            colorBgContainer: "#151a28",
            colorBgElevated: "#20273c",
            colorBorder: "rgba(255, 213, 66, 0.25)",
            colorText: "#e2e8f0",
            colorTextHeading: "#ffffff",
            borderRadius: 6,
            fontFamily: "'Inter', sans-serif",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
