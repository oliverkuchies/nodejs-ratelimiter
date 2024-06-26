import { config } from "dotenv";
import { DataSource } from "typeorm";
import { createClient } from "redis";

if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" });
} else {
  config();
}

export default new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT as unknown as number,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [__dirname + "/entities/*.ts"],
  migrations: [__dirname + "/migrations/*.ts"],
  synchronize: false,
});

const redisClient = createClient({
  url: `redis://:@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

export { redisClient };
