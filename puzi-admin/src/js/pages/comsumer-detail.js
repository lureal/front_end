/*!
 * 作者详情页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} storage [包装过后的数据存储对象]
 */
var comsumerDetailList = function(ajax, modal, storage) {

    // 根据存储在 sessionStorage 中的数据渲染界面
    var cacheCustumerdata = JSON.parse(sessionStorage.getItem('comsumer-list_comsumer'));
    // console.log(data.id);
    var cacheComsumerList; // 缓存作者列表

    ajax.get({
        url: '/admin/consumer/detail.do',
        param: {
            id: cacheCustumerdata.id
        },
        cb: function(data) {

            // 渲染数据
            var tpl = $('#comsumer-detail-list-tpl').html();
            $('#comsumer-detail-list-wrap').html(_.template(tpl)(data));

            $('body').on('click', '#modify', function() {
                var id = $(this).attr('data-id');
                $('#myModal').modal('show');
                
                // 提交
                $('.submit').on('click', function() {
                    var password = $('#password').val();
                    ajax.get({
                        url: '/admin/consumer/modify_pwd.do',
                        param: {
                            id: id,
                            password: password
                        },
                        cb: function(data) {
                            $('#myModal').modal('hide');
                            if(data.data === true) {
                                modal.onebtn({
                                    ctx: 'body',
                                    title: '更改密码',
                                    ctn: '更改密码成功',
                                    event: function() {
                                        location.reload();
                                    }
                                });
                            } else {
                                modal.nobtn({
                                    ctx: 'body',
                                    title: '更改密码',
                                    ctn: data.message !== null ? data.message : '更改密码失败'
                                });
                            }
                        }
                    })
                })
            });

            // 取消
            $('.cancel').on('click', function() {
                $('#myModal').modal('hide');
            });
        }
    });
};

module.exports = comsumerDetailList;
