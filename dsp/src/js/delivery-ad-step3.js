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
var areaSelect = [];
var interestSelect = [];
var appSelect = [];
var lifesSelect = [];

// 如果本地存储有数据，则获取数据，下文用这些数据进行填充
if(urler.normal().order_id) {
    var cacheData = cache.get('delivery_ad_detail');
    console.log(cacheData);
} else {
    var cacheData = cache.get('delivery_ad_add');
    console.log(JSON.stringify(cacheData));
}

// 初始化 url 模块
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

// 渲染性别
$('#sex').html(_.template($('#checkbox-tpl').html())({
    title: '用户性别',
    name: 'sex',
    data: {
        0: '不限',
        1: '男',
        2: '女'
    }
}));

// 初始化：年龄
if(cacheData && cacheData.three && cacheData.three.age) {
    var ageArr = cacheData.three.age.split('~');
    $('#min-age').val(ageArr[0]);
    $('#max-age').val(ageArr[1]);
}

// 监听用户是否选择性别，如果选择了就绑定到 #sex 上
$('#sex input[type="checkbox"]').change(function() {
    var self = $(this);
    var isChecked = self.is(':checked');
    var sexArr = JSON.parse($('#sex').attr('data-sex') ? $('#sex').attr('data-sex') : '[]');

    // checked
    if(isChecked) {
        sexArr.push(Number(self.val()));
        $('#sex').attr('data-sex', JSON.stringify(sexArr));
    } else {
        sexArr.splice(sexArr.indexOf(Number(self.val())), 1);
        $('#sex').attr('data-sex', JSON.stringify(sexArr));
    }
});

// 初始化：性别
if(cacheData && cacheData.three && cacheData.three.sex !== null) {
    var sexArr = JSON.parse('[' + cacheData.three.sex + ']');
    _.forEach(sexArr, function(val) {
        $('#sex [type="checkbox"][value="' + val + '"]').prop('checked', true);
    });
    $('#sex').attr('data-sex', JSON.stringify(sexArr));
}

// 初始化： 区域
if(cacheData && cacheData.three && cacheData.three.areaId !== null) {
    areaSelect = cacheData.three.areaId;
}

// 初始化： 兴趣
if(cacheData && cacheData.three && cacheData.three.interestId !== null) {
    interestSelect = cacheData.three.interestId;
}

// 初始化：生活状态
if(cacheData && cacheData.three && cacheData.three.lifeIds !== null) {
    lifesSelect = cacheData.three.lifeIds;
}

// 初始化：app
if(cacheData && cacheData.three && cacheData.three.app !== null) {
    appSelect = cacheData.three.app;
}

// 初始化曝光回调
if(cacheData && cacheData.three && cacheData.three.exposureMonitorUrl) {
    $('#exposure').val(cacheData.three.exposureMonitorUrl);
}

// 初始化点击回调
if(cacheData && cacheData.three && cacheData.three.clickMonitorUrl) {
    $('#click-exposure').val(cacheData.three.clickMonitorUrl);
}

