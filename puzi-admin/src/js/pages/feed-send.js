/*!
 * 发送邮件
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} time [包装过后的时间对象]
 */
var feedSend = function(ajax, modal, time, regexp) {
    // $('#feed-send-textarea').wysihtml5();
    // CKEDITOR.replace('feed-send-textarea');

    // 渲染
    UE.getEditor('myEditor');

    // $('#feed-send-time').daterangepicker({
    //     singleDatePicker:true,
    //     timePicker: true,
    //     timePickerIncrement: 1,
    //     format: 'MM/DD/YYYY hh:mm A'
    // });

    // 发送测试邮件
    $('#feed-send-preview').click(function() {
        var title = $.trim($('#feed-send-title').val());
        var content = UE.getEditor('myEditor').getContent(); // 发送内容
        var email = $.trim($('#feed-send-test-email').val()); // 测试邮箱

		// 缺少输入某个字段
		if(title === '' ||
		   content === '' ||
		   email === '') {

			modal.nobtn({
				ctx: '#feed-send',
				title: '订阅邮件',
				ctn: '请确保输入邮件名称，邮件内容和测试邮箱'
			});

			return;
		}

        if(!regexp.isEmail(email)) {
            modal.nobtn({
				ctx: '#feed-send',
				title: '订阅邮件',
				ctn: '请确保输入正确的测试邮箱'
			});
            return;
        }

        ajax.post({
            url: '/admin/subscriber/preview_send.do',
            param: {
                title: title,
                content: content,
                email: email
            },
            cb: function(data) {
				if(data.data === true) {
					modal.nobtn({
						ctx: '#feed-send',
						title: '订阅邮件',
						ctn: '发送测试邮件成功，请前往邮箱查收'
					});
				} else {
					modal.nobtn({
						ctx: '#feed-send',
						title: '订阅邮件',
						ctn: data.message
					});
				}
            }
        });
    });

    // 发送正式邮件
    $('#feed-send-btn').click(function() {
        var title = $.trim($('#feed-send-title').val());
        var content = UE.getEditor('myEditor').getContent(); // 发送内容
        // var date = $.trim($('#feed-send-time').val());
        // var formatTime = time.formatPluginTime(date).start; // 发送邮件时间

        // 缺少输入某个字段
        if(title === '' ||
           content === '') {

        	modal.nobtn({
        		ctx: '#feed-send',
        		title: '订阅邮件',
        		ctn: '请确保输入邮件名称，邮件内容和邮件发送时间'
        	});

        	return;
        }

        ajax.post({
            url: '/admin/subscriber/send.do',
            param: {
                title: title,
                content: content
                //starttime: formatTime
            },
            cb: function(data) {
				if(data.data === true) {
					modal.onebtn({
						ctx: '#feed-send',
						title: '订阅邮件',
						ctn: '发送邮件成功',
						event: function() {
							location.href = '/#proj_name#/html/feed/list.html';
						}
					});
				} else {
					modal.nobtn({
						ctx: '#feed-send',
						title: '订阅邮件',
						ctn: data.message
					});
				}
            }
        });
    });

};

module.exports = feedSend;
