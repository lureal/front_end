import apis from './libs/apis';
import configs from './libs/configs';
import modaler from './libs/modaler';
import notice from './libs/notice';
import fetch from './libs/fetch';
import urler from './libs/urler';
import tabler from './libs/table';
import collapseTable from './libs/collapseTable';
import uploader from './libs/uploader';
import { urlAddParam } from './libs/tools';
import { bindCloseDropdownEvt } from './libs/dropdown-select';

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
    language: 'zh-CN',
    format: 'yyyy-mm-dd'
});

// 绑定下拉框关闭事件
bindCloseDropdownEvt();

// 检索 html, 并为 href 中的链接添加上 cid 字段，cid 字段从 url 中获取
urlAddParam();

// 点击预览图片时，弹出预览弹窗
$('body').on('click', '.preview-thumbnail', e => {
    let img = $(e.currentTarget).attr('src');
    modaler.preview({ address: img });
});

// 顶部栏
// -----------------------------------------------------------------------------

// 渲染公司名称
requester.get('/external/custom/getCustomName.do').then(data => {

    // 当 customId 是 0 时，代表当前没开户，没开户则不显示公司名称，客户名称和 ID
    if (data.data.customId === 0) {
        $('#breadcrumb-company').parent().hide();
        
    // 如果当前产品名为空，则不显示产品名称
    } else if (data.data.productName === '' || data.data.productName === null) {
        $('#notice-username').html(data.data.customName);
        $('#breadcrumb-company').html(`${data.data.customName}（ID: ${data.data.customId}）`);

    } else {
        $('#notice-username').html(data.data.customName);
        $('#breadcrumb-company').html(`${data.data.customName} - ${data.data.productName}（ID: ${data.data.customId}）`);
    }

    // 如果当前没开户，则显示开户按钮
    if (data.data.customId === 0) {
        $('#open-aptitude').show();

        // 根据当前所在的页面标识开户弹窗
        if (location.href.indexOf('/wdsp/overview/index') !== -1) {
            createAptitudeFirst({ isHomepage: true });
        
        } else if(location.href.indexOf('/wdsp/aptitude/edit') !== -1) {
            createAptitudeFirst({ isOpenAptitude: true })

        } else if (location.href.indexOf('/wdsp/settle/reset-pwd') !== -1) {
            createAptitudeFirst({ isOpenAptitude: true });
            
        } else {
            createAptitudeFirst({});
        }

    // 如果当前已开户则显示查看资质按钮
    } else {
        $('#view-aptitude').show();
    }
});

// 顶部实时消耗/余额
$('#navbar-real-time').click(e => {
    let isFire = $(e.currentTarget).attr('data-isFire'); // 标识当前是否被点击

    // 如果当前没被点击过
    if (isFire === '0') {
        $(e.currentTarget).attr('data-isFire', '1');
        $(e.currentTarget).parent().addClass('active');
        let $ul = $(e.currentTarget).next();
        let $loading = $ul.find('.real-time-loading');
        let $detail = $ul.find('.real-time-detail');

        // 显示 loading 隐藏实际数据
        $loading.show();
        $detail.hide();

        // 显示实时数据框
        $ul.show();

        // 发起请求获取实时数据
        requester.get('/deal/overview/getRtConsume.do').then(data => {

            // 设置实际的数值
            $('#real-time-balance').html((data.data.balance / 100).toFixed(2));
            $('#real-time-consume').html((data.data.consume / 100).toFixed(2));
            $('#real-time-limit').html(data.data.quota === null ? 0 : (data.data.quota / 100).toFixed(2));

            // 隐藏 loading，显示实时数据
            $loading.hide();
            $detail.show();
        });

    // 当前被点击过
    } else {
        $(e.currentTarget).attr('data-isFire', '0');
        $(e.currentTarget).parent().removeClass('active');
        $(e.currentTarget).next().hide(); // 隐藏实时数据框
    }
});

// 修改限额
$('#real-time-edit-quota').click(e => {
    let tpl = $('#navbar-edit-quota-tpl').html();
    modaler.diy({
        ctn: tpl
    });

    // 确定修改按钮
    $('#modal-edit-quota-btn').unbind('click').bind('click', e => {
        let value = $('#modal-edit-quota-input').val();

        // 数据校验
        if (
            value === '' ||
            window.isNaN(Number(value)) ||
            Number(value) === 0
        ) {
            $('.modal-diy-body').addClass('error');
            return;
        }

        // 发送请求
        requester.get('/deal/overview/updateConsumeQuota.do', {
            quota: parseInt(parseFloat(value * 100).toPrecision(12))

        }).then(data => {
            if (data.data === true) {
                $('#modal-diy').modal('hide');
                $('#real-time-limit').html($('#modal-edit-quota-input').val())

            } else {
                $('#modal-diy').modal('hide');
                modaler.tip('修改失败');
            }
        });
    });
});

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
        link = link.slice(0, link.indexOf('?cid='));
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

// 登出
$('#logout').click(e => {
    requester.get('/logout.do').then(data => {
        if (data.data === true) {
            location.href = '/dsp/user/login';
        } else {
            modaler.tip('退出失败');
        }
    });
});

/**
 * 当用户需要开户的时候，弹出开户弹窗
 * 用户点击界面中的按钮时，则弹出弹窗提示用户去开户
 * @param {Boolean} isHomepage - 标识当前是否在首页，如果是，则显示开户弹窗，如果不是，则不显示
 */
function createAptitudeFirst({ isHomepage = false, isOpenAptitude = false }) {

    if (isHomepage) {

        // 弹出开户弹窗
        modaler.diy({
            ctn: $('#create-aptitude1-tpl').html(),
            className: 'overview-create-aptitude1-modal'
        });

        urlAddParam();
    }

    // 检索界面中的按钮和链接，将默认事件和链接替换掉，变成弹出弹窗
    // header
    $('.main-header #navbar-real-time').unbind('click').bind('click', e => {
        modaler.diy({
            ctn: $('#create-aptitude2-tpl').html(),
            className: 'overview-create-aptitude2-modal'
        });
        urlAddParam();
    });

    // sidebar
    $('.main-sidebar').find('a').each((index, el) => {
        let href = $(el).attr('href');
        if (href.indexOf('/wdsp/overview/index') === -1) {
            $(el).attr('href', 'javascript:void(0);');
        }
    });
    $('.main-sidebar').find('a, button').each((index, el) => {
        let href = $(el).attr('href');
        if (href.indexOf('/wdsp/overview/index') === -1) {
            $(el).unbind('click').bind('click', e => {
                e.stopPropagation();

                modaler.diy({
                    ctn: $('#create-aptitude2-tpl').html(),
                    className: 'overview-create-aptitude2-modal'
                });

                urlAddParam();
            });
        }
    });

    // content-wrapper
    // 由于正文内容又服务器返回，属于异步数据，所以这里需要定时去替换内容避免服务器返回数据后出现事件或跳转
    if (!isOpenAptitude) {
        setInterval(() => {
            $('.content-wrapper').find('a').attr('href', 'javascript:void(0);');
            $('.content-wrapper').find('a, button').unbind('click').bind('click', e => {
                e.stopPropagation();

                modaler.diy({
                    ctn: $('#create-aptitude2-tpl').html(),
                    className: 'overview-create-aptitude2-modal'
                });

                urlAddParam();
            });
        }, 500);
    }
}