// 渲染用户地域
renderArea(function(arr) {
    $('#area').treeview({
        showCheckbox: true,
        searchResultBackColor: undefined,

        // 用户点击的效果
        onNodeChecked: function(e, node) {
            areaSelect.push(node.areaId);

            // 当前节点是一个父节点，底下有子节点
            if(node.nodes && node.nodes.length > 0) {

                // 将节点推入缓存数组
                _.each(node.nodes, function(node) {
                    areaSelect.push(node.areaId);
                });
                $('#area').treeview('checkNode', [checkBoxAction(node.nodes), { silent: true } ]);
            }
        },

        // 用户取消点击的效果
        onNodeUnchecked: function(e, node) {
            var index = areaSelect.indexOf(node.areaId);
            if(index > -1) {
                areaSelect.splice(index, 1);
            }

            // 当前节点是一个父节点，底下有子节点
            if(node.nodes && node.nodes.length > 0) {

                // 将数组从缓存数组中取出
                _.each(node.nodes, function(node) {
                    var index = areaSelect.indexOf(node.areaId);
                    if(index > -1) {
                        areaSelect.splice(index, 1);
                    }
                });

                $('#area').treeview('uncheckNode', [ checkBoxAction(node.nodes), { silent: true } ]);
            }
        },
        data: arr
    }).treeview('collapseAll', { silent: true });

    //初始化：地域
    if(cacheData && cacheData.three && JSON.parse('[' + cacheData.three.areaId + ']').length > 0) {
        areaSelect = JSON.parse('[' + cacheData.three.areaId + ']');
        _.each(areaSelect, function(val) {
            _.each(arr, function(_val) {
                if(_val.areaId == val) {
                    _val.state.checked = true;
                }
                _.each(_val.nodes, function(__val) {
                    if(__val.areaId == val) {
                        __val.state.checked = true;
                    }
                });
            });
        });

        $('#area').treeview({
            showCheckbox: true,
            highlightSearchResults: true,
            highlightSelected: true,

            // 用户点击的效果
            onNodeChecked: function(e, node) {
                areaSelect.push(node.areaId);

                // 当前节点是一个父节点，底下有子节点
                if(node.nodes && node.nodes.length > 0) {

                    // 将节点推入缓存数组
                    _.each(node.nodes, function(node) {
                        areaSelect.push(node.areaId);
                    });
                    $('#area').treeview('checkNode', [checkBoxAction(node.nodes), { silent: true } ]);
                }
            },

            // 用户取消点击的效果
            onNodeUnchecked: function(e, node) {
                var index = areaSelect.indexOf(node.areaId);
                if(index > -1) {
                    areaSelect.splice(index, 1);
                }

                // 当前节点是一个父节点，底下有子节点
                if(node.nodes && node.nodes.length > 0) {

                    // 将数组从缓存数组中取出
                    _.each(node.nodes, function(node) {
                        var index = areaSelect.indexOf(node.areaId);
                        if(index > -1) {
                            areaSelect.splice(index, 1);
                        }
                    });

                    $('#area').treeview('uncheckNode', [ checkBoxAction(node.nodes), { silent: true } ]);
                }
            },
            data: arr
        }).treeview('collapseAll', { silent: true });
    }

    //全选按钮
    $('body').on('click change', '#checkAll', function(e, node) {
        $.each(arr, function(index, val) {
            areaSelect.push(val.areaId);
            $.each(val.nodes, function(index,value) {
                 areaSelect.push(value.areaId);
            });
        });
        console.log(areaSelect);
        $('#area').treeview('checkAll',  { silent: true } );
    });


    //取消全选
    $('body').on('click change','#uncheckAll', function() {
        $('#area').treeview('uncheckAll', {silent: true});
    });

    // 搜索事件
    $('body').on('keyup', '#input-search', function(e) {
        if(e.which === 13) {
            var value = $(this).val();

            // 获取用户搜索的节点
            var result = $('#area').treeview('search', [value, {
                ignoreCase: true,     // case insensitive
                exactMatch: false,    // like or equals
                revealResults: true
            }]);
            $('#area').treeview('checkNode', [autoSelectNode, { silent: true } ]);
            $('#area').find('.list-group-item')
            .hide()
            .filter(":contains('"+( $(this).val() )+"')")
            .show();
        }
    });
});

