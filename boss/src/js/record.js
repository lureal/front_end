/*!
 * 罗列全部菜单
 */

// var ajax = require('./modules/ajax');
// var modal = require('./modules/modal');
// var lister = require('./modules/lister.js');
// var pager = require('./modules/pager.js');
// var auth = require('./modules/auth.js');
// var select2 = require('./modules/select2.js');
// var datePicker = require('./modules/date-picker.js');
var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var config = require('./libs/portal-config'); // 加载配置文件


// 获取服务器数据
ajax.get({
    url: '/admin/opinion/opinionRecords.do',
    param: {
        page: 1
    },
    cb: function(data) {

        for(var i = 0 ; i< data.data.opinions.length; i++) {
            var val = data.data.opinions[i];
            val.question_str = (data.data.opinions[i].question).replace(/\n/g,"<BR>");
            if(val.answer.length > 1) {
                for(var j = 0; j< val.answer.length;j++) {
                    val.answer[j].content_str = (val.answer[j].content).replace(/\n/g,"<BR>");
                }
            }
        }

        // 渲染模板
        var tpl = $('#br-content-tpl').html();
        $('#br-content').html(_.template(tpl)(data));
    }
});