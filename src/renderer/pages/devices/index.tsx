import DeviceList from "./device-list";

import type { FCWithoutChildren } from "../../types/component";

const Devices: FCWithoutChildren = () => (
  <div>
    <h2>Devices</h2>
    <DeviceList />
  </div>
);

export default Devices;