// 渲染兴趣
renderInterest(function(arr) {
    $('#interest').treeview({
        showCheckbox: true,
        searchResultBackColor: undefined,

        // 用户点击的效果
        onNodeChecked: function(e, node) {
            interestSelect.push(node.areaId);

            // 当前节点是一个父节点，底下有子节点
            if(node.nodes && node.nodes.length > 0) {

                // 将节点推入缓存数组
                _.each(node.nodes, function(node) {
                    interestSelect.push(node.areaId);
                });

                $('#interest').treeview('checkNode', [checkBoxAction(node.nodes), { silent: true } ]);
            }
        },

        // 用户取消点击的效果
        onNodeUnchecked: function(e, node) {
            var index = interestSelect.indexOf(node.areaId);
            if(index > -1) {
                interestSelect.splice(index, 1);
            }

            // 当前节点是一个父节点，底下有子节点
            if(node.nodes && node.nodes.length > 0) {

                // 将数组从缓存数组中取出
                _.each(node.nodes, function(node) {
                    var index = interestSelect.indexOf(node.areaId);
                    if(index > -1) {
                        interestSelect.splice(index, 1);
                    }
                });

                $('#interest').treeview('uncheckNode', [ checkBoxAction(node.nodes), { silent: true } ]);
            }
        },
        data: arr
    }).treeview('collapseAll', { silent: true });

    // 初始化：兴趣
    if(cacheData && cacheData.three && JSON.parse('[' + cacheData.three.interestId + ']').length > 0) {
        interestSelect = JSON.parse('[' + cacheData.three.interestId + ']');
        _.each(interestSelect, function(val) {
            _.each(arr, function(_val) {
                if(_val.areaId == val) {
                    _val.state.checked = true;
                }
                _.each(_val.nodes, function(__val) {
                    if(__val.areaId == val) {
                        __val.state.checked = true;
                    }
                });
            });
        });

        $('#interest').treeview({
            showCheckbox: true,
            highlightSearchResults: true,
            highlightSelected: true,

            // 用户点击的效果
            onNodeChecked: function(e, node) {
                interestSelect.push(node.areaId);

                // 将节点推入缓存数组
                _.each(node.nodes, function(node) {
                    interestSelect.push(node.areaId);
                });

                $('#interest').treeview('checkNode', [checkBoxAction(node.nodes), { silent: true } ]);
            },

            // 用户取消点击的效果
            onNodeUnchecked: function(e, node) {
                var index = interestSelect.indexOf(node.areaId);
                if(index > -1) {
                    interestSelect.splice(index, 1);
                }

                // 当前节点是一个父节点，底下有子节点
                if(node.nodes && node.nodes.length > 0) {

                    // 将数组从缓存数组中取出
                    _.each(node.nodes, function(node) {
                        var index = interestSelect.indexOf(node.areaId);
                        if(index > -1) {
                            interestSelect.splice(index, 1);
                        }
                    });

                    $('#interest').treeview('uncheckNode', [ checkBoxAction(node.nodes), { silent: true } ]);
                }
            },
            data: arr
        }).treeview('collapseAll', { silent: true });
    }
});

// 渲染app 
renderApp(function(arr) {
    $('#app').treeview({
        showCheckbox: true,

        // 用户点击的效果
        onNodeChecked: function(e, node) {
            appSelect.push(node.areaId);
        },

        // 用户取消点击的效果
        onNodeUnchecked: function(e, node) {
            var index = appSelect.indexOf(node.areaId);
            if(index > -1) {
                appSelect.splice(index, 1);
            }
        },
        data: arr
    }).treeview('collapseAll', { silent: true });

    // 初始化：app(因为只有一层，所以用_val)
    if(cacheData && cacheData.three && JSON.parse('[' + cacheData.three.apps + ']').length > 0) {
        appSelect = JSON.parse('[' + cacheData.three.apps + ']');
        _.each(appSelect, function(val) {
            _.each(arr, function(_val) {
                if(_val.areaId == val) {
                    _val.state.checked = true;
                }
            });
        });
        $('#app').treeview({
            showCheckbox: true,

            // 用户点击的效果
            onNodeChecked: function(e, node) {
                appSelect.push(node.areaId);
            },

            // 用户取消点击的效果
            onNodeUnchecked: function(e, node) {
                var index = appSelect.indexOf(node.areaId);
                if(index > -1) {
                    appSelect.splice(index, 1);
                }
            },
            data: arr
        }).treeview('collapseAll', { silent: true });
    }
});

