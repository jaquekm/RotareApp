import { z } from 'zod';

export const telemetrySchema = z.object({
  company_id: z.string().uuid(),
  vehicle_id: z.string().uuid(),
  trip_id: z.string().uuid().optional(),
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
  speed: z.number().min(0),
  heading: z.number().min(0).max(360),
  ts: z.string().datetime(),
});

export type TelemetryMessage = z.infer<typeof telemetrySchema>;
