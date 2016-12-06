# HTML/CSS Style Guide

## HTML

## Indentations

每一级使用 4 个空格缩进，请勿混合使用空格和 Tab

示例：

    <ul>
        <li>Fantastic</li>
        <li>Great</li>
    </ul>

    .example {
        color: blue;
    }

## File Naming Conventions

- 使用半角小写字母（单词）和数字
- 使用半角 `-` 和 `.` 分割单词
- 如非必要，请勿包含版本号

示例：

    my-cart.html
    style.css
    icon-sprites.png

## Trailing Whitespace

删除末尾空格

## Protocols

引用 `http`、`https` 资源时尽量使用 `//`。

	// bad
	<script src="http://domain.com/js/lib/jquery.js"></script>

	body {
	  background-image: url(http://domain.com/img/main-bg.png);
	}

	// good
	<script src="//domain.com/js/lib/jquery.js"></script>

	body {
	  background-image: url(//domain.com/img/main-bg.png);
	}

## Cases

使用小写字母编写 HTML 元素名、属性、除 `text/CDATA`、`data-attr` 外的属的值和 CSS 选择器、属性、除字符串外的属性的值

    <script src="//domain.com/js/lib/jquery.js"></script>
    <input type="email" required placeholder="请输入 Email 地址">

    body {
      background-color: #efefef;
    }

    .cash {
      &::before {
        content: 'CNY';
      }
    }

## Encoding

确保你的编辑器 / IDE 使用 UTC-8 编码。如无法确定，请使用 Sublime、Atom、Webstorm 等，并确保编码设置。

请确保 HTML 使用以下语句：

    <meta charset="utf-8">

CSS 中请勿使用：

    @charset 'UTF-8';

## Comments
请尽量使用注释，并确保注释前空一行，如下示例：

函数(Comment Blocker)：

    /**
     * @description the function description
     * @param String param1 the param1 description
     * @param Number param2 the param2 description
     * @return Array return description
     */
    function foo(param1, param2) {
        return [];
    }

模块头部：

    /*!
     * @name moduleName
     * @description module description
     * @usage how to use this module
     */

JavaScript 单行：

    // param description
    var bar = [];

JavaScript 多行：

    /*
     * multi description
     * ...
     */
     if(true) {

     }

CSS 单行：

    /* description */
    .foo {
        background: gray;
    }

Less 单行：

    // description
    .bar {
        background: green;
    }

CSS/Less 多行：

    /*
     * multi description
     * ...
     */
     .zoo {

     }

HTML：

    <!--plugin dropdown-->
    <div class="dropdown"></div>

## HTML

### Document Type

情使用 `<!DOCTYPE html>` 作为文档类型。注意大小写。

    // bad
    <!doctype html>
    <!DOCTYPE HTML>
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

    // good
    <!DOCTYPE html>

### Quotes

请使用双引号包裹属性值：

    // bad
    <input type='text'>

    // good
    <input type="text">

### Blocks

每个块、列表、表格元素之间用空行分隔：

    <p>XXXXXXX</p>

    <div>
        hello, Block
    </div>

    <ul>
        <li>foo</li>
        <li>bar</li>
    </ul>

    <table>
        <tr>
            <td>title</td>
        </tr>
    </table>

### 'type' Attribute

请不要在 link 和 script 标签中使用 type 属性（适用于适用 href 和 src 引用的标签）

    // bad
    <link rel="stylesheet" href="//www.domain.com/css/main.css" type="text/css">
    <script src="//www.domain.com/js/main.js" type="text/javascript"></script>

    // good
    <link rel="stylesheet" href="//www.domain.com/css/main.css">
    <script src="//www.domain.com/js/main.js"></script>

### Indentations

严格按照层级关系缩进。每级缩进为 4 个空格。

    // bad
    <!DOCTYPE html>
    <html>
    <head>
    </head>
    <body>
    </body>
    </html>

    // good
    <!DOCTYPE html>
    <html>
        <head>
        </head>
        <body>
        </body>
    </html>

### 'alt' and 'title' Attributes

尽量加上 `alt` 和 `title` 属性：

	// bad
	<a href="/index">Home</a>
	<img src="logo.png">

	// good
	<a href="/index" title="Home Page">Home</a>
	<img src="logo.png" alt="Site Logo">

### Entity References

在 UTF-8 编码下，可不用字符实体的，一律不用。

## LESS

### Naming Convensions

#### General Rules

- 使用半角小写英文字母和数字（不要以数字开头）
- 使用可读性好，描述实体或行为而非样式的命名
- 在可以理解且通用的情况下，可缩短 ID 和 Class 的命名
- 对于模块，使用 BEM 命名法

示例：

    // bad
	.left
	.btn-green
	.button-large
	.ftr
	#navigation

	// good
	.pull-left
	#nav
	.btn
	.btn-large
	.logo
	.dropdown__menu-list

#### Variables

在变量后添加类型标识，如 `font-size`、`color`；可同时使用 `light`、`base` 等关键字进一步区分：

	@gray-light: #ccc;
	@sans-font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
	@base-font-size: 14px;
	@warning-text-color: @danger-light;
	@warning-background-color: @danger-light;
	@box-border-radius-base: 3px;

#### Mixins

Mixin 需以 `()` 结尾；在可通用的场合，可以使用 class 来代替。

	// bad
	.borderless {
	  border: 0 none;
	}

	// good
	.borderless() {
	  border: 0 none;
	}

	.clearfix {
	  // ...
	}

	.box {
	  .clearfix;
	}

### Quotes

使用单引号：

	// bad
	body {
	  font-family: "Avenir New";
	}

	// good
	body {
	  font-family: 'Avenir New';
	}

### Selectors

- 优先使用 class 选择器
- ID 选择器用于样式唯一的元素
- 多个选择器需分行写，一行一个，逗号置于行尾，左大括号置于最后一个选择器尾部，并以一个空格隔开
- 避免标签选择器和 ID 或 class 选择器混用
- 避免冗长的选择器，尽量保持在 3~4 个以内
- 避免使用 `*`
- 对于项目中，class 选择器用于与 css 和 html 绑定，id 选择器用于 js 与 html 绑定

示例：

	// bad
	ul.online-users {}
	button.login {}
	#send-weibo.btn {}
	div.content {}
	.common-header .main-nav ui li {}

	[type=text], [type=email] {}

	// good
	.main-menu {}
	.online-users {}
	.btn-login {}
	.main-nav li {}

	[type=text],
	[type=email] {}

### Values and Units

- 值和单位使用小写；
- 使用简写的十六进制颜色值；
- 省略 `0` 后的单位；
- 如果值小于 `1`，省略小数点前的 `0`。

示例：

	/* bad */
	header {
	  color: #DCDCDC;
	  font-size: 12PX;
	  margin: 0px;
	  opacity: 0.7;
	}

	/* good */
	header {
	  color: #ddd;
	  font-size: 12px;
	  margin: 0;
	  opacity: .7;
	}

## Commas, Whitespacesm, Colons and Semicolons

- 逗号置于单词后面，并在逗号后面加入空格
- 冒号需紧跟着属性，和值之间以一个空格分割
- `([` 后不需要插入空格，`)]` 前不需要插入空格
- 请不要省略分号

示例：

	// bad
	[ type=text ],[type=email]{
	  font-family:Avenir,Arial;
	  font-weight: 400
	}

	.btn {
	  background-image: url( btn-bg.png );
	}

	// good
	[type=text],
	[type=email] {
	  font-family: Avenir, Arial;
	  font-weight: 400;
	}

	.btn {
	  background-image: url(btn-bg.png);
	}

### Properties

- 属性以字母顺序排列，前缀不参与排序，但前缀之间需排序，W3C 标准语法放在末尾
- 优先使用属性的简写，但注意避免不必要的复写
- LESS mixin 置于最上，以字母排序
- LESS mixin 若无参数，可省略 `()`
- LESS mixin 和标准 CSS 属性之间以一个空行分割

示例：

	// bad
	body {
	  font: 16px/1.5 Arial;
	}

	h1 {
	  font: 16px/1 Avenir, Arial;
	}

	nav {
	  margin-bottom: 10px;
	  margin-left: 10px;
	  margin-top: 10px;
	}

	div {
	  width: 100px;
	  margin: 10px;
	  box-sizing: border-box;
	  -webkit-box-sizing: border-box;
	  -moz-box-sizing: border-box;
	  .clearfix();
	}

	// good
	h1 {
	  font-family: Avenir, Arial;
	  line-height: 1;
	}

	nav {
	  margin: 10px 10px 10px 0;
	}

	nav li {
	  padding: 10px;
	}

	nav li li {
	  padding-left: 30px;
	}

	div {
	  .clearfix;

	  -moz-box-sizing: border-box;
	  -webkit-box-sizing: border-box;
	  box-sizing: border-box;
	  margin: 10px;
	  width: 10px;
	}

### Browser Compatibilities

使用 [Modernizr](http://modernizr.com/) 和条件注释来区分不同样式。

	<html class="js no-touch cssanimations csstransforms csstransforms3d csstransitions video audio localstorage sessionstorage boxsizing mediaqueries placeholder no-ie8compat formvalidation">
	  <!--[if IE 6]>
	  <body class="ie ie6">
	  <![endif]-->
	  <!--[if IE 7]>
	  <body class="ie ie7">
	  <![endif]-->
	  <!--[if IE 8]>
	  <body class="ie ie8">
	  <![endif]-->
	  <!--[if not IE ]>
	  <body>
	  <![endif]-->

	.placeholder {
	  input {
	    &::-webkit-input-placeholder {}
	  }

	  .placeholder-polyfill {
	    display: none !important;
	  }
	}

	.no-placeholder {
	  input {}

	  .placeholder-polyfill {
	  	display: block;
	  }
	}

#### Hacks

一般而言，避免使用如下的 hacks：

- `property: \0`（IE 8 - 10）
- `property: value\9\0`（IE 9 - 10）
- `*property: value`（IE 6 - 7）
- `_property: value`（IE 6）

在 IE 6-7 下简短几句属性可解决的问题可以使用 hacks：

	* {
	  box-sizing: border-box;
	  *behavior: url(boxsizing.htc);
	}

	.clearfix {
	  *zoom: 1;
	}
