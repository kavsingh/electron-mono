import { useEffect, useState } from "react";

import type { FCWithoutChildren } from "../../types/component";

/*
We are disallowed from importing node-hid module by eslint no-restricted-imports, which at time of writing does not allow us to distinguish type-only imports

TODO: type-only import from node-hid directly when possible
*/
type Device = UnwrapArrayLike<AsyncResult<typeof window.bridge.getHidDevices>>;

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
