# 配置 Nginx 
---

## 目的：
为了满足开发环境能够方便开发项目。需要在本机安装配置 `Nginx`。

## 步骤

### 安装

#### Mac
1. 使用 `Homebrew` 安装 `Nginx`

        brew install nginx

2. 启动 `Nginx`

        sudo nginx

3. 在浏览器中运行一下地址，如果能正确显示出 `Nginx` 默认页面则安装成功。

#### Windows
请查看 [`Nginx` 官方文档](http://nginx.org/en/docs/windows.html)安装说明

### 配置

#### Mac
1. 在命令行中使用以下命令进入 `Nginx` 文件夹

        cd /usr/local/etc/nginx/

2. 系统默认会创建一个 `servers` 文件夹，请在 `servers` 文件夹中新建一个文件，例：

        touch e.iyq.me

3. 编辑 `e.iyq.me`，例：

        server {                                                        # 定义虚拟主机
          server_name e.iyq.me;                                       # 定义监听域名

          root   /Users/aaronhsieh/workspace/yq2;

          location ~^/(.*?)/(img|css|js)/ {}

          location ~ ^/(ferrari|demo|test)/ {
            rewrite    /(.*?)/(.+)$    /$1/html/$2.html    break;
          }
          location ~ ^/(joint|cp)/ {
          	proxy_set_header host e.iyq.me;                          # 将请求指向特定域名
          	proxy_pass http://119.29.65.21;                          # 特定域名的 ip 地址
          }
        }

4. 创建另一个文件夹，将这个文件夹链接向项目的 `dist` 目录和 `vendor` 目录

        链接 vendor 目录：
        ln -s /Users/aaronhsieh/workspace/front_end/vendor vendor

        链接 dist 目录：
        ln -s /Users/aaronhsieh/workspace/front_end/ferrari/dist ferrari

5. 在浏览器中访问地址 `http://e.iyq.me/ferrari/(文件夹/)文件名` 确认一切正常

#### Windows
请按以上类似步骤操作。
