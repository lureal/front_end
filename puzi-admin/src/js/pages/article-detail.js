/*!
 * 文章详情页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} storage [包装过后的数据存储对象]
 */
var articleDetail = function(ajax, modal, storage, util) {
    var cacheType;
    var cacheTag;
    var cacheAuthor;

    // 获取存储在 sessionStorage 中的数据
    var cacheArticleData = JSON.parse(storage.getSession('article-list_article'));
    console.log('传递过来的数据');
    console.log(cacheArticleData);

    ajax.get({
        url: '/admin/article/detail.do',
        param: {
            id: cacheArticleData.id
        },
        cb: function(articleDataJson) {

            articleData = articleDataJson.data.article;

            // 渲染数据
            $('#article-detail-name').val(articleData.title);
            $('#article-detail-description').val(articleData.description);
            $('#article-detail-sign').val(articleData.signId);
            $('#toptime').val(articleData.toptime);

            var typeObj = articleData.type;
            console.log(typeObj);
            if(typeObj === '2') {
                $('#top-operate').css('display', 'block');
            }
            $('#article-detail-type').on('change', function() {
                var addTypeObj = $('#article-detail-type').val();
                if(addTypeObj === '资讯快报') {
                    $('#top-operate').css('display', 'block');
                } else {
                    $('#top-operate').css('display', 'none');
                }
            });

             $('input[name="is-top"]:eq(0)').attr('checked', 'checked');
            // 选择置顶，是否联动框
            $('#top-choose').on('change', function() {
                $('#toptime1').attr('disabled', false);
            });
            $('#top-unchoose').on('change', function() {
                $('#toptime1').attr('disabled', true);
            });

            // if(articleData.isSpe === 0) {
            //     $('input[name="is-top"]:eq(0)').attr('checked', 'checked');
            // } else {
            //     $('input[name="is-top"]:eq(1)').attr('checked', 'checked');
            //     $('#toptime1').attr('disabled', true);
            // }

            // 将内容填充进编辑器
            var ue = UE.getEditor('myEditor');
            ue.addListener("ready", function () {
                ue.setContent(articleData.content);
            });

            var imgs = articleData.snapshots;
            _.each(imgs, function(val) {
                $('#snapshats-img-wtap').append(_.template($('#snapshats-img-tpl').html())({data: val}));
            });
            $('#article-detail-submit').attr('data-id', articleData.id);

            // 获取文章类型
            ajax.get({
                url: '/admin/article/list_type.do',
                cb: function(data) {
                    cacheType = data;

                    // 渲染类型数据
                    var tpl = $('#article-detail-type-tpl').html();
                    $('#article-detail-type').html(_.template(tpl)(data));
                    $('#article-detail-type').select2('val', articleData.typeName);
                },
                modal: modal,
                title: '文章详情',
                ctx: '#activity-add'
            });

            // 获取文章标签
            ajax.get({
                url: '/admin/article/list_tag.do',
                cb: function(data) {
                    cacheTag = data;

                    var tags = articleData.tags;
                    var tagsName = [];

                    _.each(tags, function(val, index) {

                        _.each(data.data, function(_val, _index) {
                            if(_val.id === Number(val)) {
                                tagsName.push(_val.name);
                            }
                        });

                    });
                    console.log('标签')
                    console.log(tagsName)

                    // 渲染类型数据
                    var tpl = $('#article-detail-tag-tpl').html();
                    $('#article-detail-tag').html(_.template(tpl)(data));
                    $('#article-detail-tag').select2('val', articleData.tags);
                },
                modal: modal,
                title: '文章详情',
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
                    var tpl = $('#article-detail-author-tpl').html();
                    $('#article-detail-author').html(_.template(tpl)(data));
                    $('#article-detail-author').select2('val', articleData.authorName);
                },
                modal: modal,
                title: '文章详情',
                ctx: '#activity-add'
            });

            $('.select2').select2();
            $('#article-detail-time').daterangepicker({
                timePicker: true,
                timePickerIncrement: 1,
                format: 'MM/DD/YYYY hh:mm A'
            });

            // 移到略缩图上显示删除标识
            $('#article-detail').on('mouseover', '.snapshots__img-wrap', function() {
                var $this = $(this);
                $('.snapshots__img-remove', $this).fadeIn('fast');
            });
            $('#article-detail').on('mouseout', '.snapshots__img-remove', function() {
                var $parent = $(this).parent();
                $('.snapshots__img-remove', $parent).fadeOut('fast');
            });

            // 删除图像
            $('#article-detail').on('click', '.snapshots__img-remove', function() {
                $(this).parent().remove();
            });

            // 添加略缩图
            $('#article-detail').on('click', '#article-detail-image', function(e) {
                e.preventDefault();

                var img = $('#img_input').val();

                // 用户没有选择图片
                if(img === '') {
                    modal.nobtn({
                        ctx: '#article-detail',
                        title: '文章详情',
                        ctn: '请选择上传图片'
                    });
                    return;
                }

                // 执行表单提交
                $('#img_form').submit();
                $('#article-detail-image').html('<i class="fa fa-refresh fa-spin"></i>');
            });

            // 处理上传后的回调数据
            $('#img_form').ajaxForm(function(data) {
                data = JSON.parse(data);
                console.log(data);

                // 上传成功
                if(data.code === 200) {
                    var tpl = $('#snapshats-img-tpl').html();
                    $('#snapshats-img-wtap img').attr('src', data.data);
                    // $('#snapshats-img-wtap').append(_.template(tpl)(data));
                    $('#article-detail-image').html('上传略缩图');
                } else {
                    $('#article-detail-image').html('上传略缩图');
                    modal.nobtn({
                        ctx: '#article-detail',
                        title: '文章详情',
                        ctn: '上传图片失败'
                    });
                }
            });

            // 取消文章详情，返回上一页
            $('#article-detail').on('click', '#article-detail-canel', function() {
                history.back();
            });


            // 提交新文章
            $('#article-detail').on('click', '#article-detail-submit', function() {

                var id = $(this).attr('data-id');
                var title = $.trim($('#article-detail-name').val()); // 文章标题
                var description = $.trim($('#article-detail-description').val()); // 文章描述
                var authorid = util.getPropByValue($('#article-detail-author').val(), cacheAuthor);  // 文章作者
                var type =  util.getPropByValue($('#article-detail-type').val(), cacheType.data); // 文章类型
                var tagArr = util.getObjByValue($('#article-detail-tag').val() ? $('#article-detail-tag').val() : [], cacheTag.data);
                var snapshots = getSnapshots();
                var content = UE.getEditor('myEditor').getContent(); // 文章内容
                var tag = [];
                var sign = $.trim($('#article-detail-sign').val());
                var toptime = $('#toptime1').val();
                
                // 0 是1否
                var istop = $('input[name="is-top"]:checked').val();


                _.each(tagArr, function(val, index) {
                    tag.push(val.name);
                });

                console.log('---')
                console.log(title);
                console.log(description)
                console.log(authorid);
                console.log(type);
                console.log(tag);
                console.log(snapshots);
                console.log(content);
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
                        ctx: '#article-detail',
                        title: '文章详情',
                        ctn: '请确保输入文章名称，文章作者，文章缩略图，文章类型，文章标签，文章标识和文章内容'
                    });

                    return;
                }

                if(title.length > 25) {
                    modal.nobtn({
                        ctx: '#article-detail',
                        title: '文章详情',
                        ctn: '文章标题最大长度为 25 字'
                    });
                    return;
                }

                if(description.length > 65) {
                    modal.nobtn({
                        ctx: '#article-detail',
                        title: '文章详情',
                        ctn: '文章描述最大长度为 65 字'
                    });
                    return;
                }

                if(sign.length > 256) {
                    modal.nobtn({
                        ctx: '#article-detail',
                        title: '添加文章',
                        ctn: '文章标识最大长度为 256 字'
                    });
                    return;
                }

                ajax.post({
                    url: '/admin/article/update.do',
                    param: {
                        id: id,
                        title: title,
                        description: description,
                        authorId: authorid,
                        type: type,
                        tags: JSON.stringify(tag),
                        content: content,
                        snapshots: JSON.stringify(snapshots),
                        istop: (istop === 'true' && type === '1') ? 0 : 1,
                        toptime: toptime,
                        signId: sign
                    },
                    cb: function(data) {
                        if(data.data === true) {
                            modal.onebtn({
                                ctx: '#article-detail',
                                title: '文章详情',
                                ctn: '修改文章成功',
                                event: function() {
                                    location.href = '/#proj_name#/html/article/list.html';
                                }
                            });
                        } else {
                            modal.nobtn({
                                ctx: '#article-detail',
                                title: '文章详情',
                                ctn: data.message
                            });
                        }
                    },
                    modal: modal,
                    title: '文章详情',
                    ctx: '#article-detail'
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
        }
    });

};

module.exports = articleDetail;
