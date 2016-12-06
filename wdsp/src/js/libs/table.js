const _ = window._;
import urler from './urler';

export default {

    /**
     * 发起请求
     * @param {String} url - 链接
     * @param {Object} param - 传递给服务器的参数
     * @param {jQuery} tableEl - 表格 jQuery 对象
     * @param {String} tpl - 模板
     * @param {Function} handle - 数据处理函数
     * @param {Function} cb - 回调函数
     */
    doRequest ({ url, param, tableEl, tpl, handle = undefined, cb = (() => {}) }) {
        window.requester.get(url, param).then(data => {
            let _data = data;

            // 对渲染进行额外的操作
            if (handle) {
                _data = handle(data);
            }

            tableEl.html(_.template(tpl)(_data.data));

            // 当前无数据，提示
            if (_data.data.records.length === 0) {
                modaler.tip('当前无数据');
            }

            cb(_data);
        });
    },

    /**
     * 渲染 table
     * @param {String} url - 请求链接
     * @param {Number} page - 页数
     * @param {String} tpl - 模板
     * @param {Object} otherParam - 其他参数
     * @param {String} container - 包含块 ID，包含表格和分页
     * @param {Function} cb - 回调函数
     */
    render({ url, page = 1, otherParam = {}, tpl, container, handle, cb = (() => {}) }) {
        let self = this;
        let $table = $(`${container}-table`); // 表格
        let $pager = $(`${container}-pager`); // 分页
        let $search = $(`${container}-search`); // 搜索按钮
        let $export = $(`${container}-export`); // 导出按钮
        let $tool = $(`${container}-tool`); // 工具栏

        let pageCount = 1; // 总页数
        let isLoadingData = 0; // 0 -> 当前空闲，不在加载数据, 1 -> 当前正在加载数据
        let cacheSearchParam = {}; // 缓存搜索数据，避免分页出错

        // 合并页数和其他参数
        let param = $.extend({}, { page: 1 }, otherParam);

        // 首次发起请求
        self.doRequest({
            url: url,
            param: param,
            tableEl: $table,
            tpl: tpl,
            handle: handle,
            cb(_data) {

                // 缓存总页数
                pageCount = _data.data.pageCount;

                // 设置分页最大页数
                $('.w-allpage > span', $pager).html(_data.data.pageCount);

                // 设置当前分页
                $('.w-page-now', $pager).val(_data.data.page);

                cb(_data);
            }
        });

        // 如果有分页的话
        if ($pager.length > 0) {

            // 向前翻页
            $('.w-previous', $pager).unbind('click').bind('click', (e) => {
                let $previoutBtn = $(e.currentTarget);
                let cacheHtml = $previoutBtn.html(); // 缓存按钮内的内容

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
                    url: url,
                    param: $.extend({}, param, cacheSearchParam),
                    tableEl: $table,
                    tpl: tpl,
                    handle: handle,
                    cb(_data) {

                        // 设置分页最大页数
                        $('.w-allpage > span', $pager).html(_data.data.pageCount);

                        // 设置当前分页
                        $('.w-page-now', $pager).val(_data.data.page);

                        cb(_data);

                        // 设置 loading 状态
                        isLoadingData = 0;

                        // 提示用户已经 loaded 完
                        $previoutBtn.html(cacheHtml);

                    }
                });
            });

            // 向后翻页
            $('.w-next', $pager).unbind('click').bind('click', (e) => {
                let $previoutBtn = $(e.currentTarget);
                let cacheHtml = $previoutBtn.html(); // 缓存按钮内的内容

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
                    url: url,
                    param: $.extend({}, param, cacheSearchParam),
                    tableEl: $table,
                    tpl: tpl,
                    handle: handle,
                    cb(_data) {

                        // 设置分页最大页数
                        $('.w-allpage > span', $pager).html(_data.data.pageCount);

                        // 设置当前分页
                        $('.w-page-now', $pager).val(_data.data.page);

                        cb(_data);

                        // 设置 loading 状态
                        isLoadingData = 0;

                        // 提示用户已经 loaded 完
                        $previoutBtn.html(cacheHtml);
                    }
                });

            });
        }

        // 如果当前有查询按钮
        if ($search.length > 0) {
            $search.unbind('click').bind('click', e => {
                let ajaxParam = {}; // 缓存传递给服务器的数据
                let cacheIsPass = true; // 缓存当前是否通过

                // 拿到所有的搜索字段
                $('.w-tool-input', $tool).each((index, ele) => {
                    let type = $(ele).attr('data-type'); // 字段的类型
                    let field = $(ele).attr('data-field'); // 传递给服务器的字段名称
                    let errmsg = $(ele).attr('data-errmsg'); // 错误信息
                    let isRequire = $(ele).attr('data-isRequire'); // 当前是不是必须输入的字段
                    let $ele = $(ele);

                    // 如果当前是必选字段
                    if (isRequire === '1') {

                        // 对不同类型的字段进行数据校验
                        switch (type) {

                            // 文本输入框
                            case 'input':
                                if ($ele.val() === '') {
                                    modaler.tip(errmsg);
                                    cacheIsPass = false;
                                } else {
                                    ajaxParam[field] = $ele.val();
                                }
                                break;

                            // 日期选择框
                            case 'date':
                                if ($ele.val() === '') {
                                    modaler.tip(errmsg);
                                    cacheIsPass = false;
                                } else {
                                    ajaxParam[field] = $ele.val();
                                }
                                break;

                            // 单选框
                            case 'select':
                                if ($ele.val() === '' || $ele.val() === null) {
                                    modaler.tip(errmsg);
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
                cacheSearchParam = ajaxParam;

                self.doRequest({
                    url: url,
                    param: $.extend({}, param, ajaxParam),
                    tableEl: $table,
                    tpl: tpl,
                    handle: handle,
                    cb(_data) {

                        // 缓存总页数
                        pageCount = _data.data.pageCount;

                        if ($pager.length > 0) {

                            // 设置分页最大页数
                            $('.w-allpage > span', $pager).html(_data.data.pageCount);

                            // 设置当前分页
                            $('.w-page-now', $pager).val(_data.data.page);
                        }

                        cb(_data);
                    }
                });
            });
        }

        // 如果当前有导出按钮
        if ($export.length > 0) {
            $export.unbind('click').bind('click', e => {
                let ajaxParam = {}; // 缓存传递给服务器的数据
                let cacheIsPass = true; // 缓存当前是否通过

                // 拿到所有的搜索字段
                $('.w-tool-input', $tool).each((index, ele) => {
                    let type = $(ele).attr('data-type'); // 字段的类型
                    let field = $(ele).attr('data-field'); // 传递给服务器的字段名称
                    let errmsg = $(ele).attr('data-errmsg'); // 错误信息
                    let isRequire = $(ele).attr('data-isRequire'); // 当前是不是必须输入的字段
                    let $ele = $(ele);

                    // 如果当前是必选字段
                    if (isRequire === '1') {

                        // 对不同类型的字段进行数据校验
                        switch (type) {

                            // 文本输入框
                            case 'input':
                                if ($ele.val() === '') {
                                    modaler.tip(errmsg);
                                    cacheIsPass = false;
                                } else {
                                    ajaxParam[field] = $ele.val();
                                }
                                break;

                            // 日期选择框
                            case 'date':
                                if ($ele.val() === '') {
                                    modaler.tip(errmsg);
                                    cacheIsPass = false;
                                } else {
                                    ajaxParam[field] = $ele.val();

                                }
                                break;

                            // 单选框
                            case 'select':
                                if ($ele.val() === '' || $ele.val() === null) {
                                    modaler.tip(errmsg);
                                    cacheIsPass = false;
                                } else {
                                    ajaxParam[field] = $ele.val();
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
                let exportUrl = `${url}?export=true`;

                // 循环为导出链接添加 url 参数
                let p = $.extend({}, param, ajaxParam, { customId: urler().cid });
                for (let item in p) {
                    if (item !== 'export') {
                        exportUrl += `&${item}=${p[item]}`;
                    }
                }

                location.href = exportUrl;
            });
        }
    }
};
