/*!
 * 添加banner页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} time [包装过后的时间对象]
 */

var addBanner = function(ajax, modal, time) {


    // 获取列表数据
    ajax.get({
        url: '/admin/brand/list_banner.do',
        param: { page: 1 },
        cb: function(data) {

            if(data.data[0] !== null) {
                $('#banner1 #banner1-add-name').val(data.data[0].link);
                $('#banner1 #banner1-add-description').val(data.data[0].description);
                $('#banner1 #banner1-add-image')
                    .attr('data-img', data.data[0].image)
                    .html('重新上传banner')
                $('#banner1-preview').attr('src', data.data[0].image);

            }

            if(data.data[1] !== null) {
                $('#banner2 #banner2-add-name').val(data.data[1].link);
                $('#banner2 #banner2-add-description').val(data.data[1].description);
                $('#banner2 #banner2-add-image')
                    .attr('data-img', data.data[1].image)
                    .html('重新上传banner')
                $('#banner2-preview').attr('src', data.data[1].image);

            }

            if(data.data[2] !== null) {
                $('#banner3 #banner3-add-name').val(data.data[2].link);
                $('#banner3 #banner3-add-description').val(data.data[2].description);
                $('#banner3 #banner3-add-image')
                    .attr('data-img', data.data[2].image)
                    .html('重新上传banner')
                $('#banner3-preview').attr('src', data.data[2].image);

            }

            if(data.data[3] !== null) {
                $('#banner4 #banner4-add-name').val(data.data[3].link);
                $('#banner4 #banner4-add-description').val(data.data[3].description);
                $('#banner4 #banner4-add-image')
                    .attr('data-img', data.data[3].image)
                    .html('重新上传banner')
                $('#banner4-preview').attr('src', data.data[3].image);

            }

            if(data.data[4] !== null) {
                $('#banner5 #banner5-add-name').val(data.data[4].link);
                $('#banner5 #banner5-add-description').val(data.data[4].description);
                $('#banner5 #banner5-add-image')
                    .attr('data-img', data.data[4].image)
                    .html('重新上传banner')
                $('#banner5-preview').attr('src', data.data[4].image);

            }

            // _.each(data.data, function(val, index) {
            //     $('#banner' + (index + 1) + ' #banner' + (index + 1) + '-add-name').val(val.link);
            //     $('#banner' + (index + 1) + ' #banner' + (index + 1) + '-add-description').val(val.description);
            //     $('#banner' + (index + 1) + '-preview').attr('src', val.image);
            //
            //     $('#banner' + (index + 1) + ' #banner' + (index + 1) + '-add-image')
            //         .attr('data-img', val.image)
            //         .html('重新上传banner')
            // });

        },
        modal: modal,
        title: '订阅列表',
        ctx: '#banner-list'
    });

    // 添加banner图片
    $('#banner-add').on('click', '#banner1-add-image', function(e) {
        e.preventDefault();

        var img = $('#banner1-img_input').val();

        // 用户没有选择图片
        if(img === '') {
            modal.nobtn({
                ctx: '#banner-add',
                title: '添加banner',
                ctn: '请选择上传图片'
            });
            return;
        }

        // 执行表单提交
        $('#banner1-img_form').submit();
        $('#banner1-add-image').html('<i class="fa fa-refresh fa-spin"></i>');
    });

    // 处理上传后的回调数据
    $('#banner1-img_form').ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);

        // 上传成功
        if(data.code === 200) {
            $('#banner1-preview').attr('src', data.data);
            $('#banner1-add-image')
                .attr('data-img', data.data)
                .html('图片上传成功，点击重新上传');
        } else {
            $('#banner1-add-image').html('上传图片');
            modal.nobtn({
                ctx: '#banner-add',
                title: '添加banner',
                ctn: '上传图片失败'
            });
        }
    });

    // 添加banner图片
    $('#banner-add').on('click', '#banner2-add-image', function(e) {
        e.preventDefault();

        var img = $('#banner2-img_input').val();

        // 用户没有选择图片
        if(img === '') {
            modal.nobtn({
                ctx: '#banner-add',
                title: '添加banner',
                ctn: '请选择上传图片'
            });
            return;
        }

        // 执行表单提交
        $('#banner2-img_form').submit();
        $('#banner2-add-image').html('<i class="fa fa-refresh fa-spin"></i>');
    });

    // 处理上传后的回调数据
    $('#banner2-img_form').ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);

        // 上传成功
        if(data.code === 200) {
            $('#banner2-preview').attr('src', data.data);
            $('#banner2-add-image')
                .attr('data-img', data.data)
                .html('图片上传成功，点击重新上传');
        } else {
            $('#banner2-add-image').html('上传图片');
            modal.nobtn({
                ctx: '#banner-add',
                title: '添加banner',
                ctn: '上传图片失败'
            });
        }
    });

    // 添加banner图片
    $('#banner-add').on('click', '#banner3-add-image', function(e) {
        e.preventDefault();

        var img = $('#banner3-img_input').val();

        // 用户没有选择图片
        if(img === '') {
            modal.nobtn({
                ctx: '#banner-add',
                title: '添加banner',
                ctn: '请选择上传图片'
            });
            return;
        }

        // 执行表单提交
        $('#banner3-img_form').submit();
        $('#banner3-add-image').html('<i class="fa fa-refresh fa-spin"></i>');
    });

    // 处理上传后的回调数据
    $('#banner3-img_form').ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);

        // 上传成功
        if(data.code === 200) {
            $('#banner3-preview').attr('src', data.data);
            $('#banner3-add-image')
                .attr('data-img', data.data)
                .html('图片上传成功，点击重新上传');
        } else {
            $('#banner3-add-image').html('上传图片');
            modal.nobtn({
                ctx: '#banner-add',
                title: '添加banner',
                ctn: '上传图片失败'
            });
        }
    });

    // 添加banner图片
    $('#banner-add').on('click', '#banner4-add-image', function(e) {
        e.preventDefault();

        var img = $('#banner4-img_input').val();

        // 用户没有选择图片
        if(img === '') {
            modal.nobtn({
                ctx: '#banner-add',
                title: '添加banner',
                ctn: '请选择上传图片'
            });
            return;
        }

        // 执行表单提交
        $('#banner4-img_form').submit();
        $('#banner4-add-image').html('<i class="fa fa-refresh fa-spin"></i>');
    });

    // 处理上传后的回调数据
    $('#banner4-img_form').ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);

        // 上传成功
        if(data.code === 200) {
            $('#banner4-preview').attr('src', data.data);
            $('#banner4-add-image')
                .attr('data-img', data.data)
                .html('图片上传成功，点击重新上传');
        } else {
            $('#banner4-add-image').html('上传图片');
            modal.nobtn({
                ctx: '#banner-add',
                title: '添加banner',
                ctn: '上传图片失败'
            });
        }
    });

    // 添加banner图片
    $('#banner-add').on('click', '#banner5-add-image', function(e) {
        e.preventDefault();

        var img = $('#banner5-img_input').val();

        // 用户没有选择图片
        if(img === '') {
            modal.nobtn({
                ctx: '#banner-add',
                title: '添加banner',
                ctn: '请选择上传图片'
            });
            return;
        }

        // 执行表单提交
        $('#banner5-img_form').submit();
        $('#banner5-add-image').html('<i class="fa fa-refresh fa-spin"></i>');
    });

    // 处理上传后的回调数据
    $('#banner5-img_form').ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);

        // 上传成功
        if(data.code === 200) {
            $('#banner5-preview').attr('src', data.data);
            $('#banner5-add-image')
                .attr('data-img', data.data)
                .html('图片上传成功，点击重新上传');
        } else {
            $('#banner5-add-image').html('上传图片');
            modal.nobtn({
                ctx: '#banner-add',
                title: '添加banner',
                ctn: '上传图片失败'
            });
        }
    });

    // 添加banner
    $('#banner-add').on('click', '#banner-add-submit', function() {

        var name1 = $.trim($('#banner1-add-name').val());
        var description1 = $.trim($('#banner1-add-description').val());
        var icon1 = $.trim($('#banner1-add-image').attr('data-img'));
        var name2 = $.trim($('#banner2-add-name').val());
        var description2 = $.trim($('#banner2-add-description').val());
        var icon2 = $.trim($('#banner2-add-image').attr('data-img'));
        var name3 = $.trim($('#banner3-add-name').val());
        var description3 = $.trim($('#banner3-add-description').val());
        var icon3 = $.trim($('#banner3-add-image').attr('data-img'));
        var name4 = $.trim($('#banner4-add-name').val());
        var description4 = $.trim($('#banner4-add-description').val());
        var icon4 = $.trim($('#banner4-add-image').attr('data-img'));
        var name5 = $.trim($('#banner5-add-name').val());
        var description5 = $.trim($('#banner5-add-description').val());
        var icon5 = $.trim($('#banner5-add-image').attr('data-img'));

        var uploadArray = [];

        name1 !== '' && icon1 !== '' ? (uploadArray[0] = {image: icon1, link: name1, description: description1}) : (uploadArray[0] = null)
        name2 !== '' && icon2 !== '' ? (uploadArray[1] = {image: icon2, link: name2, description: description2}) : (uploadArray[1] = null)
        name3 !== '' && icon3 !== '' ? (uploadArray[2] = {image: icon3, link: name3, description: description3}) : (uploadArray[2] = null)
        name4 !== '' && icon4 !== '' ? (uploadArray[3] = {image: icon4, link: name4, description: description4}) : (uploadArray[3] = null)
        name5 !== '' && icon5 !== '' ? (uploadArray[4] = {image: icon5, link: name5, description: description5}) : (uploadArray[4] = null)

        // 用户没有输入作者名称
        if(uploadArray[0] === null &&
           uploadArray[1] === null &&
           uploadArray[2] === null &&
           uploadArray[3] === null &&
           uploadArray[4] === null) {
               modal.nobtn({
                   ctx: '#banner-add',
                   title: '添加banner',
                   ctn: '请至少添加一个banner'
               });
               return;
           }

        ajax.post({
            url: '/admin/brand/add_banner.do',
            param: {
                json: JSON.stringify(uploadArray)
            },
            cb: function(data) {
                if(data.data === true) {
                    modal.onebtn({
                        ctx: '#banner-add',
                        title: '添加banner',
                        ctn: '添加成功',
                        event: function() {
                            location.href = '/#proj_name#/html/banner/list.html';
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: '#banner-add',
                        title: '添加banner',
                        ctn: '添加失败'
                    });
                }
            },
            modal: modal,
            title: '添加banner',
            ctx: '#banner-add'
        })
    });

    // 取消
    $('#banner-add').on('click', '#banner-add-canel', function() {
        history.back();
    });
};

module.exports = addBanner;
