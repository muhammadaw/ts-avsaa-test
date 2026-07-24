import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../index";
import { prisma } from "../db.service";

describe("Voucher API Endpoints", () => {
  beforeEach(async () => {
    // Clean database before each test run
    await prisma.voucher.deleteMany({});
  });

  describe("Undefined / Wrong Routes", () => {
    it("should return 404 Not Found for non-existent endpoint", async () => {
      const res = await request(app).get("/api/non-existent-route");

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("not found on this server");
    });
  });

  describe("GET /api/history", () => {
    it("should return empty list when no vouchers generated yet", async () => {
      const res = await request(app).get("/api/history");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.history).toEqual([]);
    });

    it("should return history records ordered by created_at DESC", async () => {
      await prisma.voucher.create({
        data: {
          crew_name: "Sarah",
          crew_id: "98123",
          flight_number: "GA101",
          flight_date: "2025-07-10",
          aircraft_type: "ATR",
          seat1: "1A",
          seat2: "3C",
          seat3: "5D",
        },
      });

      const res = await request(app).get("/api/history");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.history).toHaveLength(1);
      expect(res.body.history[0].flightNumber).toBe("GA101");
      expect(res.body.history[0].seats).toEqual(["1A", "3C", "5D"]);
    });
  });

  describe("POST /api/check", () => {
    it("should return exists: false when flight has no vouchers assigned", async () => {
      const res = await request(app)
        .post("/api/check")
        .send({ flightNumber: "GA102", date: "2025-07-12" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ exists: false });
    });

    it("should return exists: true when vouchers already exist for the flight and date", async () => {
      // Pre-seed database with a voucher
      await prisma.voucher.create({
        data: {
          crew_name: "John Crew",
          crew_id: "C101",
          flight_number: "GA102",
          flight_date: "2025-07-12",
          aircraft_type: "Airbus 320",
          seat1: "1A",
          seat2: "2B",
          seat3: "3C",
        },
      });

      const res = await request(app)
        .post("/api/check")
        .send({ flightNumber: "GA102", date: "2025-07-12" });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ exists: true });
    });

    it("should return 400 Bad Request for missing parameters", async () => {
      const res = await request(app)
        .post("/api/check")
        .send({ flightNumber: "" });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/generate", () => {
    it("should successfully generate 3 unique seats and persist to database", async () => {
      const payload = {
        name: "Sarah",
        id: "98123",
        flightNumber: "ID102",
        date: "2025-07-12",
        aircraft: "Airbus 320",
      };

      const res = await request(app).post("/api/generate").send(payload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.seats).toHaveLength(3);

      // Verify DB persistence
      const savedVoucher = await prisma.voucher.findUnique({
        where: {
          flight_number_flight_date: {
            flight_number: "ID102",
            flight_date: "2025-07-12",
          },
        },
      });

      expect(savedVoucher).not.toBeNull();
      expect(savedVoucher?.crew_name).toBe("Sarah");
      expect(savedVoucher?.aircraft_type).toBe("Airbus 320");
      expect(savedVoucher?.seat1).toBe(res.body.seats[0]);
    });

    it("should return 409 Conflict if vouchers already generated for flight & date", async () => {
      const payload = {
        name: "Sarah",
        id: "98123",
        flightNumber: "ID102",
        date: "2025-07-12",
        aircraft: "Airbus 320",
      };

      // First call -> 201 Created
      await request(app).post("/api/generate").send(payload);

      // Second call -> 409 Conflict
      const res = await request(app).post("/api/generate").send(payload);

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain("already been generated");
    });

    it("should return 400 Bad Request if aircraft type is invalid", async () => {
      const payload = {
        name: "Sarah",
        id: "98123",
        flightNumber: "ID102",
        date: "2025-07-12",
        aircraft: "Invalid Jet 99",
      };

      const res = await request(app).post("/api/generate").send(payload);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
