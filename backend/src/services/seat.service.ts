export type AircraftType = "ATR" | "Airbus 320" | "Boeing 737 Max";

const AIRCRAFT_CONFIGS: Record<AircraftType, { rows: number; cols: string[] }> = {
  ATR: {
    rows: 18,
    cols: ["A", "C", "D", "F"],
  },
  "Airbus 320": {
    rows: 32,
    cols: ["A", "B", "C", "D", "E", "F"],
  },
  "Boeing 737 Max": {
    rows: 32,
    cols: ["A", "B", "C", "D", "E", "F"],
  },
};

/**
 * Validates whether a seat string conforms to the specifications of the selected aircraft.
 * @param aircraft The aircraft type
 * @param seat The seat string (e.g., "1A", "18F")
 */
export function isValidSeat(aircraft: string, seat: string): boolean {
  if (!Object.keys(AIRCRAFT_CONFIGS).includes(aircraft)) {
    return false;
  }

  const match = seat.match(/^(\d+)([A-F])$/);
  if (!match) {
    return false;
  }

  const row = parseInt(match[1], 10);
  const col = match[2];
  const config = AIRCRAFT_CONFIGS[aircraft as AircraftType];

  if (row < 1 || row > config.rows) {
    return false;
  }

  return config.cols.includes(col);
}

/**
 * Generates exactly 3 unique, random seat numbers that conform to the target aircraft layout.
 * @param aircraft The aircraft type
 * @returns Array of 3 seat strings
 */
export function generateSeats(aircraft: string): string[] {
  if (!Object.keys(AIRCRAFT_CONFIGS).includes(aircraft)) {
    throw new Error("Invalid aircraft type");
  }

  const config = AIRCRAFT_CONFIGS[aircraft as AircraftType];
  const generatedSeats = new Set<string>();

  while (generatedSeats.size < 3) {
    const randomRow = Math.floor(Math.random() * config.rows) + 1;
    const randomColIdx = Math.floor(Math.random() * config.cols.length);
    const randomCol = config.cols[randomColIdx];
    generatedSeats.add(`${randomRow}${randomCol}`);
  }

  return Array.from(generatedSeats);
}
