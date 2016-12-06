var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var sidebar = require('./modules/sidebar.js');
var header = require('./modules/header.js');
var urler = require('./modules/urler.js');
var datePicker = require('./modules/date-picker.js');

// 初始化菜单
sidebar.manage({
    title: '投放管理',
    active: 'delivery'
});

// 初始化顶部栏
header.manage({
    title: '投放管理'
});

// 将管理平台中的表格移植到 dsp
var tabler = {

    /**
     * 发起请求
     * @description 参数 obj 为一个对象，下面包含 url, page, tpl, otherParam, container, cb 字段
     * @param {String} url - 链接
     * @param {Object} param - 传递给服务器的参数
     * @param {jQuery} tableEl - 表格 jQuery 对象
     * @param {String} tpl - 模板
     * @param {Function} handle - 数据处理函数
     * @param {Function} cb - 回调函数
     */
    doRequest: function(obj) {

        // 为回调函数设默认值
        if (!obj.cb) {
            obj.cb = function() {};
        }

        // 发起请求
        ajax.get({
            url: obj.url,
            param: obj.param,
            cb: function(data) {
                var _data = data;

                // 对渲染进行额外的操作
                if (obj.handle) {
                    _data = obj.handle(data);
                }

                obj.tableEl.html(_.template(obj.tpl)(_data.data));

                obj.cb(_data);
            }
        });
    },

    /**
     * 渲染 table
     * @description 参数 obj 为一个对象，下面包含 url, page, tpl, otherParam, container, cb 字段
     * @param {String} url - 请求链接
     * @param {Number} page - 页数
     * @param {String} tpl - 模板
     * @param {Object} otherParam - 其他参数
     * @param {String} container - 包含块 ID，包含表格和分页
     * @param {Function} cb - 回调函数
     */
    render: function(obj) {

        // 设置默认参数
        if (!obj.page) {
            obj.page = 1;
        }

        if (!obj.otherParam) {
            obj.otherParam = {}
        }

        if (!obj.cb) {
            obj.cb = function() {}
        }

        var self = this;
        var $table = $(obj.container + '-table');
        var $pager = $(obj.container + '-pager');
        var $search = $(obj.container + '-search');
        var $export = $(obj.container + '-export');
        var $tool = $(obj.container + '-tool');
        var pageCount = 1;
        var isLoadingData = 0; // 0 -> 当前空闲，不在加载数据, 1 -> 当前正在加载数据

        // 缓存分页请求的参数，缓存是为了让执行搜索后，分页能否拿到搜索的字段，每当执行
        // 一次搜索，就把数据缓存下来
        var cachePageParam = {};

        // 合并页数和其他参数
        var param = $.extend({}, { page: 1 }, obj.otherParam);

        // 发起请求
        self.doRequest({
            url: obj.url,
            param: param,
            tableEl: $table,
            tpl: obj.tpl,
            handle: obj.handle,
            cb: function(_data) {

                // 缓存总页数
                pageCount = _data.data.pageCount;

                // 设置分页最大页数
                $('.w-allpage > span', $pager).html(_data.data.pageCount);

                // 设置当前分页
                $('.w-page-now', $pager).val(_data.data.page);

                obj.cb(_data);
            }
        });

        // 向前翻页
        $('.w-previous', $pager).unbind('click').bind('click', function(e) {
            var $previoutBtn = $(e.currentTarget);
            var cacheHtml = $previoutBtn.html(); // 缓存按钮内的内容

            // 如果当前正在加载数据，则不进行任何操作
            if (isLoadingData == 1) {
                return;
            }

            // 边界值判定
            if (param.page <= 1) {
                return;
            }

            param.page--;
            isLoadingData = 1;

            // 提示用户当前正在 loading
            $previoutBtn.html('<img src="/#proj_name#/img/loading.gif" alt="loading" style="width:14px;">');

            self.doRequest({
                url: obj.url,
                param: $.extend({}, param, cachePageParam),
                tableEl: $table,
                tpl: obj.tpl,
                handle: obj.handle,
                cb(_data) {

                    // 设置分页最大页数
                    $('.w-allpage > span', $pager).html(_data.data.pageCount);

                    // 设置当前分页
                    $('.w-page-now', $pager).val(_data.data.page);

                    obj.cb(_data);

                    // 设置 loading 状态
                    isLoadingData = 0;

                    // 提示用户已经 loaded 完
                    $previoutBtn.html(cacheHtml);
                }
            });
        });

        // 向后翻页
        $('.w-next', $pager).unbind('click').bind('click', function(e) {
            var $previoutBtn = $(e.currentTarget);
            var cacheHtml = $previoutBtn.html(); // 缓存按钮内的内容

            // 如果当前正在加载数据，则不进行任何操作
            if (isLoadingData == 1) {
                return;
            }

            // 边界值判定
            if (param.page >= pageCount) {
                return;
            }

            param.page++;
            isLoadingData = 1;

            // 提示用户当前正在 loading
            $previoutBtn.html('<img src="/#proj_name#/img/loading.gif" alt="loading" style="width:14px;">');

            self.doRequest({
                url: obj.url,
                param: $.extend({}, param, cachePageParam),
                tableEl: $table,
                tpl: obj.tpl,
                handle: obj.handle,
                cb: function(_data) {

                    // 设置分页最大页数
                    $('.w-allpage > span', $pager).html(_data.data.pageCount);

                    // 设置当前分页
                    $('.w-page-now', $pager).val(_data.data.page);

                    obj.cb(_data);

                    // 设置 loading 状态
                    isLoadingData = 0;

                    // 提示用户已经 loaded 完
                    $previoutBtn.html(cacheHtml);
                }
            });
        });

        // 搜索
        if ($search.length > 0) {

            $search.unbind('click').bind('click', function(e) {
                var ajaxParam = {}; // 缓存传递给服务器的数据
                var cacheIsPass = true; // 缓存当前是否通过

                // 拿到所有的搜索字段
                $('.w-tool-input', $tool).each(function(index, ele) {
                    var type = $(ele).attr('data-type'); // 字段的类型
                    var field = $(ele).attr('data-field'); // 传递给服务器的字段名称
                    var errmsg = $(ele).attr('data-errmsg'); // 错误信息
                    var isRequire = $(ele).attr('data-isRequire'); // 当前是不是必须输入的字段
                    var $ele = $(ele);

                    // 如果当前是必选字段
                    if (isRequire === '1') {

                        // 对不同类型的字段进行数据校验
                        switch (type) {

                            // 文本输入框
                            case 'input':
                                if ($ele.val() === '') {
                                    cacheIsPass = false;
                                } else {
                                    ajaxParam[field] = $ele.val();
                                }
                                break;

                            // 日期选择框
                            case 'date':
                                if ($ele.val() === '') {
                                    cacheIsPass = false;
                                } else {
                                    ajaxParam[field] = $ele.val();

                                }
                                break;

                            // 单选框
                            case 'select':
                                if ($ele.val() === '' || $ele.val() === null) {
                                    cacheIsPass = false;
                                } else {
                                    ajaxParam[field] = $ele.val()
                                }
                                break;
                            default:
                                break;

                        }
                    } else {
                        switch (type) {

                            // 文本输入框
                            case 'input':
                            case 'select':
                                ajaxParam[field] = $ele.val() === null ? '' : $ele.val();
                                break;

                            case 'date':
                                ajaxParam[field] = $ele.val();
                                break;
                            default:
                                break;
                        }
                    }
                });

                // 当前数据校验不通过
                if (!cacheIsPass) {
                    return;
                }

                // 缓存请求参数，方便被分页调用
                cachePageParam = ajaxParam;

                self.doRequest({
                    url: obj.url,
                    param: $.extend({}, param, ajaxParam),
                    tableEl: $table,
                    tpl: obj.tpl,
                    handle: obj.handle,
                    cb: function(_data) {

                        // 缓存总页数
                        pageCount = _data.data.pageCount;

                        // 设置分页最大页数
                        $('.w-allpage > span', $pager).html(_data.data.pageCount);

                        // 设置当前分页
                        $('.w-page-now', $pager).val(_data.data.page);

                        obj.cb(_data);
                    }
                });
            });
        }

        // 导出
        if ($export.length > 0) {
            $export.unbind('click').bind('click', function(e) {
                var ajaxParam = {}; // 缓存传递给服务器的数据
                var cacheIsPass = true; // 缓存当前是否通过

                // 拿到所有的搜索字段
                $('.w-tool-input', $tool).each(function(index, ele) {
                    var type = $(ele).attr('data-type'); // 字段的类型
                    var field = $(ele).attr('data-field'); // 传递给服务器的字段名称
                    var errmsg = $(ele).attr('data-errmsg'); // 错误信息
                    var isRequire = $(ele).attr('data-isRequire'); // 当前是不是必须输入的字段
                    var $ele = $(ele);

                    // 如果当前是必选字段
                    if (isRequire === '1') {

                        // 对不同类型的字段进行数据校验
                        switch (type) {

                            // 文本输入框
                            case 'input':
                                if ($ele.val() === '') {
                                    cacheIsPass = false;
                                } else {
                                    ajaxParam[field] = $ele.val();
                                }
                                break;

                            // 日期选择框
                            case 'date':
                                if ($ele.val() === '') {
                                    cacheIsPass = false;
                                } else {
                                    ajaxParam[field] = $ele.val();
                                }
                                break;

                            // 单选框
                            case 'select':
                                if ($ele.val() === '' || $ele.val() === null) {
                                    cacheIsPass = false;
                                } else {
                                    ajaxParam[field] = $ele.val()
                                }
                                break;
                            default:
                                break;

                        }
                    } else {
                        switch (type) {

                            // 文本输入框
                            case 'input':
                            case 'select':
                                ajaxParam[field] = $ele.val() === null ? '' : $ele.val();
                                break;

                            case 'date':
                                ajaxParam[field] = $ele.val();
                                break;
                            default:
                                break;
                        }
                    }
                });

                // 当前数据校验不通过
                if (!cacheIsPass) {
                    return;
                }

                // 获取下载所需的参数
                var exportUrl = `${obj.url}?export=true`;

                // 循环为导出链接添加 url 参数
                var p = $.extend({}, param, ajaxParam);
                for (var item in p) {
                    if (item !== 'export') {
                        exportUrl += `&${item}=${p[item]}`;
                    }
                }

                location.href = exportUrl;
            });
        }
    }
}

