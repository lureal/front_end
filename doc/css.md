# CSS Style Guide

## CSS 

## 编写 CSS 样式时，我习惯遵守这些规则：
    - class 名称以连字符（-）连接，除了下文提到的 BEM 命名法；
    - 缩进 4 空格；
    - 声明拆分成多行；
    - 声明以相关性顺序排列，而非字母顺序；
    - 有前缀的声明适当缩进，从而对齐其值；
    - 缩进样式从而反映 DOM；
    - 保留最后一条声明结尾的分号。

示例：
.widget{
    padding:10px;
    border:1px solid #BADA55;
    background-color:#C0FFEE;
    -webkit-border-radius:4px;
       -moz-border-radius:4px;
            border-radius:4px;
}
    .widget-heading{
        font-size:1.5rem;
        line-height:1;
        font-weight:bold;
        color:#BADA55;
        margin-right:-10px;
        margin-left: -10px;
        padding:0.25em;
    }

## 命名规范

   - 一般情况下我都是以连字符（-）连接 class 的名字（例如 .foo-bar 而非 .foo_bar 或 .fooBar），不过在某些特定的时候我会用 BEM（Block, Element, Modifier）命名法。

BEM 命名法可以使得选择器更规范，更清晰，更具语义。

该命名法按照如下格式：
    .block{}
    .block__element{}
    .block--modifier{}

其中：
    .block 代表某个基本的抽象元素；
    .block__element 代表 .block 这一整体的一个子元素；
    .block--modifier 代表 .block 的某个不同状态。

# HTML 中的 class
    - 为了确保易读性，在 HTML 标记中用两个空格隔开 class 名，增加的空格应当可以使得在使用多个 class 时更易阅读与定位。

例如：

    <div class="foo--bar  bar__baz">

## JavaScript 钩子
    - 千万不要把 CSS 样式用作 JavaScript 钩子。把 JS 行为与样式混在一起将无法对其分别处理。

    - 如果你要把 JS 和某些标记绑定起来的话，写一个 JS 专用的 class。简单地说就是划定一个前缀 .js- 的命名空间，例如 .js-toggle，.js-drag-and-drop。这意味着我们可以通过 class 同时绑定 JS 和 CSS 而不会因为冲突而引发麻烦。

例如： 
    <th class="is-sortable  js-is-sortable">
    </th>
    上面的这个标记有两个 class，你可以用其中一个来给这个可排序的表格栏添加样式，用另一个添加排序功能。 

## 在 CSS 里坚决不要用 ID。 
参考地址（https://segmentfault.com/a/1190000000388784）

腾讯前端规范： http://alloyteam.github.io/CodeGuide/#folder-naming