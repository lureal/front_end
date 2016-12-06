const _ = window._;
import urler from './libs/urler';
const modaler = window.modaler;
const collapseTable = window.collapseTable;

// 获取未处理的发票申请的数量
requester.get('/external/manage/getInvoiceUndo.do', { userId: urler().userId }).then(data => {
    if (data.data.cnt > 0) {
        $('#invoice-notice-num').show().html(data.data.cnt);
    }
});

// 获取公司名，并渲染到页面中
$('#breadcrumb-company').html(decodeURIComponent(urler().company));
$('#box-company').html(decodeURIComponent(urler().company));

// 获取 url 后面的 id 拼接到内容导航的后面
$('.content-nav-link').each((index, el) => {
    let cacheHref = $(el).attr('href');
    cacheHref += '?id=' + urler().id;
    cacheHref += '&userId=' + urler().userId;
    cacheHref += '&company=' + urler().company;

    if (urler().f) {
        cacheHref += '&f=' + urler().f;
    }

    $(el).attr('href', cacheHref);
});

// 如果当前审核失败，只能查看账户，则隐藏多余的项
if (!urler().f) {
    $('#content-nav-finance').show();
}

// 设置更新的数量
let updateNumber = Number(localStorage.getItem('updateNumber'));
if (updateNumber > 0) {
    $('#aptitude-notice-num').html(updateNumber);
    $('#aptitude-notice-num').show();
}

// 数据导入
$('#import-data').click(e => {

    // 判断用户是否选择了日期，如果没选择日期，则不给上传
    let $date = $('#import-data-datepicker');

    // 数据校验
    if ($date.datepicker('getDate').toString() === 'Invalid Date') {

        // 如果当前没有选择日期，则不弹出选择文件框
        e.preventDefault();

        modaler.tip('请选择日期');
        return;
    }
});

// 删除数据
$('body').on('click', '.table-del', function(e) {
    let $self = $(e.currentTarget);
    let id = $self.attr('data-id');

    requester.get('/external/manage/deleteData.do', { id: id }).then(data => {
        if (data.data === true) {

            let $wPanel = $self.parents('.w-panel');
            let $wTable = $self.parents('.w-table');

            // 如果当前数据有多条
            if ($wPanel.find('.w-table').length > 1) {
                $wTable.remove();

            // 如果当前数据只有 1 条
            } else {
                $wPanel.remove();
            }

        } else {
            modaler.tip('删除失败');
        }
    });
});

// 监听上传文件是否变动
$('body').on('change', '#import-data', e => {

    // 构造上传数据
    let formData = new FormData();
    formData.append('importFile', e.target.files[0]);
    formData.append('date', $('#import-data-datepicker').val());
    formData.append('businessId', urler().id);

    // 发送请求给服务器
    window.requester.ajax('/external/manage/importData.do', formData, {
        method: 'POST',
        processData: false,
        contentType: false
    }).then(data => {
        $('.search [type="file"]').remove();
        $('.search').append('<input type="file" accept="*/*" id="import-data">');

        if (data.data === true) {
            modaler.tip('上传成功');
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            modaler.tip('上传失败');
        }
    });
});

// 渲染表格
collapseTable.render({
    url: '/external/manage/listData.do',
    containerId: '#data',
    param: {
        businessId: urler().id
    },
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
                    id: record.id,
                    tables: [record]
                });

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
