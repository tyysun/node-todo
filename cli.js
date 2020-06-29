#!/usr/bin/env node
// chmod +x cli.js
const program = require("commander")
const api = require("./index.js")

program
  .command("add")
  .description("add a task")
  .action((x, y) => {
    const words = y.join(" ")
    api.add(words)
  })

program
  .command("clear")
  .description("clear all task")
  .action((x, y) => {
    api.clear()
  })
if (process.argv.length === 2) {
  // 用户没有传参，展示所有
  api.showAll()
} else {
  program.parse(process.argv)
}
