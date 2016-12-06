/**
 * 初始化选择框
 */

var ajax = require('./ajax');
var modal = require('./modal');

module.exports = {

    /**
     * 请求服务器接口，渲染指定 select2 控件
     * @param [Object] obj {初始化参数}
     */
    init: function(obj) {
        obj.url = obj.url ? obj.url : '';
        obj.param = obj.param ? obj.param : {};
        obj.cb = obj.cb ? obj.cb : function() {};
        obj.title = obj.title ? obj.title : '';

        ajax.get({
            url: obj.url,
            param: obj.param,
            cb: function(data) {
                obj.cb(data);
            },
            modal: modal,
            title: obj.title
        });
    },

    /**
     * 获取指定 select2 控件的值
     * @param [Object] obj {获取值所需要的参数}
     */
    getVal: function(obj) {
        obj.id = obj.id ? obj.id : '';
        return $(obj.id).select2('val');
    }
};
