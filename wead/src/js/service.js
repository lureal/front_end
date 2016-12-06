const _ = window._;
const requester = window.requester;
const tabler = window.tabler;
const modaler = window.modaler;

// 获取业务开通状态
requester.get('/external/business/listStatus.do').then(data => {
    let cardTpl = $('#card-tpl').html();

    // 如果接口返回的数据小于三条则手动增加到 3 条
    if (data.data.records.length < 3) {
        for (var i = data.data.records.length; i < 3; i++) {
            data.data.records.push({
                type: -1,
                status: -1
            });
        }
    }

    // 渲染数据
    $('#cards').html(_.template(cardTpl)(data));
});

// 渲染服务介绍
let introTpl = $('#intro-tpl').html();
$('#intro').html(_.template(introTpl)({
    intros: [
        {
            id: 0,
            title: '微博粉丝通：基于新浪微博海量的用户，把推广信息广泛传送给粉丝和潜在客户的营销产品'
        }
    ]
}));

// 渲染资质详情
tabler.render({
    url: '/external/business/list.do',
    tpl: $('#detail-tpl').html(),
    container: '#detail'
});

// 重新开通和立即开通按钮，进入后删除本地缓存
$('body').on('click', '.open-fensitong', (e) => {
    let $self = $(e.currentTarget);

    // 删除本地存储的变量
    window.localStorage.removeItem('fensitong_submit_data');
    location.href = '/#proj_name#/html/service/fensitong/first.html';
});
