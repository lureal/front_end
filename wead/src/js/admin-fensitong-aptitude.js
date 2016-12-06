const _ = window._;
const tabler = window.tabler;
const modaler = window.modaler;
import urler from './libs/urler';
import { convertTimestamp } from './libs/tools';
var cachePassStatus = 1; // 缓存通过状态，2 -> 不通过 1 -> 通过
var updateNumber = 0; // 更新的数量

// 获取未处理的发票申请的数量
requester.get('/external/manage/getInvoiceUndo.do', { customId: urler().userId }).then(data => {
    if (data.data.cnt > 0) {
        $('#invoice-notice-num').show().html(data.data.cnt);
    }
});

// 获取公司名，并渲染到页面中
$('#breadcrumb-company').html(decodeURIComponent(urler().company));
$('#box-company').html(decodeURIComponent(urler().company));

// 获取 url 后面的 id 拼接到内容导航的后面
$('.content-nav-link').each((index, el) => {
    let cacheHref = $(el).attr('href');

    cacheHref += '?id=' + urler().id;
    cacheHref += '&userId=' + urler().userId;
    cacheHref += '&company=' + urler().company;

    if (urler().f) {
        cacheHref += '&f=' + urler().f;
    }

    $(el).attr('href', cacheHref);
});

// 如果当前审核失败，只能查看账户，则隐藏多余的项
if (!urler().f) {
    $('#content-nav-finance').show();
}

// // 渲染资质详情
// if (!urler().f) {
//     requester.get('/external/manage/getBusinessCompare.do', { id: urler().id }).then(data => {

//         // 微博账号
//         setVal('#account', 0, 'weiboAccount', data);
//         checkUpdate(data, 'weiboAccount', '#account');

//         // 微博 UID
//         setVal('#uid', 0, 'uid', data);
//         checkUpdate(data, 'uid', '#uid');

//         // 联系人姓名
//         setVal('#contact', 0, 'contactName', data);
//         checkUpdate(data, 'contactName', '#contact');

//         // 公司名称
//         setVal('#company-name', 0, 'companyName', data);
//         checkUpdate(data, 'companyName', '#company-name');

//         // 网站 url
//         setVal('#url', 0, 'url', data);
//         checkUpdate(data, 'url', '#url');

//         // 通讯地址
//         setVal('#address', 0, 'address', data);
//         checkUpdate(data, 'address', '#address');

//         // 联系电话
//         setVal('#phone', 0, 'phone', data);
//         checkUpdate(data, 'phone', '#phone');

//         // 商务经理邮箱
//         setVal('#sales-email', 0, 'salesEmail', data);
//         checkUpdate(data, 'salesEmail', '#sales-email');

//         // 行业
//         requester.get('/select/listTrades.do', { id: 'fans' }).then(_data => {

//             // 循环获得行业数据
//             for (let item in _data.data) {

//                 // 确定行业名称
//                 if (item === data.data.newInfo.weiboTradeId) {
//                     $('#industry').val(_data.data[item]);
//                 }
//             }
//         });

//         // 营业执照/微博截图
//         $('#pic').find('#pic-url').html(data.data.newInfo.businessLicense.slice(0, 10) + '...');
//         $('#pic').find('#pic-download').attr('data-url', data.data.newInfo.businessLicense);
//         $('#pic-download-preview')
//             .show()
//             .find('img')
//             .attr('src', data.data.newInfo.businessLicense);
//         checkUpdate(data, 'businessLicense', '#pic');

//         // 设置更新的数量
//         if (updateNumber > 0) {
//             localStorage.setItem('updateNumber', updateNumber);
//             $('#aptitude-notice-num').html(updateNumber);
//             $('#aptitude-notice-num').show();
//             $('#operate').show();
//             $('#footer').show();
//         } else {
//             localStorage.setItem('updateNumber', 0);
//         }
//     });
// } else {

// }

