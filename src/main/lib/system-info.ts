import systemInformation from "systeminformation";

import type { Requests } from "~/common/bridge/types";

export const getSystemInfo = async (): Promise<
  ReturnType<Requests["getSystemInfo"]>
> => {
  const [osInfo, mem] = await Promise.all([
    systemInformation.osInfo(),
    systemInformation.mem(),
  ]);

  return {
    os: osInfo.codename,
    totalMemory: BigInt(mem.total),
    freeMemory: BigInt(mem.free),
  };
};
