## 描述

mp-cli 教育 cli ，一键创建已有模板项目

## 使用

### 安装

`npm install mp-cli -g` 进行安装

### 使用
``` shell
mp-cli --help                                       mp-cli 命令提示
mp-cli create --help                                mp-cli create 命令提示
mp-cli create project-name                          根据模板初始化项目
mp-cli create awesome-project --path xxx/xxx/xxx    指定模板输出路径
mp-cli create awesome-project --custom xxx/xxx/xxx  通过自定义模板生成项目
```

## 目录

```
├── bin
│   └── mp-cli.js          //  入口文件
├── package.json
├── lib
│   └── create.js         // create 命令
├── lib
│   ├── gitUser.js        // 获取 git 用户信息
│   └── index.js          // 存放工具方法
├── templates             // 存放模板文件夹
│   ├── template1         // 模板一 （暂无）
│   │    ├── template     // 模板源码
│   │    └── meta.js      // 模板配置文件
│   └── template2         // 模板一 （暂无）
│   │    ├── template     // 模板源码
│   │    └── meta.js      // 模板配置文件

```