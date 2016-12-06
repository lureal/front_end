/*!
 * 广告
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var sidebar = require('./modules/sidebar.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var urler = require('./modules/urler.js');
var time = require('./modules/time.js');
var header = require('./modules/header.js');
var cache = require('./modules/cache.js');
var timer = require('./modules/time-picker.js');
var upload = require('./modules/upload.js');
var imgWidth, imgHeight;
console.log(cache.get('delivery_ad_detail'));
console.log(cache.get('delivery_ad_add'));

// 如果本地存储有数据，则获取数据，下文用这些数据进行填充
if(urler.normal().order_id) {
    var cacheData = cache.get('delivery_ad_detail');
} else {
    var cacheData = cache.get('delivery_ad_add');
}
var cacheDataConfig = { // 如果本地有存储数据，缓存一些数据，方便后续操作

    // 缓存当前是微博 feeds 广告还是 Banner、card
    type: cacheData && cacheData.two && cacheData.two.type ? cacheData.two.type : undefined,

    // 缓存当前 uid
    uid: cacheData && cacheData.two && cacheData.two.ad.uid ? cacheData.two.ad.uid : undefined,

    // 缓存当前广告位置
    adPlacementId: cacheData && cacheData.two && cacheData.two.adPlacementId ? cacheData.two.adPlacementId : undefined,

    // 缓存广告位详情
    ad: cacheData && cacheData.two && cacheData.two.ad ? cacheData.two.ad : undefined
};

// 从缓存初始化：投放位置
if(cacheDataConfig.type !== undefined) {

    // 选中特定投放位置
    $('#list [type="radio"][value="' + cacheDataConfig.type + '"]').prop('checked', true);

    // 渲染选中的投放位置
    // 当前选中renderWeioFeed
    if(cacheDataConfig.type === '1') {
        renderWeiboFeed();

    // 当前选中 Banner
    } else if(cacheDataConfig.type === '2'){
        renderBanner();
    } else if(cacheDataConfig.type === '3'){
        renderCard();
    } else {
        renderScratchable();
    }
} else {
    renderWeiboFeed();
}

// 初始化 urler
urler.initLink();

//初始化菜单
sidebar.delivery({
    title: '广告',
    active: 'ad'
});

// 初始化顶部栏
header.delivery({
    title: '广告'
});

// 投放位置选择框
$('.delivery-site').change(function() {
    var type = $(this).val();

    // 当前选中微博 feeds 广告
    if(type === '1') {

        // 绑定当前选项，方便后续操作
        $('#detail').attr('data-select', '1');

        // 渲染微博 feed 广告
        renderWeiboFeed();

    // 当前选中 banner
    } else if(type === '2'){

        // 绑定当前选项，方便后续操作
        $('#detail').attr('data-select', '2');

        // 渲染 Banner
        renderBanner();
    } else if(type === '3') {

        // 绑定当前选项，方便后续操作
        $('#detail').attr('data-select', '3');

        // 渲染品牌Card
        renderCard();
    } else {

        // 绑定当前选项，方便后续操作
        $('#detail').attr('data-select', '4');

        // 渲染九宫格
        renderScratchable();
    }
});

/**
 * 单击投放内容后出来的：渲染微博 feeds 广告
 */
function renderWeiboFeed() {

    // 默认渲染微博 feeds 广告模板
    $('#detail').html(_.template($('#feed-tpl').html())({}));

    // 初始化微博 UID 下拉框
    select2.init({
        url: '/select/listWeiboUids.do',
        param: {
            customId: urler.normal().cid
        },
        title: '广告',
        cb: function(data) {
            var tpl = $('#type-tpl').html();
            $('#weibo-uid').html(_.template(tpl)(data));
            $('#weibo-uid').select2({
                placeholder: '微博 uid'
            }).select2('val', '');

            // 从缓存初始化：微博 UID
            if(cacheDataConfig.uid) {
                $('#weibo-uid').select2('val', cacheDataConfig.uid);
            }

            getMidList(cacheDataConfig.uid);
        }
    });

    // 获取 platformId
    if(urler.normal().order_id) {
        var platform = cache.get('delivery_ad_detail.one.platform');
    } else {
        var platform = cache.get('delivery_ad_add.one.platform');
    }
    ajax.get({
        url: '/deal/listAdPlacements.do',
        param: {
            customId: urler.normal().cid,
            platformId: platform,
            type: 1
        },
        cb: function(data) {

            // 渲染表格
            var tpl = $('#feed-ad-type-tpl').html();
            $('#feed-ad-type1').html(_.template(tpl)(data));

            $('#feed-ad-type1 .feed-ad-type').change(function() {
                var self = $(this);

                $('#feed-ad-type-detail').css('display', 'block');
                $('#feed-ad-type-detail').attr('data-type', self.attr('data-type')); // 绑定当前选择的值到详情
                $('#feed-ad-type-detail').attr('data-ad_placement_id', self.attr('data-ad_placement_id'));
            });

            // 渲染上传图片
            // 初始化上传图片模板
            var index = $('#add-snapshot').attr('data-index');
            $('#feed-snapshat-wrap').append(_.template($('#snapshat-tpl').html())({
                action: '/upload.do',
                name: 'uploadFile',
                index: index
            }));

            // 显示删除按钮
            $('.delete-btn').removeClass('z-hidden');

            // 初始化上传组件
            upload.file($('#snapshat' + index), modal, '广告', function(data) {
                var parent = $('#snapshat' + index);

                // 将图片绑定到 img src 和 按钮上
                $('.snapshats-link', parent).attr('href', data.data.dlUrl);
                $('.snapshats-preview', parent).attr('src', data.data.dlUrl);
                $('.file-submit', parent)
                    .attr('data-url', data.data.dlUrl)
                    .html('图片已上传')
            });

            // 新增菜单按钮
            $('#add-snapshot').click(function() {
                var self = $(this);
                var index = Number(self.attr('data-index')) + 1;

                // 添加渲染模板
                $('#feed-snapshat-wrap').append(_.template($('#snapshat-tpl').html())({
                    action: '/upload.do',
                    name: 'uploadFile',
                    index: index
                }));

                // 显示删除按钮
                $('.delete-btn').removeClass('z-hidden');

                // 初始化上传组件
                upload.file($('#snapshat' + index), modal, '广告', function(data) {
                    var parent = $('#snapshat' + index);

                    // 将图片绑定到 img src 和 按钮上
                    $('.snapshats-link', parent).attr('href', data.data.dlUrl);
                    $('.snapshats-preview', parent).attr('src', data.data.dlUrl);
                    $('.file-submit', parent)
                        .attr('data-url', data.data.dlUrl)
                        .html('图片已上传')
                });

                // 为按钮赋值一个新的 index
                self.attr('data-index', index);
            });

            // 从缓存初始化：选择广告位
            if(cacheDataConfig.type === '1' && cacheDataConfig.adPlacementId !== undefined) {
                $('#feed-ad-type1 .feed-ad-type[data-ad_placement_id="' + cacheDataConfig.adPlacementId + '"]').prop('checked', true);
                $('#feed-ad-type-detail').css('display', 'block');
                $('#feed-ad-type-detail').attr('data-ad_placement_id', cacheDataConfig.adPlacementId);
                $('#feed-ad-type-detail').attr('data-type', cacheDataConfig.type); // 绑定当前选择的值到详情

                // 博文MID和编辑博文标签切换
                if(cacheDataConfig.ad !== undefined) {
                    $('[href="#post-mid"], [href="#edit-post"]').parent().removeClass('active');
                    $('#post-mid, #edit-post').removeClass('active');

                    // 从缓存初始化：MID
                    if(cacheDataConfig.ad.mid) {
                        $('[href="#post-mid"]').parent().addClass('active');
                        $('#post-mid').addClass('active');
                        $('#feed-mid').val(cacheDataConfig.ad.mid);

                    // 博文
                    } else {
                        $('[href="#edit-post"]').parent().addClass('active');
                        $('#edit-post').addClass('active');
                        $('#feed-text').val(cacheDataConfig.ad.text);

                        // 第一张图片
                        if(cacheDataConfig.ad.picUrls.length > 0) {
                            var parent = $('#snapshat' + index);

                            $('.snapshats-link', parent).attr('href', cacheData.two.ad.picUrls[0]);
                            $('.snapshats-preview', parent).attr('src', cacheData.two.ad.picUrls[0]);
                            $('.file-submit', parent)
                                .attr('data-url', cacheData.two.ad.picUrls[0])
                                .html('图片已上传')
                        }

                        // > 1张图片
                        if(cacheDataConfig.ad.picUrls.length > 1) {
                            var _picUrls = cacheData.two.ad.picUrls;
                            _picUrls.shift();

                            _.each(_picUrls, function(url) {
                                var self = $('#add-snapshot');
                                var index = Number(self.attr('data-index')) + 1;
                                var parent = $('#snapshat' + index);

                                $('#feed-snapshat-wrap').append(_.template($('#snapshat-detail-tpl').html())({
                                    action: '/upload.do',
                                    name: 'uploadFile',
                                    index: index,
                                    url: url
                                }));

                                upload.file($('#snapshat' + index), modal, '广告', function(data) {
                                    var parent = $('#snapshat' + index);

                                    $('.snapshats-link', parent).attr('href', data.data.dlUrl);
                                    $('.snapshats-preview', parent).attr('src', data.data.dlUrl);
                                    $('.file-submit', parent)
                                        .attr('data-url', data.data.dlUrl)
                                        .html('图片已上传')
                                });

                                self.attr('data-index', index);
                            });
                        }
                    }
                }
            }
        }
    });
}

