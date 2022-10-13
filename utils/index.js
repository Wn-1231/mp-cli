const { uniq } = require("lodash");
const { resolve, join } = require("path");
const { readdirSync, lstatSync } = require("fs");

const monorepoMap = ["lerna.json", "pnpm-workspace.yaml"];

const isDir = path => {
  return lstatSync(path).isDirectory();
};

const resolveTemplate = name => {
  return resolve(join(__dirname + "/../"), `templates/${name}`);
};

const getTemplates = () => {
  try {
    const templates = readdirSync(join(__dirname + "/../" + "/templates"));
    return uniq(templates).filter(name => name && isDir(resolveTemplate(name)));
  } catch (error) {
    throw new Error('mp-cli/templates 下暂无现成的模板，快去创建吧 ~')
  }
};

const destinationPath = (projectName = "", outputPath = "") => {
  if (outputPath) return join(outputPath, projectName);
  // 默认输出路径
  outputPath = resolve(projectName);

  // 判断是否是多仓库项目
  const isMonorepo = readdirSync(resolve()).filter(
    name => name && !isDir(resolve(name)) && monorepoMap.includes(name)
  ).length;

  if (isMonorepo !== 0) {
    outputPath = resolve("apps/" + projectName);
  }
  return outputPath;
};

module.exports = {
  resolve,
  getTemplates,
  destinationPath,
  resolveTemplate,
};

