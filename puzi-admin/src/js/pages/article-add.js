/*!
 * 添加文章页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} time [包装过后的时间对象]
 * @param {Object} util [包装过后工具对象]
 */
var articleAdd = function(ajax, modal, time, util) {
    var cacheType;
    var cacheTag;
    var cacheAuthor;

    // 获取文章类型
    ajax.get({
        url: '/admin/article/list_type.do',
        cb: function(data) {
            cacheType = data;

            // 渲染类型数据
            var tpl = $('#article-add-type-tpl').html();
            $('#article-add-type').html(_.template(tpl)(data));
            $('#article-add-type').select2();
            console.log(data);
        },
        modal: modal,
        title: '添加文章',
        ctx: '#activity-add'
    });

    $('#article-add-type').on('change', function() {
        var addTypeObj = $('#article-add-type').val();
        console.log(addTypeObj);
        if(addTypeObj === '资讯快报') {
            $('#add-top1').css('display', 'block');
        } else {
            $('#add-top1').css('display', 'none');
        }
    });

    // 选择置顶，是否联动框
    $('#top-choose').on('change', function() {
        $('#toptime').attr('disabled', false);
    });
    $('#top-unchoose').on('change', function() {
        $('#toptime').attr('disabled', true);
    });

    // 获取文章标签
    ajax.get({
        url: '/admin/article/list_tag.do',
        cb: function(data) {
            cacheTag = data;
            console.log('标签')

            // 渲染类型数据
            var tpl = $('#article-add-tag-tpl').html();
            $('#article-add-tag').html(_.template(tpl)(data));
            $('#article-add-tag').select2();
        },
        modal: modal,
        title: '添加文章',
        ctx: '#activity-add'
    });

    // 获取作者
    ajax.get({
        url: '/admin/author/list_all.do',
        cb: function(data) {
            var obj = {};

            // 拼接缓存数组
            _.each(data.data, function(val, index) {
                obj[val.id] = val.name;
            });

            cacheAuthor = obj;

            // 渲染类型数据
            var tpl = $('#article-add-author-tpl').html();
            $('#article-add-author').html(_.template(tpl)(data));
            $('#article-add-author').select2();
        },
        modal: modal,
        title: '添加文章',
        ctx: '#activity-add'
    });

    $('.select2').select2();
    $('#article-add-time').daterangepicker({
        timePicker: true,
        timePickerIncrement: 1,
        format: 'MM/DD/YYYY hh:mm A'
    });

    // 渲染
    UE.getEditor('myEditor');

    // 移到略缩图上显示删除标识
    $('#article-add').on('mouseover', '.snapshots__img-wrap', function() {
        var $this = $(this);
        $('.snapshots__img-remove', $this).fadeIn('fast');
    });
    $('#article-add').on('mouseout', '.snapshots__img-remove', function() {
        var $parent = $(this).parent();
        $('.snapshots__img-remove', $parent).fadeOut('fast');
    });

    // 删除图像
    $('#article-add').on('click', '.snapshots__img-remove', function() {
        $(this).parent().remove();
    });

    // $('#article-add-type').on('change', function() {
    //     var addTypeObj = $('#article-add-type').val();
    //     console.log(addTypeObj);
    //     if(addTypeObj === '资讯快报') {
    //         $('#add-top').css('display', 'block');
    //     }
    //     // } else {
    //     //     $('#add-top').css('display', 'none');
    //     // }
    // });

    // 添加略缩图
    $('#article-add').on('click', '#article-add-image', function(e) {
        e.preventDefault();

        var img = $('#img_input').val();

        // 用户没有选择图片
        if(img === '') {
            modal.nobtn({
                ctx: '#article-add',
                title: '添加文章',
                ctn: '请选择上传图片'
            });
            return;
        }

        // 执行表单提交
        $('#img_form').submit();
        $('#article-add-image').html('<i class="fa fa-refresh fa-spin"></i>');
    });

    // 处理上传后的回调数据
    $('#img_form').ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);

        // 上传成功
        if(data.code === 200) {
            var tpl = $('#snapshats-img-tpl').html();
            $('#snapshats-img-wtap').append(_.template(tpl)(data));
            $('#article-add-image').html('上传略缩图');
        } else {
            $('#article-add-image').html('上传略缩图');
            modal.nobtn({
                ctx: '#article-add',
                title: '添加文章',
                ctn: '上传图片失败'
            });
        }
    });

    // 取消添加文章，返回上一页
    $('#article-add').on('click', '#article-add-canel', function() {
        history.back();
    });

    // 提交新文章
    $('#article-add').on('click', '#article-add-submit', function() {

        var title = $.trim($('#article-add-name').val()); // 文章标题
        var description = $.trim($('#article-add-description').val()); // 文章描述
        var authorid = util.getPropByValue($('#article-add-author').val(), cacheAuthor);  // 文章作者
        var type =  util.getPropByValue($('#article-add-type').val(), cacheType.data); // 文章类型
        var tagArr = util.getObjByValue($('#article-add-tag').val() ? $('#article-add-tag').val() : [], cacheTag.data);
        var snapshots = getSnapshots();
        var content = UE.getEditor('myEditor').getContent(); // 文章内容
        var tag = [];
        var sign = $.trim($('#article-add-sign').val());

        // 0 是1否
        var istop = $('input[name="is-top"]:checked').val();
        console.log(istop);
        var toptime = $('#toptime').val();

        _.each(tagArr, function(val, index) {
            tag.push(val.name);
        });

        console.log('---')
        console.log(title);
        console.log(description);
        console.log(authorid);
        console.log(type);
        console.log(tag);
        console.log(snapshots);
        console.log(content);
        console.log(sign);
        console.log('---')

        // 缺少输入某个字段
        if(title === '' ||
           description === '' ||
           authorid === '' ||
           type === '' ||
           tag.length === 0 ||
           snapshots.length === 0 ||
           content === '' ||
           sign === '') {

            modal.nobtn({
                ctx: '#article-add',
                title: '添加文章',
                ctn: '请确保输入文章名称，文章作者，文章缩略图，文章类型，文章标签，文章标识和文章内容'
            });

            return;
        }

        if(title.length > 25) {
            modal.nobtn({
                ctx: '#article-add',
                title: '添加文章',
                ctn: '文章标题最大长度为 25 字'
            });
            return;
        }

        if(description.length > 65) {
            modal.nobtn({
                ctx: '#article-add',
                title: '添加文章',
                ctn: '文章描述最大长度为 65 字'
            });
            return;
        }

        if(sign.length > 256) {
            modal.nobtn({
                ctx: '#article-add',
                title: '添加文章',
                ctn: '文章标识最大长度为 256 字'
            });
            return;
        }
        console.log(type);

        ajax.post({
            url: '/admin/article/add.do',
            param: {
                title: title,
                description: description,
                authorId: authorid,
                type: type,
                tags: JSON.stringify(tag),
                content: content,
                signId: sign,
                istop: (istop === 'true' && type === '1') ? 0 : 1,
                toptime: toptime,
                snapshots: JSON.stringify(snapshots)
            },
            cb: function(data) {
                if(data.data === true) {
                    modal.onebtn({
                        ctx: '#article-add',
                        title: '添加文章',
                        ctn: '添加文章成功',
                        event: function() {
                            location.href = '/#proj_name#/html/article/list.html';
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: '#article-add',
                        title: '添加文章',
                        ctn: data.message
                    });
                }
            },
            modal: modal,
            title: '添加文章',
            ctx: '#article-add'
        });

    });

    /**
     * 获取略缩图
     * @return {Array} [字符串数组]
     */
    function getSnapshots() {
        var arr = [];

        $('.snapshots__img-wrap').each(function(val) {
            arr.push($('img', $(this)).attr('src'))
        });

        return arr;
    }
};

module.exports = articleAdd;
