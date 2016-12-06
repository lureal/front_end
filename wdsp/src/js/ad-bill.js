import {
    convertMoney,
    convertPercent,
    compareTime,
    urlAddParam
} from './libs/tools';
import checkbox from './libs/checkbox';

// 设置公司名称，产品名称和 ID
let companyInfo = JSON.parse(localStorage.getItem('custom_info'));

// 激活左侧导航栏
$('#sidebar-ad').addClass('w-active');

// 渲染广告订单表格
tabler.render({
    url: '/deal/order/list.do',
    tpl: $('#bill-tpl').html(),
    container: '#bill',
    handle(data) {

        for (let record of data.data.records) {

            // 互动率
            record.interactRatio = convertPercent(record.interactRatio);

            // 互动成本
            record.interactPrice = convertMoney(record.interactPrice);

            // 点击率
            record.clickRatio = convertPercent(record.clickRatio);

            // 点击成本
            record.clickPrice = convertMoney(record.clickPrice);

            // 消耗
            record.consume = convertMoney(record.consume);

            // 订单价格
            record.bidPrice = convertMoney(record.bidPrice);

            // 订单预算
            record.quota = convertMoney(record.quota);

            // 总体预算
            record.totalQuota = convertMoney(record.totalQuota);
        }

        return data;
    },
    otherParam: {
        export: false
    },
    cb(data) {

        // 初始化 checkbox
        checkbox.render({
            selector: '.w-checkbox'
        });

        urlAddParam();
    }
});

// 修改限额
$('body').on('click', '.quota > button', e => {
    let $self = $(e.currentTarget);
    let $parent = $self.parent();
    let isEdit = $parent.attr('data-isEdit');
    let id = $self.attr('data-id');
    let value = $parent.find('input').val().replace(/,/g, '');

    // 当前状态是确定
    if (isEdit === '1') {

        // 对数据进行校验
        if (isNaN(Number(value))) {
            modaler.tip('广告组限额只能输入数字');
            return;
        }

        $parent.attr('data-isEdit', '0');
        $self.html('修改');
        $parent.find('input').attr('readonly', 'readonly');

    // 当前状态是修改
    } else {
        $parent.attr('data-isEdit', '1');
        $self.html('确定');
        $parent.find('input').removeAttr('readonly');
    }

    // 如果当前是修改，则发起请求
    if (isEdit === '1') {

        // 发起请求
        requester.get('/deal/order/updatePrice.do', {
            orderId: id,
            price: parseInt(Number(value) * 100)
        }).then(data => {
            if (data.data === true) {
                modaler.tip('修改成功');
                $parent.find('input').val(convertMoney(Number(value) * 100));
            } else {
                modaler.tip('修改失败');
            }
        });
    }
});

// 修改预算
$('body').on('click', '.budget > button', e => {
    let $self = $(e.currentTarget);
    let $parent = $self.parent();
    let isEdit = $parent.attr('data-isEdit');
    let id = $self.attr('data-id');
    let value = $parent.find('input').val().replace(/,/g, '');

    // 当前状态是确定
    if (isEdit === '1') {

        // 对数据进行校验
        if (isNaN(Number(value))) {
            modaler.tip('每日预算只能输入数字');
            return;
        }

        // 总体预算需大于等于每日预算
        let budget = $self.parents('td').eq(0).find('.budget [type="text"]').val().replace(/,/g, '');
        let totalBudge = $self.parents('td').eq(0).find('.total-budget [type="text"]').val().replace(/,/g, '');

        if (Number(budget) > Number(totalBudge)) {
            modaler.tip('总体预算需大于等于每日预算，请重新修改');
            return;
        }

        $parent.attr('data-isEdit', '0');
        $self.html('修改');
        $parent.find('input').attr('readonly', 'readonly');

    // 当前状态是修改
    } else {
        $parent.attr('data-isEdit', '1');
        $self.html('确定');
        $parent.find('input').removeAttr('readonly');
    }

    // 如果当前是修改，则发起请求
    if (isEdit === '1') {

        // 发起请求
        requester.get('/deal/order/updateQuota.do', {
            orderId: id,
            quota: parseInt(Number(value) * 100)
        }).then(data => {
            if (data.data === true) {
                modaler.tip('修改成功');
                $parent.find('input').val(convertMoney(Number(value) * 100));
            } else {
                modaler.tip('修改失败');
            }
        });
    }
});