// 初始化 datepicker 控件
$('.w-datepicker [type="text"]').datepicker({
    autoclose: true,
    language: 'zh-CN',
    format: 'yyyy-mm-dd'
});

// 渲染表格
tabler.render({
    url: '/manage/deal/listAllCustoms.do',
    tpl: $('#data-tpl').html(),
    handle: function(data) {
        _.each(data.data.records, function(record) {
            
            // 时间
            record.time = convertTimestamp(record.posttime, (year, month, date, hour, minute) => {
                return `${year}年${month}月${date}日 ${hour}:${minute}`;
            });

            // 现金金额
            record.balance = convertMoney(record.balance);

            // 当前限额
            record.quota = convertMoney(record.quota);

            // 互动量
            record.interactCount = divideThousand(record.interactCount);

            // 互动率
            record.interactRatio = convertPercent(record.interactRatio);

            // 今日消耗
            record.rtConsume = convertMoney(record.rtConsume);

            // 所选时段消耗
            record.consume = convertMoney(record.consume);
        });

        return data;
    },
    otherParam: {
        export: false
    },
    container: '#data'
});

/**
 * 将服务器返回的时间戳转换成文章需要的格式
 * @param {Number} timestamp - 时间戳
 * @param {Function} format - 格式化函数，返回值为格式化后的字符串
 * @returns {String} - 返回格式化后的字符串
 */