requester.get('/external/manage/getPlatformDetail.do', {
    customId: urler().id,
    platformId: urler().pid
}).then(data => {

    // 微博账号
    $('#account [type="text"]').val(data.data.weiboAccount);

    // 微博 uid
    if (data.data.weiboUids !== null) {
        if (data.data.weiboUids.length === 1) {
            $('#uid [type="text"]').val(data.data.weiboUids[0]);
        } else {
            $('#uid [type="text"]').val(data.data.weiboUids[0]);

            let tpl = $('#other-uid-tpl').html();
            for (let i = 1; i < data.data.weiboUids; i++) {
                $('#other-uid').append(_.template(tpl)({
                    uid: data.data.weiboUids[i]
                }))
            }
        }
    }
    
    // 联系人姓名
    $('#contact [type="text"]').val(data.data.contactName);

    // 公司名称
    $('#company-name [type="text"]').val(data.data.customName);
    
    // 网站 URL
    $('#url [type="text"]').val(data.data.url);

    // 通讯地址
    $('#address [type="text"]').val(data.data.address);

    // 联系电话
    $('#phone [type="text"]').val(data.data.phone);

    // 微博广告行业
    requester.get('/select/listTrades.do', { id: 'fans' }).then(_data => {
        $('#weiboTrade').val(_data.data[data.data.waxTradeId]);
    });

    // 平台开户行业
    requester.get('/select/listInnerTrades.do').then(_data => {
        $('#trade').val(_data.data[data.data.tradeId]);
    });

    // 营业执照
    $('#businessLicense .preview-thumbnail').attr('src', data.data.businessLicense);

    // ICP 备案
    $('#icpLicense .preview-thumbnail').attr('src', data.data.icpLicense);

    // 其他资质
    let otherLicenseTpl = $('#other-license-tpl').html();
    $('#otherLicense').html(_.template(otherLicenseTpl)(data.data));

    // 销售经理邮箱
    $('#sales-email [type="text"]').val(data.data.salesEmail);

    // 微博 UID
    // setVal('#uid', 0, 'uid', data, true);


    // // 公司名称
    // setVal('#company-name', 0, 'companyName', data, true);

    // // 网站 url
    // setVal('#url', 0, 'url', data, true);

    // // 通讯地址
    // setVal('#address', 0, 'address', data, true);

    // // 联系电话
    // setVal('#phone', 0, 'phone', data, true);

    // // 商务经理邮箱
    // setVal('#sales-email', 0, 'salesEmail', data, true);

    // // 内部行业
    // requester.get('/select/listTrades.do', { id: 'fans' }).then(_data => {

    //     // 循环获得行业数据
    //     for (let item in _data.data) {

    //         // 确定行业名称
    //         if (item === data.data.weiboTradeId) {
    //             $('#industry').val(_data.data[item]);
    //         }
    //     }
    // });
});

// 下载图片
$('.pic-download').click(e => {
    let url = $(e.currentTarget).attr('data-url');
    location.href = `/external/manage/downloadLicense.do?imageUrl=${url}`;
});

// 切换通过还是不通过
$('#pass-status [type="radio"]').on('ifChecked', e => {
    let $self = $(e.currentTarget);
    $('#not-pass-reason textarea').val('').css('height', '40px'); // 重置 textarea

    // 通过
    if ($self.val() === '0') {
        $('#not-pass-reason').hide();
        cachePassStatus = 1;

    // 不通过
    } else {
        $('#not-pass-reason').show();
        cachePassStatus = 2;
    }
});

// 审核
$('#confirm').click(() => {
    var reason = '';

    // 不通过，填写原因
    if (cachePassStatus === 2) {
        reason = $('#not-pass-reason textarea').val();

        // 如果不通过需要判定原因
        if (reason === '') {
            modaler.tip('请填写不通过原因');
            return;
        }
    }

    // 发送请求
    requester.get('/external/manage/approvePlatform.do', {
        customId: urler().id,
        platformId: urler().pid,
        status: cachePassStatus,
        reason: reason
    }).then(data => {
        if (data.data === true) {
            return;
            location.href = '/#proj_name#/html/admin/customer/index.html';
            // localStorage.removeItem('updateNumber');
        } else {
            modaler.tip('审核失败');
        }
    });
});

// // 渲染记录详情列表
// tabler.render({
//     url: '/external/manage/listBusinessOperate.do',
//     otherParam: {
//         businessId: urler().id,
//     },
//     tpl: $('#records-tpl').html(),
//     container: '#records',
//     handle(data) {

//         // 将时间戳转换成特定格式
//         for (let record of data.data.records) {
//             record.time = convertTimestamp(record.posttime, (year, month, date, hour, minute) => {
//                 return `${year}年${month}月${date}日 ${hour}:${minute}`;
//             });
//         }

//         return data;
//     }
// });

/**
 * 抽离判断当前字段是否更新，如果更新了，则添加 update 类名
 * @param {Object} data - 服务器返回数据
 * @param {String} field - 字段名
 * @param {String} el - 元素
 */
function checkUpdate(data, field, el) {

    // 判断是否更新
    if (data.data.newInfo[field] !== data.data.oldInfo[field]) {
        $(el).addClass('update');
        updateNumber++;
    }
}

/**
 * 设置 textarea 或 input 的值
 * @param {String} el - 元素标识符
 * @param {String} type - 标识是什么类型
 * @param {String} field - 字段名称
 * @param {Object} data - 服务器返回的数据
 * @param {Boolean} isFail - 当前是否为不通过的项
 */
function setVal(el, type, field, data, isFail = false) {

    // input
    if (type === 0) {

        if (!isFail) {
            $(el).find('input').val(data.data.newInfo[field]);
        } else {
            $(el).find('input').val(data.data[field]);
        }

    // textarea
    } else {

        if (!isFail) {
            $(el).find('textarea').val(data.data.newInfo[field]);
        } else {
            $(el).find('textarea').val(data.data[field]);
        }
    }
}
