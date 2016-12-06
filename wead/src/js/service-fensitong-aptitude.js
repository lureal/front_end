const requester = window.requester;
const modaler = window.modaler;
import urler from './libs/urler';

// 获取查看资质数据
requester.get('/external/manage/getBusiness.do', { id: urler().id }).then(data => {

    // 渲染数据
    $('#account').val(data.data.weiboAccount);
    $('#uid').val(data.data.uid);
    $('#contact').val(data.data.contactName);
    $('#company').val(data.data.companyName);
    $('#url').val(data.data.url);
    $('#contactSite').val(data.data.address);
    $('#contactNumber').val(data.data.phone);

    // 获取行业列表渲染行业数据
    requester.get('/select/listTrades.do', { id: 'fans' }).then(_data => {

        // 循环获得行业数据
        for (let item in _data.data) {

            // 确定行业名称
            if (item === data.data.weiboTradeId) {
                $('#industry').val(_data.data[item]);
            }
        }
    });

    $('#pic-upload-preview')
        .show()
        .find('img')
        .attr('src', data.data.businessLicense);
    $('#email').val(data.data.salesEmail);
});

// 申请修改按钮
$('#edit').click(e => {

    // 弹出申请修改弹窗
    modaler.dialog({
        msg: '资质修改后，需要1个工作日重新审核<br>是否申请修改?',
        evtLabel: '申请',
        evt() {
            location.href = '/#proj_name#/html/service/fensitong/apply-edit.html?id=' + urler().id;
        }
    });
});
