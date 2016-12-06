import {
    checkUrl,
    getICheckStatus
} from './libs/tools';
const uploader = window.uploader;

// 暂时隐藏掉banner类型
// 为了避免以前创建的 banner 广告不能用，这里判定如果当前是创建广告，就隐藏掉 banner 类型，如果当前不是，就不隐藏
if (urler().edit === undefined) {
    $('#select-ad-type [value="#weibo-banner"]').hide();
}

// 缓存页面状态，大部分情况下默认状态是 0，如果异步数据到达时则更改状态为 1
let cachePageStatus = {
    feeds: {
        uid: 0
    },
    banner: {},
    card: {
        uid: 0
    },
    grid: {
        uid: 0,
        uploadSize: 4,
        type: null,
        subType: null
    }
};

renderDataFromCache();
addBackLinkParam();

// 初始化多图片上传（微博 feed 下的编辑博文）
uploader.multiImage({
    container: '#weibo-feed-upload',
    fileName: 'uploadFile',
    
    // 上传图片后的操作
    uploadCb() {
        let imgs = [];
        
        $('#weibo-feed-upload .multi-upload-item.upload').each((index, el) => {
            imgs.push($(el).attr('data-url'));
        });

        for (let i = 0; i < imgs.length; i++) {
            if (i === 0) {
                $('#preview-feed-pics').html(`<li><img src="${imgs[i]}"></li>`);
            } else {
                $('#preview-feed-pics').append(`<li><img src="${imgs[i]}"></li>`);
            }
        }
    },

    // 删除图片后的操作
    delCb() {
        
        // 则在预览中显示相应的图片，如果当前小于 1 张，则在预览中显示默认图片
        if ($('#weibo-feed-upload .multi-upload-item.upload').length < 1) {
            let img = '/#proj_name#/img/none.png';
            $('#preview-feed-pics').html(`
                <li><img src="${img}"></li>
                <li><img src="${img}"></li>
                <li><img src="${img}"></li>
                <li><img src="${img}"></li>
                <li><img src="${img}"></li>
                <li><img src="${img}"></li>
                <li><img src="${img}"></li>
                <li><img src="${img}"></li>
                <li><img src="${img}"></li>
            `);
        } else {
            let imgs = [];

            $('#weibo-feed-upload .multi-upload-item.upload').each((index, el) => {
                imgs.push($(el).attr('data-url'));
            });

            for (let i = 0; i < imgs.length; i++) {
                if (i === 0) {
                    $('#preview-feed-pics').html(`<li><img src="${imgs[i]}"></li>`);
                } else {
                    $('#preview-feed-pics').append(`<li><img src="${imgs[i]}"></li>`);
                }
            }
        }
    }
});

// 初始化单图片上传（上传 Banner）
uploader.singleImage({
    container: '#weibo-banner-upload',
    fileName: 'uploadFile',
    verify: {
        size: '5mb',
        width: '640,320',
        height: '100,50'
    },
    uploadCb() {
        let img = $('#weibo-banner-upload .single-upload-item.upload').attr('data-url');
        $('#preview-banner-pic').attr('src', img);
    },
    delCb() {
        $('#preview-banner-pic').attr('src', '/#proj_name#/img/none.png');
    }
});

// 初始化单图片上传（品速 Card 活动中的图片上传）
uploader.singleImage({
    container: '#weibo-card-banner-upload',
    fileName: 'uploadFile',
    verify: {
        size: '70kb',
        width: 592,
        height: 296
    },
    uploadCb() {
        let img = $('#weibo-card-banner-upload .single-upload-item.upload').attr('data-url');
        $('#preview-card-pic').attr('src', img);
    },
    delCb() {
        $('#preview-card-pic').attr('src', '/#proj_name#/img/none.png');
    }
});

// 初始化单图片上传（品速 Card 视频中的图片上传）
uploader.singleImage({
    container: '#weibo-card-video-upload',
    fileName: 'uploadFile',
    verify: {
        size: '70kb',
        width: 592,
        height: 296
    },
    uploadCb() {
        let img = $('#weibo-card-video-upload .single-upload-item.upload').attr('data-url');
        $('#preview-card-pic').attr('src', img);
    },
    delCb() {
        $('#preview-card-pic').attr('src', '/#proj_name#/img/none.png');
    }
});

// 初始化单图片上传（品速 Card 视频活动中的图片上传）
uploader.singleImage({
    container: '#weibo-card-actvideo-upload',
    fileName: 'uploadFile',
    verify: {
        size: '70kb',
        width: 592,
        height: 296
    },
    uploadCb() {
        let img = $('#weibo-card-actvideo-upload .single-upload-item.upload').attr('data-url');
        $('#preview-card-pic').attr('src', img);
    },
    delCb() {
        $('#preview-card-pic').attr('src', '/#proj_name#/img/none.png');
    }
});

// 初始化上传视频（品速 Card 视频中的上传视频）
uploader.singleVideo({
    container: '#weibo-card-video-uploadv',
    fileName: 'uploadFile'
});

// 初始化上传视频（品速 Card 视频活动中的上传视频）
uploader.singleVideo({
    container: '#weibo-card-video-act-uploadv',
    fileName: 'uploadFile'
});

// 初始化上传图片（九宫格）
uploader.multiSelectImage({
    container: '#weibo-grid-upload',
    fileName: 'uploadFile',
    verify: {
        size: '100kb',
        height: 1242,
        width: 1242
    },
    uploadCb() {
        let imgs = [];
        let imgNum = Number($('#weibo-grid-select-upload').val());
        let imgWidth = imgNum === 4 ? '50%' : '33.3333333%';

        $('#weibo-grid-upload .multi-upload-item.upload').each((index, el) => {
            imgs.push($(el).attr('data-url'));
        });

        for (let i = 0; i < imgs.length; i++) {
            if (i === 0) {
                $('#preview-grid-pics').html(`<li style="width: ${imgWidth}"><img src="${imgs[i]}"></li>`);
            } else {
                $('#preview-grid-pics').append(`<li style="width: ${imgWidth}"><img src="${imgs[i]}"></li>`);
            }
        }
    },
    delCb() {
        
        // 则在预览中显示相应的图片，如果当前小于 1 张，则在预览中显示默认图片
        if ($('#weibo-grid-upload .multi-upload-item.upload').length < 1) {
            let img = '/#proj_name#/img/none.png';
            let imgNum = Number($('#weibo-grid-select-upload').val());
            
            if(imgNum === 4) {
                $('#preview-grid-pics').html(`
                    <li style="width: 50%"><img src="${img}"></li>
                    <li style="width: 50%"><img src="${img}"></li>
                    <li style="width: 50%"><img src="${img}"></li>
                    <li style="width: 50%"><img src="${img}"></li>
                `);
            } else if (imgNum === 6) {
                $('#preview-grid-pics').html(`
                    <li style="width: 33.333333%"><img src="${img}"></li>
                    <li style="width: 33.333333%"><img src="${img}"></li>
                    <li style="width: 33.333333%"><img src="${img}"></li>
                    <li style="width: 33.333333%"><img src="${img}"></li>
                    <li style="width: 33.333333%"><img src="${img}"></li>
                    <li style="width: 33.333333%"><img src="${img}"></li>
                `);
            } else {
                $('#preview-grid-pics').html(`
                    <li style="width: 33.333333%"><img src="${img}"></li>
                    <li style="width: 33.333333%"><img src="${img}"></li>
                    <li style="width: 33.333333%"><img src="${img}"></li>
                    <li style="width: 33.333333%"><img src="${img}"></li>
                    <li style="width: 33.333333%"><img src="${img}"></li>
                    <li style="width: 33.333333%"><img src="${img}"></li>
                    <li style="width: 33.333333%"><img src="${img}"></li>
                    <li style="width: 33.333333%"><img src="${img}"></li>
                    <li style="width: 33.333333%"><img src="${img}"></li>
                `);
            }
        } else {
            let imgs = [];
            let imgNum = Number($('#weibo-grid-select-upload').val());
            let imgWidth = imgNum === 4 ? '50%' : '33.3333333%';

            $('#weibo-grid-upload .multi-upload-item.upload').each((index, el) => {
                imgs.push($(el).attr('data-url'));
            });

            for (let i = 0; i < imgs.length; i++) {
                if (i === 0) {
                    $('#preview-grid-pics').html(`<li style="width: ${imgWidth}"><img src="${imgs[i]}"></li>`);
                } else {
                    $('#preview-grid-pics').append(`<li style="width: ${imgWidth}"><img src="${imgs[i]}"></li>`);
                }
            }
        }
    }
});