/**
 * 单击投放内容后出来的：渲染 Banner
 */
function renderBanner() {
    $('#detail').html(_.template($('#banner-tpl').html())({}));

    // 查看网页链接
    $('#webpage-link').bind('input', function() {
        var self = $(this);

        if(self.val() === '') {
            $('#view-webpage-link').css('display', 'none');
        } else {
            $('#view-webpage-link').css('display', 'inline-block');
        }

        $('#view-webpage-link').attr('href', self.val());
    });

    // 获取 platformId，渲染表格
    if(urler.normal().order_id) {
        var platform = cache.get('delivery_ad_detail.one.platform');
    } else {
        var platform = cache.get('delivery_ad_add.one.platform');
    }
    ajax.get({
        url: '/deal/listAdPlacements.do',
        param: {
            customId: urler.normal().cid,
            platformId: platform,
            type: 2
        },
        cb: function(data) {

            // 渲染表格
            var tpl = $('#banner-ad-type-tpl').html();
            $('#feed-ad-type2').html(_.template(tpl)(data));

            $('#feed-ad-type2 .banner-ad-type').change(function() {
                var self = $(this);

                $('#banner-snapshat-wrap').css('display', 'block');
                $('#banner-snapshat-wrap').attr('data-type', self.attr('data-type'));
                $('#banner-snapshat-wrap').attr('data-ad_placement_id', self.attr('data-ad_placement_id'));

                // 当
                var parent = $('#snapshatbanner');
                $('.snapshats-link', parent).attr('href', '');
                $('.snapshats-preview', parent).attr('src', '/#proj_name#/img/none.png');
                $('.file-submit', parent)
                    .attr('data-url', '')
                    .html('')

            });

            var index = 'banner';

            // 添加渲染模板
            $('#banner-snapshat-wrap').append(_.template($('#snapshat-tpl').html())({
                action: '/upload.do',
                name: 'uploadFile',
                index: index
            }));

            // 初始化上传组件
            upload.file($('#snapshat' + index), modal, '广告', function(data) {
                var parent = $('#snapshat' + index);

                // 将图片绑定到 img src 和 按钮上
                $('.snapshats-link', parent).attr('href', data.data.dlUrl);
                $('.snapshats-preview', parent).attr('src', data.data.dlUrl);
                $('.file-submit', parent)
                    .attr('data-url', data.data.dlUrl)
                    .html('图片已上传')
            });

            $('#detail').attr('data-select', '2');

            // 初始化：渲染网页链接
            if(cacheDataConfig.ad && cacheDataConfig.ad.landingpageUrl) {
                $('#webpage-link').val(cacheDataConfig.ad.landingpageUrl);
                $('#view-webpage-link').attr('href', cacheDataConfig.ad.landingpageUrl);
            }

            // 从缓存初始化：选择广告位
            if(cacheDataConfig.type === '2' && cacheDataConfig.adPlacementId !== undefined) {
                $('#feed-ad-type2 .banner-ad-type[data-ad_placement_id="' + cacheDataConfig.adPlacementId + '"]').prop('checked', true);
                $('#banner-snapshat-wrap').css('display', 'block');
                $('#banner-snapshat-wrap').attr('data-ad_placement_id', cacheDataConfig.adPlacementId);
                $('#banner-snapshat-wrap').attr('data-type', cacheDataConfig.type); // 绑定当前选择的值到详情


                if(cacheDataConfig.ad.picUrl) {
                    var parent = $('#snapshat' + index);

                    $('.snapshats-link', parent).attr('href', cacheDataConfig.ad.picUrl);
                    $('.snapshats-preview', parent).attr('src', cacheDataConfig.ad.picUrl);
                    $('.file-submit', parent)
                        .attr('data-url', cacheDataConfig.ad.picUrl)
                        .html('图片已上传')
                }
            }
        }
    });
}

