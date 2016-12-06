# Gulp
---

## 创建项目步骤

1. 在根目录中创建一个文件夹，文件夹名称即是项目名称
2. 文件夹目录结构如下

    根目录
    |- 项目名称
        |- src
            |- html
            |- img
            |- js
            |- less

3. 在根目录下 gulpfile.js 中添加 generateProjTask() 函数，generateProjTask 函数定义见 gulpfile.js

## 项目 gulp 命令

1. 开发环境构建项目

    1). 执行 `npm install` 安装 `npm` 包

    2). 开发环境监视监视文件变动

            gulp default:项目名称

      如：

            gulp default:cpboss

      然后在浏览器中打开 `http://localhost:8000`


2. 正式环境构建项目

    1). 执行 `npm install` 安装 `npm` 包

    2). 执行命令

            gulp build:项目名称

      如：

            gulp build:cpboss
