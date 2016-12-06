import {
    convertMoney,
    convertPercent,
    divideThousand
} from './libs/tools';

// 获取业务
requester.get('/external/custom/listPlatformStatus.do').then(data => {
    let _data = {
        navs: []
    };

    // 处理服务器返回的数据 
    for (let item of data.data.records) {
        _data.navs.push({
            type: item.platformId,
            content: item.platformName
        });
    }

    let tpl = $('#content-nav-tpl').html();
    $('#content-sub-nav').html(_.template(tpl)(_data));

    // 数据概览下拉项单击事件
    $('.content-nav-link').unbind('click').bind('click', e => {
        let type = $(e.currentTarget).attr('data-type');
        location.href = `/#proj_name#/html/data/info-overview.html?cid=${urler().cid}&pid=${type}`;
    });
});

// 获取投放平台
requester.get('/select/listPlatForms.do').then(platformData => {
    
    // 渲染投放平台
    for (let prop in platformData.data) {
        if (prop === 1) {
            $('#platform').append(`<option value="${prop}" checked>${platformData.data[prop]}</option>`);
        } else {
            $('#platform').append(`<option value="${prop}">${platformData.data[prop]}</option>`);
        }
    }
    
    // 执行默认操作，拿到本月开始时间和结束时间，执行搜索
    let monthStart = moment().startOf('month').format('YYYY-MM-DD');
    let monthEnd = moment().endOf('month').format('YYYY-MM-DD');
    $('#overview .w-table-tool [data-field="startDate"]').val(monthStart);
    $('#overview .w-table-tool [data-field="endDate"]').val(monthEnd);

    tabler.render({
        url: '/deal/data/listPlacementDatas.do',
        tpl: $('#overview-tpl').html(),
        container: '#overview',
        handle(data) {

            for (let record of data.data.records) {
                
                // 曝光量
                record.showCount = divideThousand(record.showCount);

                // 互动量
                record.interactCount = divideThousand(record.interactCount);
                
                // 互动率
                record.interactRatio = convertPercent(record.interactRatio);

                // 加关注
                record.followCount = divideThousand(record.followCount);

                // 转发
                record.repostCount = divideThousand(record.repostCount);

                // 点赞
                record.likeCount = divideThousand(record.likeCount);

                // 收藏
                record.commentCount = divideThousand(record.commentCount);

                // 点击短链接
                record.urlClickCount = divideThousand(record.urlClickCount);

                // 消耗
                record.consume = convertMoney(record.consume);
            }

            return data;
        },
        otherParam: {
            export: false,
            platformId: Object.keys(platformData.data)[0],
            placementId: 2,
            startDate: monthStart,
            endDate: monthEnd
        }
    });
});