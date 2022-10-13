const minimist = require("minimist");
const ora = require("ora");
const chalk = require("chalk");
const Inquirer = require("inquirer");
const consolidate = require("consolidate");
const MetalSmith = require("metalsmith");
const { join } = require("path");
const { promisify } = require("util");
const getGitUser = require("../utils/gitUser");
const render = promisify(consolidate.ejs.render); // 可以把异步的api转换成promise
const { getTemplates, resolveTemplate, destinationPath } = require("../utils");

module.exports = async function () {
  try {
    const args = process.argv.slice(2);
    const parsedArgs = minimist(args);
    const projectName = args[1];
    const path = parsedArgs.path || parsedArgs.p;
    const custom = parsedArgs.custom || parsedArgs.c;
    let templatePath = "";

    // 1. 读取是否有自定义模板地址
    if (custom && typeof custom === "string") {
      console.log(`> Use local template at ${chalk.yellow(custom)}`);
      templatePath = custom;
    } else {
      // 2. 获取仓库中现成的所有模板
      let templates = getTemplates();
      const { template } = await Inquirer.prompt({
        name: "template", // 获取选择后的结果
        type: "list",
        message: "please choise a template to create project",
        choices: templates,
      });
      // 3) 储存用户选择的模板地址
      templatePath = resolveTemplate(template);
    }

    // 4) 模板输出的地址
    const destination = destinationPath(projectName, path);
    // 5) 读取模板需要的配置让用户填信息 & 输出模板
    await new Promise((resolve, reject) => {
      MetalSmith(__dirname)
        .source(join(templatePath, "/template"))
        .destination(destination)
        .use(async (files, metal, done) => {
          let args = require(join(templatePath, "/meta.js"));
          if (args && Array.isArray(args)) {
            args = args.map(item => {
              if (item.name === "partnerName") item.default = projectName;
              if (item.name === "author") item.default = getGitUser();
              return item;
            });
          } else {
            args = [];
          }
          const obj = await Inquirer.prompt(args);
          const meta = metal.metadata();
          Object.assign(meta, { ...obj, projectName });
          done();
        })
        .use((files, metal, done) => {
          const obj = metal.metadata();
          Reflect.ownKeys(files).forEach(async file => {
            // 这个是要处理的  <%
            let content = files[file].contents.toString(); // 文件的内容
            if (content.includes("<%")) {
              content = await render(content, obj);
              files[file].contents = Buffer.from(content); // 渲染
            }
          });
          done();
        })
        .build(err => {
          if (err) {
            reject(err);
          } else {
            ora("Template rendering completed").succeed();
            ora(
              `请通过 ${chalk.cyan(
                `cd ${projectName}`
              )} 进入项目，进行安装依赖。`
            ).succeed();
            resolve();
          }
        });
    }).catch(error => Promise.reject(error));
  } catch (error) {
    return Promise.reject(error);
  }
};
