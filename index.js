const db = require("./db")
const inquirer = require("inquirer")

module.exports.add = async (title) => {
  // 读取已有的任务
  const list = await db.read()
  list.push({
    title,
    done: false,
  })
  // 存储
  await db.write(list)
}

module.exports.clear = async (title) => {
  // 清除任务
  await db.write([])
}

module.exports.showAll = async () => {
  const list = await db.read()
  // 打印之前的任务
  printTasks(list)
}

function printTasks(list) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "index",
        message: "请选择你想操作的任务",
        choices: [
          { name: "退出", value: "-1" },
          ...list.map((task, index) => {
            return {
              name: `${task.done ? "[x]" : "[_]"} ${index + 1} - ${task.title}`,
              value: index.toString(),
            }
          }),
          { name: "+ 创建任务", value: "-2" },
        ],
      },
    ])
    .then((res) => {
      const index = parseInt(res.index)
      if (index >= 0) {
        // 选中任务
        askForAction(list, index)
      } else if (index === -2) {
        // 创建任务
        createTask(list)
      }
    })
}

function askForAction(list, index) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "index",
        message: "请选择你想要的操作",
        choices: [
          { name: "退出", value: "quit" },
          { name: "已完成", value: "markAsDown" },
          { name: "未完成", value: "markAsUndown" },
          { name: "改标题", value: "updateTitle" },
          { name: "删除", value: "remove" },
        ],
      },
    ])
    .then((a) => {
      switch (a.index) {
        case "markAsDown":
          list[index].done = true
          db.write(list)
          break
        case "markAsUndown":
          list[index].done = false
          db.write(list)
          break
        case "updateTitle":
          inquirer
            .prompt({
              type: "input",
              name: "title",
              message: "请输入新的标题",
              default: list[index].title,
            })
            .then((i) => {
              list[index].title = i.title
              db.write(list)
            })
          break
        case "remove":
          list.splice(index, 1)
          db.write(list)
          break
      }
    })
}

function createTask(list) {
  inquirer
    .prompt({
      type: "input",
      name: "title",
      message: "请输入任务的标题",
    })
    .then((i) => {
      list.push({
        title: i.title,
        down: false,
      })
      db.write(list)
    })
}