// 初始化单图片上传（九宫格安卓中的应用图标）
uploader.singleImage({
    container: '#weibo-grid-app-upload',
    fileName: 'uploadFile'
});

// 初始化多图片上传（九宫格IOS中的应用截图）
uploader.multiImage({
    container: '#weibo-grid-screenshot-upload',
    fileName: 'uploadFile',
    maxEdge: 3
});

// 获取用户 UID
requester.get('/select/listWeiboUids.do').then(data => {
    let tpl = $('#select-tpl').html();
    $('#weibo-feed-uid').html(_.template(tpl)(data));
    $('#weibo-card-uid').html(_.template(tpl)(data));
    $('#weibo-grid-uid').html(_.template(tpl)(data));

    // 更改状态，方便进行初始化
    cachePageStatus.feeds.uid = 1;
    cachePageStatus.card.uid = 1;
    cachePageStatus.grid.uid = 1;
});

// 获取 APP 分类
requester.get('/tree/listAppClassify.do').then(data => {
    let nav = {}; // { id: name }
    let subNav = {}; // { id: { subId: subName } }

    // 分离出一级和二级数据
    for (let item of data.data.records) {
        nav[item.id] = item.name;

        if (item.childs.length > 0) {
            subNav[item.id] = {};

            for (let _item of item.childs) {
                subNav[item.id][_item.id] = _item.name;
            }
        }
    }
    
    // 渲染模板
    let tpl = $('#select-tpl').html();
    $('#android-app-type').html(_.template(tpl)({
        data: nav
    }));
    $('#android-app-sub-type').html(_.template(tpl)({
        data: subNav[Object.keys(nav)[0]]
    }));

    // 监听分类变动
    $('#android-app-type').off('change').on('change', e => {
        let val = $(e.currentTarget).val();
        $('#android-app-sub-type').html(_.template(tpl)({
            data: subNav[val]
        }));
    });

    cachePageStatus.grid.type = nav;
    cachePageStatus.grid.subType = subNav;

});

// 获取 weibo feed 广告位
requester.get('/deal/listAdPlacements.do', {
    platformId: getCacheData().platformId,
    type: 1
}).then(data => {

    // 构造广告位数据
    let adPlaceData = [];
    _.each(data.data.records, item => {
        adPlaceData.push({
            id: item.adPlacementId,
            val: item.name
        });
    });

    // 渲染广告位
    let adPlaceTpl = $('#checkbox-tpl').html();
    $('#weibo-feed-place').html(_.template(adPlaceTpl)({
        name: 'weibo-feedPlace',
        data: adPlaceData
    }));

    // 构造渲染费用数据
    let costRefData = [];
    _.each(data.data.records, item => {

        // 由于竞价底价是在竞价规格里面的，所以需要用正则表达式匹配抽离出竞价底价
        let basePrice = item.restrict.replace(/\s/g, '')
            .slice(item.restrict.replace(/\s/g, '')
            .indexOf('竞价底价') + 5);

        costRefData.push({
            basePrice: basePrice, // 竞价底价
            avgShow: item.avgShow === null ? '-' : item.avgShow, // 日均曝光量
            avgCPC: item.avgCPC === null ? '-' : item.avgCPC, // 平均花费/CPC
            avgCPM: item.avgCPM === null ? '-' : item.avgCPM, // 平均花费/CPM
            avgCPE: item.avgCPE === null ? '-' : item.avgCPE // 平均花费/CPE
        });
    });

    // 渲染费用参考
    let costRefTpl = $('#cost-ref-tpl').html();
    $('.weibo-feed-cost-ref').html(_.template(costRefTpl)({
        data: costRefData
    }));

    // 初始化 iCheck
    $('.w-form [type="radio"]').iCheck({
        checkboxClass: 'icheckbox_flat-blue',
        radioClass: 'iradio_flat-blue'
    });
});

// 获取 weibo banner 广告位
requester.get('/deal/listAdPlacements.do', {
    platformId: getCacheData().platformId,
    type: 2
}).then(data => {

    // 构造广告位数据
    let adPlaceData = [];
    _.each(data.data.records, item => {
        adPlaceData.push({
            id: item.adPlacementId,
            val: item.name
        });
    });

    // 渲染广告位
    let adPlaceTpl = $('#checkbox-tpl').html();
    $('#weibo-banner-ad-place').html(_.template(adPlaceTpl)({
        name: 'weibo-bannerPlace',
        data: adPlaceData
    }));

    // 构造渲染费用数据
    let costRefData = [];
    _.each(data.data.records, item => {

        // 由于竞价底价是在竞价规格里面的，所以需要用正则表达式匹配抽离出竞价底价
        let basePrice = item.restrict.replace(/\s/g, '')
            .slice(item.restrict.replace(/\s/g, '')
            .indexOf('竞价底价') + 5);

        costRefData.push({
            basePrice: basePrice, // 竞价底价
            avgShow: item.avgShow === null ? '-' : item.avgShow, // 日均曝光量
            avgCPC: item.avgCPC === null ? '-' : item.avgCPC, // 平均花费/CPC
            avgCPM: item.avgCPM === null ? '-' : item.avgCPM, // 平均花费/CPM
            avgCPE: item.avgCPE === null ? '-' : item.avgCPE // 平均花费/CPE
        });
    });

    // 渲染费用参考
    let costRefTpl = $('#cost-ref-tpl').html();
    $('#weibo-banner-cost-ref').html(_.template(costRefTpl)({
        data: costRefData
    }));

    // 初始化 iCheck
    $('.w-form [type="radio"]').iCheck({
        checkboxClass: 'icheckbox_flat-blue',
        radioClass: 'iradio_flat-blue'
    });
});

// 输入框聚焦隐藏错误
$('[data-type="input"] input, [data-type="textarea"] textarea').focus((e) => {
    let $parent = $(e.currentTarget).parents('.w-row').removeClass('w-error');
});

