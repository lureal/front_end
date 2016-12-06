/*!
 * 列表页面渲染列表
 */

/**
 * 列表加载函数
 * @param {Object} param [需要被用到的参数，ajax 对象，参数，目标参数，页数]
 */
function lister(param) {

    var ajax = param.ajax ? param.ajax : undefined,
        ajaxParam = param.ajaxParam ? param.ajaxParam : undefined,
        $btn = param.$btn ? param.$btn : undefined,
        callback = param.callback ? param.callback : (function() {}),
        cachebtnContent;

    if($btn !== null && $btn !== undefined) {
        cachebtnContent = $btn.html();
        $btn.attr('data-isloading', '1')
            .html('<img class="page-loading" src="/#proj_name#/img/loading.gif">');
    }

    ajax.get({
        url: ajaxParam.url,
        param: ajaxParam.param,
        cb: function(data) {

            callback(data);

            if($btn !== null && $btn !== undefined) {
                $btn.html(cachebtnContent);
            }
        },
        modal: ajaxParam.modal,
        title: ajaxParam.title
    });

}

module.exports = lister;
