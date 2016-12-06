/*!
 * 更新广告页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} time [包装过后的时间对象]
 */

var addAd = function(ajax, modal, time) {

    // 获取列表数据
    ajax.get({
        url: '/admin/brand/list_ad.do',
        param: { page: 1 },
        cb: function(data) {
            _.each(data.data, function(val, index) {
                $('#ad' + (index + 1) + '-img-preview').attr('src', val.image);
                $('#ad' + (index + 1) + ' [type="text"]').val(val.link);
                $('#ad' + (index + 1) + ' button[type="submit"]')
                    .attr('data-img', val.image)
                    .html('重新上传 ad')
            });
        },
        modal: modal,
        title: '广告列表',
        ctx: '#ad-list'
    });

    // 添加ad图片
    $('#ad-add').on('click', '#ad1-add-image', function(e) {
        e.preventDefault();

        var img = $('#ad1-img_input').val();

        // 用户没有选择图片
        if(img === '') {
            modal.nobtn({
                ctx: '#ad-add',
                title: '添加ad',
                ctn: '请选择上传图片'
            });
            return;
        }

        // 执行表单提交
        $('#ad1-img_form').submit();
        $('#ad1-add-image').html('<i class="fa fa-refresh fa-spin"></i>');
    });

    // 处理上传后的回调数据
    $('#ad1-img_form').ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);

        // 上传成功
        if(data.code === 200) {
            $('#ad1-img-preview').attr('src', data.data);
            $('#ad1-add-image')
                .attr('data-img', data.data)
                .html('图片上传成功，点击重新上传');
        } else {
            $('#ad1-add-image').html('上传图片');
            modal.nobtn({
                ctx: '#ad-add',
                title: '添加ad',
                ctn: '上传图片失败'
            });
        }
    });

    // 添加ad图片
    $('#ad-add').on('click', '#ad2-add-image', function(e) {
        e.preventDefault();

        var img = $('#ad2-img_input').val();

        // 用户没有选择图片
        if(img === '') {
            modal.nobtn({
                ctx: '#ad-add',
                title: '添加ad',
                ctn: '请选择上传图片'
            });
            return;
        }

        // 执行表单提交
        $('#ad2-img_form').submit();
        $('#ad2-add-image').html('<i class="fa fa-refresh fa-spin"></i>');
    });

    // 处理上传后的回调数据
    $('#ad2-img_form').ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);

        // 上传成功
        if(data.code === 200) {
            $('#ad2-img-preview').attr('src', data.data);
            $('#ad2-add-image')
                .attr('data-img', data.data)
                .html('图片上传成功，点击重新上传');
        } else {
            $('#ad2-add-image').html('上传图片');
            modal.nobtn({
                ctx: '#ad-add',
                title: '添加ad',
                ctn: '上传图片失败'
            });
        }
    });

    // 添加ad图片
    $('#ad-add').on('click', '#ad3-add-image', function(e) {
        e.preventDefault();

        var img = $('#ad3-img_input').val();

        // 用户没有选择图片
        if(img === '') {
            modal.nobtn({
                ctx: '#ad-add',
                title: '添加ad',
                ctn: '请选择上传图片'
            });
            return;
        }

        // 执行表单提交
        $('#ad3-img_form').submit();
        $('#ad3-add-image').html('<i class="fa fa-refresh fa-spin"></i>');
    });

    // 处理上传后的回调数据
    $('#ad3-img_form').ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);

        // 上传成功
        if(data.code === 200) {
            $('#ad3-img-preview').attr('src', data.data);
            $('#ad3-add-image')
                .attr('data-img', data.data)
                .html('图片上传成功，点击重新上传');
        } else {
            $('#ad3-add-image').html('上传图片');
            modal.nobtn({
                ctx: '#ad-add',
                title: '添加ad',
                ctn: '上传图片失败'
            });
        }
    });

    // 添加ad图片
    $('#ad-add').on('click', '#ad4-add-image', function(e) {
        e.preventDefault();

        var img = $('#ad4-img_input').val();

        // 用户没有选择图片
        if(img === '') {
            modal.nobtn({
                ctx: '#ad-add',
                title: '添加ad',
                ctn: '请选择上传图片'
            });
            return;
        }

        // 执行表单提交
        $('#ad4-img_form').submit();
        $('#ad4-add-image').html('<i class="fa fa-refresh fa-spin"></i>');
    });

    // 处理上传后的回调数据
    $('#ad4-img_form').ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);

        // 上传成功
        if(data.code === 200) {
            $('#ad4-img-preview').attr('src', data.data);
            $('#ad4-add-image')
                .attr('data-img', data.data)
                .html('图片上传成功，点击重新上传');
        } else {
            $('#ad4-add-image').html('上传图片');
            modal.nobtn({
                ctx: '#ad-add',
                title: '添加ad',
                ctn: '上传图片失败'
            });
        }
    });

    // 添加ad图片
    $('#ad-add').on('click', '#ad5-add-image', function(e) {
        e.preventDefault();

        var img = $('#ad5-img_input').val();

        // 用户没有选择图片
        if(img === '') {
            modal.nobtn({
                ctx: '#ad-add',
                title: '添加ad',
                ctn: '请选择上传图片'
            });
            return;
        }

        // 执行表单提交
        $('#ad5-img_form').submit();
        $('#ad5-add-image').html('<i class="fa fa-refresh fa-spin"></i>');
    });

    // 处理上传后的回调数据
    $('#ad5-img_form').ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);

        // 上传成功
        if(data.code === 200) {
            $('#ad5-img-preview').attr('src', data.data);
            $('#ad5-add-image')
                .attr('data-img', data.data)
                .html('图片上传成功，点击重新上传');
        } else {
            $('#ad5-add-image').html('上传图片');
            modal.nobtn({
                ctx: '#ad-add',
                title: '添加ad',
                ctn: '上传图片失败'
            });
        }
    });

    // 添加ad
    $('#ad-add').on('click', '#ad-add-submit', function() {

        var name1 = $.trim($('#ad1-add-name').val());
        var icon1 = $.trim($('#ad1-add-image').attr('data-img'));
        var name2 = $.trim($('#ad2-add-name').val());
        var icon2 = $.trim($('#ad2-add-image').attr('data-img'));
        var name3 = $.trim($('#ad3-add-name').val());
        var icon3 = $.trim($('#ad3-add-image').attr('data-img'));
        var name4 = $.trim($('#ad4-add-name').val());
        var icon4 = $.trim($('#ad4-add-image').attr('data-img'));
        var name5 = $.trim($('#ad5-add-name').val());
        var icon5 = $.trim($('#ad5-add-image').attr('data-img'));

        var uploadArray = [];

        name1 !== '' && icon1 !== '' ? uploadArray.push({image: icon1, link: name1}) : null
        name2 !== '' && icon2 !== '' ? uploadArray.push({image: icon2, link: name2}) : null
        name3 !== '' && icon3 !== '' ? uploadArray.push({image: icon3, link: name3}) : null
        name4 !== '' && icon4 !== '' ? uploadArray.push({image: icon4, link: name4}) : null
        name5 !== '' && icon5 !== '' ? uploadArray.push({image: icon5, link: name5}) : null


        // 用户没有输入作者名称
        if(uploadArray.length === 0) {
            modal.nobtn({
                ctx: '#ad-add',
                title: '添加ad',
                ctn: '请至少添加一个ad'
            });
            return;
        }

        ajax.post({
            url: '/admin/brand/add_ad.do',
            param: {
                json: JSON.stringify(uploadArray)
            },
            cb: function(data) {
                if(data.data === true) {
                    modal.onebtn({
                        ctx: '#ad-add',
                        title: '添加ad',
                        ctn: '添加成功',
                        event: function() {
                            location.href = '/#proj_name#/html/ad/list.html';
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: '#ad-add',
                        title: '添加ad',
                        ctn: '添加失败'
                    });
                }
            },
            modal: modal,
            title: '添加ad',
            ctx: '#ad-add'
        })
    });

    // 取消
    $('#ad-add').on('click', '#ad-add-canel', function() {
        history.back();
    });
};

module.exports = addAd;
