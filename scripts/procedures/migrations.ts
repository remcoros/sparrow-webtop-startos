import { compat, types as T } from "../deps.ts";

export const migration: T.ExpectedExports.migration = compat.migrations
  .fromMapping({
    "2.0.0.1": {
      up: compat.migrations.updateConfig(
        (config: any) => {
          config["reconnect"] = false;
          return config;
        },
        true,
        { version: "2.0.0.1", type: "up" },
      ),
      down: compat.migrations.updateConfig(
        (config: any) => {
          delete config["reconnect"];
          return config;
        },
        true,
        { version: "2.0.0.1", type: "down" },
      ),
    },
  }, "2.1.0");