// 渲染生活状态
renderLifes(function(arr) {
    $('#lifes').treeview({
        showCheckbox: true,
        searchResultBackColor: undefined,

        // 用户点击的效果
        onNodeChecked: function(e, node) {
            lifesSelect.push(node.areaId);

            // 当前节点是一个父节点，底下有子节点
            if(node.nodes && node.nodes.length > 0) {

                // 将节点推入缓存数组
                _.each(node.nodes, function(node) {
                    lifesSelect.push(node.areaId);
                });

                $('#lifes').treeview('checkNode', [checkBoxAction(node.nodes), { silent: true } ]);
            }
        },

        // 用户取消点击的效果
        onNodeUnchecked: function(e, node) {
            var index = lifesSelect.indexOf(node.areaId);
            if(index > -1) {
                lifesSelect.splice(index, 1);
            }

            // 当前节点是一个父节点，底下有子节点
            if(node.nodes && node.nodes.length > 0) {

                // 将数组从缓存数组中取出
                _.each(node.nodes, function(node) {
                    var index = lifesSelect.indexOf(node.areaId);
                    if(index > -1) {
                        lifesSelect.splice(index, 1);
                    }
                });
                $('#lifes').treeview('uncheckNode', [ checkBoxAction(node.nodes), { silent: true } ]);
            }
        },
        data: arr
    }).treeview('collapseAll', { silent: true });

    // 初始化：生活状态
    if(cacheData && cacheData.three && JSON.parse('[' + cacheData.three.lifeIds + ']').length > 0) {
        lifesSelect = JSON.parse('[' + cacheData.three.lifeIds + ']');
        _.each(lifesSelect, function(val) {
            _.each(arr, function(_val) {

                // 一级目录勾选
                if(_val.areaId == val) {
                    _val.state.checked = true;
                }
                _.each(_val.nodes, function(__val) {

                    // 二级目录勾选
                    if(__val.areaId == val) {
                        __val.state.checked = true;
                    }
                });
            });
        });

        $('#lifes').treeview({
            showCheckbox: true,
            highlightSearchResults: true,
            highlightSelected: true,

            // 用户点击的效果
            onNodeChecked: function(e, node) {
                lifesSelect.push(node.areaId);

                // 当前节点是一个父节点，底下有子节点
                if(node.nodes && node.nodes.length > 0) {

                    // 将节点推入缓存数组
                    _.each(node.nodes, function(node) {
                        lifesSelect.push(node.areaId);
                    });

                    $('#lifes').treeview('checkNode', [checkBoxAction(node.nodes), { silent: true } ]);
                }
            },

            // 用户取消点击的效果
            onNodeUnchecked: function(e, node) {
                var index = lifesSelect.indexOf(node.areaId);
                if(index > -1) {
                    lifesSelect.splice(index, 1);
                }

                // 当前节点是一个父节点，底下有子节点
                if(node.nodes && node.nodes.length > 0) {

                    // 将数组从缓存数组中取出
                    _.each(node.nodes, function(node) {
                        var index = lifesSelect.indexOf(node.areaId);
                        if(index > -1) {
                            lifesSelect.splice(index, 1);
                        }
                    });
                    $('#lifes').treeview('uncheckNode', [ checkBoxAction(node.nodes), { silent: true } ]);
                }
            },
            data: arr
        }).treeview('collapseAll', { silent: true });
    }
});

// 渲染系统定向
$('#system').html(_.template($('#checkbox-tpl').html())({
    title: '系统定向',
    name: 'sysrem',
    data: {
        0: '不限',
        1: 'IOS',
        2: '安卓'
    }
}));

// 监听用户是否选择系统，如果选择了就绑定到 #system 上
$('#system input[type="checkbox"]').change(function() {
    var self = $(this);
    var isChecked = self.is(':checked');
    var systemArr = JSON.parse($('#system').attr('data-system') ? $('#system').attr('data-system') : '[]');

    // checked
    if(isChecked) {
        systemArr.push(Number(self.val()));
        $('#system').attr('data-system', JSON.stringify(systemArr));
    } else {
        systemArr.splice(systemArr.indexOf(Number(self.val())), 1);
        $('#system').attr('data-system', JSON.stringify(systemArr));
    }
});

// 初始化：系统定向
if(cacheData && cacheData.three && cacheData.three.os !== null) {
    var systemArr = JSON.parse('[' + cacheData.three.os + ']');
    _.forEach(systemArr, function(val) {
        $('#system [type="checkbox"][value="' + val + '"]').prop('checked', true);
    });
    $('#system').attr('data-system', JSON.stringify(systemArr));
}

