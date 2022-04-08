import { useEffect, useState } from "react";

import { uniqueBy } from "~/common/util/array";

import type { FC } from "react";
import type { Device } from "node-hid";

const DeviceList: FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    void window.bridge.getHidDevices().then((response) => {
      setDevices(uniqueBy((a, b) => a.productId === b.productId, response));
    });
  }, []);

  return devices ? (
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
  ) : (
    <>Loading...</>
  );
};

export default DeviceList;
