// This file contains code that we reuse between our tests.
import { FastifyInstance } from "fastify";
const helper = require("fastify-cli/helper.js");
import * as path from "path";

const AppPath = path.join(__dirname, "..", "src", "app.js");

// Fill in this config with all the configurations
// needed for testing the application
async function config() {
  return {};
}

// Automatically build and tear down our instance
async function build(t: any): Promise<FastifyInstance> {
  // you can set all the options supported by the fastify CLI command
  const argv = [AppPath];

  // fastify-plugin ensures that all decorators
  // are exposed for testing purposes, this is
  // different from the production setup
  const app = await helper.build(argv, await config());

  t.teardown(() => void app.close());
  // Tear down our app after we are done

  return app;
}

export { config, build };