function convertTimestamp(timestamp, format) {
    var _date = new Date(timestamp);

    // 得到必要的时间片段
    var year = _date.getFullYear();
    var month = _date.getMonth() + 1;
    var date = _date.getDate();
    var hour = _date.getHours();
    var minute = _date.getMinutes();
    var second = _date.getSeconds();

    // 小时，分钟和秒数小于十的数可能返回一个位数的数字，如果返回一个位数的数字则在前面加 0
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;

    return format(year, month, date, hour, minute, second);
};

/**
 * 数字每相隔 1000 添加一个 ,
 */
function divideThousand(num) {
    if (num === null) return '-';

    var str = num.toString();
    
    str = str.split('').reverse().join("").replace(/(\d{3})+?/g, (s) => {
        return s + ',';
    }).replace(/,$/, '').split('').reverse().join('');

    return str;
};

/**
 * 将金额转换成特定的形式，因为服务器返回的金额并不是以元为单位，而是以分为单位，实际上
 * 需要先除以 100 如果小数点后有位数，并且不超过 2 位，则显示小数点后位数，如果小数点后
 * 超过两位，则取小数点后两位，如果没有小数点，则显示实际的数值
 * @param {Number} money - 等待被转换的金钱
 * @returns {Number} - 返回转换过后的金钱
 */
