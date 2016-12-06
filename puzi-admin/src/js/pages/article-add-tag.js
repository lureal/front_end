/*!
 * 添加标签页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} storage [包装过后的数据存储对象]
 */
var articleTypeAdd = function(ajax, modal, storage) {

    // 渲染全部标签、热门标签
    ajax.get({
        url: '/admin/article/list_tags.do',
        cb: function(data) {

            // 渲染全部标签
            var tpl = $('#article-label-tpl').html();
            $('#article-label').html(_.template(tpl)(data));
        },
        modal: modal,
        title: '全部标签',
        ctx: '#label'
    });

    // 点击编辑按钮
    $('body').on('click', '#edit', function(e) {

        // 隐藏编辑按钮，显示完成按钮
        $('.edit').addClass('z-hidden');
        $('.complete').removeClass('z-hidden');

        // 显示删除图标
        $('.delete').removeClass('z-hidden');
        $('.delete-all').removeClass('z-hidden');

        deleteAllList = [];
        deleteList = [];
        $('body').on('click', '.delete-all', function(e) {
        
            // 删除全部标签
            $(this).parent('.tagall').remove();
            var tagText = $(this).parent('.tagall').text();
            deleteAllList.push(tagText);
            
            $('.taghot').each(function() {
                if(tagText === $(this).text()) {
                    deleteList.push(tagText);
                    $(this).remove();
                   
                }
            });
        });

         
        $('body').on('click', '.delete', function(e) {

            // 删除热门标签
            $(this).parent('.taghot').remove();

            // 删除全部标签
            $(this).parent('.tagall').remove();
            var hotText = $(this).parent('.taghot').text();
            deleteList.push(hotText);
        });
    });

    // 点击完成按钮，遍历标签组，发送请求，完成删除功能
    $('body').on('click', '#complete', function() {
        // 遍历数组,热门标签
        // var hotList = [];
        // $('.taghot').each(function() {
        //     var value = $(this).attr('data-val'); 
        //     hotList.push(
        //        value
        //     );
        // });

        // // 全部标签
        // var tagALlList = [];
        // $('.tagall').each(function() {
        //     var value = $(this).attr('data-val'); 
        //     tagALlList.push(
        //        value
        //     );
        // });
        ajax.get({
            url: '/admin/article/delete_tags.do',
            param: {
                tags:deleteAllList.toString().replace("\"(\\w+)\"(\\s*:\\s*)", "$1$2"), 
                hotTags: deleteList.toString().replace(/["\[\]]/g, '')
               
            },
            cb: function(data) {
                if(data.data === true) {
                    modal.onebtn({
                        ctx: '#article-tag-add',
                        title: '删除标签',
                        ctn: '删除标签成功',
                        event: function() {
                            location.reload();
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: '#article-tag-add',
                        title: '删除标签',
                        ctn: data.message
                    });
                }
            },
            modal: modal,
            title: '全部标签',
            ctx: '#label'
        });

        $('.complete').addClass('z-hidden');
        $('.edit').removeClass('z-hidden');
        $('.delete').addClass('z-hidden');
        $('.delete-all').addClass('z-hidden');
    });

    // 添加文章标签
    $('#article-tag-add').on('click', '#article-tag-add-submit', function() {
        var articleTag = $.trim($('#article-tag-add-name').val());

        // 用户没有输入作者名称
        if(articleTag === '') {
            modal.nobtn({
                ctx: '#article-tag-add',
                title: '添加文章标签',
                ctn: '请输入标签名称'
            });
            return;
        }

        ajax.post({
            url: '/admin/article/add_tag.do',
            param: {
				name: articleTag
            },
            cb: function(data) {
                if(data.data === true) {
                    modal.onebtn({
                        ctx: '#article-tag-add',
                        title: '添加文章标签',
                        ctn: '添加成功',
                        event: function() {
                            // location.href = '/#proj_name#/html/article/list.html';
                            location.reload();
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: '#article-tag-add',
                        title: '添加文章标签',
                        ctn: '添加失败'
                    });
                }
            },
            modal: modal,
            title: '添加文章标签',
            ctx: '#article-tag-add'
        })
    });

    // 取消
    $('#article-tag-add').on('click', '#article-tag-add-canel', function() {
        history.back();
    });
};

module.exports = articleTypeAdd;
