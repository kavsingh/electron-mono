import { useEffect, useState } from "react";

import { uniqueBy } from "~/common/util/array";
import bridge from "~/renderer/bridge";

import type { Device } from "usb-detection";
import type { FC } from "react";

const DeviceList: FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    void bridge.getUsbDevices().then((response) => {
      setDevices(uniqueBy((a, b) => a.productId === b.productId, response));
    });

    return bridge.subscribeUsbDevices(({ device, status }) => {
      setDevices((current) => {
        const deviceIndex = current.findIndex(
          (d) => d.productId === device.productId
        );

        if (status === "added" && deviceIndex < 0) return [...current, device];

        if (status === "removed" && deviceIndex > -1) {
          const next = [...current];

          next.splice(deviceIndex, 1);

          return next;
        }

        return current;
      });
    });
  }, []);

  return devices ? (
    <div>
      {devices.map((device) => (
        <div key={device.productId}>
          {device.deviceName || "Unknown"}
          <br />
          {device.manufacturer || "Unknown"}
          <br />
          {device.vendorId} | {device.productId}
        </div>
      ))}
    </div>
  ) : (
    <>Loading...</>
  );
};

export default DeviceList;
