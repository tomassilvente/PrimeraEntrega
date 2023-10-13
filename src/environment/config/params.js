import { Command } from "commander";

const program = new Command()

program
    .option('-d, --debug', "Variable de debug", false)
    .option('-m, --mode <mode>', "Ambiente", 'development')
program.parse()

console.log("Options => ", program.opts())

export default program.opts()