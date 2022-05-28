import styled from "@emotion/styled";
import { useEffect, useState } from "react";

import { uniqueBy } from "~/common/util/array";
import bridge from "~/renderer/bridge";

import type { FC } from "react";
import type { Device } from "usb-detection";

const UsbDeviceList: FC = () => {
  const [devices, setDevices] = useState<Device[]>();

  useEffect(() => {
    void bridge.getUsbDevices().then((response) => {
      setDevices(uniqueBy((a, b) => a.productId === b.productId, response));
    });

    return bridge.subscribeUsbDevices(({ device, status }) => {
      setDevices((current) => {
        const deviceIndex =
          current?.findIndex((d) => d.productId === device.productId) ?? -1;

        if (status === "added" && deviceIndex < 0) {
          return [...(current ?? []), device];
        }

        if (status === "removed" && deviceIndex > -1) {
          const next = [...(current ?? [])];

          next.splice(deviceIndex, 1);

          return next;
        }

        return current;
      });
    });
  }, []);

  return devices ? (
    <Container>
      {devices.map((device) => (
        <UsbDevice key={device.productId}>
          <span>{device.deviceName || "Unknown"}</span>
          <span>{device.manufacturer || "Unknown"}</span>
          <span>
            {device.vendorId} | {device.productId}
          </span>
        </UsbDevice>
      ))}
    </Container>
  ) : (
    <>Loading...</>
  );
};

export default UsbDeviceList;

const Container = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  gap: ${({ theme }) => theme.spacing.fixed[1]};
  list-style-type: none;
`;

const UsbDevice = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.fixed[0]};

  &:not(:last-of-type) {
    padding-block-end: ${({ theme }) => theme.spacing.fixed[1]};
    border-block-end: 1px solid ${({ theme }) => theme.color.text[100]};
  }
`;
