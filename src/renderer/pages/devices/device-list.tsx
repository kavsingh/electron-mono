import { useEffect, useState } from "react";

import { uniqueBy } from "~/common/util/array";

import type { FCWithoutChildren } from "~/renderer/types/component";

/*
We are disallowed from importing node-hid module by eslint no-restricted-imports, which at time of writing does not allow us to distinguish type-only imports

TODO: type-only import from node-hid directly when possible
*/
type Device = UnwrapArrayLike<AsyncResult<typeof window.bridge.getHidDevices>>;

const DeviceList: FCWithoutChildren = () => {
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
