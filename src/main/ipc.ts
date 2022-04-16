import HID from "node-hid";

import { mainResponder } from "~/bridge/request";

export const setupIpcHandlers = () => {
  const removeHidResponder = mainResponder("hid-devices", () =>
    Promise.resolve(HID.devices())
  );
  const removeEchoResponder = mainResponder("echo", (_, ping) =>
    Promise.resolve(`${ping}... ${ping}... ${ping}`)
  );

  return () => {
    removeEchoResponder();
    removeHidResponder();
  };
};