/**
 * 单击品速Card广告
**/
function renderCard() {
    $('#detail').html(_.template($('#card-ad-tpl').html())({}));

    // 初始化微博 UID 下拉框
    select2.init({
        url: '/select/listWeiboUids.do',
        param: {
            customId: urler.normal().cid
        },
        title: '广告',
        cb: function(data) {
            var typeTpl = $('#card-type-tpl').html();
            $('#card-weibo-uid').html(_.template(typeTpl)(data));
            $('#card-weibo-uid').select2({
                placeholder: 'card微博uid'
            }).select2('val', '');

            // 从缓存初始化：card 微博 UID
            if(cacheDataConfig.ad && cacheDataConfig.ad.uid) {
                $('#card-weibo-uid').select2('val', cacheDataConfig.ad.uid);
            }
        }
    });

    // 获取 platformId，渲染表格
    if(urler.normal().order_id) {
        var platform = cache.get('delivery_ad_detail.one.platform');
    } else {
        var platform = cache.get('delivery_ad_add.one.platform');
    }
    ajax.get({
        url: '/deal/listAdPlacements.do',
        param: {
            customId: urler.normal().cid,
            platformId: platform,
            type: 3
        },
        cb: function(data) {

            // 渲染
            var tpl = $('#card-ad-tpl').html();
            $('#detail').html(_.template(tpl)(data));
            console.log('-------');
            console.log(cacheDataConfig.ad);

            $('#detail').attr('data-select', '3');

            // 渲染card上传视频
            // 初始化Card上传视频模板
            $('.snapshat-video-wrap').css('display', 'block');
            $('.snapshat-wrap').css('display', 'none');
            var index = 'card'
            $('#card-snapshat-video-wrap').append(_.template($('#snapshat-tpl').html()) ({
                action: '/uploadvideo.do',
                name: 'uploadFile',
                index: index
            }));

            // 初始化视频上传组件
            upload.videofile($('#snapshat' + index), modal, '广告', function(data) {
                var parent = $('#snapshat' + index);

                // 将图片绑定到 img src 和 按钮上
                $('#card-snapshat-video-wrap .snapshats-link', parent).attr('href', data.data.path);
                $('#card-snapshat-video-wrap .snapshats-preview', parent).attr('src', data.data.path);
                cache.set('videoPath', data.data.path);

                $('#card-snapshat-video-wrap .file-submit', parent)
                    .attr('data-videourl', data.data.path)
                    .html('文件已上传')
            });

            $('.snapshat-video-wrap').css('display', 'none');
            $('#card-snapshat-wrap').css('display', 'none');
            $('#card-snapshat-wrap1').css('display', 'block');
            var index = 'card'
            $('#card-snapshat-wrap1').append(_.template($('#snapshat-tpl').html()) ({
                action: '/upload.do',
                name: 'uploadFile',
                index: index
            }));

            // 初始化图片上传组件
            upload.image($('#snapshat' + index), modal, '广告', 580, 326 , function(data) {
                var parent = $('#snapshat' + index);

                // 将图片绑定到 img src 和 按钮上
                $(' .snapshats-link', '#card-snapshat-wrap1').attr('href', data.data.dlUrl);
                $(' .snapshats-preview', '#card-snapshat-wrap1').attr('src', data.data.dlUrl);

                // 预览栏里预览上传的图片
                $('#upload-img').attr('src',data.data.dlUrl);
                $('.file-submit', '#card-snapshat-wrap1')
                    .attr('data-url', data.data.dlUrl)
                    .html('图片已上传')
            });

            // 初始化（活动类型）图片上传组件
            $('.snapshat-video-wrap').css('display', 'none');
            $('#card-snapshat-wrap').css('display', 'block');
            $('#card-snapshat-wrap1').css('display', 'none');
            var index = 'card'
            $('#card-snapshat-wrap').append(_.template($('#snapshat-tpl').html()) ({
                action: '/upload.do',
                name: 'uploadFile',
                index: index
            }));
            upload.image($('#snapshat' + index), modal, '广告', 592, 296 , function(data) {

                var parent = $('#snapshat' + index);

                // 将图片绑定到 img src 和 按钮上
                $(' .snapshats-link', '#card-snapshat-wrap' ).attr('href', data.data.dlUrl);
                $(' .snapshats-preview', '#card-snapshat-wrap').attr('src', data.data.dlUrl);

                // 预览栏里预览上传的图片
                $('#upload-img').attr('src',data.data.dlUrl);
                $(' .file-submit', '#card-snapshat-wrap')
                    .attr('data-url', data.data.dlUrl)
                    .html('图片已上传')
            });
            // <-- 初始化（活动类型）图片上传组件 -->

            $('#card-snapshat-video-wrap input[type="file"][name="uploadFile"]').change(function() {
                var str = $(this).val();
                var arr = str.split('\\');
                var uploadVideoName = arr[arr.length-1];
                var pattern = /\w+(.mp4)$/;
                if(pattern.exec(str)) {
                    cache.set('uploadVideoName', uploadVideoName);
                    $('#card-snapshat-video-wrap .file-submit').html('<strong>'+cache.get('uploadVideoName')+'</strong>');
                }
            });
            console.log(cache.get('uploadVideoName'));

            // 删除视频的上传附件中的预览图片
            $('#card-snapshat-video-wrap').find('.snapshats-link').css('display', 'none');

            // 初始化：渲染品速Card标题
            if(cacheDataConfig.ad && cacheDataConfig.ad.cardTitle) {
                $('#card-title').val(cacheDataConfig.ad.cardTitle);
            }
            // 初始化：渲染品速Card内容
            if(cacheDataConfig.ad && cacheDataConfig.ad.cardDesc) {
                $('#card-content').val(cacheDataConfig.ad.cardDesc);
            }

            // 初始化：右侧预览框
            if(cacheDataConfig.ad && cacheDataConfig.ad.cardTitle) {
                $('.card-title-watch').html(cacheDataConfig.ad.cardTitle);
            }
            if(cacheDataConfig.ad && cacheDataConfig.ad.cardDesc) {
                $('.card-content-watch').html(cacheDataConfig.ad.cardDesc);
            }
            if(cacheDataConfig.ad && cacheDataConfig.ad.text && cacheDataConfig.ad.cardTitle) {
                $('.card-wbpromote-watch').html(cacheDataConfig.ad.text);
            }

            // 初始化：渲染品速Card类型
            if(cacheDataConfig.ad && cacheDataConfig.ad.cardType) {

                // 选中活动类型
                $('#card-type [type="radio"][value="' + cacheDataConfig.ad.cardType + '"]').prop('checked', true);

                // card按钮类型
                if(cacheDataConfig.ad && cacheDataConfig.ad.cardButtonType && Number(cacheDataConfig.ad.cardType) !== 2) {
                    $('.activity-video-common').css('display', 'block');
                    $('#card-button-type [type="radio"][value="'+ cacheDataConfig.ad.cardButtonType +'"]')
                    .prop('checked', true);
                }

                // card按钮链接
                if(cacheDataConfig.ad && cacheDataConfig.ad.cardButtonUrl && Number(cacheDataConfig.ad.cardType) !== 2 && cacheDataConfig.ad.cardButtonType !== 'none') {
                    $('.card-none').css('display', 'block');
                    $('.card-button-link').css('display', 'block');
                    $('#card-button-link').val(cacheDataConfig.ad.cardButtonUrl);
                }
                if(cacheDataConfig.ad && cacheDataConfig.ad.landingpageUrl && cacheDataConfig.ad.cardType ) {
                    $('.card-none').css('display', 'block');
                    $('#card-link').val(cacheDataConfig.ad.landingpageUrl);
                }
            } else {

                $('input[name="type"][value="1"]').prop('checked', true);

                // 显示card 按钮类型
                $('.activity-video-common').css('display', 'block');

                // 默认选中为无
                $('input[name="card-button-type"][value="none"]').prop('checked', true);

                // 显示card 按钮链接
                $('.card-none').css('display', 'block');
            }

            // 初始化： 如果是活动类型，那么清除videPath的缓存数据
            if(cacheDataConfig.ad && Number(cacheDataConfig.ad.cardType) === 1) {
                cache.set('delivery_ad_detail.two.ad.videoPath', '');
                cacheDataConfig.ad.videoPath = '';
                $('#card-snapshat-wrap').css('display', 'block');
                $('#card-snapshat-wrap1').css('display', 'none');
                $('#card-snapshat-video-wrap').css('display', 'none');
            }

            // 初始化视频地址
            if(cacheDataConfig.ad && Number(cacheDataConfig.ad.cardType) !== 1) {
                // $('.video-common').css('display', 'block');
                $('.snapshat-video-wrap').css('display', 'block');
                var pattern = /\w+(.mp4)$/;

                // 文件隐藏，视频显示
                $('.snapshat-video-wrap').css('display', 'block');
                $('.snapshat-wrap').css('display', 'none');
                $('.snapshat-wrap1').css('display', 'block');
                if(cacheDataConfig.ad.videoPath) {
                    $('#card-snapshat-video-wrap .file-submit').html('<strong>'+cache.get('uploadVideoName')+'</strong>');
                }
            } else {
                $('.snapshat-video-wrap').css('display', 'none');
                $('.snapshat-wrap1').css('display', 'none');
            }

            // 初始化：渲染品速Card博文内容
            if(cacheDataConfig.ad && cacheDataConfig.ad.text) {
                $('#weibo-content').val(cacheDataConfig.ad.text);
            }

            if(cacheDataConfig.ad && cacheDataConfig.ad.picUrl ) {
                if(Number(cacheDataConfig.ad.cardType) === 1) {
                    var parent = $('#snapshat' + index);
                    $('.snapshats-link', '#card-snapshat-wrap').attr('href', cacheDataConfig.ad.picUrl);
                    $('.snapshats-preview', '#card-snapshat-wrap').attr('src', cacheDataConfig.ad.picUrl);
                    $('.file-submit', '#card-snapshat-wrap')
                        .attr('data-url', cacheDataConfig.ad.picUrl)
                        .html('图片已上传')
                }
                if(Number(cacheDataConfig.ad.cardType) === 2) {
                    var parent = $('#snapshat' + index);
                    $('.snapshats-link', '#card-snapshat-wrap1').attr('href', cacheDataConfig.ad.picUrl);
                    $('.snapshats-preview', '#card-snapshat-wrap1').attr('src', cacheDataConfig.ad.picUrl);
                    $('.file-submit', '#card-snapshat-wrap1')
                        .attr('data-url', cacheDataConfig.ad.picUrl)
                        .html('图片已上传')
                }
            }

            // 渲染上传视频
            if(cacheDataConfig.ad && cacheDataConfig.ad.videoPath !== '') {
                $('#card-snapshat-video-wrap').css('display', 'block');
                $('#card-snapshat-video-wrap .file-form').html('<strong>'+cache.get('uploadVideoName')+'</strong>');

                // $('#card-snapshat-video-wrap .file-submit').html('<strong>'+cache.get('uploadVideoName')+'</strong>');
                var parent = $('#snapshat' + index);
                $(' .snapshats-link', '#card-snapshat-video-wrap').attr('href', cacheDataConfig.ad.videoPath);
                $(' .snapshats-preview', '#card-snapshat-video-wrap').attr('src', cacheDataConfig.ad.videoPath);
                $(' .file-submit', '#card-snapshat-video-wrap')
                    .attr('data-videourl', cacheDataConfig.ad.videoPath)
                    .html('文件已上传')
            } else {
                $('#card-snapshat-video-wrap').css('display', 'none')
            }

            // 初始化：右侧预览图片
            if(cacheDataConfig.ad && cacheDataConfig.ad.picUrl) {
                $('#upload-img').attr('src', cacheDataConfig.ad.picUrl);
            }

            // 根据选中的类型，切换上传图片的尺寸提示
            $('body').on('change', '.card-type', function(){
                var $typevalue = $('input[name="type"]:checked').val();
                if($typevalue !== '1') {
                    $('body .pic-tip').html('(图片尺寸为580px*326px,图片仅支持png,大小不能超过70k)');
                } else {
                    $('body .pic-tip').empty();
                    $('body .pic-tip').html('(图片尺寸为592px*296px,图片仅支持png及jpg,大小不能超过70k)');
                }
            });

            // 绑定类型
            // 选择活动类型
            $('body').on('change', '.card-type', function() {
                var $typevalue = $('input[name="type"]:checked').val();
                switch($typevalue) {
                    case '1':

                        // 将右侧预览栏设为无
                        $('.card-button-watch').html('');
                        $('.activity-video-common').css('display', 'block');
                        // $('.video-common').css('display', 'none');
                        $('.activity-link').css('display', 'block');

                        // 切换活动类型时，默认card button 类型选中无
                        $('input[name="card-button-type"][value="none"]').prop('checked', true);

                        // 显示card 按钮链接，隐藏card链接
                        $('.card-button-link').css('display', 'none');
                        $('.card-none').css('display', 'block');

                        // 文件隐藏，视频显示
                        $('.snapshat-video-wrap').css('display', 'none');
                        $('#card-snapshat-wrap').css('display', 'block');
                        $('#card-snapshat-wrap1').css('display', 'none');
                        break;
                    case '2':

                        // 将右侧预览栏设为无
                        $('.card-button-watch').html('');

                        // $('.video-common').css('display', 'block');
                        $('.activity-video-common').css('display', 'none');
                        $('.activity-link').css('display', 'none');
                        $('.card-none').css('display', 'block');

                        // 文件隐藏，视频显示
                        $('.snapshat-video-wrap').css('display', 'block');
                        $('#card-snapshat-wrap').css('display', 'none');
                        $('#card-snapshat-wrap1').css('display', 'block');
                        break;
                    default:

                        // 将右侧预览栏设为无
                        $('.card-button-watch').html('');

                        // $('.video-common').css('display', 'block');
                        $('.activity-video-common').css('display', 'block');
                        $('.activity-link').css('display', 'block');

                        // 切换视频活动类型时，默认card button 类型选中无
                        $('input[name="card-button-type"][value="none"]').prop('checked', true);

                        // 显示card 按钮链接，隐藏card链接
                        $('.card-button-link').css('display', 'none');
                        $('.card-none').css('display', 'block');

                        // 文件隐藏，视频显示
                        $('.snapshat-video-wrap').css('display', 'block');
                        $('#card-snapshat-wrap').css('display', 'none');
                        $('#card-snapshat-wrap1').css('display', 'block');
                        break;
                }
            });

            // 绑定Card按钮类型，如果Card按钮类型选择无的话，则不显示
            // 监听radio的值
            $('input[name="card-button-type"]:radio').change(function() {
                if($(this).val() === 'join') {
                    $('.card-button-watch').html('参与');
                }
                if($(this).val() === 'buy') {
                    $('.card-button-watch').html('购买');
                }
                if($(this).val() === 'download') {
                    $('.card-button-watch').html('下载');
                }
                if($(this).val() === 'none') {
                    $('.card-button-watch').html('');
                }

                var $typeButtonValue = $('input[name="card-button-type"]:checked').val();
                if($typeButtonValue == 'none') {
                    $('.card-button-link').css('display', 'none');
                    $('.card-content-watch').css('display', 'inline-block');
                } else {
                    $('.card-button-link').css('display', 'block');
                }
            });
        }
    });
}

