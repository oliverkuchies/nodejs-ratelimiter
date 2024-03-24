import path from "path";
import "reflect-metadata";

import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from "testcontainers";

declare global {
  // eslint-disable-next-line no-var
  var DOCKER: StartedDockerComposeEnvironment;
}

export default async function setup(): Promise<void> {
  console.info("Starting docker compose");
  const composeFilePath = path.resolve(__dirname, "..");
  try {
    globalThis.DOCKER = await new DockerComposeEnvironment(
      composeFilePath,
      "docker-compose.yml",
    ).up();
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("already in use")) {
      console.info("Docker compose already running. Skipping bootstrap");
    } else {
      throw err;
    }
  }
}