// 修改总体预算
$('body').on('click', '.total-budget > button', e => {
    let $self = $(e.currentTarget);
    let $parent = $self.parent();
    let isEdit = $parent.attr('data-isEdit');
    let id = $self.attr('data-id');
    let value = $parent.find('input').val().replace(/,/g, '');

    // 当前状态是确定
    if (isEdit === '1') {

        // 对数据进行校验
        if (isNaN(Number(value))) {
            modaler.tip('总体预算只能输入数字');
            return;
        }

        // 总体预算需大于等于每日预算
        let budget = $self.parents('td').eq(0).find('.budget [type="text"]').val().replace(/,/g, '');
        let totalBudge = $self.parents('td').eq(0).find('.total-budget [type="text"]').val().replace(/,/g, '');

        if (Number(budget) > Number(totalBudge)) {
            modaler.tip('总体预算需大于等于每日预算，请重新修改');
            return;
        }
        
        $parent.attr('data-isEdit', '0');
        $self.html('修改');
        $parent.find('input').attr('readonly', 'readonly');

    // 当前状态是修改
    } else {
        $parent.attr('data-isEdit', '1');
        $self.html('确定');
        $parent.find('input').removeAttr('readonly');
    }

    // 如果当前是修改，则发起请求
    if (isEdit === '1') {

        // 发起请求
        requester.get('/deal/order/updateTotalQuota.do', {
            orderId: id,
            quota: parseInt(Number(value) * 100)
        }).then(data => {
            if (data.data === true) {
                modaler.tip('修改成功');
                $parent.find('input').val(convertMoney(Number(value) * 100));
            } else {
                modaler.tip('修改失败');
            }
        });
    }
});

// 启用/停用订单
$('body').on('click', 'td .toggle', e => {
    let $self = $(e.currentTarget);
    let status = $self.attr('data-status');
    let id = $self.attr('data-id');

    if (status === '3') {
        $self.html('启用');
        $self.parents('tr').find('.stop-group').show();
        $self.parents('tr').find('.active-group').hide();
        $self.attr('data-status', '1');

        // 执行停用
        requester.get('/deal/order/stop.do', { orderId: id }).then(data => {
            if (data.data === true) {
                modaler.tip('停用成功');

                // 改变表单中的状态
                $self.parents('tr').find('.table-status > span').hide();
                $self.parents('tr').find('.stop-bill').show();
            } else {
                modaler.tip('失败成功');
            }
        });

        // 设置当前状态为启用
        $self.attr('data-status', 4);

    } else {
        $self.html('暂停');
        $self.parents('tr').find('.stop-group').hide();
        $self.parents('tr').find('.active-group').show();
        $self.attr('data-status', '0');

        // 执行启用
        requester.get('/deal/order/start.do', { orderId: id }).then(data => {
            if (data.data === true) {
                modaler.tip('启用成功');

                // 改变表单中的状态
                $self.parents('tr').find('.table-status > span').hide();
                $self.parents('tr').find('.active-bill').show();

            } else {
                modaler.tip('启用失败');
            }
        });

        // 设置当前状态为停用
        $self.attr('data-status', 3);
    }
});

// 删除订单
$('body').on('click', 'td .del', e => {
    let $self = $(e.currentTarget);
    let id = $(e.currentTarget).attr('data-id');

    // 弹出提示框让用户判定是否删除
    modaler.dialog({
        msg: `
            <p style="font-size: 20px; color: #1b8cfa; margin-bottom: 10px;">是否删除订单？</p>
        `,
        evt() {

            // 发起请求删除数据
            requester.get('/deal/order/remove.do', { orderId: id }).then(data => {
                if (data.data === true) {
                    location.reload();
                } else {
                    $('#modal-dialog').modal('hide');
                    modaler.tip('删除失败');
                }
            });
        }
    });
});

// 全选按钮
$('#select-all').change(e => {
    let self = e.currentTarget;

    // 勾选
    if (self.checked === true) {

        // 查找当前页面中的勾选框，并将数据
        $('.bill-checkbox').prop('checked', true).parent().addClass('active');

    // 取消勾选
    } else {

        // 取消勾选勾选框
        $('.bill-checkbox').prop('checked', false).parent().removeClass('active');

    }
});

