const _ = window._;
const tabler = window.tabler;

// 渲染表格
tabler.render({
    url: '/external/manage/listPlatforms.do',
    tpl: $('#customers-tpl').html(),
    container: '#customers'
});
