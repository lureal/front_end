/**
 * 初始化日期控件
 */

module.exports = {

    /**
     * 初始化日期选择控件
     * @param [String] id {日期控件 id}
     */
    init: function(id) {
        $(id).daterangepicker({
            format: 'YYYY/MM/DD'
        });
    },

    /**
     * 获取日期控件日期
     * @param [String] id {日期控件 id}
     */
    getVal: function(id) {
        var date = $.trim($(id).val().replace(/\//g, '-'));

        return({
            start: date.slice(0, 10),
            end: date.slice(13, 24)
        });
    }
};
