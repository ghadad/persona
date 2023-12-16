import FlowProcessor from "../modules/smartflow/flow/FlowProcessor";
import createOrGetConnection from "../db";

const minimist = require("minimist");

const args = minimist(process.argv.slice(2), {
  alias: {
    h: "help",
    v: "version",
    f: "flow",
    d: "describe",
  },
  boolean: ["help", "version"],
  string: ["flow"],
  stopEarly: true,
});

function showUsage() {
  console.log(`Usage: node ${__filename} [options]
  Options:
    -h, --help      Display this help message
    -f, --flow      Specify a Flow to be run `);
}

if (args.help) {
  showUsage();
  process.exit(0);
}

if (!args.flow) {
  console.error('Error: The "flow" argument is required.');
  showUsage();
  process.exit(1);
}

async function main() {
  const connection = await createOrGetConnection();
  const flow = new FlowProcessor(args.flow);
  await flow.init();
  if (args.describe) {
    flow.describe();
    return;
  }

  console.time("RUN FLOW");
  const result = await flow.execute();
  console.timeEnd("RUN FLOW");
  await connection.destroy();
  console.log("FLOW DONE! :", result);
}

main();