// 批量启用
$('#group-active').click(e => {

    // 获得界面中所有勾选的勾选框，并拿到 ID 字符串
    let ids = getCheckboxId();

    // 如果用户没有勾选一个勾选框，则提示
    if (ids === '') {
        modaler.tip('请至少选择一个订单');
        return;
    }

    // 如果用户至少勾选了一个勾选框则发送请求
    requester.get('/deal/order/start.do', { orderId: ids }).then(data => {
        if (data.data === true) {
            modaler.tip('批量启用成功');
        } else {
            modaler.tip('批量启用失败');
        }
    });
});

// 批量停用
$('#group-stop').click(e => {

    // 获得界面中所有勾选的勾选框，并拿到 ID 字符串
    let ids = getCheckboxId();

    // 如果用户没有勾选一个勾选框，则提示
    if (ids === '') {
        modaler.tip('请至少选择一个订单');
        return;
    }

    requester.get('/deal/order/stop.do', { orderId: ids }).then(data => {
        if (data.data === true) {
            modaler.tip('批量停用成功');
        } else {
            modaler.tip('批量停用失败');
        }
    });
});

// 弹窗中的 [type="text"] 框焦点聚焦去除错误信息
$('body').on('focus', '.modal-diy-body [type="text"]', e => {
    $(e.currentTarget).parents('.row').removeClass('error');
});

