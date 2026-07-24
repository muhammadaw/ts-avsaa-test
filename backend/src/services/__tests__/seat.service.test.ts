import { describe, it, expect } from "vitest";
import { generateSeats, isValidSeat } from "../seat.service";

describe("Seat Generation Service", () => {
  describe("isValidSeat", () => {
    it("should correctly validate ATR seats", () => {
      // ATR rows 1-18, columns A, C, D, F
      expect(isValidSeat("ATR", "1A")).toBe(true);
      expect(isValidSeat("ATR", "18F")).toBe(true);
      expect(isValidSeat("ATR", "10C")).toBe(true);
      expect(isValidSeat("ATR", "5D")).toBe(true);

      // Invalid column B, E
      expect(isValidSeat("ATR", "5B")).toBe(false);
      expect(isValidSeat("ATR", "5E")).toBe(false);

      // Out of bounds row 0 or 19
      expect(isValidSeat("ATR", "0A")).toBe(false);
      expect(isValidSeat("ATR", "19A")).toBe(false);

      // Malformed strings
      expect(isValidSeat("ATR", "A1")).toBe(false);
      expect(isValidSeat("ATR", "")).toBe(false);
      expect(isValidSeat("ATR", "100A")).toBe(false);
    });

    it("should correctly validate Airbus 320 seats", () => {
      // Airbus 320 rows 1-32, columns A, B, C, D, E, F
      expect(isValidSeat("Airbus 320", "1A")).toBe(true);
      expect(isValidSeat("Airbus 320", "32F")).toBe(true);
      expect(isValidSeat("Airbus 320", "15B")).toBe(true);
      expect(isValidSeat("Airbus 320", "15E")).toBe(true);

      // Out of bounds row 0 or 33
      expect(isValidSeat("Airbus 320", "0A")).toBe(false);
      expect(isValidSeat("Airbus 320", "33A")).toBe(false);

      // Invalid column G
      expect(isValidSeat("Airbus 320", "10G")).toBe(false);
    });

    it("should correctly validate Boeing 737 Max seats", () => {
      // Boeing 737 Max rows 1-32, columns A, B, C, D, E, F
      expect(isValidSeat("Boeing 737 Max", "1A")).toBe(true);
      expect(isValidSeat("Boeing 737 Max", "32F")).toBe(true);
      expect(isValidSeat("Boeing 737 Max", "20C")).toBe(true);

      // Out of bounds
      expect(isValidSeat("Boeing 737 Max", "0A")).toBe(false);
      expect(isValidSeat("Boeing 737 Max", "33F")).toBe(false);
    });

    it("should reject unknown aircraft types", () => {
      expect(isValidSeat("Spaceship", "1A")).toBe(false);
    });
  });

  describe("generateSeats", () => {
    it("should generate exactly 3 unique, valid seats for ATR", () => {
      const seats = generateSeats("ATR");
      expect(seats).toHaveLength(3);

      // Check uniqueness
      const uniqueSeats = new Set(seats);
      expect(uniqueSeats.size).toBe(3);

      // Check validity of each seat
      seats.forEach(seat => {
        expect(isValidSeat("ATR", seat)).toBe(true);
      });
    });

    it("should generate exactly 3 unique, valid seats for Airbus 320", () => {
      const seats = generateSeats("Airbus 320");
      expect(seats).toHaveLength(3);

      const uniqueSeats = new Set(seats);
      expect(uniqueSeats.size).toBe(3);

      seats.forEach(seat => {
        expect(isValidSeat("Airbus 320", seat)).toBe(true);
      });
    });

    it("should generate exactly 3 unique, valid seats for Boeing 737 Max", () => {
      const seats = generateSeats("Boeing 737 Max");
      expect(seats).toHaveLength(3);

      const uniqueSeats = new Set(seats);
      expect(uniqueSeats.size).toBe(3);

      seats.forEach(seat => {
        expect(isValidSeat("Boeing 737 Max", seat)).toBe(true);
      });
    });

    it("should throw an error for unknown aircraft types", () => {
      expect(() => generateSeats("Spaceship")).toThrow("Invalid aircraft type");
    });

    it("should produce non-deterministic random outputs", () => {
      const run1 = generateSeats("Airbus 320");
      const run2 = generateSeats("Airbus 320");
      // It is statistically highly improbable that two independent random runs generate the exact same list of 3 seats in the same order
      const match = run1.every((val, idx) => val === run2[idx]);
      expect(match).toBe(false);
    });
  });
});
