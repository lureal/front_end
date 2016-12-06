const _ = window._;
const requester = window.requester;
const modaler = window.modaler;
const collapseTable = window.collapseTable;

// 渲染表格
collapseTable.render({
    url: '/external/data/list.do',
    containerId: '#data',
    param: {},
    tpl: $('#data-tpl').html(),

    // 数据处理，处理逻辑是：
    // 如果有多个数据是同一日期的，则将这些数据合并在一起，比如
    // [{dataDate: 2016-09-30, 数据1}, {dataDate: 2016-09-30, 数据2}, {dataDate: 2016-10-01, 数据3}]
    // 合并后的效果是：[{dataDate: 2016-09-30, 数据1, 数据2}]
    handle(data) {
        var _data = {
            data: {
                records: []
            }
        };

        // 循环服务器返回的数据
        for (let record of data.data.records) {

            // 当前缓存数组中没数据，则直接往里面塞数据
            if (_data.data.records.length === 0) {
                _data.data.records.push({
                    date: record.dataDate,
                    tables: [record]
                });

                console.log(1);

            // 当前缓存数组中有数据，判断是否有相同的日期
            } else {
                var isDateInCache = false;
                var cacheRecord = null;
                for (let _record of _data.data.records) {
                    if (_record.date === record.dataDate) {
                        isDateInCache = true;
                        cacheRecord = _record;
                    }
                }

                // 如果有相同日期
                if (isDateInCache) {
                    cacheRecord.tables.push(record);

                // 没有相同日期
                } else {
                    _data.data.records.push({
                        date: record.dataDate,
                        tables: [record]
                    });
                }
            }
        }
        return _data;
    }
});
