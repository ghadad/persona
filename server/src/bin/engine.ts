import FactProcessor from "../modules/smartfact/fact/FactProcessor";
import createOrGetConnection from "../db";

const minimist = require("minimist");

const args = minimist(process.argv.slice(2), {
  alias: {
    h: "help",
    v: "version",
    f: "fact",
    d: "describe",
  },
  boolean: ["help", "version"],
  string: ["fact"],
  stopEarly: true,
});

function showUsage() {
  console.log(`Usage: node ${__filename} [options]
  Options:
    -h, --help      Display this help message
    -f, --fact      Specify a Fact to be run `);
}

if (args.help) {
  showUsage();
  process.exit(0);
}

if (!args.fact) {
  console.error('Error: The "fact" argument is required.');
  showUsage();
  process.exit(1);
}

async function main() {
  const connection = await createOrGetConnection();
  const fact = new FactProcessor(args.fact);
  await fact.init();
  if (args.describe) {
    fact.describe();
    return;
  }

  console.time("RUN FACT");
  const result = await fact.execute();
  console.timeEnd("RUN FACT");
  await connection.destroy();
  console.log("FACT DONE! :", result);
}

main();
