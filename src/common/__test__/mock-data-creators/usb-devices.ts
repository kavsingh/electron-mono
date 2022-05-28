import type { Device } from "usb-detection";

export const createMockUsbDevice = (device: Partial<Device> = {}): Device => ({
  locationId: 0,
  vendorId: 0,
  productId: 0,
  deviceName: "Device name",
  manufacturer: "Manufacturer",
  serialNumber: "serial-number",
  deviceAddress: 0,
  ...device,
});
