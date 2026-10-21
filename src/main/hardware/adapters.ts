import type { HardwareAvailability } from '../../shared/contracts';

export interface MicroscopeAdapter {
  connect(): Promise<HardwareAvailability>;
}

export interface PowerSupplyAdapter {
  connect(): Promise<HardwareAvailability>;
}

export interface MultimeterAdapter {
  connect(): Promise<HardwareAvailability>;
}

const unavailable = async (): Promise<HardwareAvailability> => ({
  available: false,
  reason: 'El modelo y el protocolo del dispositivo aún no están configurados.',
});

export const hardwareHub = {
  microscope: { connect: unavailable } satisfies MicroscopeAdapter,
  powerSupply: { connect: unavailable } satisfies PowerSupplyAdapter,
  multimeter: { connect: unavailable } satisfies MultimeterAdapter,
};