function convertMoney(money) {
    var moneyStr = (money / 100).toString(), _money;

    // 如果当前有小数点
    if (moneyStr.indexOf('.') === -1) {
        _money = Number(moneyStr);

    // 小数点后位数为两位以内
    } else if (moneyStr.slice(moneyStr.indexOf('.') + 1).length > 2) {
        _money = Number(moneyStr.slice(0, (moneyStr.indexOf('.') + 3)));

    // 当前没有小数点
    } else {
        _money = Number(moneyStr);
    }

    // 拿到小数点前的位数，然后进行千分
    var prefixMoney = _money.toFixed(2).toString().slice(0, _money.toFixed(2).toString().indexOf('.'));
    var suffixMoney = _money.toFixed(2).toString().slice(_money.toFixed(2).toString().indexOf('.'));

    return divideThousand(Number(prefixMoney)) + suffixMoney;
}

/**
 * 将百分比转换成特定的形式
 * 1. 将实际的数值乘以 100
 * 2. 判定小数点后有多少位，如果是两位以内的，则直接返回，如果是两位以上的，则小数点后
 * 取值两位
 * @param {Number} percent - 百分数
 * @returns {String} - 转换后的百分数
 */
function convertPercent(percent) {
    var _percent = percent * 100;
    var _percentStr = _percent.toString();

    // 当前没有小数点
    if (_percentStr.indexOf('.') === -1) {
        _percent = _percent + '.00%'

    // 当前小数点后超过两位
    } else if (_percentStr.slice(_percentStr.indexOf('.') + 1).length > 2) {
        _percent = _percentStr.slice(0, (_percentStr.indexOf('.') + 3)) + '%';

    // 当前小数点后小于两位
    } else {
        _percent = _percent + '0%'
    }

    return _percent;
};

