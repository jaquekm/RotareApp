import { Client, connect } from 'mqtt';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { telemetrySchema, TelemetryMessage } from './schema';

dotenv.config();

const mqttHost = process.env.MQTT_HOST || 'localhost';
const mqttPort = process.env.MQTT_PORT || '1883';
const mqttUrl = `mqtt://${mqttHost}:${mqttPort}`;

const pgPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const client: Client = connect(mqttUrl);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('rotare/telemetry/#', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to rotare/telemetry/#');
    }
  });
});

client.on('message', async (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    const parsed = telemetrySchema.parse(payload);

    const { company_id, vehicle_id, trip_id, lat, lon, speed, heading, ts } = parsed;

    const query = `
      INSERT INTO positions (company_id, vehicle_id, trip_id, ts, geom, speed_kmh, heading_deg)
      VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326), $7, $8)
    `;

    await pgPool.query(query, [
      company_id,
      vehicle_id,
      trip_id || null,
      ts,
      lon,
      lat,
      speed,
      heading,
    ]);
  } catch (error) {
    console.error('Error processing message:', error);
  }
});

client.on('error', (err) => {
  console.error('MQTT client error:', err);
});

process.on('SIGINT', async () => {
  console.log('Disconnecting...');
  client.end();
  await pgPool.end();
  process.exit(0);
});