// 渲染网络环境
$('#internet').html(_.template($('#checkbox-tpl').html())({
    title: '网络定向',
    name: 'internet',
    data: {
        0: '不限',
        1: 'WIFI',
        2: '2G',
        3: '3G',
        4: '4G'
    }
}));

// 监听用户是否选择网络环境，如果选择了就绑定到 #internet 上
$('#internet input[type="checkbox"]').change(function() {
    var self = $(this);
    var isChecked = self.is(':checked');
    var internetArr = JSON.parse($('#internet').attr('data-internet') ? $('#internet').attr('data-internet') : '[]');

    if(isChecked) {
        internetArr.push(Number(self.val()));
        $('#internet').attr('data-internet', JSON.stringify(internetArr));
    } else {
        internetArr.splice(internetArr.indexOf(Number(self.val())), 1);
        $('#internet').attr('data-internet', JSON.stringify(internetArr));
    }
});

// 初始化：网络
if(cacheData && cacheData.three && cacheData.three.wifi !== null) {
    var internetArr = JSON.parse('[' + cacheData.three.wifi + ']');
    _.forEach(internetArr, function(val) {
        $('#internet [type="checkbox"][value="' + val + '"]').prop('checked', true);
    });
    $('#internet').attr('data-internet', JSON.stringify(internetArr));
}

// 初始化日期选择框
datePicker.init('#date');

// 初始化：日期
if(cacheData && cacheData.three && cacheData.three.date !== null) {
    $('#date').val(cacheData.three.date.replace(/-/g, '/').replace(/~/g, ' - '));
}

// 渲染投放时间
$('#time').html(_.template($('#radio-tpl').html())({
    title: '投放时间',
    name: 'time',
    data: {
        0: '全时段',
        1: '特定时间段'
    }
}));

// 初始化投放时间
timer.init('#time-start');
timer.init_end('#time-end');
// timer.fillTimeEnd('#time-end');

// 初始化：时间
if(cacheData && cacheData.three && cacheData.three.time) {

    // 全时段，勾选全时段选框
    if(cacheData.three.time === '00:00~24:00') {
        $('#time [type="radio"]').eq(0).prop('checked', true);
        $('#time').attr('data-time', 0);

    // 非全时段，勾选非全时段选框
    } else {

        $('#time').attr('data-time', 1);
        $('#time [type="radio"]').eq(1).prop('checked', true);
        $('#time-start')
            .removeAttr('disabled')
            .val(timer.format24Time(cacheData.three.time.split('~')[0]));
        $('#time-end')
            .removeAttr('disabled')
            .val(timer.format24Time(cacheData.three.time.split('~')[1]));
    }
}

// 如果选择了特定时间段，则允许用户选择时间
$('#time input[type="radio"]').change(function() {
    var type = $(this).val();
    var self = $(this);

    $('#time').attr('data-time', self.val());

    // 全时段
    if(type === '0') {
        $('#time-start').attr('disabled', 'disabled');
        $('#time-end').attr('disabled', 'disabled');

    // 特定时段
    } else {
        $('#time-start').removeAttr('disabled');
        $('#time-end').removeAttr('disabled');
    }
});

// 初始化出价方式
select2.init({
    url: '/select/listBidWays.do',
    param: {
        platformId: urler.normal().order_id ? cache.get('delivery_ad_detail.one.platform') : cache.get('delivery_ad_add.one.platform'),
        customId: urler.normal().cid
    },
    title: '广告',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#price-type').html(_.template(tpl)(data));
        $('#price-type').select2({
            placeholder: '选择出价方式'
        }).select2('val', '');

        // 出价方式
        if(cacheData && cacheData.three && cacheData.three.bidWay) {
            $('#price-type').select2('val', cacheData.three.bidWay);
        }
    }
});

$(".js-example-tags").select2({
  tags: true
});

