import { useEffect, useState } from "react";
import type { Device } from "node-hid";

import type { FCWithoutChildren } from "./types/component";

const DeviceList: FCWithoutChildren = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    window.bridge.getHidDevices().then((response) => {
      setDevices(
        response.reduce((acc: Device[], device) => {
          if (!acc.find((item) => item.productId === device.productId)) {
            acc.push(device);
          }

          return acc;
        }, [])
      );
    });
  }, []);

  return devices ? (
    <div>
      <h1>HID Devices</h1>
      <div>
        {devices.map((device) => (
          <div key={device.productId}>
            {device.product || "Unknown"}
            <br />
            {device.manufacturer || "Unknown"}
            <br />
            {device.vendorId} | {device.productId}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <>Loading...</>
  );
};

export default DeviceList;