// 选择广告形式（select 框）
$('#select-ad-type select').change(e => {
    let $self = $(e.currentTarget);
    
    // 删除所有激活状态
    $('.weibo-feed, .weibo-banner, .weibo-card, .weibo-grid').removeClass('active');

    // 激活当前状态
    $($self.val()).addClass('active');

    // 切换广告形式时去除错误信息
    $('.w-row').removeClass('w-error');

    // 隐藏所有预览图
    $('.promotion-preview > div').hide();

    // 切换广告形式
    switch ($self.val()) {
        case '#weibo-feed':
            
            // 如果当前是编辑博文，则显示预览图
            if (getICheckStatus('#weibo-feed-type') === '2') {
                let picUrls = [];

                $('#weibo-feed-upload .multi-upload-item.upload').each((index, el) => {
                    picUrls.push($(el).attr('data-url'));
                });

                if (picUrls.length < 1) {
                    picUrls = [ // 默认图片
                        '/#proj_name#/img/none.png',
                        '/#proj_name#/img/none.png',
                        '/#proj_name#/img/none.png',
                        '/#proj_name#/img/none.png',
                        '/#proj_name#/img/none.png',
                        '/#proj_name#/img/none.png',
                        '/#proj_name#/img/none.png',
                        '/#proj_name#/img/none.png',
                        '/#proj_name#/img/none.png'
                    ]
                }

                renderWeiboPreview(1, false, {
                    data: {
                        ad: {
                            text: $('#weibo-feed-text').val() === '' ? '请输入博文内容' : $('#weibo-feed-text').val(),
                            picUrls: picUrls
                        }
                    }
                });

                $('.promotion-preview > div').show();
            }

            break;
        case '#weibo-banner':
            
            // 显示微博预览
            renderWeiboPreview(2, false, {
                data: {
                    ad: {
                        landingpageUrl: $('#weibo-banner-landing').val(),
                        picUrl: $('#weibo-banner-upload .single-upload-item.upload').attr('data-url')
                    }
                }
            });
            
            $('.promotion-preview > div').show();

            break;
        case '#weibo-card':
            let ad = {
                cardButtonType: '',
                cardButtonUrl: '',
                cardDesc: $('#card-content').val(),
                cardTitle: $('#card-title').val(),
                cardType: getICheckStatus('#weibo-card-type'),
                landingpageUrl: '',
                picUrl: '',
                text: '',
                videoPath: '',
            }

            switch (ad.cardType) {
                
                // 活动
                case '1':
                    ad.cardButtonType = getICheckStatus('#activity-btn');
                    ad.cardButtonUrl = $('#activity-card-btn-link').val();
                    ad.landingpageUrl = $('#activity-card-link').val();
                    ad.picUrl = $('#weibo-card-banner-upload .single-upload-item.upload').attr('data-url');
                    ad.text = $('#activity-blog-ctn').val();
                    break;
                
                // 视频
                case '2':
                    ad.landingpageUrl = $('#video-card-link').val();
                    ad.picUrl = $('#weibo-card-video-upload .single-upload-item.upload').attr('data-url');
                    ad.text = $('#video-blog-ctn').val();
                    break;
                
                // 视频活动
                case '3':
                    ad.cardButtonType = getICheckStatus('#activity-video-btn');
                    ad.cardButtonUrl = $('#activity-video-card-btn-link').val();
                    ad.landingpageUrl = $('#activity-video-card-link').val();
                    ad.picUrl = $('#weibo-card-actvideo-upload .single-upload-item.upload').attr('data-url');
                    ad.text = $('#activity-video-blog-ctn').val();
                    break;
                
                default:
                    break;
            }

            // 显示微博预览
            renderWeiboPreview(3, false, {
                data: {
                    ad: ad
                }
            });
            $('.promotion-preview > div').show();
            break;
        case '#weibo-grid':
            let gridAd = {
                text: '',
                picUrls: []
            };
            
            // 上传图片的数量
            let uploadNum = Number($('#weibo-grid-select-upload').val());
            
            $('#weibo-grid-upload .multi-upload-item.upload').each((index, el) => {
                gridAd.picUrls.push($(el).attr('data-url'));
            });

            // 如果当前没有图片，则使用默认图片
            if (gridAd.picUrls.length < 1) {
                switch (uploadNum) {
                    case 4:
                        gridAd.picUrls = [
                            '/#proj_name#/img/none.png',
                            '/#proj_name#/img/none.png',
                            '/#proj_name#/img/none.png',
                            '/#proj_name#/img/none.png'
                        ];
                        break;
                    case 6:
                        gridAd.picUrls = [
                            '/#proj_name#/img/none.png',
                            '/#proj_name#/img/none.png',
                            '/#proj_name#/img/none.png',
                            '/#proj_name#/img/none.png',
                            '/#proj_name#/img/none.png',
                            '/#proj_name#/img/none.png'
                        ];
                        break;
                    default:
                        gridAd.picUrls = [
                            '/#proj_name#/img/none.png',
                            '/#proj_name#/img/none.png',
                            '/#proj_name#/img/none.png',
                            '/#proj_name#/img/none.png',
                            '/#proj_name#/img/none.png',
                            '/#proj_name#/img/none.png',
                            '/#proj_name#/img/none.png',
                            '/#proj_name#/img/none.png',
                            '/#proj_name#/img/none.png'
                        ];
                        break;
                }
            }

            renderWeiboPreview(4, false, {
                data: {
                    ad: gridAd
                }
            });
            $('.promotion-preview > div').show();
            break;
    }
});

// 微博 feed 广告切换类型：博文链接推广还是编辑博文
$('body').on('ifChecked', '#weibo-feed-type [type="radio"]', e => {
    let $self = $(e.currentTarget);
    let value = $self.val();

    // 先隐藏链接和博文
    $('#weibo-feed-link').hide();
    $('#weibo-feed-article').hide();
    
    // 隐藏所有预览图
    $('.promotion-preview > div').hide();

    // 显示博文链接推广
    if (value === '1') {
        $('#weibo-feed-link').show();
        

    // 显示编辑博文
    } else {
        $('#weibo-feed-article').show();

        let picUrls = [];

        $('#weibo-feed-upload .multi-upload-item.upload').each((index, el) => {
            picUrls.push($(el).attr('data-url'));
        });

        if (picUrls.length < 1) {
            picUrls = [ // 默认图片
                '/#proj_name#/img/none.png',
                '/#proj_name#/img/none.png',
                '/#proj_name#/img/none.png',
                '/#proj_name#/img/none.png',
                '/#proj_name#/img/none.png',
                '/#proj_name#/img/none.png',
                '/#proj_name#/img/none.png',
                '/#proj_name#/img/none.png',
                '/#proj_name#/img/none.png'
            ]
        }

        renderWeiboPreview(1, false, {
            data: {
                ad: {
                    text: $('#weibo-feed-text').val() === '' ? '请输入博文内容' : $('#weibo-feed-text').val(),
                    picUrls:  picUrls
                }
            }
        });

        $('.promotion-preview > div').show();
    }

});

// 品速 Card 广告切换类型：活动，视频还是视频活动
$('body').on('ifChecked', '#weibo-card-type [type="radio"]', e => {
    let $self = $(e.currentTarget);
    let value = $self.val();

    // 先隐藏活动，视频和视频活动的主要内容区域
    $('#weibo-card-activity').hide();
    $('#weibo-card-video').hide();
    $('#weibo-card-video-activity').hide();

    let ad = {
        cardButtonType: '',
        cardButtonUrl: '',
        cardDesc: $('#card-content').val(),
        cardTitle: $('#card-title').val(),
        cardType: value,
        landingpageUrl: '',
        picUrl: '',
        text: '',
        videoPath: '',
    }

    switch (value) {
        
        // 活动
        case '1':
            ad.cardButtonType = getICheckStatus('#activity-btn');
            ad.cardButtonUrl = $('#activity-card-btn-link').val();
            ad.landingpageUrl = $('#activity-card-link').val();
            ad.picUrl = $('#weibo-card-banner-upload .single-upload-item.upload').attr('data-url');
            ad.text = $('#activity-blog-ctn').val();
            break;
        
        // 视频
        case '2':
            ad.landingpageUrl = $('#video-card-link').val();
            ad.picUrl = $('#weibo-card-video-upload .single-upload-item.upload').attr('data-url');
            ad.text = $('#video-blog-ctn').val();
            break;
        
        // 视频活动
        case '3':
            ad.cardButtonType = getICheckStatus('#activity-video-btn');
            ad.cardButtonUrl = $('#activity-video-card-btn-link').val();
            ad.landingpageUrl = $('#activity-video-card-link').val();
            ad.picUrl = $('#weibo-card-actvideo-upload .single-upload-item.upload').attr('data-url');
            ad.text = $('#activity-video-blog-ctn').val();
            break;
        
        default:
            break;
    }

    // 显示微博预览
    renderWeiboPreview(3, false, {
        data: {
            ad: ad
        }
    });

    switch (value) {

        // 活动
        case '1':
            $('#weibo-card-activity').show();
            break;

        // 视频
        case '2':
            $('#weibo-card-video').show();
            break;

        // 视频活动
        default:
            $('#weibo-card-video-activity').show();
    }
});

// 九宫格切换安卓和 ios
$('#weibo-grid-app').change(e => {
    let $self = $(e.currentTarget);

    // 隐藏安卓和 ios
    $('.weibo-grid-android').hide();
    $('.weibo-grid-ios').hide();

    // ios
    if ($self.val() === '0') {
        $('.weibo-grid-android').show();

    // 安卓
    } else {
        $('.weibo-grid-ios').show();
    }
});

// 九宫格中切换上传图片张数
$('#weibo-grid-select-upload').change(e => {
    cachePageStatus.grid.uploadSize = Number($(e.currentTarget).val());

    // 当切换图片时，清空已经上传的图片
    let tpl = $('#multi-upload-select-item-tpl').html();
    $('#weibo-grid-upload').html(tpl);

    // 将张数绑定到元素上
    $('#weibo-grid-upload')
        .attr('data-maxedge', $(e.currentTarget).val())
        .attr('data-minedge', 0)
});

