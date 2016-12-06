/*!
 ** 信息概览页
 */
var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var sidebar = require('./modules/sidebar.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
var header = require('./modules/header.js');

// 初始化导航
sidebar.manage({
	title: '信息概览',
    active: 'overview'
});

// 初始化顶部栏
header.manage({
    title: '信息概览'
});

//获取客户数量
ajax.get({
	url: '/manage/overview/countCustom.do',
	cb: function(data) {
		var tpl = $('#overview-list-tpl').html();
    	$('#overview-list').html(_.template(tpl)(data));
	},
});

//获取今日实时消耗的数量
ajax.get({
    url: '/manage/overview/getRtConsume.do',
    cb: function(data) {
        var tpl = $('#overview-consumption-tpl').html();
        $('#overview-consumption').html(_.template(tpl)(data));
    }
})

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/manage/overview/listPlatformStatistics.do',
        param: {
            page: 1,
            export: false
        },
        title: '信息概览'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
            
        }));
        for(var i = 0; i < data.data.records.length; i++) {
            var val = data.data.records[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        // 渲染模板
        var tpl = $('#overview-table-tpl').html();
        $('#overview-table').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/manage/overview/listPlatformStatistics.do',
            param: param ,
            title: '客户管理'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#overview-table-tpl').html();
            $('#overview-table').html(_.template(tpl)(data));
        }
    });
});

//查询
$('#search').on('click', function() {
    
    //获取日期
    var date = datePicker.getVal('#search-datapicker');

    //执行搜索
    ajax.get({
    	url: '/manage/overview/listPlatformStatistics.do',
    	param: {
    		startDate: date.start,
    		endDate: date.end,
    		page: 1,
    		export: false
    	},
    	cb: function(data) {
    		// 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                startDate: date.start,
	    		endDate: date.end,
	    		page: 1,
	    		export: false
            }));
            for(var i = 0; i < data.data.records.length; i++) {
                var val = data.data.records[i];
                val.posttime_str = time.unixToTime(val.posttime); 
            }

            // 渲染模板
            var tpl = $('#overview-table-tpl').html();
            $('#overview-table').html(_.template(tpl)(data));
    	},
    	modal: modal,
    	title: '信息概览'
    });
});

$('#export').on('click', function() {

	 //获取日期
    var date = datePicker.getVal('#search-datapicker');

	// 浏览器打开页面的方式下载附件
    location.href = '/manage/overview/listPlatformStatistics.do?startDate=' + date.start +
        '&endDate=' + date.end +
        '&export=' + true;
});

// 初始化搜索条中的日期控件
datePicker.init('#search-datapicker');

// 初始化搜索条中的日期控件
datePicker.init('#export-datapicker');

// 转换日期格式
// Date.prototype.Format = function(fmt) {  
//     var o = {  
//         'y+' :this.getFullYear(), 
//         "M+" : this.getMonth()+1,                 //月份   
//         "d+" : this.getDate(),                    //日   
//         "h+" : this.getHours(),                   //小时   
//         "m+" : this.getMinutes(),                 //分   
//         "s+" : this.getSeconds(),                 //秒   
//         "q+" : Math.floor((this.getMonth() + 3) / 3), //季度   
//         "S"  : this.getMilliseconds()             //毫秒   
//     };   
//     if(/(y + )/.test(fmt))   
//         fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(3 - RegExp.$1.length));   
//     for(var k in o)   
//         if(new RegExp("("+ k +")").test(fmt))   
//         fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00'+ o[k]).substr(('' + o[k]).length)));   
//     return fmt;   
// }  

Date.prototype.Format=function(fmt) {         
    var o = {         
    'M+' : this.getMonth()+1, //月份         
    'd+' : this.getDate(), //日         
    'h+' : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
    'H+' : this.getHours(), //小时         
    'm+' : this.getMinutes(), //分         
    's+' : this.getSeconds(), //秒         
    'q+' : Math.floor((this.getMonth()+3)/3), //季度         
    'S' : this.getMilliseconds() //毫秒         
    };         
    if(/(y+)/.test(fmt)){         
        fmt = fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
    }         
    if(/(E+)/.test(fmt)){         
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);         
    }         
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));         
        }         
    }         
    return fmt;         
}       
          
// 转换日期
var date = new Date();
var currentDate = new Date().Format("yyyy/MM/dd");   
var dateBefore = new Date(date.getTime()-86400000*7).Format("yyyy/MM/dd");
$('#search-datapicker').val(dateBefore +' - '+ currentDate);
