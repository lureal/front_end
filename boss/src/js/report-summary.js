/*!
 * 罗列全部产品汇总
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');

// 初始化菜单和权限
auth.toolbar1({
    title: '产品汇总'
});

// 初始化搜索条中选择产品线
$('#search-product-id').select2({
    placeholder: "产品汇总",
    minimumInputLength: 3,
    ajax: {
        url: "/admin/report/product_option.do",
        dataType: 'json',
        delay: 250,
        data: function (params) {
            return {
                q: params.term, // search term
                page: params.page
            };
            $('#product-line').select2({
                placeholder: '产品汇总',
                openOnEnter: true
            }).select2('val', '');
        },
    processResults: function (data, params) {
        params.page = params.page || 1;
        return {
            results: data.data.items,
            pagination: {
                more: (params.page * 30) < data.total_count
            }
        };
    },
    cache: true
    },
    escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
    minimumInputLength: 1,
    templateResult: formatRepo, // omitted for brevity, see the source of this page
    templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
});

// select2 所用到的方法
function formatRepo (repo) {
    if (repo.loading) return repo.full_name;
    var markup =  repo.full_name ;
    // markup += repo.full_name;
    return markup;
}

function formatRepoSelection (repo) {
    return repo.full_name || repo.text;
}

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/report/prod_static.do',
            param: param,
            title: '产品汇总'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#customer').html(_.template(tpl)(data));
        }
    });
});

// 搜索按钮
$('#search').click(function() {

    // 获取日期
    var date = datePicker.getVal('#search-datapicker');

    // 获取产品 ID
    var productId = select2.getVal({
        id: '#search-product-id'
    });

    // 判断数据是否符合要求
    var isDate = date.start !== '' && date.end !== '';
    var isProductId = productId !== '' && productId !== null;

    // 客户名称
    var name = $('#customer-name').val();

    if(!isProductId) {
        modal.nobtn({
            ctx: 'body',
            title: '产品汇总',
            ctn: '请输入搜索条件（产品为必选项）'
        });
        return;
    }

    // 执行搜索
    ajax.get({
        url: '/admin/report/prod_static.do',
        param: {
            startdate: date.start,
            enddate: date.end,
            id: productId,
            name: name,
            page: 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                startdate: date.start,
                enddate: date.end,
                id: productId,
                name: name,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#summary').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '产品汇总'
    });

});

// 初始化搜索条中的日期控件
datePicker.init('#search-datapicker');