// 九宫格上传完的图片可拖拽
Sortable.create($('#weibo-grid-upload')[0], {
    handle: '.upload-wrap',
    animation: 150,

    // 拖拽完成后执行的操作
    onEnd() {
        let imgs = [];
        let imgNum = Number($('#weibo-grid-select-upload').val());
        let imgWidth = imgNum === 4 ? '50%' : '33.3333333%';

        $('#weibo-grid-upload .multi-upload-item.upload').each((index, el) => {
            imgs.push($(el).attr('data-url'));
        });

        for (let i = 0; i < imgs.length; i++) {
            if (i === 0) {
                $('#preview-grid-pics').html(`<li style="width: ${imgWidth}"><img src="${imgs[i]}"></li>`);
            } else {
                $('#preview-grid-pics').append(`<li style="width: ${imgWidth}"><img src="${imgs[i]}"></li>`);
            }
        }
    }
});

// 监听必要文本框实现实时预览
// -----------------------------------------------------------------------------
// 微博 feed
// 编辑博文
$('#weibo-feed').on('keyup', '#weibo-feed-text', e => {
    $('#preview-feed-ctn').html($(e.currentTarget).val());
});

// 微博 banner
// 网页链接
$('#weibo-banner').on('keyup', '#weibo-banner-landing', e => {
    $('#preview-banner-link').attr('href', $(e.currentTarget).val());
});

// 品速 card
// card 标题
$('#weibo-card').on('keyup', '#card-title', e => {
    $('#preview-card-title').html($(e.currentTarget).val());
});

// card 内容
$('#weibo-card').on('keyup', '#card-content', e => {
    $('#preview-card-ctn').html($(e.currentTarget).val());
});

// 活动类型下 card 切换按钮
$('body').on('ifChecked', '#activity-btn [type="radio"]', e => {
    let value = $(e.currentTarget).val();
    
    // 隐藏所有按钮
    $('.card-btn').hide();

    switch (value) {
        case 'none':

            break;
        case 'join':
            $('#preview-card-btn-join').show();
            break;
        case 'buy':
            $('#preview-card-btn-buy').show();
            break;
        case 'download':
            $('#preview-card-btn-download').show();
            break;
    
        default:
            break;
    }
});

// 活动类型下按钮链接
$('#weibo-card').on('keyup', '#activity-card-btn-link', e => {
    $('.card-btn').attr('href', $(e.currentTarget).val());
});

// 活动类型下card链接
$('#weibo-card').on('keyup', '#activity-card-link', e => {
    $('#preview-card-link').attr('href', $(e.currentTarget).val());
});

// 活动类型下推广博文
$('#weibo-card').on('keyup', '#activity-blog-ctn', e => {
    $('#preview-card-blog-ctn').html($(e.currentTarget).val());
});

// 视频类型下card链接
$('#weibo-card').on('keyup', '#video-card-link', e => {
    $('#preview-card-link').attr('href', $(e.currentTarget).val());
});

// 视频类型下的推广博文
$('#weibo-card').on('keyup', '#video-blog-ctn', e => {
    $('#preview-card-blog-ctn').html($(e.currentTarget).val());
});

// 活动视频类型下 card 切换按钮
$('body').on('ifChecked', '#activity-video-btn [type="radio"]', e => {
    let value = $(e.currentTarget).val();
    
    // 隐藏所有按钮
    $('.card-btn').hide();

    switch (value) {
        case 'none':

            break;
        case 'join':
            $('#preview-card-btn-join').show();
            break;
        case 'buy':
            $('#preview-card-btn-buy').show();
            break;
        case 'download':
            $('#preview-card-btn-download').show();
            break;
    
        default:
            break;
    }
});

// 活动视频类型下按钮链接
$('#weibo-card').on('keyup', '#activity-video-card-btn-link', e => {
    $('.card-btn').attr('href', $(e.currentTarget).val());
});

// 活动视频类型下card链接
$('#weibo-card').on('keyup', '#activity-video-card-link', e => {
    $('#preview-card-link').attr('href', $(e.currentTarget).val());
});

// 活动视频类型下推广博文
$('#weibo-card').on('keyup', '#activity-video-blog-ctn', e => {
    $('#preview-card-blog-ctn').html($(e.currentTarget).val());
});

// 九宫格
// 微博正文
$('#weibo-grid').on('keyup', '#weibo-grid-content', e => {
    $('#preview-grid-ctn').html($(e.currentTarget).val());
});

// 微博 Feeds 相关操作
// -----------------------------------------------------------------------------

// 提交博文链接推广数据
$('#weibo-feed-link-submit').click(e => {
    let adPlacementId = getICheckStatus('#weibo-feed-place');
    let uid = $('#weibo-feed-uid').val();
    let mid = $('#weibo-feed-mid').val();

    let $midWrap = $('#weibo-feed-mid').parents('.w-row');

    // 数据校验
    if (
        mid === '' ||
        !checkUrl(mid)
    ) {
        $midWrap.addClass('w-error');
        return;
    }

    // 缓存数据
    setCacheData({
        type: 11,
        data: {
            adPlacementId: adPlacementId,
            ad: {
                uid: uid,
                mid: mid
            }
        }
    });

    // 跳转到下一步骤
    jump2NextStep();
});

// 提交编辑博文数据
$('#weibo-feed-article-submit').click(e => {
    let adPlacementId = getICheckStatus('#weibo-feed-place');
    let uid = $('#weibo-feed-uid').val();
    let text = $('#weibo-feed-text').val();
    let $textWrap = $('#weibo-feed-text').parents('.w-row');
    let picUrls = [];

    // 获取所有图片
    $('#weibo-feed-upload .multi-upload-item.upload').each((index, el) => {
        let url = $(el).attr('data-url');
        picUrls.push(url);
    });

    // 数据校验
    // 博文校验
    if (
        text.length < 1 ||
        text.length > 140
    ) {
        $textWrap.addClass('w-error');
        return;
    }

    // 取消图片校验
    // // 图片校验
    // if (picUrls.length < 1) {
    //     modaler.tip('图片最少上传一张');
    //     return;
    // }

    // 缓存数据
    setCacheData({
        type: 12,
        data: {
            adPlacementId: adPlacementId,
            ad: {
                picUrls: picUrls,
                uid: uid,
                text: text
            }
        }
    });

    // 跳转到下一步骤
    jump2NextStep();
});

// 微博 Banner 相关操作
// -----------------------------------------------------------------------------
$('#weibo-banner-submit').click(e => {
    let adPlacementId = getICheckStatus('#weibo-banner-ad-place');
    let landingpageUrl = $('#weibo-banner-landing').val();
    let $landingpageUrlWrap = $('#weibo-banner-landing').parents('.w-row');
    let picUrl = $('#weibo-banner-upload > div.upload').attr('data-url');

    // 数据校验
    // 页面链接
    if (landingpageUrl === '') {
        $landingpageUrlWrap.addClass('w-error');
        return;
    }

    // 推广图片
    if (
        picUrl === undefined ||
        picUrl === ''
    ) {
        modaler.tip('请上传推广图片')
        return;
    }

    // 缓存数据
    setCacheData({
        type: 2,
        data: {
            adPlacementId: adPlacementId,
            ad: {
                picUrl: picUrl,
                landingpageUrl: landingpageUrl
            }
        }
    });

    // 跳转到下一步骤
    jump2NextStep();
});

// 品速 Card 相关操作
// -----------------------------------------------------------------------------