// 初始化搜索条中选择产品线
$('#step3-UID').select2({
    placeholder: "选择指定用户UID",
    minimumInputLength: 3,
    ajax: {
        url: "/select/listAllWeiboUids.do",
        dataType: 'json',
        delay: 250,
        multiple: true,
        data: function (params) {
            return {
                key: params.term, // search term
                page: params.page
            };
            $('#step3-UID').select2({
                placeholder: '选择指定用户UID',
                openOnEnter: true
            }).select2('val', '');
        },
    processResults: function (data, params) {
        params.page = params.page || 1;
        return {
            results: data.data,
            pagination: {
                more: (params.page * 30) < data.total_count
            }
        };
    },
    cache: true
    },
    escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
    minimumInputLength: 1,
    templateResult: formatRepo, // omitted for brevity, see the source of this page
    templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
});


// 初始化UIDS选择
if(cacheData && cacheData.three && cacheData.three.uids) {
    var uidsArrList = cacheData.three.uids.split(',');
    console.log(uidsArrList);
    // 手动从缓存中取值添加option到页面，渲染uids的值
    for(var i = 0 ; i < uidsArrList.length;i++) {
        $('#step3-UID').append("<option value="+uidsArrList[i]+">"+ uidsArrList[i]+"</option>");
    }
    $('#step3-UID').val(uidsArrList).trigger("change");
}

// select2 所用到的方法
function formatRepo (repo) {
    if (repo.loading) return repo.full_name;
    var markup = "<div class='select2-result-repository__title'>"  + repo.full_name + "</div>";
    return markup ;
}

function formatRepoSelection (repo) {
    return repo.full_name || repo.text;
}

// 出价
if(cacheData && cacheData.three && cacheData.three.bidPrice) {
    $('#price').val(cacheData.three.bidPrice / 100);
}

// 订单限额
if(cacheData && cacheData.three && cacheData.three.quota) {
    $('#bill-limit').val(cacheData.three.quota / 100);
}

