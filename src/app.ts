import express, { Request, Response } from "express";
import "reflect-metadata";
import AppDataSource from "./data/datasource";
import {rateLimiter} from "./middleware/ratelimiter";
const app = express();
const port = 3000;
const logger = require('pino-http')()

AppDataSource.initialize().then(() => {
  app.use(logger);
  app.use(rateLimiter)

  app.get("/api/hello", (req: Request, res: Response) => {
    res.send("Hello World!");
  });

  app.get("/admin/hello", (req: Request, res: Response) => {
    res.send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
