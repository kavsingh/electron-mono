import { z } from "zod";

export const systemStatsSchema = z.object({
	memTotal: z.string(),
	memUsed: z.string(),
	memAvailable: z.string(),
	sampledAt: z.string(),
});

export type SystemStats = z.infer<typeof systemStatsSchema>;

export const systemInfoSchema = z.object({
	osName: z.string(),
	osVersion: z.string(),
	osArch: z.string(),
});

export type SystemInfo = z.infer<typeof systemInfoSchema>;
