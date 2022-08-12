import type { SystemInfo } from "~/common/bridge/types";

export const createMockSystemInfo = (
  info: Partial<SystemInfo> = {}
): SystemInfo => ({
  os: "OS",
  totalMemory: BigInt(10_000_000_000),
  freeMemory: BigInt(1_000_000_000),
  ...info,
});
