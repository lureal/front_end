/*!
 * 罗列全部菜单
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');

$('.submit').on('click', function() {
    var content  = $('#feedback-textarea').val();
    ajax.get({
        url: '/admin/opinion/add.do',
        param: {
            content: content
        },
        cb: function(data) {
            $('#modal-onebtn').find('.modal-content').css('height', '160px');
            $('#modal-onebtn').find('.modal-content').css('width', '280px');
            if(data.data === true) {
                $('#tip').fadeIn('fast');
                $('.tip-message').html('添加反馈成功');
                setTimeout("location.href = '/#proj_name#/portal/record';", 1500);
            } else {
                $('#tip').fadeIn('fast');
                $('.tip-message').html('添加反馈失败');
            }
            
        }
    });
});

ajax.get({
    url: '/admin/opinion/opinionRecords.do',
    param: {
        page: 1
    },
    cb: function(data) {
        
        if(data.data.opinions.length >  0) {
            $('.record').on('click', function() {
               
                location.href = "/#proj_name#/portal/record";
             
            });
        }
    }
})

$(function() {
    $("#feedback-textarea").focus(function() {
        $(this).css('border-color', '#29cc29');
    }).blur(function() {
    $(this).css('border-color', '#eeeeee');
    })
});