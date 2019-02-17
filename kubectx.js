#!/usr/bin/env node

const execa = require("execa");
const { execSync } = require("child_process");
const inquirer = require("inquirer");

(async () => {
  try {
    const [
      { stdout: currentContext },
      { stdout: contexts }
    ] = await Promise.all([
      execa("kubectl", "config current-context".split(" ")),
      execa("kubectl", "config get-contexts -o name".split(" "))
    ]);

    const { context: selectedContext } = await inquirer.prompt([
      {
        type: "list",
        message: "Select kubectl context",
        name: "context",
        default: currentContext,
        choices: contexts.split("\n").sort()
      }
    ]);

    execSync("kubectl config use-context " + selectedContext);

    console.log("done!");
    process.exit(0);
  } catch (err) {
    console.log("error", err); //TRACE
    process.exit(1);
  }
})();
