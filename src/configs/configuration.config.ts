export interface DatabaseConfig {
  host: string;
  port: number;
  uri: string;
  name: string;
}

export const database_config = () => ({
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    uri: process.env.DATABASE_URI,
    name: process.env.DATABASE_NAME,
  },
});
