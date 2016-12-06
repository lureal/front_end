export default {

    /**
     * 发起请求
     * @param {String} url - 请求链接
     * @param {Object} param - 请求参数
     * @param {jQuery} collapseTableEl - 伸缩表格
     * @param {String} tpl - 模板
     * @param {Function} handle - 数据处理函数
     * @param {Function} cb - 回调函数
     */
    doRequest({ url, param, collapseTableEl, tpl, handle = undefined, cb = (() => {}) }) {
        window.requester.get(url, param).then(data => {
            var _data = data;

            // 数据处理
            if (handle) {
                _data = handle(data);
            }

            collapseTableEl.html(_.template(tpl)(_data.data));

            // 当前无数据，提示
            if (_data.data.records.length === 0) {
                modaler.tip('当前无数据');
            }

            cb(_data);
        });
    },

    /**
     * 渲染表格
     * @param {String} url - 请求链接
     * @param {String} containerId - 包含块
     * @param {Object} param - 其他参数
     * @param {String} tpl - 模板
     * @param {Function} handle - 数据处理函数
     * @param {Function} cb - 回调函数
     */
    render({ url, containerId, param = {}, tpl, handle, cb = (() => {})}) {
        let $container = $(containerId); // 包含块
        let $search = $(containerId + '-search'); // 搜索按钮
        let $export = $(containerId + '-export'); // 导出按钮
        let $startDate = $(containerId + '-start-date'); // 开始日期
        let $endDate = $(containerId + '-end-date'); // 结束日期
        let $collapseTable = $(containerId + '-table'); // 伸缩表格
        let self = this;

        // 首次发起请求
        self.doRequest({
            url: url,
            param: $.extend({}, { startDate: '', endDate: '', export: false }, param),
            collapseTableEl: $collapseTable,
            tpl: tpl,
            handle: handle,
            cb(_data) {
                cb(_data);
            }
        });

        // 如果有搜索按钮，绑定搜索事件
        if ($search.length > 0) {
            $search.unbind('click').bind('click', e => {

                // 数据校验
                if (
                    $startDate.datepicker('getDate').toString() === 'Invalid Date' ||
                    $endDate.datepicker('getDate').toString() === 'Invalid Date'
                ) {
                    window.modaler.tip('请选择开始日期和结束日期');
                    return;
                }
                if ($startDate.datepicker('getDate') > $endDate.datepicker('getDate')) {
                    window.modaler.tip('请确保结束日期大于开始日期');
                    return;
                }

                // 发起请求
                self.doRequest({
                    url: url,
                    param: $.extend({}, { startDate: $startDate.val(), endDate: $endDate.val(), export: false }, param),
                    collapseTableEl: $collapseTable,
                    tpl: tpl,
                    handle: handle,
                    cb(_data) {
                        cb(_data);
                    }
                });
            });
        }

        // 如果有导出按钮，绑定导出事件
        if ($export.length > 0) {
            $export.unbind('click').bind('click', e => {

                // 数据校验
                if (
                    $startDate.datepicker('getDate').toString() === 'Invalid Date' ||
                    $endDate.datepicker('getDate').toString() === 'Invalid Date'
                ) {
                    window.modaler.tip('请选择开始日期和结束日期');
                    return;
                }
                if ($startDate.datepicker('getDate') > $endDate.datepicker('getDate')) {
                    window.modaler.tip('请确保结束日期大于开始日期');
                    return;
                }

                // 发起请求
                var urlParamString = `${url}?startDate=${$startDate.val()}&endDate=${$endDate.val()}&export=${true}`;
                for (let prop in param) {
                    urlParamString += `&${prop}=${param[prop]}`;
                }
                location.href = urlParamString;
            });
        }
    }
};
