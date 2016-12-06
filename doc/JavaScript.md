# JavaScript Style Guide

## Naming Conventions

### Codes

- 命名需选择有意义的名字，除了默认成俗的名字外，尽量不要使用简写形式
- 虽然 JavaScript 支持 Unicode 字符，但请使用 `[a-zA-Z0-9_\$]`
- 使用[驼峰命名法](http://zh.wikipedia.org/wiki/%E9%A7%9D%E5%B3%B0%E5%BC%8F%E5%A4%A7%E5%B0%8F%E5%AF%AB)（camel case），变量和函数使用小驼峰，如 `getElementById`，类、构造函数和枚举类型使用大驼峰，如 `DocumentFragment`
- 常量所有字母均大写并使用 `_` 分割单词，如 `Number.MAX_VALUE`
- 尊重惯例，避免使用常用库、框架名，如 `$ = {}`、`jQuery = {}`、`_ = {}`
- 使用 `_` 作为私有变量的前缀，如 `_index = arr.indexOf(value)`
- `Boolean` 变量、函数请加上 `is`、`has` 前缀
- 当保存 `this` 对象时，尽量使用可对应上下文的命名，或使用 `_this`

示例：

    // bad
    valid = true;
    k = 'word'
    hasAttr = function (e, a) {
      var _a = e.getAttribute(a);
      return _a === null;
    };

    $form.on('submit', function(){
      var that = this;
    });

    // good
    isValid = true;
    keyword = 'word';
    hasAttr = function (elem, attr) {
      var _attr = elem.getAttribute(attr);
      return _attr === null;
    }

    $form.on('submit', function(){
      var rootForm = this;

      // or

      var _this = this;
    });

## Strict Mode

建议使用 `'use strict'`。

## Commas

逗号一律放在后面:

    var foo = 1,
        bar = false,
        arr = [
          1,
          2
        ],
        obj = {
          foo: 'foo',
          bar: 'bar'
        }
    ;

    function (argv1,
              argv2) {}

禁止添加多余的逗号（[IE bugs](http://tobyho.com/2014/01/07/js-trailing-comma-remover/)）：

    // bad
    var obj = {
          foo: 'foo',
          bar: 'bar',
        };

## Whitespaces and Semicolons

- 请在关键字、变量、操作符等等合适的位置插入空格
- `([{` 后不需要插入空格，`)]}` 前不需要插入空格
- 请不要省略分号

示例：

    // good
    var a = 'hello', b, c;

    b = function(){
      c.call(data, context);
    };

    c = function (data, context) {
      if (data && context) {
        // ..
      } else {
        // ..
      }

      switch (context) {
        case true:
          break;
        case false:
          break;
        default:
          // ..
      }
    };

    for (var i = 0; i < len; i++) {
      // ..
    }

    while (true) {
      // ..
    }

    b = 1 + 2;
    c = (b + 1) / 2;
    b = (b ? 1 : 2) * 3;


## Braces, Brackets and Square Brackets

左大括号（花括号）置于行尾，右大括号放在代码块的下一行：

    if (foo) {
      // ..
    } else {
      // ..
    }

    foo = {
      bar: 1
    };

    bar = function(){
      // ..
    };

所有代码块需放在大括号（花括号）内：

    // bad
    if (false) return;

    while (true)
      fn();

    arr.map(function (elem) { return elem * 2; });

    // good
    if (false) {
      return;
    }

    while (true) {
      fn();
    }

    arr.map(function (elem) {
      return elem * 2;
    });

    [1, 2, 3].map(x => x * 2) // 2, 4, 6

括号、方括号通常放置在一行，如果遇到过长需要换行的时候，参考大括号（花括号）：

    // good
    var foo, bar;

    bar = (foo ? 'foo' : 'bar') + 'foobar';

    fn(
      null,
      foo,
      bar
    );

    foo = [1, 2, 3];

    bar = [
      1,
      2,
      3,
      4
    ];

## Indentations

- 以 4 个空格为单位
- 函数参数以第一个参数或左括号为基准对齐
- 多行三元运算符以第一个运算对象为基准对齐，运算符置于行尾
- 多行运算符以第一个运算对象为基准对齐，运算符置于行尾
- `if`、`while` 以第一个条件为基准对齐
- `for` 以各个表达式各自对齐

示例：

    // good
    var str = 'hello' +
              ' ' +
              'world';

    foo = function (arg1, arg2,
                    arg3, arg4,
                    arg5) {
    };

    var isEmpty = str.length == 0 ?
                  true :
                  false;

    if(foo === true &&
       bar === false ||
       zoo !== 12) {}

    for (var i = 0,
             j = 0,
             m = 0;
         i < 10 &&
         j < 10 &&
         m > 0;
         i++) {}

 ## Chains

 链式写法请遵循以下规则：

 - 若链过长，分多行放置，`.` 放在行首

 示例：


    $('body')
        .css('background', '#888')
        .html('<div></div>');

## Quotes

使用单引号 `'`。避免使用 `\` 或 `\"`

    // bad
    elem.innerHTML = '<div class=\'sidebar\'></div>';
    elem.innerHTML = "<div class='sidebar'></div>";

    // good
    elem.innerHTML = '<div class="sidebar"></div>';

## Variables

使用变量时，请遵循以下规范：

- 任何变量使用前均需在代码块顶部通过 `var` 声明（循环用的临时变量可例外）
- 如代码块有简单的中断逻辑（如参数数量不符合要求），可将变量声明放置在该逻辑后
- 声明的同时有赋值的变量需独占一行，下一行变量需以第一个变量对齐，并以 `,` 结尾
- 仅有声明并没有赋值的变量放在其他变量后，可写在一行
- 避免直接在函数内调用、设置外部作用域的变量，建议使用参数传入

示例：

    // bad
    var globalVar;
    window.onload = function(){
      var arr = [];

      globalVar = 'global var';

      var fn = function(){};
    };

    var fn = function (data) {
      var a = 'Hello'
        , b, c;

      if (!data) {
        return false;
      }
    };

    // good
    window.onload = function(){
      var arr = [],
          globalVar = 'global var',
          fn, fetchUser
      ;

      for ( var i = 0; i < 10; i++ ) {
        arr.push( i );
      }

      fn = function(){};

      window.globalVar = globalVar;
    };

    var fn = function (data) {
      if (!data) {
        return false;
      }

      var a = 'Hello'
        , b, c;

      return data;
    };

    window.fn = fn();

## Types

优先使用原始类型（primitive type）：

    // bad
    function (data) {
      var isValid = new Boolean(data);

      if (isValid) {} // always be true
    }

    var foo, bar;
    foo = new String('Hello');
    bar = new String('World');
    foo + bar; // 'HelloWorld'

    // good
    function (data) {
      var isValid = Boolean(data);

      if (isValid) {}
    }

    var foo, bar;
    foo = 'Hello';
    bar = 'World';

优先使用字面量（Literal）：

    // bad
    var arr = new Array(1, 2),
        foo = new Object()
    ;

    foo.bar = 'foobar';

    // good
    var arr = [1, 2],
        foo = {
          bar: 'foobar'
        }
    ;

在操作变量时，对变量进行类型转换：

    // bad
    var foo = 123,
        bar = '321'
    ;

    foo + bar; // '123321'

    // good
    foo + parseInt(bar, 10); // 444

## Numbers

仅使用 `parseInt`、`Math.floor`、`Number` 等方式转换数字；可指定进制的，请勿省略进制：

    // bad
    parseInt(foo);
    bar = +foo;
    bar = new Number(foo);
    bar = foo >> 0;

    // good
    parseInt(foo, 10);
    bar = Number(bar);

## Objects

- 使用字面量
- 不要使用保留字
- 使用可读性好的同义词
- 使用点 `.` 访问属性，当属性名为变量时使用 `[]`

示例：

    // bad
    var foo = new Object();
    foo['klass'] = 'human';
    foo['private] = true;

    if (foo['klass']) {}

    // good
    var foo = {
      type: 'human',
      hidden: true
    };

    if (foo.type) {}

    function getProp (prop) {
      return this[prop];
    }

    getProp.call(foo, 'hidden');

## Arrays

- 使用字面量
- 添加、删除数组元素时，尽量使用 `push`、`pop`、`splice` 等函数

## Functions

- 类，构造函数，请使用 `function name() {}` 方式声明函数
- 函数参数部分（括号部分）需以一空格和 `function`、`function_name` 和花括号分隔开；无参数的匿名函数可省略空格
- 在有模块工具的情况下尽量将功能封装成模块，在没模块工具的情况下，尽量将功能封装成函数
- 避免在循环，条件判断语句中使用函数声明，不建议在循环，条件判断语句中使用函数表达式

## Eval

除编写类、插件库外，请勿使用 `eval()`。

## With

为了保持代码清晰，任何时候都不要使用 `with(){}`。

## Exceptions

`try..catch` 有严重性能问题（[jsPerf](http://jsperf.com/try-catch-error-perf/64)），因此不建议过度依赖 `try..catch` 进行异常处理

## Conditional Expressions and Comparisons

- 尽量使用 `===`、`!==`
- 尽量使用 `!` 来做 `true` / `fasle` 判断
- 多使用内置或第三方函数检测实例，如 `Array.isArray`、`_.isString`

示例：

    // bad
    if (arr.length == 3) {}

    if (isValid != true) {}

    if (arr instanceof Array) {}

    // good
    if (arr.length === 3) {}

    if (!isValid) {}

    if (Array.isArray(arr)) {}

## jQuery

建议使用以下编码风格：

    // 变量区域
    var foo = '';
    var bar = '';
    var cache = {};

    // 初始化
    init();

    // 事件区域
    $('body').on('click', function() {});
    $('div').on('click', function() {});

    // 功能函数区域
    function init() {}
    function fn() {}

避免频繁操作 `DOM` 元素，请使用 `underscore` 或 `lodash` 等工具渲染模板。

在变量名前添加 `$`：

    var $form = $(this),
        _$select = $form.find('select');

缓存元素或使用 `chains`：

    // bad
    $('button').on('click', callback);
    $('button').prop('disabled', false);

    // good
    $('button')
      .on('click', callback)
      .prop('disabled', false);

    $form = $('form');

    $.ajax().then(function(){
      $form;
    });

使用高级 [CSS selector](http://api.jquery.com/category/selectors/)：

    // bad
    $('div').first();

    $('input').each(function(){
      if ($(this).css('display') !== 'none') {}
    });

    // good
    $('div:first');

    $('input:not(:hidden)').each(function(){});

合理选择 context 和 `find`：

    // bad
    $('nav').find('a');
    $('a', 'nav');
    $('a', $nav);

    // good
    $('nav a');
    $('nav > a');
    $('a', document.getElementById('nav'));
    $('a', $nav[0]);
    $nav.find('a');

使用 `on`：

    // bad
    $('button').live('click', callback);
    $('button').click(callback);

    // good
    $(document).on('click', 'button', callback);
    $('button').on('click', callback);

使用 `each` 来减少判断语句：

    // bad
    var $body = $('body')
    if ($body.length) {
      // ..
    }

    // good
    $('body').each(function(){
      $body = $(this);
    });