/**
 * 单击的九宫格广告
 **/
function renderScratchable() {
    $('#detail').html(_.template($('#scratchable-tpl').html())({}));
    $('#detail').attr('data-select', '4');

    // 初始化九宫格:微博 UID 下拉框
    select2.init({
        url: '/select/listWeiboUids.do',
        param: {
            customId: urler.normal().cid
        },
        title: '广告',
        cb: function(data) {
            var typeTpl = $('#card-type-tpl').html();
            $('#scratchable-uid').html(_.template(typeTpl)(data));
            $('#scratchable-uid').select2({
                placeholder: '九宫格微博uid'
            }).select2('val', '');

            // 从缓存初始化：九宫格微博uid
            if(cacheDataConfig.ad && cacheDataConfig.ad.uid) {

                // 从缓存初始化：card 微博 UID
                $('#scratchable-uid').select2('val', cacheDataConfig.ad.uid);
            }
        }
    });

    // 初始化app操作系统(0是安卓，1是ios)
    select2.init({
        url: '/select/listAppSys.do',
        title: '广告',
        cb: function(_data) {
            var tpl = $('#type-tpl').html();
            $('#scratchable-app').html(_.template(tpl)(_data));
            $('#scratchable-app').select2({
                placeholder: '选择app操作系统类型'
            }).select2('val', '');

            // app操作系统
            if(cacheDataConfig.ad && cacheDataConfig.ad.appType) {
                $('#scratchable-app').select2('val', cacheDataConfig.ad.appType);
            }
        }
    });

    // 初始化按钮标签类型
    select2.init({
        url: '/select/listWaxGridButton.do',
        title: '广告',
        cb: function(_data) {
            var tpl = $('#type-tpl').html();
            $('#scratchable-type').html(_.template(tpl)(_data));
            $('#scratchable-type').select2({
                placeholder: '选择九宫格按钮类型'
            }).select2('val', '');

            // 按钮标签类型
            if(cacheDataConfig.ad && cacheDataConfig.ad.cardButtonType) {
                $('#scratchable-type').select2('val', cacheDataConfig.ad.cardButtonType);
            }
        }
    });

    // 获取 platformId
    if(urler.normal().order_id) {
        var platform = cache.get('delivery_ad_detail.one.platform');
    } else {
        var platform = cache.get('delivery_ad_add.one.platform');
    }

    // 应用图标渲染
    var index = $('#add-snapshot').attr('data-index');
    $('#application-icon').append(_.template($('#application-icon-tpl').html())({
        action: '/upload.do',
        index: index,
        name: 'uploadFile'
    }));

    upload.image($('#scrasnapshat'), modal, '广告', 1242, 1242, function(data) {

        // 渲染图片和链接
        $('#scrasnapshat .snapshats-preview').attr('src', data.data.dlUrl);
        $('#scrasnapshat .file-input').attr('src', data.data.dlUrl);

        // // 绑定数据
        $('#scrasnapshat .file-submit')
            .attr('data-url', data.data.dlUrl)
            .html('附件已上传！');
    });

    // --- 应用图标

    // 应用截图渲染
    var screenindex = $('#scratchable-add-snapshot').attr('data-index');
    $('#scratchable-snapshat-wrap').append(_.template($('#snapshat-tpl').html())({
        action: '/upload.do',
        name: 'uploadFile',
        index: screenindex
    }));

    upload.image($('#snapshat' + screenindex), modal, '图片', 1242, 1242, function(data) {
        var parent = $('#snapshat' + screenindex);

        // 渲染图片和链接
        $('.snapshats-preview', parent).attr('src', data.data.dlUrl);
        $('.file-input', parent).attr('src', data.data.dlUrl);

        // // 绑定数据
        $('.file-submit', parent)
            .attr('data-url', data.data.dlUrl)
            .html('附件已上传！');
    });

    $('#scratchable-add-snapshot').click(function() {

        // 如果超过是三个图片则提示，最多能上传三张截图
        var screenObj = $('#scratchable-snapshat-wrap').find('.snapshats').length;
        if(screenObj > 2) {
            modal.nobtn({
                ctx: 'body',
                title: '添加图片',
                ctn: '最多上传三张截图'
            });
            return;
        }
        var self = $(this);
        var screenindex = Number(self.attr('data-index')) + 1;

        // 添加渲染模板
        $('#scratchable-snapshat-wrap').append(_.template($('#screensnapshat-tpl').html())({
            action: '/upload.do',
            name: 'uploadFile',
            index: screenindex
        }));

        // 初始化上传组件
        upload.image($('#screensnapshat' + screenindex), modal, '广告',1242, 1242, function(data) {
            var parent = $('#screensnapshat' + screenindex);

            // 将图片绑定到 img src 和 按钮上
            $('.snapshats-link', parent).attr('href', data.data.dlUrl);
            $('.snapshats-preview', parent).attr('src', data.data.dlUrl);
            $('.file-submit', parent)
                .attr('data-url', data.data.dlUrl)
                .html('图片已上传')
        });

        // 为按钮赋值一个新的 index
        self.attr('data-index', screenindex);
    });

    // --- 应用图标
    $('#scratchablecard').append(_.template($('#scratchablecard-tpl').html())({
        action: '/upload.do',
        title: '图片（点击图片查看详情）',
        name: 'uploadFile'
    }));

    upload.image($('#snapshatcard0'), modal, '图片', 1242, 1242, function(data) {

        // 渲染图片和链接
        $('#snapshatcard0 .snapshats-preview0').attr('src', data.data.dlUrl);
        $('#snapshatcard0 .file-input').attr('src', data.data.dlUrl);
        $('#snapshatcard0 .snapshats-link0').attr('href', data.data.dlUrl);

        // // 绑定数据
        // 预览栏里预览上传的图片
        $('#pic9-upload-img1').attr('src',data.data.dlUrl);
        $('#pic6-upload-img1').attr('src',data.data.dlUrl);
        $('#pic4-upload-img1').attr('src',data.data.dlUrl);

        $('#snapshatcard0 .file-submit0')
            .attr('data-url', data.data.dlUrl)
            .html('附件已上传！');
    });
    upload.image($('#snapshatcard1'), modal, '图片', 1242, 1242, function(data) {

        // 渲染图片和链接
        $('#snapshatcard1 .snapshats-link1').attr('href', data.data.dlUrl);
        $('#snapshatcard1 .snapshats-preview1').attr('src', data.data.dlUrl);
        $('#snapshatcard1 .file-input').attr('src', data.data.dlUrl);

        // // 绑定数据
        $('#pic9-upload-img2').attr('src',data.data.dlUrl);
        $('#pic6-upload-img2').attr('src',data.data.dlUrl);
        $('#pic4-upload-img2').attr('src',data.data.dlUrl);
        $('#snapshatcard1 .file-submit1')
            .attr('data-url', data.data.dlUrl)
            .html('附件已上传！');
    });

    upload.image($('#snapshatcard2'), modal, '图片', 1242, 1242,function(data) {

        // 渲染图片和链接
        $('#snapshatcard2 .snapshats-preview2').attr('src', data.data.dlUrl);
        $('#snapshatcard2 .file-input').attr('src', data.data.dlUrl);
        $('#snapshatcard2 .snapshats-link2').attr('href', data.data.dlUrl);

        // // 绑定数据
        $('#pic9-upload-img3').attr('src',data.data.dlUrl);
        $('#pic6-upload-img3').attr('src',data.data.dlUrl);
        $('#pic4-upload-img3').attr('src',data.data.dlUrl);
        $('#snapshatcard2 .file-submit2')
            .attr('data-url', data.data.dlUrl)
            .html('附件已上传！');
    });

    upload.image($('#snapshatcard3'), modal, '图片', 1242, 1242,function(data) {

        // 渲染图片和链接
        $('#snapshatcard3 .snapshats-preview3').attr('src', data.data.dlUrl);
        $('#snapshatcard3 .file-input').attr('src', data.data.dlUrl);
        $('#snapshatcard3 .snapshats-link3').attr('href', data.data.dlUrl);

        // // 绑定数据
        $('#pic9-upload-img4').attr('src',data.data.dlUrl);
        $('#pic6-upload-img4').attr('src',data.data.dlUrl);
        $('#pic4-upload-img3').attr('src',data.data.dlUrl);
        $('#snapshatcard3 .file-submit3')
            .attr('data-url', data.data.dlUrl)
            .html('附件已上传！');
    });

    upload.image($('#snapshatcard4'), modal, '图片', 1242, 1242,function(data) {

        // 渲染图片和链接
        $('#snapshatcard4 .snapshats-preview4').attr('src', data.data.dlUrl);
        $('#snapshatcard4 .file-input').attr('src', data.data.dlUrl);
        $('#snapshatcard4 .snapshats-link4').attr('href', data.data.dlUrl);

        // // 绑定数据
        $('#pic9-upload-img5').attr('src',data.data.dlUrl);
        $('#pic6-upload-img5').attr('src',data.data.dlUrl);
        $('#pic4-upload-img4').attr('src',data.data.dlUrl);
        $('#snapshatcard4 .file-submit4')
            .attr('data-url', data.data.dlUrl)
            .html('附件已上传！');
    });

    upload.image($('#snapshatcard5'), modal, '图片', 1242, 1242,function(data) {

        // 渲染图片和链接
        $('#snapshatcard5 .snapshats-preview5').attr('src', data.data.dlUrl);
        $('#snapshatcard5 .file-input').attr('src', data.data.dlUrl);
        $('#snapshatcard5 .snapshats-link5').attr('href', data.data.dlUrl);

        // // 绑定数据
        $('#pic9-upload-img6').attr('src',data.data.dlUrl);
        $('#pic6-upload-img6').attr('src',data.data.dlUrl);

        $('#snapshatcard5 .file-submit5')
            .attr('data-url', data.data.dlUrl)
            .html('附件已上传！');
    });
    upload.image($('#snapshatcard6'), modal, '图片', 1242, 1242,function(data) {

        // 渲染图片和链接
        $('#snapshatcard6 .snapshats-link6').attr('href', data.data.dlUrl);
        $('#snapshatcard6 .snapshats-preview6').attr('src', data.data.dlUrl);
        $('#snapshatcard6 .file-input').attr('src', data.data.dlUrl);

        // // 绑定数据
        $('#pic9-upload-img7').attr('src',data.data.dlUrl);

        $('#snapshatcard6 .file-submit6')
            .attr('data-url', data.data.dlUrl)
            .html('附件已上传！');
    });
    upload.image($('#snapshatcard7'), modal, '图片', 1242, 1242,function(data) {

        // 渲染图片和链接
        $('#snapshatcard7 .snapshats-link7').attr('href', data.data.dlUrl);
        $('#snapshatcard7 .snapshats-preview7').attr('src', data.data.dlUrl);
        $('#snapshatcard7 .file-input').attr('src', data.data.dlUrl);

        // // 绑定数据
        $('#pic9-upload-img8').attr('src',data.data.dlUrl);

        $('#snapshatcard7 .file-submit7')
            .attr('data-url', data.data.dlUrl)
            .html('附件已上传！');
    });
    upload.image($('#snapshatcard8'), modal, '图片', 1242, 1242,function(data) {

        // 渲染图片和链接
        $('#snapshatcard8 .snapshats-link8').attr('href', data.data.dlUrl);
        $('#snapshatcard8 .snapshats-preview8').attr('src', data.data.dlUrl);
        $('#snapshatcard8 .file-input').attr('src', data.data.dlUrl);

        // // 绑定数据
        $('#pic9-upload-img9').attr('src',data.data.dlUrl);
        $('#snapshatcard8 .file-submit8')
            .attr('data-url', data.data.dlUrl)
            .html('附件已上传！');
    });

    // 上传图片一次选择4、6、9张
    $('#upload-pic-number').change(function() {
       var optionObj = $('#upload-pic-number option:selected').val();
       if(optionObj === '4') {
            $('.pic-6').addClass('z-hidden');
            $('.scratchable-pic-9').addClass('z-hidden');
            $('.watch-pic-4').removeClass('z-hidden');
            $('.watch-pic-6').addClass('z-hidden');
            $('.watch-pic-9').addClass('z-hidden');
       } else if(optionObj === '6') {
            $('.pic-6').removeClass('z-hidden');
            $('.scratchable-pic-9').addClass('z-hidden');
            $('.watch-pic-6').removeClass('z-hidden');
            $('.watch-pic-4').addClass('z-hidden');
            $('.watch-pic-9').addClass('z-hidden');
       } else {
            $('.pic-6').removeClass('z-hidden');
            $('.scratchable-pic-9').removeClass('z-hidden');
            $('.watch-pic-4').addClass('z-hidden');
            $('.watch-pic-6').addClass('z-hidden');
            $('.watch-pic-9').removeClass('z-hidden');
       }
    });

    // 应用分类
    ajax.get({
        url: '/tree/listAppClassify.do',
        cb: function(_data) {

            // 渲染模板
            var tpl = $('#application-tpl').html();
            $('#application-classify').html(_.template(tpl)(_data));
            $('#application-classify').select2();
            $('#application-classify').find('span:eq(0)').css('width', '386px');
        }
    });

    // 初始化： 应用分类
    // 绑定app操作系统选项
    $('#scratchable-app').change(function() {
        var appObj = select2.getVal({
            id: '#scratchable-app'
        });
        if(appObj === '0') {
            $('.ios-type').removeClass('z-hidden');
        } else {
            $('.ios-type').addClass('z-hidden');
        }
    });

    // 初始化：应用图标
    if(cacheDataConfig.ad && cacheDataConfig.ad.appIcon) {
        $('#scrasnapshat .snapshats-preview').attr('src',cacheDataConfig.ad.appIcon);
        $('#scrasnapshat .file-input').attr('src', cacheDataConfig.ad.appIcon);

         $('#scrasnapshat .file-submit')
            .attr('data-url', cacheDataConfig.ad.appIcon)
            .html('附件已上传！');
    }

    // 初始化：微博正文
    if(cacheDataConfig.ad && cacheDataConfig.ad.text) {
        $('#scratchable-text').val(cacheDataConfig.ad.text);
    }

    // 初始化：图片Url
    if(cacheDataConfig.ad && cacheDataConfig.ad.picUrls) {
        var picNumber = cacheDataConfig.ad.picUrls.length;
        if(picNumber === 4) {
            $('#upload-pic-number').find('option[value="4"]').attr('selected',true);
        } else if(picNumber === 6) {
            $('#upload-pic-number').find('option[value="6"]').attr('selected',true);
        } else {
             $('#upload-pic-number').find('option[value="9"]').attr('selected',true);
        }
    }

    // 初始化：app 下载链接
    if(cacheDataConfig.ad && cacheDataConfig.ad.appUrl) {
        $('#scratchable-download').val(cacheDataConfig.ad.appUrl);
    }

    // 初始化： 微博应用名称
    if(cacheDataConfig.ad && cacheDataConfig.ad.appName) {
        $('#scratchable-application').val(cacheDataConfig.ad.appName);
    }

    // 初始化：开发者
    if(cacheDataConfig.ad && cacheDataConfig.ad.appDeveloper) {
        $('#develop').val(cacheDataConfig.ad.appDeveloper);
    }

    // 初始化：应用描述
    if(cacheDataConfig.ad && cacheDataConfig.ad.appDesc) {
        $('#application-description').val(cacheDataConfig.ad.appDesc);
    }

    if(cacheDataConfig.ad && cacheDataConfig.ad.picUrls) {
        var picUrlList = cacheDataConfig.ad.picUrls.toString().replace(/[\[\]]/g, '');
        var picUrlListArr = picUrlList.split(',');
        console.log(picUrlListArr[0].toString().replace(/^\"|\"$/g, ''));

        // 渲染图片和链接
        $('#snapshatcard0 .snapshats-preview0').attr('src', picUrlListArr[0].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard0 .file-input').attr('src', picUrlListArr[0].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard0 .snapshats-link0').attr('href', picUrlListArr[0].toString().replace(/^\"|\"$/g, ''));

        // 第一张图片 绑定数据
        $('#pic9-upload-img1').attr('src',picUrlListArr[0].toString().replace(/^\"|\"$/g, ''));
        $('#pic6-upload-img1').attr('src',picUrlListArr[0].toString().replace(/^\"|\"$/g, ''));
        $('#pic4-upload-img1').attr('src',picUrlListArr[0].toString().replace(/^\"|\"$/g, ''));

        $('#snapshatcard0 .file-submit')
            .attr('data-url', picUrlListArr[0].toString().replace(/^\"|\"$/g, ''))
            .html('附件已上传！');

        $('#snapshatcard1 .snapshats-preview1').attr('src', picUrlListArr[1].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard1 .file-input').attr('src',picUrlListArr[1].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard1 .snapshats-link1').attr('href', picUrlListArr[1].toString().replace(/^\"|\"$/g, ''));

        // 第二张图片 绑定数据
        $('#pic9-upload-img2').attr('src',picUrlListArr[1].toString().replace(/^\"|\"$/g, ''));
        $('#pic6-upload-img2').attr('src',picUrlListArr[1].toString().replace(/^\"|\"$/g, ''));
        $('#pic4-upload-img2').attr('src',picUrlListArr[1].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard1 .file-submit')
            .attr('data-url', picUrlListArr[1].toString().replace(/^\"|\"$/g, ''))
            .html('附件已上传！');

        // 第三张 绑定数据
        $('#snapshatcard3 .snapshats-preview3').attr('src', picUrlListArr[2].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard3 .file-input').attr('src', picUrlListArr[2].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard3 .snapshats-link3').attr('href', picUrlListArr[2].toString().replace(/^\"|\"$/g, ''));
        $('#pic9-upload-img4').attr('src',picUrlListArr[2].toString().replace(/^\"|\"$/g, ''));
        $('#pic6-upload-img4').attr('src',picUrlListArr[2].toString().replace(/^\"|\"$/g, ''));
        $('#pic4-upload-img3').attr('src',picUrlListArr[2].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard3 .file-submit')
            .attr('data-url', picUrlListArr[2].toString().replace(/^\"|\"$/g, ''))
            .html('附件已上传！');

        // 第四张 绑定数据
        $('#snapshatcard4 .snapshats-preview4').attr('src', picUrlListArr[3].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard4 .file-input').attr('src', picUrlListArr[3].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard4 .snapshats-link4').attr('href', picUrlListArr[3].toString().replace(/^\"|\"$/g, ''));
        $('#pic9-upload-img5').attr('src',picUrlListArr[3].toString().replace(/^\"|\"$/g, ''));
        $('#pic6-upload-img5').attr('src',picUrlListArr[3].toString().replace(/^\"|\"$/g, ''));
        $('#pic4-upload-img4').attr('src',picUrlListArr[3].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard4 .file-submit')
            .attr('data-url', picUrlListArr[3].toString().replace(/^\"|\"$/g, ''))
            .html('附件已上传！');
    }
    if(cacheDataConfig.ad && cacheDataConfig.ad.picUrls && cacheDataConfig.ad.picUrls.length === 6) {
        var picUrlList = cacheDataConfig.ad.picUrls.toString().replace(/[\[\]]/g, '');
        var picUrlListArr = picUrlList.split(',');
        $('.pic-6').removeClass('z-hidden');
        $('.watch-pic-6').removeClass('z-hidden');
        $('.watch-pic-4').addClass('z-hidden');

        // 渲染图片和链接
        $('#snapshatcard2 .snapshats-preview2').attr('src', picUrlListArr[4].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard2 .file-input').attr('src', picUrlListArr[4].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard2 .snapshats-link2').attr('href', picUrlListArr[4].toString().replace(/^\"|\"$/g, ''));

        // // 绑定数据
        $('#pic9-upload-img3').attr('src',picUrlListArr[4].toString().replace(/^\"|\"$/g, ''));
        $('#pic6-upload-img3').attr('src',picUrlListArr[4].toString().replace(/^\"|\"$/g, ''));
        $('#pic4-upload-img4').attr('src',picUrlListArr[4].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard4 .file-submit')
            .attr('data-url', picUrlListArr[4].toString().replace(/^\"|\"$/g, ''))
            .html('附件已上传！');

        // 第6张图片
        $('#snapshatcard5 .snapshats-preview5').attr('src', picUrlListArr[5].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard5 .file-input').attr('src', picUrlListArr[5].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard5 .snapshats-link5').attr('href', picUrlListArr[5].toString().replace(/^\"|\"$/g, ''));

        // // 绑定数据
        $('#pic9-upload-img6').attr('src',picUrlListArr[5].toString().replace(/^\"|\"$/g, ''));
        $('#pic6-upload-img6').attr('src',picUrlListArr[5].toString().replace(/^\"|\"$/g, ''));

        $('#snapshatcard5 .file-submit')
            .attr('data-url', picUrlListArr[5].toString().replace(/^\"|\"$/g, ''))
            .html('附件已上传！');
    }
    if(cacheDataConfig.ad &&  cacheDataConfig.ad.picUrls && cacheDataConfig.ad.picUrls.length === 9) {
        var picUrlList = cacheDataConfig.ad.picUrls.toString().replace(/[\[\]]/g, '');
        var picUrlListArr = picUrlList.split(',');
        $('.pic-6').removeClass('z-hidden');
        $('.scratchable-pic-9').removeClass('z-hidden');
        $('.watch-pic-6').removeClass('z-hidden');
        $('.watch-pic-4').addClass('z-hidden');
        $('.watch-pic-6').removeClass('z-hidden');

        // // 渲染图片和链接
        // $('#snapshatcard6 .snapshats-preview6').attr('src', picUrlListArr[4].toString().replace(/^\"|\"$/g, ''));
        // $('#snapshatcard6 .file-input6').attr('src', picUrlListArr[4].toString().replace(/^\"|\"$/g, ''));

        // // // 绑定数据
        // $('#pic9-upload-img7').attr('src',picUrlListArr[4].toString().replace(/^\"|\"$/g, ''));
        // $('#pic6-upload-img7').attr('src',picUrlListArr[4].toString().replace(/^\"|\"$/g, ''));
        // // $('#pic4-upload-img4').attr('src',picUrlListArr[4].toString().replace(/^\"|\"$/g, ''));
        // $('#snapshatcard4 .file-submit')
        //     .attr('data-url', picUrlListArr[4].toString().replace(/^\"|\"$/g, ''))
        //     .html('附件已上传！');

        // $('#snapshatcard5 .snapshats-preview5').attr('src',picUrlListArr[5].toString().replace(/^\"|\"$/g, ''));
        // $('#snapshatcard5 .file-input').attr('src', picUrlListArr[5].toString().replace(/^\"|\"$/g, ''));

        // // // 绑定数据
        // $('#pic9-upload-img6').attr('src',picUrlListArr[5].toString().replace(/^\"|\"$/g, ''));
        // $('#pic6-upload-img6').attr('src',picUrlListArr[5].toString().replace(/^\"|\"$/g, ''));

        // $('#snapshatcard5 .file-submit')
        //     .attr('data-url', picUrlListArr[5].toString().replace(/^\"|\"$/g, ''))
        //     .html('附件已上传！');

        // 渲染第七张图片
        $('#snapshatcard6 .snapshats-preview6').attr('src', picUrlListArr[6].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard6 .file-input6').attr('src', picUrlListArr[6].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard6 .snapshats-link6').attr('href', picUrlListArr[6].toString().replace(/^\"|\"$/g, ''));

        // // 绑定数据
        $('#pic9-upload-img7').attr('src',picUrlListArr[6].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard6 .file-submit6')
            .attr('data-url', picUrlListArr[6].toString().replace(/^\"|\"$/g, ''))
            .html('附件已上传！');

        // 渲染第八张图片
        $('#snapshatcard7 .snapshats-preview7').attr('src', picUrlListArr[7].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard7 .file-input').attr('src', picUrlListArr[7].toString().replace(/^\"|\"$/g, ''));
        $('#pic9-upload-img8').attr('src',picUrlListArr[7].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard7 .snapshats-link7').attr('href', picUrlListArr[7].toString().replace(/^\"|\"$/g, ''));

        // // 绑定数据
        $('#snapshatcard7 .file-submit8')
            .attr('data-url', picUrlListArr[7].toString().replace(/^\"|\"$/g, ''))
            .html('附件已上传！');

        // 渲染第九张图片
        $('#snapshatcard8 .snapshats-preview8').attr('src', picUrlListArr[8].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard8 .file-input').attr('src', picUrlListArr[8].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard8 .snapshats-link8').attr('href', picUrlListArr[8].toString().replace(/^\"|\"$/g, ''));
        $('#pic9-upload-img9').attr('src',picUrlListArr[7].toString().replace(/^\"|\"$/g, ''));

        // // 绑定数据
        $('#pic9-upload-img8').attr('src',picUrlListArr[8].toString().replace(/^\"|\"$/g, ''));
        $('#snapshatcard8 .file-submit8')
            .attr('data-url', picUrlListArr[8].toString().replace(/^\"|\"$/g, ''))
            .html('附件已上传！');
    }

    // 第一张图片
    if(cacheDataConfig.ad && cacheDataConfig.ad.appImages && cacheDataConfig.ad.appImages.length > 0) {
        var parent = $('#screensnapshat' + screenindex);

        $('.snapshats-link', parent).attr('href', cacheData.two.ad.appImages[0]);
        $('.snapshats-preview', parent).attr('src', cacheData.two.ad.appImages[0]);
        $('.file-submit', parent)
            .attr('data-url', cacheData.two.ad.appImages[0])
            .html('图片已上传')
    }

    // > 1张图片
    if(cacheDataConfig.ad && cacheDataConfig.ad.appImages && cacheDataConfig.ad.appImages.length > 1) {
        var _picUrls = cacheData.two.ad.appImages;
        _picUrls.shift();

        _.each(_picUrls, function(url) {
            var self = $('#scratchable-add-snapshot');
            var screenindex = Number(self.attr('data-index')) + 1;
            var parent = $('#screensnapshat' + screenindex);

            $('#scratchable-snapshat-wrap').append(_.template($('#snapshat-detail-tpl').html())({
                action: '/upload.do',
                name: 'uploadFile',
                index: index,
                url: url
            }));

            upload.file($('#screensnapshat' + screenindex), modal, '广告', function(data) {
                var parent = $('#screensnapshat' + screenindex);

                $('.snapshats-link', parent).attr('href', data.data.dlUrl);
                $('.snapshats-preview', parent).attr('src', data.data.dlUrl);
                $('.file-submit', parent)
                    .attr('data-url', data.data.dlUrl)
                    .html('图片已上传')
            });

            self.attr('data-index', screenindex);
        });
    }

    $('#scratchable-type').on('change', function() {
        if($('#scratchable-type option:selected').text() === '') {
            $('.arrow-right').addClass('z-hidden');
            $('.scratchable-watch-buttonType').addClass('z-hidden');
        } else {
            $('.arrow-right').removeClass('z-hidden');
            $('.scratchable-watch-buttonType').removeClass('z-hidden');
        }
        $('body .scratchable-watch-buttonType').html($('#scratchable-type option:selected').text());
    });
}

// 下一步
$('#submit').click(function() {

    // 判定当前选择的投放位置是哪个
    var select = $('#detail').attr('data-select') === undefined ? '1' : $('#detail').attr('data-select');
    // var select = $('#detail').attr('data-select');
    console.log(select);

    // 如果是微博 feeds 广告
    if(select === '1') {
        console.log('微博 feed 广告');

        // 获取微博 uid
        var feedUid = select2.getVal({
            id: '#weibo-uid'
        });

        // 获取选择的广告位 id
        var feedAdPlacementId = $('#feed-ad-type-detail').attr('data-ad_placement_id');
        var feedType = $('#feed-ad-type-detail').attr('data-type'); // 博文类型 11（banner） 21 (博文) 22（card）23（app）

        // 判定当前是博文 mid 还是直接输入博文，并获取
        var feedMid = $('#feed-mid').val(); // 微博 mid
        var feedPicUrls = getFeedPicImage(); // 微博图片
        var feedText = $('#feed-text').val(); // 微博内容

        // 数据判定，如果没有按照要求填入数据就直接返回
        if(feedUid === null || feedUid === '') {
            modal.nobtn({
                ctx: 'body',
                ctn: '请选择微博 UID',
                title: '广告'
            });
            return;
        }

        if(feedAdPlacementId === '' || feedAdPlacementId === undefined || feedType === '' || feedType === undefined) {
            modal.nobtn({
                ctx: 'body',
                ctn: '请选择投放的广告位',
                title: '广告'
            });
            return;
        }

        if(feedMid !== '' &&  feedText !== '') {
            modal.nobtn({
                ctx: 'body',
                ctn: '微博 mid 和博文只能使用其中一种',
                title: '广告'
            });
            return;
        }

        if(feedMid === '') {
            if(feedText === '') {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '请输入投放的具体内容，如果选择微博 mid，请确保意境输入 mid，如果选择编辑博文，请确保已经填写博文',
                    title: '广告'
                });
                return;
            }
        }

        if(feedText === '') {
            if(feedMid === '') {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '请输入投放的具体内容，如果选择微博 mid，请确保意境输入 mid，如果选择编辑博文，请确保已经填写博文',
                    title: '广告'
                });
                return;
            }
        }

         // 存储数据
         // mid 类型
         if(feedMid !== '') {
            if(urler.normal().order_id) {
                cache.set('delivery_ad_detail.two', {
                    type: '1',
                    adPlacementId: feedAdPlacementId,
                    ad: {
                        uid: feedUid,
                        mid: feedMid
                    }
                });

                // 跳转到步骤3
                urler.initLink('/#proj_name#/html/delivery/ad/step3.html?order_id=' + urler.normal().order_id);
            } else {
                cache.set('delivery_ad_add.two', {
                    type: '1',
                    adPlacementId: feedAdPlacementId,
                    ad: {
                        uid: feedUid,
                        mid: feedMid
                    }
                });

                // 跳转到步骤3
                urler.initLink('/#proj_name#/html/delivery/ad/step3.html');
            }

         // 编辑图文
         } else {
            if(urler.normal().order_id) {
                cache.set('delivery_ad_detail.two', {
                    type: '1',
                    adPlacementId: feedAdPlacementId,
                    ad: {
                        picUrls: feedPicUrls,
                        uid: feedUid,
                        text: feedText
                    }
                });

                // 跳转到步骤3
                urler.initLink('/#proj_name#/html/delivery/ad/step3.html?order_id=' + urler.normal().order_id);
            } else {
                cache.set('delivery_ad_add.two', {
                    type: '1',
                    adPlacementId: feedAdPlacementId,
                    ad: {
                        picUrls: feedPicUrls,
                        uid: feedUid,
                        text: feedText
                    }
                });

                // 跳转到步骤3
                urler.initLink('/#proj_name#/html/delivery/ad/step3.html');
            }
         }

    // 如果是 banner
    } else if(select === '2'){
        console.log('banner');

        // 获取网页链接
        var bannerUrl = $('#webpage-link').val();

        // 获取选择的广告位

        var bannerType = $('#banner-snapshat-wrap').attr('data-type');
        var bannerAdPlacementId = $('#banner-snapshat-wrap').attr('data-ad_placement_id');

        // 获取上传图片
        var bannerPic = $('.file-submit', $('#banner-snapshat-wrap')).attr('data-url');

        // 数据判定，如果没有按照要求填入数据就直接返回
        if(bannerUrl === '') {
            modal.nobtn({
                ctx: 'body',
                ctn: '请输入网页链接',
                title: '广告'
            });
            return;
        }

        if(bannerAdPlacementId === '' || bannerAdPlacementId === undefined || bannerType === '' || bannerType === undefined) {
            modal.nobtn({
                ctx: 'body',
                ctn: '请选择投放的广告位',
                title: '广告'
            });
            return;
        }

        if(bannerPic === '' || bannerPic === undefined) {
            modal.nobtn({
                ctx: 'body',
                ctn: '请上传图片',
                title: '广告'
            });
            return;
        }

        if(urler.normal().order_id) {
            cache.set('delivery_ad_detail.two', {
                type: '2',
                adPlacementId: bannerAdPlacementId,
                ad: {
                    picUrl: bannerPic,
                    landingpageUrl: bannerUrl
                }
            });

            // 跳转到步骤3
            urler.initLink('/#proj_name#/html/delivery/ad/step3.html?order_id=' + urler.normal().order_id);
        } else {
            cache.set('delivery_ad_add.two', {
                type: '2',
                adPlacementId: bannerAdPlacementId,
                ad: {
                    picUrl: bannerPic,
                    landingpageUrl: bannerUrl
                }
            });

            // 跳转到步骤3
            urler.initLink('/#proj_name#/html/delivery/ad/step3.html');
        }

    // 如果是品速card
    } else if(select === '3'){

        // 获取card 微博 uid
        var cardUid = select2.getVal({
            id: '#card-weibo-uid'
        });

        // 获取card标题
        var cardTitle = $('#card-title').val();

        // 获取card 内容
        var cardDesc = $('#card-content').val();

        // 获取card 类型
        var cardType = $('input[name="type"]:checked').val();

        // 获取card 按钮类型
        var cardButtonType = $('input[name="card-button-type"]:checked').val();

        // 获取card按钮链接
        var cardButtonUrl = $('#card-button-link').val();

        // 获取card链接
        var landingpageUrl = $('#card-link').val();

        // 推广的博文内容
        var text = $('#weibo-content').val();

        // 获取上传图片
        var cardPic = $('.file-submit', $('#card-snapshat-wrap')).attr('data-url');
        console.log('---我是图片参数---');
        console.log(cardPic);
        var cardVideoPic = $('.file-submit', $('#card-snapshat-wrap1')).attr('data-url');
        console.log(cardVideoPic);

        // 获取上传视频地址
        // var videoPath = $('.file-submit', $('#card-snapshat-video-wrap')).attr('data-videourl');
        var videoPath = cache.get('videoPath');

        // 数据判定，如果没有按照要求填入数据就直接返回
        if(cardTitle === '') {
            modal.nobtn({
                ctx: 'body',
                ctn: '请输入card标题',
                title: '广告'
            });
            return;
        }
        if(cardDesc === '') {
            modal.nobtn({
                ctx: 'body',
                ctn: '请输入card内容',
                title: '广告'
            });
            return;
        }
        if(text === '' || text === 'undefined') {
            modal.nobtn({
                ctx: 'body',
                ctn: '请输入推广的博文内容',
                title: '广告'
            });
            return;
        }

        if(cardType !== '1' && videoPath === '') {
            modal.nobtn({
                ctx: 'body',
                ctn: '请上传视频',
                title: '广告'
            });
            return;
        }

        // 判断活动类型
        if(cardType === '1' || cardType === '3') {
            if(landingpageUrl === '') {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '请输入card链接',
                    title: '广告'
                });
                return;
            }

            // 按钮类型不是无的情况
            if(cardButtonType !== 'none') {
                if(cardButtonUrl === '') {
                    modal.nobtn({
                        ctx: 'body',
                        ctn: '请输入card按钮链接',
                        title: '广告'
                    });
                    return;
                }
            }
        }

        // 活动类型是视频、视频活动，判断视频地址
        if(videoPath === '' && cardType !== '1' ) {
            modal.nobtn({
                ctx: 'body',
                ctn: '请上传视频地址',
                title: '广告'
            });
            return;
        }
        if(cardPic === '' || cardPic === undefined && cardType === '1') {
            modal.nobtn({
                ctx: 'body',
                ctn: '请上传图片',
                title: '广告'
            });
            return;
        }

        if(urler.normal().order_id) {
            cache.set('delivery_ad_detail.two', {
                type: '3',
                adPlacementId: bannerAdPlacementId,
                ad: {
                    uid: cardUid,
                    picUrl: cardType === '1' ? cardPic : cardVideoPic,
                    cardTitle: cardTitle,
                    cardType: Number(cardType),
                    cardDesc: cardDesc,
                    cardButtonType: cardButtonType,
                    landingpageUrl: landingpageUrl,
                    cardButtonUrl: cardButtonUrl,
                    videoPath: videoPath,
                    text: text
                }
            });
            console.log(cache.get('delivery_ad_detail.two'));

            // 跳转到步骤3
            urler.initLink('/#proj_name#/html/delivery/ad/step3.html?order_id=' + urler.normal().order_id);
        } else {
            cache.set('delivery_ad_add.two', {
                type: '3',
                adPlacementId: bannerAdPlacementId,
                ad: {
                    uid: cardUid,
                    picUrl: cardType === '1' ? cardPic : cardVideoPic,
                    cardTitle: cardTitle,
                    cardType: Number(cardType),
                    cardDesc: cardDesc,
                    cardButtonType: cardButtonType,
                    landingpageUrl: landingpageUrl,
                    cardButtonUrl: cardButtonUrl,
                    videoPath: videoPath,
                    text: text
                }
            });

            // 跳转到步骤3
            urler.initLink('/#proj_name#/html/delivery/ad/step3.html');
        }

    // 如果是九宫格
    } else {
        console.log('scratchablecard');

        // 获取九宫格 微博 uid
        var cardUid = select2.getVal({
            id: '#scratchable-uid'
        });

        // 获取微博正文
        var text = $('#scratchable-text').val();

        // 匹配微博正文输入url
        // var reg = /\b(([\w-]+://?|www[.])[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|/)))/;
        // // var reg = /\w+[@]{1}\w+[.]\w+/;
        // if(!reg.test(text)) {
        //     alert(1);
        // }
        if(text.length < 10 || text.length > 30) {
             modal.nobtn({
                ctx: 'body',
                ctn: '请输入推广的博文内容最少不少于10个汉字，最长不超过30个汉字',
                title: '广告'
            });
            return;
        }

        // 图片数组
        var picUrls = [];
        $('.file-submit', '#scratchablecard').each(function() {
            if($(this).attr('data-url') !== '' && $(this).attr('data-url') !== undefined) {
                picUrls.push($(this).attr('data-url'));
            }
        });

        var appImages = [];
        $('.file-submit', '#scratchable-snapshat-wrap').each(function() {
            if($(this).attr('data-url') !== '' && $(this).attr('data-url') !== undefined) {
                appImages.push($(this).attr('data-url'));
            }
        });

        var optionObj = $('#upload-pic-number option:selected').val();
        if(optionObj === '4') {
            if(picUrls.length !== 4) {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '请上传图片',
                    title: '广告'
                });
                return;
            } 
        } else if(optionObj === '6') {
            if(picUrls.length !== 6) {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '请上传图片',
                    title: '广告'
                });
                return;
            } 
        } else if(optionObj === '9') {
            if(picUrls.length !== 9) {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '请上传图片',
                    title: '广告'
                });
                return;
            } 
        }

        // 数据判定，如果没有按照要求填入数据就直接返回
        if(cardUid === '') {
            modal.nobtn({
                ctx: 'body',
                ctn: '请选择Uid',
                title: '广告'
            });
            return;
        }
        if(cardDesc === '') {
            modal.nobtn({
                ctx: 'body',
                ctn: '请输入text',
                title: '广告'
            });
            return;
        }
        if(picUrls === '') {
            modal.nobtn({
                ctx: 'body',
                ctn: '请选择图片',
                title: '广告'
            });
            return;
        }

        // 按钮类型
        var cardButtonType = select2.getVal({
            id: '#scratchable-type'
        });

        var appType = select2.getVal({
            id: '#scratchable-app'
        });

        // 应用下载链接
        var appUrl = $('#scratchable-download').val();
        if(appType === null) {
            modal.nobtn({
                ctx: 'body',
                ctn: '请选择app类型',
                title: '广告'
            });
            return;
        }
        if(cardButtonType === null) {
            modal.nobtn({
                ctx: 'body',
                ctn: '请选择按钮类型',
                title: '广告'
            });
            return;
        }

        if(appUrl === '') {
            modal.nobtn({
                ctx: 'body',
                ctn: '请输入应用下载链接',
                title: '广告'
            });
            return;
        }


        // 应用名称
        var appName = $('#scratchable-application').val();

        // 应用分类
        var appClassify = select2.getVal({
            id: '#application-classify'
        });

        // 应用开发者
        var appDeveloper = $('#develop').val();

        // 应用描述
        var appDesc = $('#application-description').val();

        // 应用图标
        var appIcon = $('.file-submit', $('#scrasnapshat')).attr('data-url');

        if(urler.normal().order_id) {
            cache.set('delivery_ad_detail.two', {
                type: '4',
                adPlacementId: feedAdPlacementId,
                ad: {
                    uid: cardUid,
                    text: text,
                    picUrls: picUrls,
                    cardButtonType: cardButtonType,
                    appType:appType,
                    appUrl: appUrl,
                    appName: appName,
                    appClassify: appType === '0' ? appClassify : '',
                    appDeveloper: appType === '0' ? appDeveloper: '',
                    appDesc: appType === '0' ? appDesc: '',
                    appIcon: appType === '0' ? appIcon: '',
                    appImages: appType === '0' ? appImages: ''
                }
            });

            // 跳转到步骤3
            urler.initLink('/#proj_name#/html/delivery/ad/step3.html?order_id=' + urler.normal().order_id);
        } else {
            cache.set('delivery_ad_add.two', {
                type: '4',
                adPlacementId: feedAdPlacementId,
                ad: {
                    uid: cardUid,
                    text: text,
                    picUrls: picUrls,
                    cardButtonType: cardButtonType,
                    appType:appType,
                    appUrl: appUrl,
                    appName: appName,
                    appClassify: appType === '0' ? appClassify : '',
                    appDeveloper: appType === '0' ? appDeveloper: '',
                    appDesc: appType === '0' ? appDesc: '',
                    appIcon: appType === '0' ? appIcon: '',
                    appImages: appType === '0' ? appImages: ''
                }
            });

            // 跳转到步骤3
            urler.initLink('/#proj_name#/html/delivery/ad/step3.html');
        }
    }

});

/**
 * 获取微博 feed 广告编辑博文的图片
 * @return [Array]  图片数组
 */
function getFeedPicImage() {
    var arr = [];
    var parent = $('#edit-post');
    $('.file-submit', parent).each(function() {
        if($(this).attr('data-url') !== '' && $(this).attr('data-url') !== undefined) {
            arr.push($(this).attr('data-url'));
        }
    });
    return arr;
}



/**
 * 通过用户选择的 UID 来请求接口，获取 MID 数据，当用户焦点聚焦到博文 MID 时，显示 UID
 * 下拉列表提供给用户选择，如果用户焦点不聚焦，则隐藏列表
 */
function getMidList(uid) {

    // 获取微博 MID 数据
    ajax.get({
        url: '/select/listWeiboMids.do',
        param: {
            weiboUid: uid
        },
        cb: function(data) {

            // 渲染微博 UID 模板
            var tpl = $('#mid-list-tpl').html();
            $('#mid-list').html(_.template(tpl)(data));

            $('#feed-mid').attr('data-length', Object.keys(data.data).length);
        }
    });
}

// 用户选择微博 UID 事件
$('body').on('select2:select', '#weibo-uid', function(e) {
    var uid = select2.getVal({ id: '#weibo-uid' }) === null ? '' : select2.getVal({ id: '#weibo-uid' }) ;
    getMidList(uid);
});

// 品速card，用户选择微博 UID 事件
$('body').on('select2:select', '#card-weibo-uid', function(e) {
    var uid = select2.getVal({ id: '#card-weibo-uid' }) === null ? '' : select2.getVal({ id: '#card-weibo-uid' }) ;
    getMidList(uid);
});

// 九宫格，用户选择微博UID事件
$('body').on('select2:select', '#scratchable-uid', function(e) {
    var uid = select2.getVal({ id: '#scratchable-uid' }) === null ? '' : select2.getVal({ id: '#scratchable-uid' }) ;
    getMidList(uid);
});

// 用户聚焦 MID 输入框
$('body').on('focus', '#feed-mid', function() {
    var length = parseInt($(this).attr('data-length'));
    if(length > 0) {
        $('#mid-list').fadeIn('fast');
    }
});

// MID 输入框失去焦点
$('body').on('blur', '#feed-mid', function() {
    $('#mid-list').fadeOut('fast');
});

// 用户选择 MID 列表的项时将项填充到实际的输入框
$('body').on('click', '#mid-list a', function() {
    var mid = $(this).attr('data-mid');
    $('#feed-mid').val(mid);
});

// 监听品速Card标题
$('body').on('input propertychange','#card-title', function(){
    $('body .card-title-watch').html($(this).val());
});

// 监听品速Card内容
$('body').on('input propertychange','#card-content', function(){
    $('body .card-content-watch').html($(this).val());
});

// 监听品速Card内容
$('body').on('input propertychange','#weibo-content', function(){
    $('body .card-wbpromote-watch').html($(this).val());
});

// 监听九宫格内容
$('body').on('input propertychange','#scratchable-text', function(){
    $('body .scratchable-para').html($(this).val());
});

