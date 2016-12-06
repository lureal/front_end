import {
    convertMoney,
    convertPercent
} from './libs/tools';

// 渲染广告组表格
tabler.render({
    url: '/deal/group/list.do',
    tpl: $('#group-tpl').html(),
    container: '#group',
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

            // 广告组日限额
            record.quota = convertMoney(record.quota);
        }
        return data;
    },
    otherParam: {
        export: false
    }
});

// 广告组日限额
$('body').on('click', '.quota > button', e => {
    let $self = $(e.currentTarget);
    let $parent = $self.parent();
    let isEdit = $parent.attr('data-isEdit');
    let id = $self.attr('data-id');
    let value = $parent.find('input').val();

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
        $parent.find('input').val(Number($parent.find('input').val()).toFixed(2));

        // 发起请求
        requester.get('/deal/group/updateQuota.do', {
            groupId: id,
            quota: Number(value) * 100
        }).then(data => {
            if (data.data === true) {
                modaler.tip('修改成功');
            } else {
                modaler.tip('修改失败');
            }
        });
    }
});

// 暂停/启用广告组
$('body').on('click', '.toggle', e => {
    let $self = $(e.currentTarget);
    let status = $self.attr('data-status');
    let id = $self.attr('data-id');

    if (status !== '0') {
        $self.html('启用');
        $self.parents('tr').find('.stop-group').show();
        $self.parents('tr').find('.active-group').hide();
        $self.attr('data-status', '0');

        // 执行停用
        requester.get('/deal/group/stop.do', { groupId: id }).then(data => {
            if (data.data === true) {
                modaler.tip('停用成功');
            } else {
                modaler.tip('失败成功');
            }
        });

    } else {
        $self.html('停用');
        $self.parents('tr').find('.stop-group').hide();
        $self.parents('tr').find('.active-group').show();
        $self.attr('data-status', '1');

        // 执行启用
        requester.get('/deal/group/start.do', { groupId: id }).then(data => {
            if (data.data === true) {
                modaler.tip('启用成功');
            } else {
                modaler.tip('启用失败');
            }
        });
    }
});

// 删除广告组
$('body').on('click', '.del', e => {
    let $self = $(e.currentTarget);
    let id = $(e.currentTarget).attr('data-id');

    // 弹出提示框让用户判定是否删除
    modaler.dialog({
        msg: `
            <p style="font-size: 20px; color: #1b8cfa; margin-bottom: 10px;">是否删除广告组？</p>
            <p style="font-size: 14px; color: #738399; margin: 0;">（注意：该广告组下的订单也将一并删除）</p>
        `,
        evt() {

            // 发起请求删除数据
            requester.get('/deal/group/remove.do', { groupId: id }).then(data => {
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
