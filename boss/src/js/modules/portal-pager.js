module.exports =  {

    /**
     * 发起请求
     * @param {String} url - 链接
     * @param {Object} param - 传递给服务器的参数
     * @param {jQuery} tableEl - 表格 jQuery 对象
     * @param {String} tpl - 模板
     * @param {Function} handle - 数据处理函数
     * @param {Function} cb - 回调函数
     */
    doRequest: function(obj) {
        var url, param, tableEl, tpl, cb, handle;

        if (!obj.handle) {
            handle = undefined;
        
        } else {
            handle = obj.handle;
        }

        cb = obj.cb ? obj.cb : function() {};
        url = obj.url ? obj.url : undefined;
        param = obj.param ? obj.param : undefined;
        tableEl = obj.tableEl ? obj.tableEl : undefined;
        tpl = obj.tpl ? obj.tpl : undefined;
        
        $.get(url, param, function(data) {
            data = JSON.parse(data);
            var _data = data;
            
            // 对渲染进行额外的操作
            if(handle) {
                _data = handle(data);
            }

            tableEl.html(_.template(tpl)(_data));
            
            // 当前无数据，提示
            // if (_data.data.records.length === 0) {
            //     modaler.tip('当前无数据');
            // }
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
     render: function(obj) {
        var url, otherParam, tpl, container, handle, cb;

        otherParam = obj.otherParam ? obj.otherParam: {};
        url = obj.url ? obj.url : undefined;
        container = obj.container ? obj.container : undefined;
        tpl = obj.tpl ? obj.tpl : undefined;
        handle = obj.handle ? obj.handle : undefined;
        
        if (!obj.cb) {
            cb = function() {};
        }
        
        var self = this;
        $table = $(container + '-table');
        $pager = $(container + '-pager');
        var pageCount = 1;
        var isLoadingData = 0; // 0 -> 当前空闲，不在加载数据, 1 -> 当前正在加载数据

        // 合并页数和其他参数
        param = $.fn.extend({}, { page: 1 }, otherParam);

        // 首次发起请求
        self.doRequest({
            url: url,
            param: $.fn.extend({}, { page: 1 }, otherParam),
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

        // 向前翻页
        $('.w-previous', $pager).unbind('click').bind('click', function(e) {
            var  $previoutBtn = $(e.currentTarget);
            var  cacheHtml = $previoutBtn.html(); // 缓存按钮内的内容

            // 如果当前正在加载数据，则不进行任何操作
            if (isLoadingData == 1) {
                return;
            }

            // 边界值判定
            if (param.page <= 1) {
                return;
            }

            param.page --;
            isLoadingData = 1;

            // 提示用户当前正在 loading
            $previoutBtn.html('<img src="/#proj_name#/img/loading.gif" alt="loading" style="width:14px;">');

            self.doRequest({
                url: url,
                param: param,
                tableEl: $table,
                tpl: tpl,
                handle: handle,
                cb(_data) {

                    console.log(_data);

                    // 设置分页最大页数
                    $('.w-allpage > span', $pager).html(_data.data.pageCount);
                    console.log(_data.data.pageCount);

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
        $('.w-next', $pager).unbind('click').bind('click', function(e) {
            var  $previoutBtn = $(e.currentTarget);
            var  cacheHtml = $previoutBtn.html(); // 缓存按钮内的内容

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
                param: param,
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
    
};
