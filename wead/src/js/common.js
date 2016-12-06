import apis from './libs/apis';
import configs from './libs/configs';
import modaler from './libs/modaler';
import notice from './libs/notice';
import fetch from './libs/fetch';
import urler from './libs/urler';
import tabler from './libs/table';
import collapseTable from './libs/collapseTable';
import uploader from './libs/uploader';

// 将接口和配置信息绑定到 window 对象上
window.apis = apis;
window.configs = configs;
window.modaler = modaler;
window.notice = notice;
window.requester = fetch;
window.urler = urler;
window.tabler = tabler;
window.collapseTable = collapseTable;
window.uploader = uploader;

// 绑定侧边栏关闭事件
$('body').on('click', '#notice-close', notice.close);

// 为 datepicker 添加 after (css 无法为 input 添加 :after)
let datepickerTriangle = $('<i class="fa fa-caret-down"></i>');
$('.w-datepicker input').after(datepickerTriangle);

// 初始化 datepicker 控件
$('.w-datepicker [type="text"]').datepicker({
    autoclose: true,
    format: 'yyyy-mm-dd',
    language: 'zh-CN'
});

// 点击预览图片时，弹出预览弹窗
$('.preview-thumbnail').click(e => {
    let img = $(e.currentTarget).attr('src');
    modaler.preview({ address: img });
});

// 顶部栏
// -----------------------------------------------------------------------------

// 登出
$('#logout').click(e => {
    requester.get('/logout.do').then(data => {
        if (data.data === true) {
            location.href = '/#proj_name#/html/user/login.html';
        } else {
            modaler.tip('退出失败');
        }
    });
});

// 获取通知数据
if ($('#notice-num').length > 0) {
    window.requester.get('/external/tips/getUnread.do').then(data => {

        // 当通知数量大于 0 时才显示，否则不现实
        if (data.data.cnt > 0) {
            $('#notice-num').show();
            $('#notice-num').html(data.data.cnt);
        } else {
            $('#notice-num').hide();
        }
    });
}

// 设置用户名
$('#notice-username').html(localStorage.getItem('username'));

// 侧边栏
// -----------------------------------------------------------------------------

// 根据 URL 来匹配应该激活哪个列表项
$('.sidebar-menu .treeview').each((index, element) => {
    let $self = $(element);
    let $subMenu = $('.treeview-menu', $self);
    let path = location.pathname; // 获得 url 上的文件地址

    // 当前有子菜单
    if($subMenu.size() > 0) {

        // 先移除所有激活状态
        $self.removeClass('active')

        // 循环子菜单项得到
        $subMenu.find('li > a').each((subIndex, subMenu) => {
            let subLink = $(subMenu).attr('href');
            if(path === subLink) {
                $self.addClass('active');
                $self.find('.treeview-menu').addClass('menu-open').css('display', 'block');
                $(subMenu).addClass('w-sub-active');
            }
        });

    // 当前没有子菜单
    } else {
        let link = $self.find('> a').attr('href');
        path === link ? $self.addClass('w-active') : $self.removeClass('w-active');
    }
});

// 有子菜单项的附加操作
$('.sidebar-menu li').click((e) => {
    let $self = $(e.currentTarget);
    if($self.find('.w-sub-active').length > 0) {
        $self.addClass('w-active');
    }
});

// 表格
// -----------------------------------------------------------------------------

// 表格中某一项目需要展开
$('body').on('click', '.w-collapse-toggle', (e) => {
    let $self = $(e.currentTarget);
    let $collapseTd = $self.parents('tr').find('.w-collapse-td');

    // 打开 collapse
    if($collapseTd.hasClass('w-collapse-td-close')) {
        $collapseTd.removeClass('w-collapse-td-close').addClass('w-collapse-td-open');
        $self.html('收起详情<i class="fa fa-caret-up"></i>');

    // 关闭 collapse
    } else {
        $collapseTd.removeClass('w-collapse-td-open').addClass('w-collapse-td-close');
        $self.html('展开详情<i class="fa fa-caret-down"></i>');
    }
});

// 表单
// -----------------------------------------------------------------------------

// 将表单中的 radio 替换成 iCheck 样式
$('.w-form [type="radio"]').iCheck({
    checkboxClass: 'icheckbox_flat-blue',
    radioClass: 'iradio_flat-blue'
});

// 文本内容菜单，如后台的客户列表中的一系列步骤
// -----------------------------------------------------------------------------

// 内容内部导航条下拉菜单
$('.content-sub-menu').on('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    let $self = $(e.currentTarget);
    let $menu = $self.find('ul');
    let $toggle = $self.find('>a');

    $menu.slideToggle('fast', (e) => {

        // 判断当前是显示还是隐藏
        if ($menu.is(':visible')) {

            // 如果当前页面不是财务，则点击下拉列表高亮显示字体颜色
            if (!$toggle.attr('data-active')) {
                $toggle.addClass('active');
            }
        } else {

            // 如果当前页面不是财务，则点击 body 取消高亮显示字体颜色
            if (!$toggle.attr('data-active')) {
                $('.content-sub-menu > a').removeClass('active');
            }
        }
    });
});

// 内容导航条下按钮取消事件冒泡
$('.content-sub-menu > ul a').click((e) => {
    e.stopPropagation();
});

// 隐藏内容内部导航条下拉菜单
$('body').on('click', (e) => {
    let $toggle = $('.content-sub-menu > a');

    // 如果当前页面不是财务，则点击 body 取消高亮显示字体颜色
    if (!$toggle.attr('data-active')) {
        $('.content-sub-menu > a').removeClass('active');
    }

    $('.content-sub-menu ul').slideUp('fast');
});
