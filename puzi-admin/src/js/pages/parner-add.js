/*!
 * 添加合作方
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} storage [包装过后的存储对象]
 */
var parnerAdd = function(ajax, modal, storage) {

    // 取消
    $('#parner-add').on('click', '#parner-add-canel', function() {
        history.back();
    });

    // 更新
    $('#parner-add').on('click', '#parner-add-submit', function() {
        
        var name = $.trim($('#parner-add-name').val()); // 合作方名称
        var link = $.trim($('#parner-add-link').val()); // 合作方链接

        // 缺少输入某个字段
        if(name === '' ||
           link === '') {

            modal.nobtn({
                ctx: '#parner-add',
                title: '合作方详情',
                ctn: '请确保输入合作方名称，跳转链接'
            });
            return;
        }

        ajax.post({
            url: '/admin/partner/add.do',
            param: {
                name: name,
                link: link
            },
            cb: function(data) {
                if(data.data === true) {
                    modal.onebtn({
                        ctx: '#parner-add',
                        title: '添加合作方',
                        ctn: '添加合作方成功',
                        event: function() {
                            location.href = '/#proj_name#/html/parner/list.html';
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: '#parner-add',
                        title: '添加合作方',
                        ctn: data.message
                    });
                }
            }
        });
    });
};

module.exports = parnerAdd;