// 提交活动数据
$('#weibo-card-activity-submit').click(e => {
    let uid = $('#weibo-card-uid').val();
    let cardTitle = $('#card-title').val();
    let $cardTitleWrap = $('#card-title').parents('.w-row');
    let cardDesc = $('#card-content').val();
    let $cardDescWrap = $('#card-content').parents('.w-row');
    let cardButtonType = getICheckStatus('#activity-btn');
    let cardButtonUrl = $('#activity-card-btn-link').val();
    let $cardButtonUrlWrap = $('#activity-card-btn-link').parents('.w-row');
    let landingpageUrl = $('#activity-card-link').val();
    let $landingpageUrlWrap = $('#activity-card-link').parents('.w-row');
    let picUrl = $('#weibo-card-banner-upload > div.upload').attr('data-url');
    let text = $('#activity-blog-ctn').val();
    let $textWrap = $('#activity-blog-ctn').parents('.w-row');

    // 品牌 Card 标题
    if (cardTitle === '') {
        $cardTitleWrap.addClass('w-error');
        return;
    }

    // 品牌 Card 内容
    if (cardDesc === '') {
        $cardDescWrap.addClass('w-error');
        return;
    }

    // Card 按钮链接
    if (
        cardButtonUrl === '' ||
        !checkUrl(cardButtonUrl)
    ) {
        $cardButtonUrlWrap.addClass('w-error');
        return;
    }

    // Card 链接
    if (
        landingpageUrl === '' ||
        !checkUrl(landingpageUrl)
    ) {
        $landingpageUrlWrap.addClass('w-error');
        return;
    }

    // 图片链接
    if (
        picUrl === undefined ||
        picUrl === ''
    ) {
        modaler.tip('图片最少上传一张');
        return;
    }

    // 推广博文
    if (
        text === '' ||
        text.length > 130
    ) {
        $textWrap.addClass('w-error');
        return;
    }

    // 缓存数据
    setCacheData({
        type: 31,
        data: {
            adPlacementId: '',
            ad: {
                uid: uid,
                cardType: 1,
                cardTitle: cardTitle,
                cardDesc: cardDesc,
                cardButtonType: cardButtonType,
                cardButtonUrl: cardButtonUrl,
                landingpageUrl: landingpageUrl,
                picUrl: picUrl,
                videoPath: '',
                text: text
            }
        }
    });

    // 跳转到下一步骤
    jump2NextStep();
});

// 提交视频数据
$('#weibo-card-video-submit').click(e => {
    let uid = $('#weibo-card-uid').val();
    let cardTitle = $('#card-title').val();
    let $cardTitleWrap = $('#card-title').parents('.w-row');
    let cardDesc = $('#card-content').val();
    let $cardDescWrap = $('#card-content').parents('.w-row');
    let landingpageUrl = $('#video-card-link').val();
    let $landingpageUrlWrap = $('#video-card-link').parents('.w-row');
    let picUrl = $('#weibo-card-video-upload > div.upload').attr('data-url');
    let videoPath = $('#video-upload').attr('data-url');
    let text = $('#video-blog-ctn').val();
    let $textWrap = $('#video-blog-ctn').parents('.w-row');

    // 品牌 Card 标题
    if (cardTitle === '') {
        $cardTitleWrap.addClass('w-error');
        return;
    }

    // 品牌 Card 内容
    if (cardDesc === '') {
        $cardDescWrap.addClass('w-error');
        return;
    }
    
    // Card 链接
    if (
        landingpageUrl === '' ||
        !checkUrl(landingpageUrl)
    ) {
        $landingpageUrlWrap.addClass('w-error');
        return;
    }

    // 图片链接
    if (
        picUrl === undefined ||
        picUrl === ''
    ) {
        modaler.tip('图片最少上传一张');
        return;
    }

    // 上传视频
    if (
        videoPath === undefined ||
        videoPath === ''
    ) {
        modaler.tip('请上传视频');
        return;
    }

    // 推广博文
    if (
        text === '' ||
        text.length > 130
    ) {
        $textWrap.addClass('w-error');
        return;
    }

    // 缓存数据
    setCacheData({
        type: 32,
        data: {
            adPlacementId: '',
            ad: {
                uid: uid,
                cardType: 1,
                cardTitle: cardTitle,
                cardDesc: cardDesc,
                landingpageUrl: landingpageUrl,
                picUrl: picUrl,
                videoPath: videoPath,
                text: text
            }
        }
    });

    // 跳转到下一步骤
    jump2NextStep();
});

// 提交活动视频数据
$('#weibo-card-actvideo-submit').click(e => {
    let uid = $('#weibo-card-uid').val();
    let cardTitle = $('#card-title').val();
    let $cardTitleWrap = $('#card-title').parents('.w-row');
    let cardDesc = $('#card-content').val();
    let $cardDescWrap = $('#card-content').parents('.w-row');
    let cardButtonType = getICheckStatus('#activity-video-btn');
    let cardButtonUrl = $('#activity-video-card-btn-link').val();
    let $cardButtonUrlWrap = $('#activity-video-card-btn-link').parents('.w-row');
    let landingpageUrl = $('#activity-video-card-link').val();
    let $landingpageUrlWrap = $('#activity-video-card-link').parents('.w-row');
    let picUrl = $('#weibo-card-actvideo-upload > div.upload').attr('data-url');
    let videoPath = $('#activity-video-upload').attr('data-url');
    let text = $('#activity-video-blog-ctn').val();
    let $textWrap = $('#activity-video-blog-ctn').parents('.w-row');

    // 品牌 Card 标题
    if (cardTitle === '') {
        $cardTitleWrap.addClass('w-error');
        return;
    }

    // 品牌 Card 内容
    if (cardDesc === '') {
        $cardDescWrap.addClass('w-error');
        return;
    }

    // Card 按钮链接
    if (
        cardButtonUrl === '' ||
        !checkUrl(cardButtonUrl)
    ) {
        $cardButtonUrlWrap.addClass('w-error');
        return;
    }

    // Card 链接
    if (
        landingpageUrl === '' ||
        !checkUrl(landingpageUrl)
    ) {
        $landingpageUrlWrap.addClass('w-error');
        return;
    }

    // 图片链接
    if (
        picUrl === undefined ||
        picUrl === ''
    ) {
        modaler.tip('图片最少上传一张');
        return;
    }

    // 上传视频
    if (
        videoPath === undefined ||
        videoPath === ''
    ) {
        modaler.tip('请上传视频');
        return;
    }

    // 推广博文
    if (
        text === '' ||
        text.length > 130
    ) {
        $textWrap.addClass('w-error');
        return;
    }

    // 缓存数据
    setCacheData({
        type: 33,
        data: {
            adPlacementId: '',
            ad: {
                uid: uid,
                cardType: 1,
                cardTitle: cardTitle,
                cardDesc: cardDesc,
                cardButtonType: cardButtonType,
                cardButtonUrl: cardButtonUrl,
                landingpageUrl: landingpageUrl,
                picUrl: picUrl,
                videoPath: videoPath,
                text: text
            }
        }
    });

    // 跳转到下一步骤
    jump2NextStep();
});

// 九宫格相关操作
// -----------------------------------------------------------------------------

// 提交安卓数据
$('#weibo-grid-android-submit').click(e => {
    let uid = $('#weibo-grid-uid').val();
    let text = $('#weibo-grid-content').val();
    let $textWrap = $('#weibo-grid-content').parents('.w-row');
    let picUrls = [];

    // 获取所有图片
    $('#weibo-grid-upload .multi-upload-item.upload').each((index, el) => {
        let url = $(el).attr('data-url');
        picUrls.push(url);
    });

    let cardButtonType = $('#weibo-grid-tag').val();
    let appType = 0;
    let appUrl = $('#android-download-link').val();
    let $appUrlWrap = $('#android-download-link').parents('.w-row');
    let appName = $('#android-download-name').val();
    let $appNameWrap = $('#android-download-name').parents('.w-row');
    let appClassify = $('#android-app-sub-type').val();
    let appDeveloper = $('#android-develop').val();
    let $appDeveloperWrap = $('#android-develop').parents('.w-row');
    let appDesc = $('#android-description').val();
    let $appDescWrap = $('#android-description').parents('.w-row');
    let appIcon = $('#weibo-grid-app-upload > div').attr('data-url');
    let appImages = [];

    // 获取应用截图
    $('#weibo-grid-screenshot-upload .multi-upload-item.upload').each((index, el) => {
        let url = $(el).attr('data-url');
        appImages.push(url);
    });
    
    // 数据校验
    // 博文校验
    if (
        text.length < 10 ||
        text.length > 30
    ) {
        $textWrap.addClass('w-error');
        return;
    }

    // 图片校验
    if (picUrls.length !== Number($('#weibo-grid-select-upload').val())) {
        modaler.tip('请上传指定数量的图片');
        return;
    }
    
    // 下载链接校验
    if (appUrl === '') {
        $appUrlWrap.addClass('w-error');
        return;
    }

    // 应用名称校验
    if (appName === '') {
        $appNameWrap.addClass('w-error');
        return;
    }

    // 开发者校验
    if (appDeveloper === '') {
        $appDeveloperWrap.addClass('w-error');
        return;
    }

    // 应用描述校验
    if (appDesc === '') {
        $appDescWrap.addClass('w-error');
        return;
    }

    // 应用图标
    if (!appIcon || appIcon === '') {
        modaler.tip('请上传应用图标');
        return;
    }

    // 应用截图
    if (appImages.length < 1) {
        modaler.tip('请上传应用截图');
        return;
    }
    
    // 缓存数据
    setCacheData({
        type: 41,
        data: {
            adPlacementId: '',
            ad: {
                uid: uid,
                text: text,
                picUrls: picUrls,
                cardButtonType: cardButtonType,
                appType: appType,
                appUrl: appUrl,
                appName: appName,
                appClassify: appClassify,
                appDeveloper: appDeveloper,
                appDesc: appDesc,
                appIcon: appIcon,
                appImages: appImages
            }
        }
    });
    
    // 跳转到下一步骤
    jump2NextStep();
});

