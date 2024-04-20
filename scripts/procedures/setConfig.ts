import { compat, types as T } from "../deps.ts";

// Define a custom type for T.Config to include the 'server' property with a 'type' property
interface SparrowConfig extends T.Config {
  sparrow?: {
    server?: {
      type?: string;
    };
  };
}

// deno-lint-ignore require-await
export const setConfig: T.ExpectedExports.setConfig = async (
  effects: T.Effects,
  newConfig: SparrowConfig,
) => {
  const depsBitcoind: { [key: string]: string[] } = newConfig?.sparrow?.server?.type === "bitcoind" ? { "bitcoind": [] } : {};
  const depsElectrs: { [key: string]: string[] } = newConfig?.sparrow?.server?.type === "electrs" ? { "electrs": [] } : {};

  return compat.setConfig(effects, newConfig, {
    ...depsBitcoind,
    ...depsElectrs,
  });
};
