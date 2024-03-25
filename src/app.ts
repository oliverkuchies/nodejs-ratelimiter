import express, { Request, Response } from "express";
import "reflect-metadata";
import AppDataSource, { redisClient } from "./data/datasource";
import { rateLimiter } from "./middleware/ratelimiter";
import logger from "pino-http";
const app = express();
const port = 3000;

const connectMethods = [AppDataSource.initialize(), redisClient.connect()];

Promise.all(connectMethods).then(() => {
  app.use(logger());

  app.use((req, res, next) => {
    (req as any).redisClient = redisClient;
    next();
  });

  app.use(rateLimiter);

  app.get("/api/hello", (req: Request, res: Response) => {
    res.send("Hello World!");
  });

  app.get("/admin/hello", (req: Request, res: Response) => {
    res.send("Hello World!");
  });

  app.listen(port);
});

export default app;