// 提交 ios 数据
$('#weibo-grid-ios-submit').click(e => {
    let uid = $('#weibo-grid-uid').val();
    let text = $('#weibo-grid-content').val();
    let $textWrap = $('#weibo-grid-content').parents('.w-row');
    let picUrls = [];

    // 获取所有图片
    $('#weibo-grid-upload .multi-upload-item.upload').each((index, el) => {
        let url = $(el).attr('data-url');
        picUrls.push(url);
    });

    let cardButtonType = $('#weibo-grid-tag').val();
    let appType = 1;
    let appUrl = $('#ios-download-link').val();
    let $appUrlWrap = $('#ios-download-link').parents('.w-row');

    // 数据校验
    // 博文校验
    if (
        text.length < 10 ||
        text.length > 30
    ) {
        $textWrap.addClass('w-error');
        return;
    }

    // 图片校验
    if (picUrls.length !== Number($('#weibo-grid-select-upload').val())) {
        modaler.tip('请按照指定数量上传图片');
        return;
    }

    // 下载链接校验
    if (appUrl === '') {
        $appUrlWrap.addClass('w-error');
        return;
    }

    // 缓存数据
    setCacheData({
        type: 42,
        data: {
            adPlacementId: '',
            ad: {
                uid: uid,
                text: text,
                picUrls: picUrls,
                cardButtonType: cardButtonType,
                appType: appType,
                appUrl: appUrl
            }
        }
    });
    
    // 跳转到下一步骤
    jump2NextStep();
});

/**
 * （暂时不用，废弃）
 * 重置界面中的内容
 * @param {Number} sign - 标识应该重置哪些地方的内容
 */
function resetContent(sign) {
    switch (sign) {

        // 重置微博 feed
        case 1:

            // uid
            $('#weibo-feed-uid').val($('#weibo-feed-uid > option').attr('value'));

            // 默认选择博文链接推广
            $('#weibo-feed-type [value="1"]').iCheck('check');

            // 博文链接推广下内容
            $('#weibo-feed-mid').val('');

            // 编辑博文下内容
            $('#weibo-feed-text').val('');
            $('#weibo-feed-upload').html($('#multi-upload-item-tpl').html());
            break;
        
        // 重置博文推广链接
        case 11:
            $('#weibo-feed-mid').val('');
            break;

        // 重置编辑博文
        case 12:
            $('#weibo-feed-text').val('');
            $('#weibo-feed-upload').html($('#multi-upload-item-tpl').html());
            break;
        
        // 重置微博 banner
        case 2:
            $('#weibo-banner-landing').val('');
            $('#weibo-banner-upload > div')
                .removeClass('upload')
                .addClass('add')
                .attr('data-url', '');
            $('#weibo-banner-upload img').attr('src', '');
            break;
        
        // 重置品速 card
        case 3:
            
            // 重置 weibo uid
            $('#weibo-card-uid').val($('#weibo-card-uid> option').attr('value'));
            
            // 重置品牌 Card 标题
            $('#card-title').val('');

            // 重置品牌 Card 内容
            $('#card-content').val('');

            // 重置品牌 Card 类型为活动
            $('#weibo-card-type [value="1"]').iCheck('check');

            // 重置活动类型下的内容
            $('#activity-btn [value="none"]').iCheck('check');
            $('#activity-card-btn-link').val('');
            $('#activity-card-link').val('');
            $('#weibo-card-banner-upload > div')
                .removeClass('upload')
                .addClass('add')
                .attr('data-url', '');
            $('#weibo-card-banner-upload img').attr('src', '');
            $('#activity-blog-ctn').val('');

            // 重置视频类型下的内容
            $('#video-card-link').val('');
            $('#weibo-card-video-upload > div')
                .removeClass('upload')
                .addClass('add')
                .attr('data-url', '');
            $('#weibo-card-video-upload img').attr('src', '');
            $('#video-upload').val('');
            $('#video-blog-ctn').val('');

            // 重置视频活动类型下的内容
            $('#activity-btn [value="none"]').iCheck('check');
            $('#activity-video-btn [value="none"]').iCheck('check');
            $('#activity-video-card-btn-link').val('');
            $('#activity-video-card-link').val('');
            $('#weibo-card-actvideo-upload > div')
                .removeClass('upload')
                .addClass('add')
                .attr('data-url', '');
            $('#weibo-card-actvideo-upload img').attr('src', '');
            $('#activity-video-upload').val('');
            $('#activity-video-blog-ctn').val('');
            
            break;
        
        // 重置活动
        case 31:
            $('#weibo-card-type [value="1"]').iCheck('check');
            $('#activity-btn [value="none"]').iCheck('check');
            $('#activity-card-btn-link').val('');
            $('#activity-card-link').val('');
            $('#weibo-card-banner-upload > div')
                .removeClass('upload')
                .addClass('add')
                .attr('data-url', '');
            $('#weibo-card-banner-upload img').attr('src', '');
            $('#activity-blog-ctn').val('');
            break;
        
        // 重置视频
        case 32:
            $('#video-card-link').val('');
            $('#weibo-card-video-upload > div')
                .removeClass('upload')
                .addClass('add')
                .attr('data-url', '');
            $('#weibo-card-video-upload img').attr('src', '');
            $('#video-upload').val('');
            $('#video-blog-ctn').val('');
            break;
        
        // 重置视频活动
        case 33:
            $('#activity-btn [value="none"]').iCheck('check');
            $('#activity-video-btn [value="none"]').iCheck('check');
            $('#activity-video-card-btn-link').val('');
            $('#activity-video-card-link').val('');
            $('#weibo-card-actvideo-upload > div')
                .removeClass('upload')
                .addClass('add')
                .attr('data-url', '');
            $('#weibo-card-actvideo-upload img').attr('src', '');
            $('#activity-video-upload').val('');
            $('#activity-video-blog-ctn').val('');
            break;
        
        // 重置九宫格
        case 4:

            // 重置 weibo uid
            $('#weibo-grid-uid').val($('#weibo-grid-uid > option').attr('value'));

            // 重置九宫格微博正文
            $('#weibo-grid-content').val('');

            // 重置上传图片数量
            $('#weibo-grid-select-upload').val($('#weibo-grid-select-upload > option').attr('value'));

            // 重置上传图片
            $('#weibo-grid-upload').html($('#multi-upload-item-tpl').html());

            // 重置标签类型
            $('#weibo-grid-tag').val($('#weibo-grid-tag > option').attr('value'));

            // 重置 APP 类型
            $('#weibo-grid-app').val($('#weibo-grid-app > option').attr('value'));

            break;
        
        // 重置九宫格安卓
        case 41:
            $('#android-download-link').val('');
            $('#android-download-name').val('');

            break;

        // 重置九宫格 IOS
        case 42:
            $('#ios-download-link').val('');
            break;
    }
}