// /*!
//  * 投放管理列表
//  **/
// var ajax = require('./modules/ajax');
// var modal = require('./modules/modal');
// var lister = require('./modules/lister.js');
// var pager = require('./modules/pager.js');
// var sidebar = require('./modules/sidebar.js');
// var select2 = require('./modules/select2.js');
// var datePicker = require('./modules/date-picker.js');
// var time = require('./modules/time.js');
// var header = require('./modules/header.js');
// var urler = require('./modules/urler.js');
//
// // 初始化菜单
// sidebar.manage({
//     title: '投放管理',
//     active: 'delivery'
// });
//
// // // 初始化顶部栏
// header.manage({
//     title: '投放管理'
// });
//
// //effect加载列表
// lister({
//     ajax: ajax,
//     ajaxParam: {
//         url: '/manage/deal/listEffects.do',
//         param: {
//             page: 1,
//             export: false
//         },
//         title: '效果数据'
//     },
//     $btn: null,
//     callback: function(data) {
//
//         // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
//         data.data.ajaxParam = encodeURIComponent(JSON.stringify({
//             page: 1,
//             export: false
//         }));
//         for(var i = 0; i < data.data.records.length; i++) {
//             var val = data.data.records[i];
//             val.posttime_str = time.unixToTime(val.posttime);
//         }
//
//         // 渲染模板
//         var tpl = $('#delivery-effect-tpl').html();
//         $('#delivery-effect').html(_.template(tpl)(data));
//     }
// });
//
// //effect查询
// $('#search').on('click', function() {
//
//     //获取日期
//     var date = datePicker.getVal('#search-datapicker');
//
//     //执行搜索
//     ajax.get({
//         url: '/manage/deal/listEffects.do',
//         param: {
//             startDate: date.start,
//             endDate: date.end,
//             page: 1,
//             export: false
//         },
//         cb: function(data) {
//
//             // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
//             data.data.ajaxParam = encodeURIComponent(JSON.stringify({
//                 startDate: date.start,
//                 endDate: date.end,
//                 page: 1,
//                 export: false
//             }));
//
//             // 渲染模板
//             var tpl = $('#delivery-effect-tpl').html();
//             $('#delivery-effect').html(_.template(tpl)(data));
//         },
//         modal: modal,
//         title: '投放管理效果列表'
//     });
// });
//
// // 分页
// pager(function(param, $this) {
//     lister({
//         ajax: ajax,
//         ajaxParam: {
//             url: '/manage/deal/listEffects.do',
//             param: param ,
//             title: '投放管理'
//         },
//         $btn: $this,
//         callback: function(data) {
//
//             // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
//             data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));
//
//             // 渲染模板
//             var tpl = $('#delivery-effect-tpl').html();
//             $('#delivery-effect').html(_.template(tpl)(data));
//         }
//     });
// });
//
// //customer 加载列表
// lister({
//     ajax: ajax,
//     ajaxParam: {
//         url: '/manage/deal/listCustoms.do',
//         param: {
//             page: 1,
//             export: false
//         },
//         title: '客户列表'
//     },
//     $btn: null,
//     callback: function(data) {
//
//         // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
//         data.data.ajaxParam = encodeURIComponent(JSON.stringify({
//             page: 1,
//             export: false
//         }));
//         for(var i = 0; i < data.data.records.length; i++) {
//             var val = data.data.records[i];
//             val.posttime_str = time.unixToTime(val.posttime);
//         }
//
//         // 渲染模板
//         var tpl = $('#delivery-cuslist-tpl').html();
//         $('#delivery-cuslist').html(_.template(tpl)(data));
//
//         // 初始化链接
//         urler.initLink();
//     }
// });
//
// //customer查询
// $('#cuslist-search').on('click', function() {
//     var customerID = $('#search-delivery').val();
//
//     //执行搜索
//     ajax.get({
//         url: '/manage/deal/listCustoms.do',
//         param: {
//             keyword: customerID,
//             page: 1,
//             export: false
//         },
//         cb: function(data) {
//             // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
//             data.data.ajaxParam = encodeURIComponent(JSON.stringify({
//                 keyword : customerID,
//                 page: 1,
//                 export: false
//             }));
//
//             // 渲染模板
//             var tpl = $('#delivery-cuslist-tpl').html();
//             $('#delivery-cuslist').html(_.template(tpl)(data));
//         },
//         modal: modal,
//         title: '投放管理客户列表'
//     });
// });
//
// // customer分页
// pager(function(param, $this) {
//     lister({
//         ajax: ajax,
//         ajaxParam: {
//             url: '/manage/deal/listCustoms.do',
//             param: param ,
//             title: '投放管理'
//         },
//         $btn: $this,
//         callback: function(data) {
//
//             // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
//             data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));
//
//             // 渲染模板
//             var tpl = $('#delivery-cuslist-tpl').html();
//             $('#delivery-cuslist').html(_.template(tpl)(data));
//
//             // 初始化链接
//             urler.initLink();
//
//             // 初始化搜索条中的日期控件
//             datePicker.init('#search-datapicker');
//         }
//     });
// });
//
// //初始化日期控件
// datePicker.init('#search-datapicker');
//
// Date.prototype.Format=function(fmt) {
//     var o = {
//     'M+' : this.getMonth()+1, //月份
//     'd+' : this.getDate(), //日
//     'h+' : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
//     'H+' : this.getHours(), //小时
//     'm+' : this.getMinutes(), //分
//     's+' : this.getSeconds(), //秒
//     'q+' : Math.floor((this.getMonth()+3)/3), //季度
//     'S' : this.getMilliseconds() //毫秒
//     };
//     if(/(y+)/.test(fmt)){
//         fmt = fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
//     }
//     if(/(E+)/.test(fmt)){
//         fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
//     }
//     for(var k in o){
//         if(new RegExp("("+ k +")").test(fmt)){
//             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
//         }
//     }
//     return fmt;
// }
//
// // 转换日期
// var date = new Date();
// var currentDate = new Date().Format("yyyy/MM/dd");
// var dateBefore = new Date(date.getTime()-86400000*7).Format("yyyy/MM/dd");
// $('#search-datapicker').val(dateBefore +' - '+ currentDate);
