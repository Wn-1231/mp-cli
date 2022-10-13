#!/usr/bin/env node
const program = require("commander");
const chalk = require("chalk");

program
  .version(`mp-cli ${require("../package").version}`)
  .usage("<command> [options]");

program
  .command("create [project-name]")
  .description("create a new project powered by mp-cli")
  .option("-p, --path [value]", "use output the project using a custom path")
  .option(
    "-c, --custom [value]",
    "use cached template or specific a local path to template"
  )
  .on("--help", () => {
    console.log();
    console.log("  Examples:");
    console.log();
    console.log(chalk.gray("    # create a new project in current directory"));
    console.log("    $ mp-cli create awesome-project");
    console.log();
    console.log(
      chalk.gray("    # create a new project with the specified dirname")
    );
    console.log("    $ mp-cli create awesome-project --path xxx/xxx/xxx");
    console.log();
    console.log(chalk.gray("    # create a project using a custom template"));
    console.log("    $ mp-cli create awesome-project --custom xxx/xxx/xxx");
    console.log();
  })
  .action(async () => {
    require("../lib/create")().catch(error => {
      console.log(`${chalk.red(error)}`);
      process.exit(1);
    });
  });

program.parse(process.argv);
