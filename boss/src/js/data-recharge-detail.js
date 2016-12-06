/*!
 * 充值记录详情
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var urler = require('./modules/urler.js');

// 初始化导航
auth.noToolbar({
    title: '充值记录详情'
});

// 获取服务器数据
ajax.get({
    url: '/admin/recharge/detail.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {
        var tpl = $('#detail-tpl').html();
        $('#detail').html(_.template(tpl)(data));

        // 初始化类型选择
        select2.init({
            url: '/admin/recharge/agent_option.do',
            title: '添加充值记录',
            cb: function(_data) {
                var tpl = $('#select-tpl').html();
                $('#agent').html(_.template(tpl)(_data));
                $('#agent').select2({
                    placeholder: '选择类型'
                }).select2('val', data.data.recharge.agent);
            }
        });
    },
    modal: modal,
    title: '充值记录'
});

// 提交数据
$('body').on('click', '#submit', function() {
    $("#submit").attr("disabled", true);

    // 获取数据
    var contractDate = $('#contractDate').val();
    var contractId = $('#contractId').val();
    var platformId = $('#platformId').val();
    var custName = $('#custName').val();
    var agent = select2.getVal({
        id: '#agent'
    });
    var contractAmount = $('#contractAmount').val();
    var paymentAmount = $('#paymentAmount').val();
    var paymentDate = $('#paymentDate').val();
    var discount = $('#discount').val();
    var donate = $('#donate').val();
    var chargeAmount = $('#chargeAmount').val();
    var allotDate = $('#allotDate').val();
    var serviceCharge = $('#serviceCharge').val();
    var openCharge = $('#openCharge').val();
    var memo = $('#memo').val();

    // 数据合法性校验
    var isContractDate = contractDate !== '';
    var isContractId = contractId !== '';
    var isPlatformId = platformId !== '';
    var isCustName = custName !== '';
    var isAgent = agent !== '' || agend !== null;
    var isContractAmount = contractAmount !== '';
    var isPaymentAmount = paymentAmount !== '';
    var isPaymentDate = paymentDate !== '';
    var isDiscount = discount !== '';
    var isDonate = donate !== '';
    var isChargeAmount = chargeAmount !== '';
    var isAllotDate = allotDate !== '';
    var isServiceCharge = serviceCharge !== '';
    var isOpenCharge = openCharge !== '';
    var isMemo = memo !== '';

    if(!isContractDate || !isContractId || !isPlatformId || !isCustName || !isContractAmount || !isChargeAmount || !isAllotDate) {
        modal.nobtn({
            ctx: 'body',
            title: '添加充值记录',
            ctn: '请输入必选字段：合同日期，合同号，平台ID，客户名称，合同金额，充值金额，划拨日期'
        });
        return;
    }

    // 提交数据
    ajax.get({
        url: '/admin/recharge/update.do',
        param: {
            id: urler.normal().id,
            contractDate: contractDate,
            contractId: contractId,
            platformId: platformId,
            custName: custName,
            agent: agent,
            contractAmount: contractAmount,
            paymentAmount: paymentAmount,
            paymentDate: paymentDate,
            discount: discount,
            donate: donate,
            chargeAmount: chargeAmount,
            allotDate: allotDate,
            serviceCharge: serviceCharge,
            openCharge: openCharge,
            memo: memo
        },
        cb: function(data) {
            $("#submit").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '添加充值记录',
                    ctn: '添加成功',
                    event: function() {
                        location.href = '/#proj_name#/html/data/recharge-list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '添加充值记录',
                    ctn: '添加失败'
                });
            }
        },
        modal: modal,
        title: '添加充值记录'
    });

});
