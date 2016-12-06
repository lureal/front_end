/**
 * 树结构
 * url: https://github.com/jonmiles/bootstrap-treeview
 */

 var ajax = require('./modules/ajax');

module.exports = {

    // 保存树结构
    //
    // example:
    // [
    //     {                          // 父元素 1
    //         text: 'parent',        // 父元素名称
    //         nodes: [               // 子元素列表
    //             {                  // 子元素 1
    //                 text: 'child'  // 子元素名称
    //             },
    //             {                  // 子元素 2
    //                 text: 'child', // 子元素名称
    //                 nodes: [       // 孙元素列表
    //
    //                 ]
    //             }
    //         ]
    //     },
    //     {                          // 父元素 2
    //         text: 'parent',        // 父元素名称
    //         nodes: [               // 子元素列表
    //             {                  // 子元素 1
    //                 text: 'child'  // 子元素名称
    //                 nodes: [       // 孙元素列表
    //
    //                 ]
    //             },
    //             {                  // 子元素 2
    //                 text: 'child'  // 子元素名称
    //             }
    //         ]
    //     },
    // ]
    //
    // 具体参数值参考上面的 GitHub

    data: {},

    /**
     * 根据服务器传递过来的数据初始化树结构
     */
    init: function() {

    },

    /**
     * 初始化树结构
     * @param [Object] obj {包含目标元素，回调函数等数据的对象}
     */
    generate: function(obj) {

        obj.ele = obj.ele ? obj.ele : '';
        obj.cb = obj.cb ? obj.cb : function() {};

        var _data = this.data;
        $(obj.ele).treeview({data: _data})
    },

    /**
     * 添加菜单
     * @param {Object} obj [添加菜单所需要的数据：需要添加的菜单在哪个等级，需要添加的菜单名称，需要添加菜单的 icon，需要添加菜单的链接，需要添加菜单的父元素名称]
     */
    addMenu: function(obj) {

    },

    /**
     * 删除菜单
     * @param {Object} obj [删除菜单所需要的数据：需要添加的菜单在哪个等级，]
     */
    delMenu: function(obj) {

    }
}