// 批量修改日期
$('#group-edit-date').click(e => {

    // 获得界面中所有勾选的勾选框，并拿到 ID 字符串
    let ids = getCheckboxId();

    // 如果用户没有勾选一个勾选框，则提示
    if (ids === '') {
        modaler.tip('请至少选择一个订单');
        return;
    }

    // 如果用户至少勾选了一个勾选框则弹出修改日期弹出框
    modaler.diy({
        ctn: $('#edit-date-tpl').html(),
        className: 'edit-date-modal'
    });

    // 初始化弹窗中的选择日期
    $('#modal-datepicker').daterangepicker({
        format: 'YYYY/MM/DD',
        language: 'zh-CN'
    });

    // 弹窗中的单击事件
    $('#edit-date-btn').unbind('click').bind('click', e => {
        let $dateWrap = $('.edit-date-modal .modal-diy-body .row');
        let $datepicker = $('#modal-datepicker');
        let date = $datepicker.val();

        // 日期判断
        if (date === '') {
            $dateWrap.addClass('error');
            return;
        }

        // 将日期转换成服务器需要的日期
        let dateArr = [];
        for (let item of (date.replace(/\s/g, '').split('-'))) {
            dateArr.push(item.replace(/\//g, '-'));
        }

        // 发起请求
        requester.get('/deal/order/updateDate.do', {
            orderId: ids,
            date: `${dateArr[0]}~${dateArr[1]}`
        }).then(data => {
            if (data.data === true) {
                $('#modal-diy').modal('hide');
                modaler.tip('日期修改成功');
            } else {
                $('#modal-diy').modal('hide');
                modaler.tip('日期修改失败');
            }
        });
    });
});

// 批量修改时间
$('#group-edit-time').click(e => {

    // 获得界面中所有勾选的勾选框，并拿到 ID 字符串
    let ids = getCheckboxId();

    // 如果用户没有勾选一个勾选框，则提示
    if (ids === '') {
        modaler.tip('请至少选择一个订单');
        return;
    }

    // 如果用户至少勾选了一个勾选框则弹出修改日期弹出框
    modaler.diy({
        ctn: $('#edit-time-tpl').html(),
        className: 'edit-time-modal'
    });

    // 初始化时间控件
    $('#modal-start-time').datetimepicker({
        format: 'HH:mm'
    });
    $('#modal-end-time').datetimepicker({
        format: 'HH:mm'
    });

    // 弹窗中的单击事件
    $('#edit-time-btn').unbind('click').bind('click', e => {
        let $self = $(e.currentTarget);
        let startTimeWrap = $('.start-time-wrap');
        let endTimeWrap = $('.end-time-wrap');

        // 获取时间
        let startTime = $('#modal-start-time').val().replace(/\s/g, '');
        let endTime = $('#modal-end-time').val().replace(/\s/g, '');

        // 时间校验：时间是不是在正常范围内，开始时间是不是大于结束时间，当前用户是否有输入时间
        if (startTime === '') {
            startTimeWrap.addClass('error');
            return;
        }

        if (endTime === '') {
            endTimeWrap.addClass('error');
            return;
        }

        // 如果开始时间大于结束时间
        if (
            compareTime(startTime, endTime) === 1 ||
            compareTime(startTime, endTime) === 0
        ) {
            modaler.tip('开始时间不能大于等于结束时间');
            return;
        }

        // 发送请求
        requester.get('/deal/order/updateTime.do', {
            orderId: ids,
            time: `${startTime}~${endTime}`
        }).then(data => {
            if (data.data === true) {
                $('#modal-diy').modal('hide');
                modaler.tip('时间修改成功');
            } else {
                $('#modal-diy').modal('hide');
                modaler.tip('时间修改失败');
            }
        });
    });
});

// 批量修改出价
$('#group-edit-bidprice').click(e => {

    // 获得界面中所有勾选的勾选框，并拿到 ID 字符串
    let ids = getCheckboxId();

    // 如果用户没有勾选一个勾选框，则提示
    if (ids === '') {
        modaler.tip('请至少选择一个订单');
        return;
    }

    // 如果用户至少勾选了一个勾选框则弹出修改日期弹出框
    modaler.diy({
        ctn: $('#edit-bidprice-tpl').html(),
        className: 'edit-bidprice-modal'
    });

    // 确定事件
    $('#edit-bidprice-btn').unbind('click').bind('click', e => {

        // 获取出价
        let $bidpriceWrap = $('.edit-bidprice-modal .modal-diy-body .row');
        let $bidprice = $('#modal-bidprice');
        let bidprice = $('#modal-bidprice').val();

        // 出价校验
        if (isNaN(Number(bidprice)) || bidprice === '') {
            $bidpriceWrap.addClass('error');
            return;
        }

        // 发起请求
        requester.get('/deal/order/updatePrice.do', {
            orderId: ids,
            price: parseInt(Number(bidprice) * 100)
        }).then(data => {
            if (data.data === true) {

                // 逆推找到勾选的元素，保存在 $eles 中
                let $eles = [];

                // 将找到的元素存储到 $eles 中
                _.each(ids.split(','), id => {
                    $eles.push($(`[value="${id}"]`));
                });

                // 设置值
                for (let $item of $eles) {
                    $item.parents('tr').find('.bidprice-wrap [type="text"]').val(bidprice);
                }

                // 提示
                $('#modal-diy').modal('hide');
                modaler.tip('出价修改成功');
            } else {
                $('#modal-diy').modal('hide');
                modaler.tip('出价修改失败');
            }
        });
    });
});

// 批量删除
$('#group-del').click(e => {

    // 获得界面中所有勾选的勾选框，并拿到 ID 字符串
    let ids = getCheckboxId();

    // 如果用户没有勾选一个勾选框，则提示
    if (ids === '') {
        modaler.tip('请至少选择一个订单');
        return;
    }

    // 弹出提示框让用户判定是否删除
    modaler.dialog({
        msg: `
            <p style="font-size: 20px; color: #1b8cfa; margin-bottom: 10px;">是否删除订单？</p>
        `,
        evt() {

            // 发起请求删除数据
            requester.get('/deal/order/remove.do', { orderId: ids }).then(data => {
                if (data.data === true) {
                    location.reload();
                } else {
                    $('#modal-dialog').modal('hide');
                    modaler.tip('删除失败');
                }
            });
        }
    });
});

// 创建新广告
$('#create-ad').click(e => {
    localStorage.removeItem('weiboAdInfo');
    location.href = `/#proj_name#/html/ad/weibo/base-info.html?cid=${urler().cid}`;
});

/**
 * 获取界面中所有勾选的勾选框，返回 ID 字符串
 * @returns {String} - 返回 ID 字符串
 */
function getCheckboxId() {
    let idStr = '';

    $('.bill-checkbox').each((index, el) => {
        let id = $(el).val();

        // 如果当前勾选框有勾选的则将 ID 追加到 idStr 中
        if (el.checked) {
            if (idStr === '') {
                idStr += `${id}`;
            } else {
                idStr += `,${id}`;
            }
        }
    });

    return idStr;
}
