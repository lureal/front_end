# 创建项目指引

本文意在描述整个项目的组织方式，开发方式，以便于更快更好的上手

## 项目结构
以下如果有不明的名词，不明的用法，想了解为什么用它们，自行 Google

    根目录
      |- build                     # 分割构建工具，避免构建工具过度臃肿，此文件夹的文件被 gulpfile.js 引用
      |    |- css.js               # 维护构建工具中的 css 操作
      |    |- html.js              # 维护构建工具中的 html 操作
      |    |- script.js            # 维护构建工具中的 JsvaScript 操作
      |    |- img.js               # 维护构建工具中的图像操作
      |
      |- demo                      # 示例项目，用于展示项目应该怎么创建
      |    |- dist                 # 发布文件夹，此文件夹不用创建，由构建工具创建
      |    |- src                  # 开发文件夹，所有代码保存在这里
      |    |   |- html             # 开发文件夹中的 html 文件夹，保存所有 html(模版代码)
      |    |   |- js               # 开发文件夹中的 js 文件夹，保存所有 js 代码
      |    |   |- less             # 开发文件夹中的 less 文件夹，保存所有 less 文件
      |    |
      |    |- webpack.config.js    # 模块化工具配置文件，每添加一个被实际页面引用的 js 文件时，需要在此记录，具体写法可查看此文件
      |
      |- doc                       # 保存项目文档
      |- lib                       # 保存公共模块
      |   |- js                    # 保存公共 js 模块，使用模块化工具引用，如，require(...);
      |   |- less                  # 保存公共 less 模块，使用 less 本身引用工具引用，如，@import(...);
      |   |- html                  # 保存公共 html 模块，使用 swig 模版 {% import '...' %}
      |
      |- node_modules              # Node.js 安装的 npm 包，构建工具运行在 Node.js 基础上，需要 Node.js 的包
      |- vendor                    # 前端依赖的库，如，jQuery...，使用 bower 安装
      |- .bowerrc                  # bower 配置文件
      |- bower.json                # bower 项目配置，保存 bower 管理的项目配置，bower安装的包会在此记录
      |- gulpfile.js               # gulp 配置文件，项目构建工具
      |- package.json              # Node.js 项目管理文件，安装的包将会记录在此
      |

## 如何新开始一个项目？
1. 拷贝项目到本地并执行 `npm install` 安装 Node.js 依赖的包
2. 配置 Nginx。配置方法请参考同级目录下的 `nginx.md` 文件
3. 配置 Gulp。配置方法请参考同级目录下的 `gulp.md` 文件
4. 使用 `gulp.md` 中的命令监视项目并进入上一步中创建的文件夹中开发项目

## 注意
1. 项目中路径以 `/#proj_name#/` 作为路径开头，可查看 demo 项目的用法，编译工具最后会编译出正确的路径

## QA
1. 问：如果项目中需要依赖一个前端库怎么办？

   答：在根目录中执行 `bower install 库名 --save`， 并在文件中引用安装下来的库
