import { fetchStatus } from './libs/tools';

let cachePlatformId; // 缓存当前选择的平台

// 初始化订单名称
renderDataFromCache(1);

// 获取广告组列表
getAdGroup(() => {

    // 如果本地存储有广告组的值，则初始化广告组
    renderDataFromCache(2);
});

// 获取投放平台列表
requester.get('/select/listPlatForms.do').then(data => {

    // 处理数据，将数据从 {0: xx, 1: xx} 更改为 [{id: 0, val: xx}]
    let _data = [];

    for (let prop in data.data) {
        _data.push({
            id: prop,
            val: data.data[prop]
        });
    }

    // 缓存第一个值
    if (_data.length > 0) {
        cachePlatformId = _data[0].id;
    }

    let tpl = $('#ad-platform-tpl').html();
    $('#ad-platform').html(_.template(tpl)({
        data: _data
    }));

    // 初始化 iCheck
    $('.w-form [type="radio"]').iCheck({
        checkboxClass: 'icheckbox_flat-blue',
        radioClass: 'iradio_flat-blue'
    });
});

// 投放平台切换
$('body').on('ifChecked', '#ad-platform [type="radio"]', e => {
    let $self = $(e.currentTarget);
    cachePlatformId = $self.val();
});

// 弹出新建广告组
$('#create-ad-group').click(e => {
    let tpl = $('#create-ad-group-tpl').html();
    modaler.diy({
        ctn: tpl,
        className: 'create-ad-group-modal'
    });
});

// 弹窗中的 [type="text"] 框焦点聚焦去除错误信息
$('body').on('focus', '.modal-diy-body [type="text"]', e => {
    $(e.currentTarget).parents('.row').removeClass('error');
});

// 新建广告组按钮
$('body').on('click', '#modal-create-group', e => {
    let $groupNameWrap = $('#modal-group-name-wrap');
    let $groupName = $('#modal-group-name');
    let $quotaWrap = $('#modal-group-quota-wrap');
    let $quota = $('#modal-group-quota');
    let groupName = $groupName.val();
    let quota = $quota.val();

    // 数据校验
    if (groupName === '') {
        console.log(1);
        $groupNameWrap.addClass('error');
        return;
    }
    if (
        quota === '' ||
        isNaN(Number(quota)) ||
        Number(quota) <= 0
    ) {
        console.log(2);
        $quotaWrap.addClass('error');
        return;
    }

    // 判断当前是否在请求中
    if (fetchStatus.getState(e.currentTarget) !== '0') {
        return;
    }

    // 标识当前为请求中
    fetchStatus.loading(e.currentTarget);

    // 校验通过，发送请求
    requester.get('/deal/group/submit.do', {
        name: groupName,
        quota: parseInt(Number(quota) * 100)
    }).then(data => {

        $('#modal-diy').modal('hide');

        // 恢复原来的状态
        fetchStatus.reset(e.currentTarget);

        if (data.data === true) {
            modaler.tip('新增广告组成功');
            getAdGroup();
        } else {
            modaler.tip('新增广告组失败');
        }
    });
});

// 当 input 聚焦时去除错误信息
$('[data-type="input"] input, [data-type="textarea"] textarea').focus((e) => {
    let $parent = $(e.currentTarget).parents('.w-row').removeClass('w-error');
});

// 下一步
$('#submit').click(e => {
    let isValidate = true; // 标识是否校验成功
    let fields = { // 字段列表
        groupId: '',
        name: '',
        platformId: cachePlatformId
    };

    $('.w-form .w-row').each((index, el) => {
        let $self = $(el);
        let type = $self.attr('data-type');
        let id = $self.attr('data-id');
        let validates = $self.attr('data-validate').split(','); // 获取需要判断的条件

        switch (type) {
            case 'input':
                let _val = $self.find('input').val(); // 获取输入框的值

                // 循环判断条件
                for (let validate of validates) {

                    // 判断是否为空
                    if (validate === 'empty' && _val === '') {
                        $self.addClass('w-error');
                        isValidate = false;
                        return;
                    }

                    // 缓存值
                    fields[id] = _val;
                }
                break;
            case 'select':
                fields[id] = $self.find('select').val();
                break;
            default:
                break;
        }
    });

    // 当前数据校验失败，不发送请求
    if (isValidate === false) {
        return;
    }

    // 缓存数据
    cacheData({
        data: fields
    });

    // 跳转到下一步骤
    jump2NextStep();
});

/**
 * 获取广告组列表，并渲染显示数据
 * 抽象此方法是因为获取广告组可能会在多处用到
 * @param {Function} cb - 获取广告组数据后的回调函数
 */
function getAdGroup(cb = (() => {})) {
    requester.get('/select/listAdGroups.do').then(data => {
        let tpl = $('#ad-group-tpl').html();
        $('#ad-group').html(_.template(tpl)(data));

        cb();
    });
}

/**
 * 如果之前有缓存数据，则根据之前缓存的数据渲染界面
 * @param {Number} part - 标识当前要初始化哪部分 0 -> 名称，1 -> 广告组，2 -> 投放平台
 */
function renderDataFromCache(part) {
    let data;

    // 如果当前是编辑订单，则拿到编辑订单的缓存数据
    if (urler().edit === '1') {
        data = JSON.parse(localStorage.getItem('editWeiboAdInfo'));

    // 如果当前是新创建的订单，则拿到新创建订单的缓存数据
    } else {
        data = JSON.parse(localStorage.getItem('weiboAdInfo'));
    }

    // 如果当前没有数据，则直接返回
    if (!data) {
        return;
    }

    switch (part) {
        case 1:
            $('[data-id="name"]').find('input').val(data.name);
            break;
        case 2:
            $('#ad-group').val(data.groupId);
            break;
        case 3:
            break;
        default:

    }
}

/**
 * 缓存订单基本信息数据
 * @param {Function} cb - 缓存完数据后的毁掉函数
 */
function cacheData({ data, cb = (() => {}) }) {

    // 如果当前是编辑订单
    if (urler().edit === '1') {
        let weiboAdInfo = JSON.parse(localStorage.getItem('editWeiboAdInfo'));
        weiboAdInfo.groupId = data.groupId;
        weiboAdInfo.name = data.name;
        weiboAdInfo.platformId = data.platformId;
        localStorage.setItem('editWeiboAdInfo', JSON.stringify(weiboAdInfo));

    // 如果当前是创建新的订单
    } else {
        let weiboAdInfo = localStorage.getItem('weiboAdInfo');

        // 如果之前已经有存储过相关的信息，则取出之前的数据进行更改
        if (weiboAdInfo) {
            weiboAdInfo = JSON.parse(weiboAdInfo);
            weiboAdInfo.groupId = data.groupId;
            weiboAdInfo.name = data.name;
            weiboAdInfo.platformId = data.platformId;
            localStorage.setItem('weiboAdInfo', JSON.stringify(weiboAdInfo));

        // 之前没有存储过相关的信息，存储一个新的数据到本地
        } else {
            localStorage.setItem('weiboAdInfo', JSON.stringify(data));
        }
    }

    // 执行回调函数
    cb();
}

/**
 * 跳转到下一步骤
 */
function jump2NextStep() {

    // 如果当前是编辑订单
    if (urler().edit === '1') {
        location.href = `/#proj_name#/html/ad/weibo/promotion-info.html?cid=${urler().cid}&edit=1&oid=${urler().oid}`;

    // 当前不是编辑订单
    } else {
        location.href = `/#proj_name#/html/ad/weibo/promotion-info.html?cid=${urler().cid}`;
    }
}