/**
 * 如果之前有缓存数据，则根据之前缓存的数据渲染界面
 * @param {Function} 回调函数
 */
function renderDataFromCache(cb = () => {}) {
    let cacheData = getCacheData();

    // 如果本地没有缓存数据就直接返回
    if (!cacheData.ad) {
        return;
    }

    // 先隐藏不同的广告形式
    $('#weibo-feed, #weibo-banner, #weibo-card, #weibo-grid').removeClass('active');

    switch (cacheData.type) {
        
        // 微博 feeds
        case 1:

            // 切换广告形式
            $('#select-ad-type select').val('#weibo-feed');
            $('#weibo-feed').addClass('active');

            // 当前是博文推广链接
            if (cacheData.subType === 11) {
                
                // 由于当前需要初始化的数据是需要请求服务器数据的，也就是说是异步的数据，
                // 异步数据无法确定数据返回的时间，一般情况下会直接在异步数据返回后直接初始化，
                // 但是因为想要把初始化的代码全部包裹在一个地方，所以这里使用了定时器，当异步数据
                // 返回时会更改某个状态，而定时器则每隔一定时间去获取这个状态，如果这个状态到某个值的时
                // 就清除定时器并执行初始化代码
                let timer = setInterval(() => {
                    if (cachePageStatus.feeds.uid === 1) {
                        $('#weibo-feed-uid').val(cacheData.ad.uid);
                        clearInterval(timer);
                    }
                }, 300);

                // 设置推广链接
                $('#weibo-feed-mid').val(cacheData.ad.mid);

            // 当前是博文
            } else {
                
                // 切换到编辑博文
                // 使用 setTimeout 避免多线程操作界面，界面渲染先后顺序问题
                setTimeout(function() {
                    $('#weibo-feed-type [value="2"]').iCheck('check');

                    // 编辑博文内容
                    $('#weibo-feed-text').val(cacheData.ad.text);

                    // 初始化上传图片
                    let uploadTpl = $('#multi-upload-item-upload-tpl').html();
                    for (let i = 0; i < cacheData.ad.picUrls.length; i++) {

                        // 第一个元素
                        if (i === 0) {
                            $('#weibo-feed-upload').html(_.template(uploadTpl)({
                                url: cacheData.ad.picUrls[i]
                            }));

                        // 非第一个元素
                        } else {
                            $('#weibo-feed-upload').append(_.template(uploadTpl)({
                                url: cacheData.ad.picUrls[i]
                            }));
                        }
                    }

                    // 如果当前的图片小于 9 张，则追加添加图片按钮
                    if (cacheData.ad.picUrls.length < 9 && cacheData.ad.picUrls.length !== 0) {
                        $('#weibo-feed-upload').append($('#multi-upload-item-tpl').html());
                    }

                    // 显示微博预览
                    renderWeiboPreview(1, false, {
                        data: {
                            ad: {
                                text: cacheData.ad.text,
                                picUrls: cacheData.ad.picUrls
                            }
                        }
                    });
                }, 0);
            }

            break;
        
        // banner
        case 2:

            // 切换广告形式
            $('#select-ad-type select').val('#weibo-banner');
            $('#weibo-banner').addClass('active');

            // 网页链接
            $('#weibo-banner-landing').val(cacheData.ad.landingpageUrl);

            // 推广图片
            $('#weibo-banner-upload > div')
                .removeClass('add')
                .addClass('upload')
                .attr('data-url', cacheData.ad.picUrl);
            $('#weibo-banner-upload img').attr('src', cacheData.ad.picUrl);

            // 显示微博预览
            renderWeiboPreview(2, false, {
                data: {
                    ad: {
                        landingpageUrl: cacheData.ad.landingpageUrl,
                        picUrl: cacheData.ad.picUrl
                    }
                }
            });

            break;
        
        // 品速 card
        case 3:

            // 切换广告形式
            $('#select-ad-type select').val('#weibo-card');
            $('#weibo-card').addClass('active');

            // 渲染 uid
            let cardTimer = setInterval(() => {
                if (cachePageStatus.feeds.uid === 1) {
                    $('#weibo-card-uid').val(cacheData.ad.uid);
                    clearInterval(cardTimer);
                }
            }, 300);

            // 渲染 card 品牌
            $('#card-title').val(cacheData.ad.cardTitle);

            // 渲染 card 内容
            $('#card-content').val(cacheData.ad.cardDesc);

            // 活动
            if (cacheData.subType === 31) {
                setTimeout(function() {
                    $('#weibo-card-type [value="1"]').iCheck('check');

                    // 渲染按钮类型
                    $(`#activity-btn [value="${cacheData.ad.cardButtonType}"]`).iCheck('check');

                    // 渲染 card 按钮链接
                    $('#activity-card-btn-link').val(cacheData.ad.cardButtonUrl);

                    // 渲染 card 链接
                    $('#activity-card-link').val(cacheData.ad.landingpageUrl);

                    // 渲染上传图片
                    $('#weibo-card-banner-upload > div')
                        .removeClass('add')
                        .addClass('upload')
                        .attr('data-url', cacheData.ad.picUrl);
                    $('#weibo-card-banner-upload img').attr('src', cacheData.ad.picUrl);

                    // 渲染推广博文
                    $('#activity-blog-ctn').val(cacheData.ad.text);

                    // 显示微博预览
                    renderWeiboPreview(3, false, {
                        data: {
                            ad: cacheData.ad
                        }
                    });
                }, 0);

            // 视频
            } else if (cacheData.subType === 32) {
                setTimeout(function() {
                    $('#weibo-card-type [value="2"]').iCheck('check');

                    // 渲染 card 链接
                    $('#video-card-link').val(cacheData.ad.landingpageUrl);

                    // 渲染上传图片
                    $('#weibo-card-video-upload > div')
                        .removeClass('add')
                        .addClass('upload')
                        .attr('data-url', cacheData.ad.picUrl);
                    $('#weibo-card-video-upload img').attr('src', cacheData.ad.picUrl);

                    // 渲染上传视频
                    $('#video-upload').attr('data-url', cacheData.ad.videoPath);

                    // 渲染推广博文
                    $('#video-blog-ctn').val(cacheData.ad.text);

                    // 显示微博预览
                    renderWeiboPreview(3, false, {
                        data: {
                            ad: cacheData.ad
                        }
                    });
                }, 0);
            
            // 视频活动
            } else {
                setTimeout(function() {
                    $('#weibo-card-type [value="3"]').iCheck('check');

                    // 渲染按钮类型
                    $(`#activity-video-btn [value="${cacheData.ad.cardButtonType}"]`).iCheck('check');

                    // 渲染 card 按钮链接
                    $('#activity-video-card-btn-link').val(cacheData.ad.cardButtonUrl);

                    // 渲染 card 链接
                    $('#activity-video-card-link').val(cacheData.ad.landingpageUrl);

                    // 渲染上传图片
                    $('#weibo-card-actvideo-upload > div')
                        .removeClass('add')
                        .addClass('upload')
                        .attr('data-url', cacheData.ad.picUrl);
                    $('#weibo-card-actvideo-upload img').attr('src', cacheData.ad.picUrl);

                    // 渲染上传视频
                    $('#activity-video-upload').attr('data-url', cacheData.ad.videoPath);

                    // 渲染推广博文
                    $('#activity-video-blog-ctn').val(cacheData.ad.text);

                    // 显示微博预览
                    renderWeiboPreview(3, false, {
                        data: {
                            ad: cacheData.ad
                        }
                    });
                }, 0);
            }
        
        // 九宫格
        case 4:

            // 隐藏 IOS 和 安卓填写项
            $('.weibo-grid-android, .weibo-grid-ios').hide();

            // 切换广告形式
            $('#select-ad-type select').val('#weibo-grid');
            $('#weibo-grid').addClass('active');

            // 渲染 uid
            let gridTimer1 = setInterval(() => {
                if (cachePageStatus.grid.uid === 1) {
                    $('#weibo-grid-uid').val(cacheData.ad.uid);
                    clearInterval(gridTimer1);
                }
            }, 300);

            // 微博正文
            $('#weibo-grid-content').val(cacheData.ad.text);

            // 渲染上传图片张数
            $('#weibo-grid-select-upload').val(cacheData.ad.picUrls.length);

            // 渲染上传图片
            let uploadTpl = $('#multi-upload-item-upload-tpl').html();
            for (let i = 0; i < cacheData.ad.picUrls.length; i++) {
                if (i === 0) {
                    $('#weibo-grid-upload').html(_.template(uploadTpl)({
                        url: cacheData.ad.picUrls[i]
                    }));
                } else {
                    $('#weibo-grid-upload').append(_.template(uploadTpl)({
                        url: cacheData.ad.picUrls[i]
                    }));
                }
            }
            $('#weibo-grid-upload')
                .attr('data-minedge', 0)
                .attr('data-maxedge', cacheData.ad.picUrls.length);

            // 渲染标签类型
            $('#weibo-grid-tag').val(cacheData.ad.cardButtonType);

            // 安卓
            if (cacheData.subType === 41) {
                $('.weibo-grid-android').show();
                $('#weibo-grid-app').val('0');

                // 渲染下载链接
                $('#android-download-link').val(cacheData.ad.appUrl);

                // 渲染应用名称
                $('#android-download-name').val(cacheData.ad.appName);

                // 渲染应用分类
                let timer = setInterval(() => {
                    if (cachePageStatus.grid.subType !== null) {
                        for (let item in cachePageStatus.grid.subType) {
                            for (let _item in cachePageStatus.grid.subType[item]) {
                                if (String(_item) === String(cacheData.ad.appClassify)) {
                                    $('#android-app-type').val(item);
                                    
                                    let tpl = $('#select-tpl').html();

                                    $('#android-app-sub-type').html(_.template(tpl)({
                                        data: cachePageStatus.grid.subType[item]
                                    }));

                                    $('#android-app-sub-type').val(cacheData.ad.appClassify);
                                    clearInterval(timer);
                                }
                            }
                        }
                    }
                }, 300);

                // 渲染开发者
                $('#android-develop').val(cacheData.ad.appDeveloper);

                // 渲染应用描述
                $('#android-description').val(cacheData.ad.appDesc);

                // 渲染应用图标
                $('#weibo-grid-app-upload > div')
                    .removeClass('add')
                    .addClass('upload')
                    .attr('data-url', cacheData.ad.appIcon);
                $('#weibo-grid-app-upload img').attr('src', cacheData.ad.appIcon);

                // 渲染应用截图
                let uploadTpl = $('#multi-upload-item-upload-tpl').html();
                for (let i = 0; i < cacheData.ad.appImages.length; i++) {
                    if (i === 0) {
                        $('#weibo-grid-screenshot-upload').html(_.template(uploadTpl)({
                            url: cacheData.ad.appImages[i]
                        }));
                    } else {
                        $('#weibo-grid-screenshot-upload').append(_.template(uploadTpl)({
                            url: cacheData.ad.appImages[i]
                        }));
                    }
                }
                
                // 如果当前小于 3 张，则添加添加截图按钮
                if (cacheData.ad.appImages.length < 3) {
                    let tpl = $('#multi-upload-item-tpl').html();
                    $('#weibo-grid-screenshot-upload').append(tpl);
                }

            // IOS
            } else {
                $('.weibo-grid-ios').show();
                $('#weibo-grid-app').val('1');
                $('#ios-download-link').val(cacheData.ad.appUrl);
            }
            
            // 显示微博预览
            renderWeiboPreview(4, false, {
                data: {
                    ad: {
                        text: cacheData.ad.text,
                        picUrls: cacheData.ad.picUrls
                    }
                }
            });

            break;
        default:
            break;
    }
}