// 提交数据
$('#submit').click(function() {

     // 获取数据
     var minAge = Number($('#min-age').val());
     var maxAge = Number($('#max-age').val());
     var sex = $('#sex').attr('data-sex');
     var area = areaSelect;
     var interest = interestSelect;
     console.log('---兴趣的值--');
     console.log(interest);
     console.log('-----------'+area);

     var lifeIds = lifesSelect;
     console.log('---life的值---');
     console.log(lifeIds);
     var apps = appSelect;
     console.log('---app的值--');
     console.log(apps);
     var system = $('#system').attr('data-system');
     var internet = $('#internet').attr('data-internet');
     var date = datePicker.getVal('#date');
     var timeSelect = $('#time').attr('data-time'); // '0' -> 全时段  '1' -> 具体时段
     var time = '';
     var priceType = select2.getVal({
         id: '#price-type'
     });
     var price = Number($('#price').val());
     var billLimit = Number($('#bill-limit').val());

     // 获取UID的值
     var step3Uids = select2.getVal({
        id: '#step3-UID'
     });
     // console.log(step3Uids);
     var uidsList = [];

     // 获取曝光回调的值
     var exposureMonitorUrl = $('#exposure').val();

     // 获取点击回调的值
     var clickMonitorUrl = $('#click-exposure').val();
     if(step3Uids !== null) {
        for(var i = 0; i < step3Uids.length; i++) {
            uidsList.push(step3Uids[i]);
        }
    }

      // 根据选择的时间段获取具体的时间
      // 全时段
      if(timeSelect === '0') {
          time = '00:00~24:00';

      // 具体时段
      } else {
          var start = timer.getTime('#time-start');
          var end = timer.getTimeLast('#time-end') !== '00:00' ? timer.getTimeLast('#time-end') : '24:00';
          time = start + '~' + end;
      }

    //   // 打印所有数据
    //   console.log(minAge);
    //   console.log(maxAge);
    //   console.log(sex);
    //   console.log(area);
    //   console.log(interest);
    //   console.log(system);
    //   console.log(internet);
    //   console.log(date);
    //   console.log(timeSelect);
    //   console.log(time);
    //   console.log(priceType);
    //   console.log(price);
    //   console.log(billLimit);
    //   return;

     // 校验数据
    if(minAge <= 0 || maxAge <= 0 || minAge > maxAge) {
        modal.nobtn({
             ctx: 'body',
             ctn: '请输入正实确的年龄段',
             title: '广告'
        });
        return;
    }

    // 校验数据
    if(start > end) {
        modal.nobtn({
            ctx: 'body',
            ctn: '投放时间有误，请重新设置',
            title: '投放时间'
        });
        return;
    }

    if(sex === undefined) {
         modal.nobtn({
             ctx: 'body',
             ctn: '请选择性别',
             title: '广告'
         });
         return;
    }

    if(area.length < 1) {
        modal.nobtn({
            ctx: 'body',
            ctn: '请选择地域',
            title: '广告'
        });
        return;
    }

    // 校验兴趣
    if(interest.length < 1) {
        modal.nobtn({
            ctx: 'body',
            ctn: '请选择兴趣',
            title: '广告'
        });
        return;
    }

    // 生活状态校验
    if(lifeIds.length < 1) {
        modal.nobtn({
            ctx: 'body',
            ctn: '请选择生活状态',
            title: '广告'
        });
        return;
    }

    // app校验
    if(apps.length < 1) {
        modal.nobtn({
            ctx: 'body',
            ctn: '请选择app',
            title: '广告'
        });
        return;
    }

    if(system === undefined) {
         modal.nobtn({
             ctx: 'body',
             ctn: '请选择系统',
             title: '广告'
         });
         return;
    }

    if(internet === undefined) {
         modal.nobtn({
             ctx: 'body',
             ctn: '请选择网络',
             title: '广告'
         });
         return;
    }

    if(date.start === '' || date.end === undefined) {
         modal.nobtn({
            ctx: 'body',
            ctn: '请选择日期',
            title: '广告'
         });
         return;
    }

    if(timeSelect === undefined) {
         modal.nobtn({
            ctx: 'body',
            ctn: '请选择时间段',
            title: '广告'
         });
         return;
    }

    if(timeSelect !== '0' && (start === '' || end === '')) {
         modal.nobtn({
            ctx: 'body',
            ctn: '如果选择特定时间段，请选择具体的时间',
            title: '广告'
         });
         return;
    }

    if(priceType === undefined || priceType === null) {
         modal.nobtn({
             ctx: 'body',
             ctn: '请选择出价方式',
             title: '广告'
         });
         return;
    }

    if(price <= 0) {
         modal.nobtn({
             ctx: 'body',
             ctn: '请输入出价',
             title: '广告'
         });
         return;
    }

    if(billLimit <= 0) {
         modal.nobtn({
             ctx: 'body',
             ctn: '请输入订单限额',
             title: '广告'
         });
         return;
    }

    // 将数据保存到本地
    if(urler.normal().order_id) {
        cache.set('delivery_ad_detail.three', {
            bidWay: priceType,
            os: system.toString().replace(/[\[\]]/g, ''),
            wifi: internet.toString().replace(/[\[\]]/g, ''),
            date: date.start + '~' + date.end,
            time: time,
            bidPrice: parseInt(parseFloat(price * 100).toPrecision(12)),
            quota: parseInt(parseFloat(billLimit * 100).toPrecision(12)),
            age: minAge + '~' + maxAge,
            sex: sex.toString().replace(/[\[\]]/g, ''),
            areaId: area.toString().replace(/["\[\]]/g, ''),
            interestId: interest.toString().replace(/["\[\]]/g, ''),
            lifeIds: lifeIds.toString().replace(/["\[\]]/g, ''),
            apps: apps.toString().replace(/["\[\]]/g, ''),
            // uids: uidsList.toString().replace(/["\[\]]/g, '')
            uids: uidsList.toString().replace(/["\[\]]/g, ''),
            exposureMonitorUrl: exposureMonitorUrl,
            clickMonitorUrl: clickMonitorUrl
        });

         // 跳转到步骤3
        urler.initLink('/#proj_name#/html/delivery/ad/step4.html?order_id=' + urler.normal().order_id);
    } else {
        cache.set('delivery_ad_add.three', {
            bidWay: priceType,
            os: system.toString().replace(/[\[\]]/g, ''),
            wifi: internet.toString().replace(/[\[\]]/g, ''),
            date: date.start + '~' + date.end,
            time: time,
            bidPrice: parseInt(parseFloat(price * 100).toPrecision(12)),
            quota: parseInt(parseFloat(billLimit * 100).toPrecision(12)),
            age: minAge + '~' + maxAge,
            sex: sex.toString().replace(/[\[\]]/g, ''),
            areaId: area.toString().replace(/["\[\]]/g, ''),
            interestId: interest.toString().replace(/["\[\]]/g, ''),
            lifeIds: lifeIds.toString().replace(/["\[\]]/g, ''),
            apps: apps.toString().replace(/["\[\]]/g, ''),
            // uids: uidsList.toString().replace(/["\[\]]/g, '')
            uids: uidsList.toString().replace(/["\[\]]/g, ''),
            exposureMonitorUrl: exposureMonitorUrl,
            clickMonitorUrl: clickMonitorUrl

        });

         // 跳转到步骤3
        urler.initLink('/#proj_name#/html/delivery/ad/step4.html');
    }

});

// 点击父节点时，把所有的子节点的值传到数组中，将数组做为参数传到服务器
function checkBoxAction(nodes) {
    var arr = [];
    for(var i = 0; i < nodes.length; i++) {
        arr.push(nodes[i].nodeId);
    }
    return arr;
}

/**
 * 从服务器获取并转换服务器传递过来的数据
 */
function renderArea(cb) {
    ajax.get({
        url: '/deal/listAreas.do',
        param: {
            customId: urler.normal().cid
        },
        cb: function(data) {

            var arr = [];
            _.each(data.data.records, function(record) {
                var obj = {
                    areaId: record.areaId,
                    text: record.name,
                    state: {
                        checked: false
                    },
                    nodes: []

                }

                // 如果有子菜单
                _.each(record.childAreas, function(childArea) {
                    obj.nodes.push({
                        areaId: childArea.areaId,
                        text: childArea.name,
                        state: {
                            checked: false
                        }
                    });
                });

                arr.push(obj);
            })
            console.log('------------------');
            console.log(arr);
            cb(arr, data);
        }
    });
}

/**
 * 从服务器获取并转换服务器传递过来的数据
 */
function renderInterest(cb) {
    ajax.get({
        url: '/deal/listInterests.do',
        param: {
            customId: urler.normal().cid
        },
        cb: function(data) {

            var arr = [];
            _.each(data.data.records, function(record) {
                var obj = {
                    areaId: record.areaId,
                    text: record.name,
                    state: {
                        checked: false
                    },
                    nodes: []
                }

                // 如果有子菜单
                _.each(record.childAreas, function(childArea) {
                    obj.nodes.push({
                        areaId: childArea.areaId,
                        text: childArea.name,
                        state: {
                            checked: false
                        }
                    });
                });
                arr.push(obj);
            })
            cb(arr, data);
        }
    });
}

/**
 * 从服务器获取生活状态相关数据并转换服务器传递过来的数据
 */
function renderLifes(cb) {
    ajax.get({
        url: '/deal/listLifes.do',
        param: {
            customId: urler.normal().cid
        },
        cb: function(data) {

            var arr = [];
            _.each(data.data.records, function(record) {
                var obj = {
                    areaId: record.areaId,
                    text: record.name,
                    state: {
                        checked: false
                    },
                    nodes: []
                }

                // 如果有子菜单
                _.each(record.childAreas, function(childArea) {
                    obj.nodes.push({
                        areaId: childArea.areaId,
                        text: childArea.name,
                        state: {
                            checked: false
                        }
                    });
                });
                arr.push(obj);
            })
            cb(arr, data);
        }
    });
}

/**
 * 从服务器获取app的数据并转换相应的数据
 */
function renderApp(cb) {
    ajax.get({
        url: '/deal/listApps.do',
        param: {
            customId: urler.normal().cid
        },
        cb: function(data) {

            var arr = [];
            _.each(data.data.records, function(record) {
                var obj = {
                    areaId: record.areaId,
                    text: record.name,
                    state: {
                        checked: false
                    }
                }

                arr.push(obj);
            })

            cb(arr, data);
        }
    });
}

$(".js-example-basic-multiple").select2();
