/*!
 * 合作方详情
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} storage [包装过后的存储对象]
 */
var parnerDetail = function(ajax, modal, storage) {

    // 根据存储在 sessionStorage 中的数据渲染界面
    var data = JSON.parse(storage.getSession('parner-list_parner'));
    console.log(data);
    
    // 绑定数据
    $('#parner-detail-name').val(data.name);
    $('#parner-detail-link').val(data.link);
    $('#parner-detail-submit').attr('data-id', data.id);

    // 取消
    $('#parner-detail').on('click', '#parner-detail-canel', function() {
        history.back();
    });

    // 更新
    $('#parner-detail').on('click', '#parner-detail-submit', function() {
        
        var id = $(this).attr('data-id');
        var name = $.trim($('#parner-detail-name').val()); // 合作方名称
        var link = $.trim($('#parner-detail-link').val()); // 合作方链接

        // 缺少输入某个字段
        if(name === '' ||
           link === '') {

            modal.nobtn({
                ctx: '#parner-detail',
                title: '合作方详情',
                ctn: '请确保输入合作方名称，跳转链接'
            });
            return;
        }

        ajax.post({
            url: '/admin/partner/update.do',
            param: {
                id: id,
                name: name,
                link: link
            },
            cb: function(data) {
                if(data.data === true) {
                    modal.onebtn({
                        ctx: '#parner-detail',
                        title: '合作方详情',
                        ctn: '更新合作方成功',
                        event: function() {
                            location.href = '/#proj_name#/html/parner/list.html';
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: '#parner-detail',
                        title: '合作方详情',
                        ctn: data.message
                    });
                }
            }
        });
    });
};

module.exports = parnerDetail;