/**
 * 缓存订单基本信息数据
 * @param {Number} type - 标识当前应该存储什么类型的数据
 * @param {Object} data - 当前需要缓存的数据
 */
function setCacheData({ type, data }) {
    let cacheData = getCacheData();

    switch (type) {

        // 博文链接
        case 11:
            cacheData.type = 1;
            cacheData.subType = 11;
            cacheData.adPlacementId = data.adPlacementId;
            cacheData.ad = data.ad;
            break;
        
        // 编辑博文
        case 12:
            cacheData.type = 1;
            cacheData.subType = 12;
            cacheData.adPlacementId = data.adPlacementId;
            cacheData.ad = data.ad;
            break;
        
        // 微博 banner
        case 2:
            cacheData.type = 2;
            cacheData.subType = 2;
            cacheData.adPlacementId = data.adPlacementId;
            cacheData.ad = data.ad;
            break;
        
        // 微博 card - 活动
        case 31:
            cacheData.type = 3;
            cacheData.subType = 31;
            cacheData.adPlacementId = '1';
            cacheData.ad = data.ad;
            break;

        // 微博 card - 视频
        case 32:
            cacheData.type = 3;
            cacheData.subType = 32;
            cacheData.adPlacementId = '1';
            cacheData.ad = data.ad;
            break;

        // 微博 card - 视频活动
        case 33:
            cacheData.type = 3;
            cacheData.subType = 33;
            cacheData.adPlacementId = '1';
            cacheData.ad = data.ad;
            break;
        
        // 微博九宫格安卓
        case 41:
            cacheData.type = 4;
            cacheData.subType = 41;
            cacheData.adPlacementId = '1';
            cacheData.ad = data.ad;
            break;
        
        // 微博九宫格 ios
        case 42:
            cacheData.type = 4;
            cacheData.subType = 42;
            cacheData.adPlacementId = '1';
            cacheData.ad = data.ad;
            break;
    }

    // 如果当前是编辑订单
    if (urler().edit === '1') {
        localStorage.setItem('editWeiboAdInfo', JSON.stringify(cacheData));

    // 如果当前是创建新的订单
    } else {
        localStorage.setItem('weiboAdInfo', JSON.stringify(cacheData));
    }
}

/**
 * 跳转到下一步骤
 */
function jump2NextStep() {
    
    // 如果当前是编辑订单
    if (urler().edit === '1') {
        location.href = `/#proj_name#/html/ad/weibo/orientation.html?cid=${urler().cid}&edit=1&oid=${urler().oid}`;

    // 当前不是编辑订单
    } else {
        location.href = `/#proj_name#/html/ad/weibo/orientation.html?cid=${urler().cid}`;
    }
}

/**
 * 从本地获取数据
 * @param {Object} 返回从缓存中获取的值
 */
function getCacheData() {
    let data;
    
    // 当前是编辑订单
    if (urler().edit === '1') {
        data = localStorage.getItem('editWeiboAdInfo');

    // 当前是新订单
    } else {
        data = localStorage.getItem('weiboAdInfo');
    }

    if (!data) {
        modaler.tip('本地没有存储订单数据');
        return;
    }

    return JSON.parse(data);
}

/**
 * 根据服务器返回的数据判断应该渲染那种样式的预览形式
 * @param {Number} type - 当前预览的类型
 * @param {Boolean} isMis - 当前是否有 mid，现有微博
 * @param {Object} data - 服务器返回的数据
 */
function renderWeiboPreview(type, isMid, data) {

    // 博文
    if (type === 1) {

        // 服务器直接返回博文数据
        // 当前通过 mid 获取博文，则不渲染预览
        if (!isMid) {
            let tpl = $('#weibo-feed-preview-tpl').html();
            $('.weibo-preview').html(_.template(tpl)(data));
        }

    // banner
    } else if (type === 2) {
        let tpl = $('#weibo-banner-preview-tpl').html();
        $('.weibo-preview').html(_.template(tpl)(data))

    // 品速 card
    } else if (type === 3) {
        let tpl = $('#weibo-card-preview-tpl').html();
        $('.weibo-preview').html(_.template(tpl)(data));

    // 九宫格
    } else {
        let tpl = $('#weibo-grid-preview-tpl').html();
        $('.weibo-preview').html(_.template(tpl)(data));
    }
}

/**
 * 为后退操作添加正确的参数
 */
function addBackLinkParam() {
    
    // 当前是重新编辑订单
    if (urler().edit === '1') {
        let $link = $('.content-progress .progress-title a');
        $link.each((index, el) => {
            let url = $(el).attr('href');
            $(el).attr('href', `${url}&edit=1&oid=${urler().oid}`);
        });
    }
}