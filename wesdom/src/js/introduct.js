/*!
 * 公司介绍页面
 */

// 根据屏宽比调整 html 字体大小
require('./modules/adjuster.js')();

var isPopAnimate = false;

var number = 0;
var interval = setInterval(function() {
    number += Math.floor(Math.random() * (5 - 1 + 1) + 1);

    if(number >= 99) {
        number = 99;
    }

    $('.loading > span').html(number + '%');

}, 100)

// 当界面中所有元素加载完成之后隐藏 loading 显示界面
window.onload = function() {

    setTimeout(function() {

        clearInterval(interval);
        $('.loading > span').html('100%');

        $('.loading').fadeOut('fast');
        $('.first-page').fadeIn('fast');
        $('#fullpage').fullpage({

            // 监听滚动
            onLeave: function(index, nextIndex, direction) {
                if(nextIndex === 2) {
                    $('.social .tool').addClass('tool-animation');
                    $('.social .main').addClass('main-animation');
                }

                if(nextIndex === 3) {
                    $('.media .tool').addClass('tool-animation');
                    $('.media .main').addClass('main-animation');
                }

                if(nextIndex === 4) {
                    $('.app .tool').addClass('tool-animation');
                    $('.app .main').addClass('main-animation');
                }

                if(nextIndex === 5) {
                    $('.rule1 .rule1-font').addClass('tool-animation');
                    $('.rule1 .rule1-img').addClass('main-animation');
                }

                if(nextIndex === 6) {
                    $('.rule .main-img-1').addClass('main-img-1-active');
                    $('.rule .main-img-2').addClass('main-img-2-active');
                    $('.rule .main-img-3').addClass('main-img-3-active');
                    $('.rule .main-img-4').addClass('main-img-4-active');
                    $('.rule .active').addClass('active-animation');

                }

                if(nextIndex === 10) {
                    $('.contact .qrcode').addClass('qrcode-animation');
                    $('.contact-phone').addClass('contact-phone-animation');
                    $('.contact-qq').addClass('contact-qq-animation');
                    $('.contact-website').addClass('contact-website-animation');
                }
            }
        });
    }, 3000);
};

// 跳进第一屏
$('#enter').click(function() {
    $('.first-page').hide();
    $('.wrapper').fadeIn('fast');
});

// 弹出提示框
$('.rule-btn').click(function() {
    var target = $(this).attr('data-toggle');

    $('.rule .active').css('display', 'none');

    if(isPopAnimate === false) {
        $('.rule .active').removeClass('active-animation');
        $('.rule .active').addClass('active2-animation');
        isPopAnimate = true;
    }

    switch(target) {
        case '0':
            $('.seed-modal1').fadeIn('fast');
            break;
        case '1':
            $('.grewth-modal1').fadeIn('fast');
            break;
        case '2':
            $('.quickly-modal1').fadeIn('fast');
            break;
        default:
            $('.mature-modal1').fadeIn('fast');
            break;
    }
});

// 关闭弹窗
$('.modal-close a').click(function() {
    var target = $(this).attr('data-id');

    $('.modal').fadeOut('fast');

    switch(target) {
        case '0':
            $('.grewth-active').css('display', 'block');
            break;
        case '1':
            $('.quickly-active').css('display', 'block');
            break;
        case '2':
            $('.mature-active').css('display', 'block');
            break;
        case '3':
            $('.seed-active').css('display', 'block');
            break;

    }
});

// 弹窗内进入详情
$('.modal .detail').click(function() {
    var target = $(this).attr('data-target');
    $('.modal').css('display', 'none');
    $('.' + target).fadeIn('fast');
});


/* 获取微信标识 */
$.get('/mobile/weixin/get_wx_sign.do', {
	url: location.href
}, function(data) {
	var _data = JSON.parse(data);
	setWxParam(_data)
});

/**
 * 设置微信参数
 */
function setWxParam(data) {

    wx.config({
        debug: false,
        appId: data.data.appId,
        timestamp: data.data.timestamp,
        nonceStr: data.data.noncestr,
        signature: data.data.signature,
        jsApiList: [
            'checkJsApi',
			'hideMenuItems',
			'showMenuItems',
			'hideAllNonBaseMenuItem',
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ',
			'onMenuShareWeibo'
        ]
    });

    wx.ready(function() {
        wx.onMenuShareAppMessage({
            title: '微思敦丨APP整合营销专家  10亿+优质流量，100+精英团队，APP推广优选合作伙伴。',
            desc: '独创AABR四维营销法则，把脉APP生命周期，定制个性化解决方案，成就300+APP营销新高度！',
            link: location.href,
            imgUrl: location.origin + '/#proj_name#/img/wesdom.jpg',
            success: function () {
            },
            cancel: function () {
            }
        });

        wx.onMenuShareTimeline({
            title: '微思敦丨APP整合营销专家  10亿+优质流量，100+精英团队，APP推广优选合作伙伴。',
            desc: '独创AABR四维营销法则，把脉APP生命周期，定制个性化解决方案，成就300+APP营销新高度！',
            link: location.href,
            imgUrl: location.origin + '/#proj_name#/img/wesdom.jpg',
            success: function () {
            },
            cancel: function () {
            }
        });
        wx.onMenuShareQQ({
            title: '微思敦丨APP整合营销专家  10亿+优质流量，100+精英团队，APP推广优选合作伙伴。',
            desc: '独创AABR四维营销法则，把脉APP生命周期，定制个性化解决方案，成就300+APP营销新高度！',
            link: location.href,
            imgUrl: location.origin + '/#proj_name#/img/wesdom.jpg',
            success: function () {
            },
            cancel: function () {
            }
        });

        wx.onMenuShareWeibo({
            title: '微思敦丨APP整合营销专家  10亿+优质流量，100+精英团队，APP推广优选合作伙伴。',
            desc: '独创AABR四维营销法则，把脉APP生命周期，定制个性化解决方案，成就300+APP营销新高度！',
            link: location.href,
            imgUrl: location.origin + '/#proj_name#/img/wesdom.jpg',
            success: function () {
            },
            cancel: function () {
            }
        });
    });
}
