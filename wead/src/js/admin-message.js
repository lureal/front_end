const _ = window._;
const tabler = window.tabler;
var cacheSearchKeyword = ''; // 缓存范围搜索关键词
var cacheSearchPage = 1; // 缓存范围搜索页数
var cacheCompany = []; // 缓存选择范围中选择的公司
import { convertTimestamp } from './libs/tools';

var isNoMoreData = false; // 滚动加载判定接下来是否还有数据
var isLoadingData = false; // 滚动加载判定当前是否在加载数据

// 执行渲染推送列表
renderPushTable();

// 单击选择范围按钮和重新选择按钮，弹出自定义弹出框
$('#not-select button, #selected #reselect').click(() => {

    // 重置缓存数组
    cacheCompany = [];

    let tpl = $('#area-modal-tpl').html();
    modaler.diy({ ctn: tpl });
    getCompanyData(1, 0);
    cacheSearchKeyword = '';
    cacheSearchPage = 1;

    // 监听滚动效果
    $('#area-modal-company').unbind('scroll').bind('scroll', e => {
        let scrollTop = $(e.currentTarget).scrollTop();
        let height = $(e.currentTarget).height();
        let scrollHeight = $(e.currentTarget)[0].scrollHeight;

        if (scrollTop + height >= scrollHeight - 40) {
            isLoadingData = true;

            // 获取数据
            if (!isNoMoreData || !isLoadingData) {
                getCompanyData(++cacheSearchPage, 1, { name: cacheSearchKeyword }, (data) => {
                    isLoadingData = false;

                    // 重置高度
                    $('#area-modal-company').scrollTop(height + scrollTop);

                    if (data.data.records.length === 0) {
                        isNoMoreData = true;
                    }
                });
            }
        }
    });
});

// 搜索范围
$('body').on('click', '#area-modal-search-icon', e => {
    isNoMoreData = false;
    isLoadingData = false;

    let value = $('#area-modal-search').val();
    getCompanyData(1, 0, { name: value }, data => {
        cacheSearchKeyword = value;
        cacheSearchPage = 1;
        $('#area-modal-company').scrollTop(0);
    });
});

// 回车搜索范围
$('body').on('keypress', '#area-modal-search', e => {
    if (e.keyCode === 13) {
        isNoMoreData = false;
        isLoadingData = false;

        let value = $('#area-modal-search').val();
        getCompanyData(1, 0, { name: value }, data => {
            cacheSearchKeyword = value;
            cacheSearchPage = 1;
            $('#area-modal-company').scrollTop(0);
        });
    }
});

// 确认范围
$('body').on('click', '#modal-confirm', e => {
    if (cacheCompany.length < 1) {
        modaler.tip('请至少选择一个范围');
        return;
    }

    // 隐藏自定义弹窗
    $('#modal-diy').modal('hide');
    $('#selected').show();
    $('#not-select').hide();
    $('#area').attr('data-select', JSON.stringify(cacheCompany)); // 将选中的数据绑定到 html 中

    // 显示数据
    var str = `已选成员（${cacheCompany.length}）：`;
    cacheCompany.forEach((item, index) => {
        if (index === 0) {
            str += item.name;
        } else {
            str += ('、' + item.name);
        }
    });
    $('#selected-content > span').html(str);
});

// 推送消息
$('#push-message').click(() => {
    let company = $('#area').attr('data-select') === '' ? [] : JSON.parse($('#area').attr('data-select'));

    // 获取范围
    let area = '';
    let areaId = '';

    // 获取传送给服务器的数据
    company.forEach((item, index) => {
        if (index === 0) {
            area += item.name;
            areaId += item.id;
        } else {
            area += (',' + item.name);
            areaId += (',' + item.id);
        }
    });

    // 获取内容
    let content = $('#push-content').val();

    // 数据校验
    if (
        area === '' ||
        areaId === '' ||
        content === ''
    ) {
        modaler.tip('请选择范围并输入内容');
        return;
    }

    // 推送
    requester.post('/external/manage/submitTips.do', {
        content: content,
        customIds: areaId,
        customNames: area
    }).then(data => {
        if (data.data === true) {
            modaler.tip('<i class="fa fa-check"></i>推送成功');

            // 重新刷新推送表格
            renderPushTable();
        } else {
            modaler.tip('推送失败');
        }
    });
});

/**
 * 获取并填充公司数据
 * @param {Number} page - 页数
 * @param {Number} type - 0 -> 替换 area-modal-company 中的数据 1 -> 追加数据到 area-modal-company 后
 * @param {String} param - 传递给服务器的参数
 * @param {Function} cb - 回掉函数
 */
function getCompanyData(page, type, param = {}, cb = () => {}) {
    let self = this;
    var _param = $.extend({}, { page: page }, param);

    // 获取数据填充弹出框
    requester.get('/external/manage/listCustom.do', _param).then(data => {
        let tpl = $('#area-modal-company-tpl').html();

        // 替换数据
        if (type === 0) {

            // 首次加载，并且没有数据时
            if (data.data.records.length < 1) {
                $('#area-modal-company').hide();
                $('#area-modal-company-noresult').show();

            // 有数据
            } else {
                $('#area-modal-company').show();
                $('#area-modal-company-noresult').hide();
                $('#area-modal-company').html(_.template(tpl)(data.data));
            }

        // 追加数据
        } else {
            $('#area-modal-company').append(_.template(tpl)(data.data));
        }

        // 将 checkbox 初始化 iCheck
        $('.modal-diy-body [type="checkbox"]').iCheck({
            checkboxClass: 'iradio_square-blue'
        });

        // 如果当前的 iCheck item 已经缓存在数组里，则选中它
        for (let item of data.data.records) {
            for (let _item of cacheCompany) {
                if (Number(item.id) === Number(_item.id)) {
                    $(`.modal-diy-body [type="checkbox"][value="${item.id}"]`).iCheck('check');
                    console.log(item);
                }
            }
        }

        // iCheck 点击事件
        $('.modal-diy-body [type="checkbox"]').on('ifChecked', e => {
            let name = $(e.currentTarget).attr('data-name');
            let id = $(e.currentTarget).val();

            // 缓存数据
            cacheCompany.push({
                name: name,
                id: id
            });
        });

        // iCheck 取消点击事件
        $('.modal-diy-body [type="checkbox"]').on('ifUnchecked', e => {
            let name = $(e.currentTarget).attr('data-name');
            let id = $(e.currentTarget).val();

            // 缓存数据
            cacheCompany.forEach((item, index) => {
                if (item.id === id) {
                    cacheCompany.splice(index, 1);
                }
            });
        });

        cb(data);
    });
}

/**
 * 渲染推送列表
 * 抽象出一个函数是因为有多个地方使用
 */
function renderPushTable() {
    tabler.render({
        url: '/external/manage/listTips.do',
        tpl: $('#lists-tpl').html(),
        container: '#lists',
        handle(data) {

            // 将时间戳转换成特定格式
            for (let record of data.data.records) {
                record.time = convertTimestamp(record.posttime, (year, month, date, hour, minute) => {
                    return `${year}年${month}月${date}日 ${hour}:${minute}`;
                });
            }

            return data;
        }
    });
}
