/*!
 * 客户详情
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var sidebar = require('./modules/sidebar.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
var upload = require('./modules/upload.js');
var urler = require('./modules/urler.js');
var header = require('./modules/header.js');

// 初始化菜单
sidebar.manage({
    title: '客户详情',
    active: 'customer'
});

// 初始化顶部栏
header.manage({
    title: '客户详情'
});

// 根据 id 从服务器获取数据
ajax.get({
    url: '/manage/custom/get.do',
    param: {
        customId: urler.normal().id
    },
    cb: function(data) {

        // 填充数据
        // 填充公司名称
        $('#custom-name').val(data.data.customName);

        // 填充产品名称
        $('#product-name').val(data.data.productName);

        // 填充 DSP 行业
        select2.init({
            url: '/select/listInnerTrades.do',
            title: '客户详情',
            cb: function(_data) {
                var tpl = $('#type-tpl').html();
                $('#inner-trades').html(_.template(tpl)(_data));
                $('#inner-trades').select2({
                    placeholder: '选择 DSP 行业'
                }).select2('val', data.data.tradeId);
            }
        });

        // 渲染营业执照模板
        $('#business-license').html(_.template($('#file-detail-tpl').html())({
            action: '/upload.do',
            title: '营业执照',
            name: 'uploadFile',
            url: data.data.businessLicense,
            img: data.data.businessLicense
        }));

        // 初始化上传组件
        upload.file($('#business-license'), modal, '营业执照', function(data) {

            // 渲染图片和链接
            $('#business-license .snapshats-link').attr('href', data.data.dlUrl);
            $('#business-license .snapshats-preview').attr('src', data.data.dlUrl);

            // 绑定数据
            $('#business-license .file-submit')
                .attr('data-url', data.data.dlUrl)
                .html('附件已上传！');
        });

        // 填充 icp 备案
        $('#icp').html(_.template($('#file-detail-tpl').html())({
            action: '/upload.do',
            title: 'icp 备案',
            name: 'uploadFile',
            url: data.data.icpLicense,
            img: data.data.icpLicense
        }));

        // 初始化上传组件
        upload.file($('#icp'), modal, 'icp 备案', function(data) {

            // 渲染图片和链接
            $('#icp .snapshats-link').attr('href', data.data.dlUrl);
            $('#icp .snapshats-preview').attr('src', data.data.dlUrl);

            // 绑定数据
            $('#icp .file-submit')
                .attr('data-url', data.data.dlUrl)
                .html('附件已上传！');
        });

        // 填充其他资质附件
        _.each(data.data.otherLicenses, function(val) {
            var index = $('#add-qualification').attr('data-index');

            // 添加文件上传包含块
            $('#qualification').append('<div class="qualification-file qualification' + index + '"></div>');

            // 渲染上传组件
            $('.qualification' + index).html(_.template($('#file-detail-tpl2').html())({
                action: '/upload.do',
                title: '资质附件',
                name: 'uploadFile',
                url: val.url,
                fileName: val.name,
                img: val.url
            }));

            // 初始化上传组件
            upload.file($('.qualification' + index), modal, '其他资质', function(data) {

                // 渲染图片和链接
                $('.qualification' + index + ' .snapshats-link').attr('href', data.data.dlUrl);
                $('.qualification' + index + ' .snapshats-preview').attr('src', data.data.dlUrl);

                // 绑定数据
                $('.qualification' + index + ' .file-submit')
                    .attr('data-url', data.data.dlUrl)
                    .html('附件已上传！');
            });

            $('#add-qualification').attr('data-index', (index + 1));
        });

        // 初始化 wax 行业
        select2.init({
            url: '/select/listTrades.do?id=wax',
            title: '客户详情',
            cb: function(_data) {
                var tpl = $('#type-tpl').html();
                $('#wax-industry').html(_.template(tpl)(_data));
                $('#wax-industry').select2({
                    placeholder: '选择 WAX 行业'
                }).select2('val', data.data.waxTradeId);
            }
        });

        // 填充 wax 网站链接
        $('#wax-link').val(data.data.url);

        // 填充游戏ID
        if(data.data.gameId) {
            $('#game-ID').val(data.data.gameId);
        }

        // 填充媒体ID
        if(data.data.mediaId) {
            $('#media-ID').val(data.data.mediaId);
        }

        // 填充上报URL
        if(data.data.reportUrl) {
            $('#report-url').val(data.data.reportUrl);
        }


        // 填充微博 UID
        var uidListTpl = $('#uid-list-tpl').html();

        _.each(data.data.weiboUids, function(val) {
            $('#uid-list').append(_.template(uidListTpl)({
                name: val
            }))
        });

    }
});

// 添加其他资质
$('#add-qualification').click(function() {
    var index = $(this).attr('data-index');

    // 添加文件上传包含块
    $('#qualification').append('<div class="qualification-file qualification' + index + '"></div>');

    // 渲染上传组件
    $('.qualification' + index).html(_.template($('#file-tpl2').html())({
        action: '/upload.do',
        title: '资质附件',
        name: 'uploadFile'
    }));

    // 初始化上传组件
    upload.file($('.qualification' + index), modal, '其他资质', function(data) {

        // 渲染图片和链接
        $('.qualification' + index + ' .snapshats-link').attr('href', data.data.dlUrl);
        $('.qualification' + index + ' .snapshats-preview').attr('src', data.data.dlUrl);

        // 绑定数据
        $('.qualification' + index + ' .file-submit')
            .attr('data-url', data.data.dlUrl)
            .html('附件已上传！');
    });

    $(this).attr('data-index', (Number(index) + 1));
});

// 删除当前的其他资质
$('body').on('click', '.file-del', function() {
    $(this).parents('.qualification-file').remove();
});

// 添加微博 uid
$('#add-uid').click(function() {
    var uid = $('#uid-text').val();

    if(uid === '') {
        modal.nobtn({
            ctx: 'body',
            title: '客户详情',
            ctn: '请输入 uid'
        });
        return;
    }

    var tpl = $('#uid-list-tpl').html();
    $('#uid-list').append(_.template(tpl)({
        name: uid
    }));

    var uid = $('#uid-text').val('');
});

// 删除 uid
$('body').on('click', '.del-uid', function() {
    $(this).parents('li').remove();
});

// 提交客户
$('#submit').click(function() {

    // 获取数据
    var customName = $('#custom-name').val(); // 客户名称
    var productName = $('#product-name').val(); // 产品名称
    var innertrades = select2.getVal({ // DSP 行业 id
        id: '#inner-trades'
    });
    var businessLicense = $('#business-license .file-submit').attr('data-url') // 营业执照
    var icp = $('#icp .file-submit').attr('data-url'); // icp 备案
    var qualification = getQualification(); // 其他资质列表
    var waxTrade = select2.getVal({ // 获取 wax 行业 id
        id: '#wax-industry'
    });
    var url = $('#wax-link').val(); // 获取网站链接
    var uid = getUid(); // 获取 uid
    var gameId = $('#game-ID').val(); // 游戏id
    var mediaId = $('#media-ID').val(); // 媒体id
    var reportUrl = $('#report-url').val(); // 上报url

    // // 测试，打印数据
    // console.log(customName);
    // console.log(productName);
    // console.log(innertrades);
    // console.log(businessLicense);
    // console.log(icp);
    // console.log(qualification);
    // console.log(waxTrade);
    // console.log(url);
    // console.log(uid);

    // 校验数据
    if(customName === '' || productName === '' || innertrades === null ||
       businessLicense === undefined || icp === undefined || qualification === false) {
           modal.nobtn({
               ctx: 'body',
               title: '客户详情',
               ctn: '请确保录入公司名称，产品名称，选择 DSP 行业，上传营业执照，上传 icp 备案，填写完所有添加的资质附件字段（如果不需要，请删除当前资质），填写微博行业，网站链接和微博 UID'
           })
           return;
       }

    // 构造服务器所需要的数据格式
    var param = {
        customId: urler.normal().id,
        customName: customName,
        productName: productName,
        tradeId: innertrades,
        businessLicense: businessLicense,
        icpLicense: icp,
        // otherLicenses: qualification,
        waxTradeId: waxTrade,
        url: url,
        gameId: gameId,
        mediaId: mediaId,
        reportUrl: reportUrl,
        weiboUids: JSON.stringify(uid === false ? [] : uid)
    };

    _.each(qualification, function(val, index) {
        param['otherLicenses[' + index + '].name'] = val.name;
        param['otherLicenses[' + index + '].url'] = val.url;
    });

    // 提交数据
    ajax.post({
        url: '/manage/custom/submit.do',
        param: param,
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '客户详情',
                    ctn: '客户详情成功',
                    event: function() {
                        location.href = '/#proj_name#/html/manage/customer/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '客户详情',
                    ctn: data.message
                });
            }
        }
    });
});

/**
 * 获取其他资质列表的数据
 * @return 如果添加的资质没有填写完则返回 false 如果填写完则返回填写的数据列表
 */
function getQualification() {
    var qualificationArr = []; // 资质数组

    $('.qualification-file').each(function() {
        var name = $(this).find('.file-name').val();
        var url = $(this).find('.file-submit').attr('data-url');

        qualificationArr.push({
            name: name,
            url: url
        });
    });

    var isPass = true;
    if(qualificationArr.length > 0) {
        _.each(qualificationArr, function(val, index) {
            if(val.name === '' || val.url === '' || val.url === undefined) {
                isPass = false;
            }
        });
    }

    if(isPass) {
        return qualificationArr;
    } else {
        return false;
    }
}

/**
 * 获取微博 uid
 * @return 如果当前没有 uid 则返回 false，否则则返回 实际数据
 */
function getUid() {
    var uids = [];

    $('.wbuid').each(function() {
        var uid = decodeURIComponent($(this).attr('data-uid'));
        uids.push(uid);
    });

    if(uids.length < 1) {
        return false;
    }

    return uids;
}
