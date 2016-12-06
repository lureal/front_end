/*!
 ** 投放系统里信息概览页
 */
var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var sidebar = require('./modules/sidebar.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
var header = require('./modules/header.js');
var cache = require('./modules/cache.js');
var urler = require('./modules/urler.js');
var arrayer = require('./modules/arrayer.js');

// 初始化
urler.initLink();
sidebar.delivery({
	title: '首页概览',
	active: 'overview'
});
header.delivery({
	title: '首页概览'
});

// 获取数据概览接口，渲染数据概览
// 数据概览接口要求传递一个平台 id，所以先获取平台 ID 的接口
// ajax.get({
//     url: '/select/listPlatForms.do',
//     param: {
//         customId: urler.normal().cid
//     },
//     cb: function(platformData) {
//         getCountAd(Object.keys(platformData.data)[0], function(data) {

//             // 渲染数据概览数据统计模板
//             var tpl = $('#overview-count-ad-tpl').html();
//             $('#overview-count-ad').html(_.template(tpl)(data));
//         });
//     }
// });


// // *
// //  * 封装获取实际广告概览统计数据，方便多次请求
// //  * @param {String | Number} platformId [广告平台 ID]
// //  * @param {Function} cb [回调函数]

// function getCountAd(platformId, cb) {
//     ajax.get({
//         url: '/deal/overview/countAd.do',
//         param: {
//             platformId: platformId,
//             customId: urler.normal().cid
//         },
//         cb: cb
//     });
// }


ajax.get({
 	url: '/select/listPlatForms.do',
	param: {
		customId: parseInt(urler.normal().cid)
	},
	cb: function(data) {

		var tpl = $('#overview-count-title-tpl').html();
		$('#overview-count-title').html(_.template(tpl)(data));

		//如果后断返回一个平台，更换平台按钮隐藏
		if(getJasonLength(data.data) > 1 ) {
			$('.ovplatform-btn').removeClass('z-hidden');
		}
		if(getJasonLength(data.data) === 2 ) {
			$('#table-data2').css('display', 'block');
		}
		if(getJasonLength(data.data) === 3) {
			$('#table-data3').css('display', 'block');
		}

		// 初始化链接
		urler.initLink();
	},
});

function getJasonLength(json){
	var length = 0;
	for(var i in json){
		length ++;
	}
	return length;
}

//声明平台变换标志
var weiboflag = true;
var tengxunflag = false;
var sinaflag = false;

// 初始化首页概览中的日期选择框
datePicker.init('#delivery-overview-datepicker');

// 初始化搜索条中的日期控件
datePicker.init('#search-datapicker');

//获取平台审核列表数据
ajax.get({
	url: '/deal/overview/countAd.do',
	param: {
		platformId: 1,
		customId: parseInt(urler.normal().cid)
	},
	cb: function(data) {
		var tpl = $('#overview-count-data-tpl').html();
		$('#overview-count-data').html(_.template(tpl)(data));

		// 初始化链接
		urler.initLink();
	},
});

//获取平台详细数据
ajax.get({
	url: '/deal/overview/listPlatformDatas.do',
	param: {
		page: 1,
		export: false,
		customId: urler.normal().cid
	},
	cb: function(data) {
		var tpl = $('#overview-platform-text-tpl').html();
		$('#overview-platform-text').html(_.template(tpl)(data));

		// 1. 获取x轴数据
		var chartTableData = [];
		var yName = [];
		if(getJasonLength(data.data) > 0) {
			if(data.data.records[0].chart !== null) {
				chartTableData.push(data.data.records[0].chart.x);

				// 2. 提取 y 轴数据
				_.each(data.data.records[0].chart.y, function(val,index) {
					chartTableData.push(val.data);
					yName.push(val.name);
				});
				$('#overview-chart-wrap').html(_.template($('#overview-chart-tpl').html())({
					data: {
						records: arrayer.upsideDown(chartTableData),
						yName: yName
					}
				}))

				// 构造渲染图表数据
				var y = {
					info: [],
					data: []
				};
				_.each(data.data.records[0].chart.y, function(val, index) {

					// y 轴标题
					if(index % 2 !== 0) {
						y.info.push({
							labels: {
								format: '{value}'
							},
							title: {
								text: ''
							},
							opposite: true
							});
					} else {
						y.info.push({
							labels: {
								format: '{value}'
							},
							title: {
								text: ''
							}
						});
					}

					// y 轴数据
					y.data.push({
						name: val.name,
						type: 'spline',
						data: val.data
					})
				});

				//渲染图表
				renderChart($('#overview-chart'), {
					title: data.data.records[0].chart.name,
					x: data.data.records[0].chart.x,
					y: y
				});

				// 构造数据
				var selectData = {};
				_.each(data.data.records[0].chart.y, function(val, index) {
					selectData[index] = val.name;
				});

				//渲染下拉选择框模板
				$('#overview-chart-select').html(_.template($('#type-tpl').html())({data: selectData}));

				// 初始化图表下拉选择框
				$('#overview-chart-select').select2({
					placeholder: '选择显示数据'
				}).select2('val', '');

				//生成图表
				$('#overview-generate-chart').click(function() {
					var select = select2.getVal({
						id: '#overview-chart-select'
				});

				// 判定数量只能为两个
				if(select.length !== 2) {
					modal.nobtn({
						ctx: 'body',
						ctn: '请选择两个选项',
						title: '数据统计'
					});
					return;
				}

				// 根据用户的选择重新构造数据
				var _data = {
					name: data.data.records[0].chart.name,
					x: data.data.records[0].chart.x,
					y: []
				};

				_.each(select, function(val, index) {
					_data.y.push(data.data.records[0].chart.y[val]);
				});

				// 构造渲染图表数据
				var y = {
					info: [],
					data: []
				};
				_.each(_data.y, function(val, index) {

					// y 轴标题
					if(index % 2 !== 0) {
						y.info.push({
							labels: {
								format: '{value}'
							},
							title: {
								text: ''
							},
							opposite: true
						});

						// y 轴数据
						y.data.push({
							name: val.name,
							type: 'spline',
							yAxis: index,
							data: val.data
						})
					} else {
						y.info.push({
							labels: {
								format: '{value}'
							},
							title: {
								text: ''
							}
						});

						// y 轴数据
						y.data.push({
							name: val.name,
							type: 'spline',
							dashStyle: 'shortdot',
							yAxis: index,
							data: val.data
						})
					}
				});

				// 渲染图表
				renderChart($('#overview-chart'), {
						title: _data.name,
						x: _data.x,
						y: y
					});
				});
			}
		}
		if(getJasonLength(data.data) === 2) {
			if(data.data.records[1]) {

				//腾讯平台
				var tpl1 = $('#overview-platform-text-tpl1').html();
				$('#overview-platform-text1').html(_.template(tpl1)(data));

				// 1.构造腾讯渲染数据
				var chartTableData1 = [];
				var yName1 = [];
				if(data.data.records[1].chart !== null) {
					chartTableData1.push(data.data.records[1].chart.x);
				}

				// 2. 提取 y 轴数据
				if(data.data.records[1].chart !== null) {
					_.each(data.data.records[1].chart.y, function(val,index) {
						chartTableData1.push(val.data);
						yName1.push(val.name);
					});
				}

				$('#overview-chart-wrap1').html(_.template($('#overview-chart-tpl1').html())({
					data: {
						records1: arrayer.upsideDown(chartTableData1),
						yName1: yName1
					}
				}))

				// 构造渲染图表数据
				var y1 = {
					info: [],
					data: []
				};
				_.each(data.data.records[1].chart.y, function(val, index) {

					// y 轴标题
					if(index % 2 !== 0) {
						y1.info.push({
							labels: {
								format: '{value}'
							},
							title: {
								text: ''
							},
							opposite: true
							});
					} else {
						y1.info.push({
							labels: {
								format: '{value}'
							},
							title: {
								text: ''
							}
						});
					}

					// y轴数据
					y1.data.push({
						name: val.name,
						type: 'spline',
						data: val.data
					})
				});

				// 渲染图表
				renderChart($('#overview-chart1'), {
					title: data.data.records[1].chart.name,
					x: data.data.records[1].chart.x,
					y: y1
				});

				// 构造数据
				var selectData1 = {};
				_.each(data.data.records[1].chart.y, function(val, index) {
					selectData[index] = val.name;
				});

				// 渲染下拉选择框模板
				$('#overview-chart-select1').html(_.template($('#type-tpl1').html())({data: selectData}));

				// 初始化图表下拉选择框
				$('#overview-chart-select1').select2({
					placeholder: '选择显示数据'
				}).select2('val', '');

				// 生成图表
				$('#overview-generate-chart1').click(function() {
					var select = select2.getVal({
						id: '#overview-chart-select1'
				});

				// 判定数量只能为两个
				if(select.length !== 2) {
					modal.nobtn({
						ctx: 'body',
						ctn: '请选择两个选项',
						title: '数据统计'
					});
					return;
				}

				// 根据用户的选择重新构造数据
				var _data = {
					name: data.data.records[1].chart.name,
					x: data.data.records[1].chart.x,
					y: []
				};

				_.each(select, function(val, index) {
					_data.y.push(data.data.records[1].chart.y[val]);
				});

				// 构造渲染图表数据
				var y1 = {
					info: [],
					data: []
				};
				_.each(_data.y, function(val, index) {

					// y 轴标题
					if(index % 2 !== 0) {
						y1.info.push({
							labels: {
								format: '{value}'
							},
							title: {
								text: ''
							},
							opposite: true
						});

						// y 轴数据
						y1.data.push({
							name: val.name,
							type: 'spline',
							yAxis: index,
							data: val.data
						})
					} else {
						y1.info.push({
							labels: {
								format: '{value}'
							},
							title: {
								text: ''
							}
						});

						// y 轴数据
						y1.data.push({
							name: val.name,
							type: 'spline',
							dashStyle: 'shortdot',
							yAxis: index,
							data: val.data
						})
					}
				});

				// 渲染图表
				renderChart($('#overview-chart1'), {
						title: _data.name,
						x: _data.x,
						y: y1
					});
				});
			}
		}
		if(getJasonLength(data.data) === 3) {
			if(data.data.records[2]) {

				//sina平台
				var tpl2 = $('#overview-platform-text-tpl2').html();
				$('#overview-platform-text2').html(_.template(tpl2)(data));

				// 1.sina平台构造x轴数据
				var chartTableData2 = [];
				var yName2 = [];
				if(data.data.records[2].chart !== null ) {
					chartTableData2.push(data.data.records[2].chart.x);
				}

				// 2. 提取 y 轴数据
				if(data.data.records[2].chart !== null) {
					_.each(data.data.records[2].chart.y, function(val,index) {
						chartTableData2.push(val.data);
						yName2.push(val.name);
					});
				}
				$('#overview-chart-wrap2').html(_.template($('#overview-chart-tpl2').html())({
					data: {
						records: arrayer.upsideDown(chartTableData2),
						yName2: yName2
					}
				}))

				// 构造渲染图表数据
				var y2 = {
					info: [],
					data: []
				};
				_.each(data.data.records[2].chart.y, function(val, index) {

					// y 轴标题
					if(index % 2 !== 0) {
						y2.info.push({
							labels: {
								format: '{value}'
							},
							title: {
								text: ''
							},
							opposite: true
							});
					} else {
						y2.info.push({
							labels: {
								format: '{value}'
							},
							title: {
								text: ''
							}
						});
					}

					// y 轴数据
					y2.data.push({
						name: val.name,
						type: 'spline',
						data: val.data
					})
				});

				//渲染图表
				renderChart($('#overview-chart2'), {
					title: data.data.records[2].chart.name,
					x: data.data.records[2].chart.x,
					y: y
				});

				//构造数据
				var selectData2 = {};
				_.each(data.data.records[2].chart.y, function(val, index) {
					selectData2[index] = val.name;
				});

				// 渲染下拉选择框模板
				$('#overview-chart-select2').html(_.template($('#type-tpl2').html())({data: selectData2}));

				//初始化图表下拉选择框
				$('#overview-chart-select2').select2({
					placeholder: '选择显示数据'
				}).select2('val', '');

				// 生成图表
				$('#overview-generate-chart2').click(function() {
					var select = select2.getVal({
						id: '#overview-chart-select2'
				});

				// 判定数量只能为两个
				if(select.length !== 2) {
					modal.nobtn({
						ctx: 'body',
						ctn: '请选择两个选项',
						title: '数据统计'
					});
					return;
				}

				// 根据用户的选择重新构造数据
				var _data = {
					name: data.data.records[2].chart.name,
					x: data.data.records[2].chart.x,
					y: []
				};

				_.each(select, function(val, index) {
					_data.y.push(data.data.records[2].chart.y[val]);
				});

				// 构造渲染图表数据
				var y2 = {
					info: [],
					data: []
				};
				_.each(_data.y, function(val, index) {

					// y 轴标题
					if(index % 2 !== 0) {
						y2.info.push({
							labels: {
								format: '{value}'
							},
							title: {
								text: ''
							},
							opposite: true
						});

						// y 轴数据
						y2.data.push({
							name: val.name,
							type: 'spline',
							yAxis: index,
							data: val.data
						})
					} else {
						y2.info.push({
							labels: {
								format: '{value}'
							},
							title: {
								text: ''
							}
						});

						// y 轴数据
						y2.data.push({
							name: val.name,
							type: 'spline',
							dashStyle: 'shortdot',
							yAxis: index,
							data: val.data
						})
					}
				});

				// 渲染图表
				renderChart($('#overview-chart2'), {
						title: _data.name,
						x: _data.x,
						y: y2
					});
				});
			}
		}
	}
});

//查询
$('#search').on('click', function() {

	//获取日期
	var date = datePicker.getVal('#delivery-overview-datepicker');

	//执行搜索
	ajax.get({
		url: '/deal/overview/listPlatformDatas.do',
		param: {
			startDate: date.start,
			endDate: date.end,
			page: 1,
			export: false,
			customId: urler.normal().cid
		},
		cb: function(data) {

			// 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
			data.data.ajaxParam = encodeURIComponent(JSON.stringify({
				startDate: date.start,
				endDate: date.end,
				page: 1,
				export: false
			}));
			for(var i = 0; i < data.data.records.length; i++) {
				var val = data.data.records[i];
			}
			if(getJasonLength(data.data) > 0) {
				if(data.data.records[0].chart !== null) {

					// 渲染模板
					var tpl = $('#overview-platform-text-tpl').html();
					$('#overview-platform-text').html(_.template(tpl)(data));

					var chartTableData = [];
					var yName = [];
					chartTableData.push(data.data.records[0].chart.x);

					// 2. 提取 y 轴数据
					_.each(data.data.records[0].chart.y, function(val,index) {
						chartTableData.push(val.data);
						yName.push(val.name);
					});
					$('#overview-chart-wrap').html(_.template($('#overview-chart-tpl').html())({
						data: {
							records: arrayer.upsideDown(chartTableData),
							yName: yName
						}
					}))

					// 构造渲染图表数据
					var y = {
						info: [],
						data: []
					};
					_.each(data.data.records[0].chart.y, function(val, index) {

						// y 轴标题
						if(index % 2 !== 0) {
							y.info.push({
								labels: {
									format: '{value}'
								},
								title: {
									text: ''
								},
								opposite: true
								});
						} else {
							y.info.push({
								labels: {
									format: '{value}'
								},
								title: {
									text: ''
								}
							});
						}

						// y 轴数据
						y.data.push({
							name: val.name,
							type: 'spline',
							data: val.data
						})
					});

					//渲染图表
					renderChart($('#overview-chart'), {
						title: data.data.records[0].chart.name,
						x: data.data.records[0].chart.x,
						y: y
					});

					// 构造数据
					var selectData = {};
					_.each(data.data.records[0].chart.y, function(val, index) {
						selectData[index] = val.name;
					});

					// 渲染下拉选择框模板
					$('#overview-chart-select').html(_.template($('#type-tpl').html())({data: selectData}));

					//  初始化图表下拉选择框
					$('#overview-chart-select').select2({
						placeholder: '选择显示数据'
					}).select2('val', '');

					//生成图表
					$('#overview-generate-chart').click(function() {
						var select = select2.getVal({
							id: '#overview-chart-select'
					});
					if(select === null) {
						modal.nobtn({
							ctx: 'body',
							ctn: '请选择展示数据参数选项',
							title: '数据统计'
						});
						return;
					}

					// 判定数量只能为两个
					if(select.length !== 2) {
						modal.nobtn({
							ctx: 'body',
							ctn: '请选择两个选项',
							title: '数据统计'
						});
						return;
					}

					// 根据用户的选择重新构造数据
					var _data = {
						name: data.data.records[0].chart.name,
						x: data.data.records[0].chart.x,
						y: []
					};

					_.each(select, function(val, index) {
						_data.y.push(data.data.records[0].chart.y[val]);
					});

					// 构造渲染图表数据
					var y = {
						info: [],
						data: []
					};
					_.each(_data.y, function(val, index) {

						// y 轴标题
						if(index % 2 !== 0) {
							y.info.push({
								labels: {
									format: '{value}'
								},
								title: {
									text: ''
								},
								opposite: true
							});

							// y 轴数据
							y.data.push({
								name: val.name,
								type: 'spline',
								yAxis: index,
								data: val.data
							})
						} else {
							y.info.push({
								labels: {
									format: '{value}'
								},
								title: {
									text: ''
								}
							});

							// y 轴数据
							y.data.push({
								name: val.name,
								type: 'spline',
								dashStyle: 'shortdot',
								yAxis: index,
								data: val.data
							})
						}
					});

					// 渲染图表
					renderChart($('#overview-chart'), {
							title: _data.name,
							x: _data.x,
							y: y
						});
					});
				}
			}
			if(getJasonLength(data.data) === 2) {
				if(data.data.records[1].chart !== null) {

					//腾讯平台
					var tpl1 = $('#overview-platform-text-tpl1').html();
					$('#overview-platform-text1').html(_.template(tpl1)(data));

					// 2.构造腾讯渲染数据
					var chartTableData1 = [];
					var yName1 = [];
					chartTableData1.push(data.data.records[1].chart.x);

					// 2. 提取 y 轴数据
					_.each(data.data.records[1].chart.y, function(val,index) {
						chartTableData1.push(val.data);
						yName1.push(val.name);
					});
					$('#overview-chart-wrap1').html(_.template($('#overview-chart-tpl1').html())({
						data: {
							records1: arrayer.upsideDown(chartTableData1),
							yName1: yName1
						}
					}))

					// 构造渲染图表数据
					var y1 = {
						info: [],
						data: []
					};
					_.each(data.data.records[1].chart.y, function(val, index) {

						// y 轴标题
						if(index % 2 !== 0) {
							y1.info.push({
								labels: {
									format: '{value}'
								},
								title: {
									text: ''
								},
								opposite: true
								});
						} else {
							y1.info.push({
								labels: {
									format: '{value}'
								},
								title: {
									text: ''
								}
							});
						}

						// y 轴数据
						y1.data.push({
							name: val.name,
							type: 'spline',
							data: val.data
						})
					});

					//渲染图表
					renderChart($('#overview-chart1'), {
						title: data.data.records[1].chart.name,
						x: data.data.records[1].chart.x,
						y: y1
					});

					// 构造数据
					var selectData1 = {};
					_.each(data.data.records[1].chart.y, function(val, index) {
						selectData[index] = val.name;
					});

					// 渲染下拉选择框模板
					$('#overview-chart-select1').html(_.template($('#type-tpl1').html())({data: selectData}));

					// 初始化图表下拉选择框
					$('#overview-chart-select1').select2({
						placeholder: '选择显示数据'
					}).select2('val', '');

					// 生成图表
					$('#overview-generate-chart1').click(function() {
						var select = select2.getVal({
							id: '#overview-chart-select1'
					});

					// 如果没有选择数据参数
					if(select === null) {
						modal.nobtn({
							ctx: 'body',
							ctn: '请选择展示数据参数选项',
							title: '数据统计'
						});
						return;
					}

					// 判定数量只能为两个
					if(select.length !== 2) {
						modal.nobtn({
							ctx: 'body',
							ctn: '请选择两个选项',
							title: '数据统计'
						});
						return;
					}

					// 根据用户的选择重新构造数据
					var _data = {
						name: data.data.records[1].chart.name,
						x: data.data.records[1].chart.x,
						y: []
					};

					_.each(select, function(val, index) {
						_data.y.push(data.data.records[1].chart.y[val]);
					});

					// 构造渲染图表数据
					var y1 = {
						info: [],
						data: []
					};
					_.each(_data.y, function(val, index) {

						// y 轴标题
						if(index % 2 !== 0) {
							y1.info.push({
								labels: {
									format: '{value}'
								},
								title: {
									text: ''
								},
								opposite: true
							});

							// y 轴数据
							y1.data.push({
								name: val.name,
								type: 'spline',
								yAxis: index,
								data: val.data
							})
						} else {
							y1.info.push({
								labels: {
									format: '{value}'
								},
								title: {
									text: ''
								}
							});

							// y 轴数据
							y1.data.push({
								name: val.name,
								type: 'spline',
								dashStyle: 'shortdot',
								yAxis: index,
								data: val.data
							})
						}
					});

					// 渲染图表
					renderChart($('#overview-chart1'), {
							title: _data.name,
							x: _data.x,
							y: y1
						});
					});
				}
			}
			if(getJasonLength(data.data) === 3) {
				if(data.data.records[2].chart !== null) {

					//sina平台
					var tpl2 = $('#overview-platform-text-tpl2').html();
					$('#overview-platform-text2').html(_.template(tpl2)(data));

					//sina平台
					var chartTableData2 = [];
					var yName2 = [];
					chartTableData2.push(data.data.records[2].chart.x);

					// 2. 提取 y 轴数据
					_.each(data.data.records[2].chart.y, function(val,index) {
						chartTableData2.push(val.data);
						yName2.push(val.name);
					});
					$('#overview-chart-wrap2').html(_.template($('#overview-chart-tpl2').html())({
						data: {
							records: arrayer.upsideDown(chartTableData2),
							yName2: yName2
						}
					}))

					// 构造渲染图表数据
					var y2 = {
						info: [],
						data: []
					};
					_.each(data.data.records[2].chart.y, function(val, index) {

						// y 轴标题
						if(index % 2 !== 0) {
							y2.info.push({
								labels: {
									format: '{value}'
								},
								title: {
									text: ''
								},
								opposite: true
								});
						} else {
							y2.info.push({
								labels: {
									format: '{value}'
								},
								title: {
									text: ''
								}
							});
						}

						// y 轴数据
						y2.data.push({
							name: val.name,
							type: 'spline',
							data: val.data
						})
					});

					// 渲染图表
					renderChart($('#overview-chart2'), {
						title: data.data.records[2].chart.name,
						x: data.data.records[2].chart.x,
						y: y
					});

					// 构造数据
					var selectData2 = {};
					_.each(data.data.records[2].chart.y, function(val, index) {
						selectData2[index] = val.name;
					});

					// 渲染下拉选择框模板
					$('#overview-chart-select2').html(_.template($('#type-tpl2').html())({data: selectData2}));

					// 初始化图表下拉选择框
					$('#overview-chart-select2').select2({
						placeholder: '选择显示数据'
					}).select2('val', '');

					// 生成图表
					$('#overview-generate-chart2').click(function() {
						var select = select2.getVal({
							id: '#overview-chart-select2'
					});

					// 如果没有选择数据参数
					if(select === null) {
						modal.nobtn({
							ctx: 'body',
							ctn: '请选择展示数据参数选项',
							title: '数据统计'
						});
						return;
					}

					// 判定数量只能为两个
					if(select.length !== 2) {
						modal.nobtn({
							ctx: 'body',
							ctn: '请选择两个选项',
							title: '数据统计'
						});
						return;
					}

					// 根据用户的选择重新构造数据
					var _data = {
						name: data.data.records[2].chart.name,
						x: data.data.records[2].chart.x,
						y: []
					};

					_.each(select, function(val, index) {
						_data.y.push(data.data.records[2].chart.y[val]);
					});

					// 构造渲染图表数据
					var y2 = {
						info: [],
						data: []
					};
					_.each(_data.y, function(val, index) {

						// y 轴标题
						if(index % 2 !== 0) {
							y2.info.push({
								labels: {
									format: '{value}'
								},
								title: {
									text: ''
								},
								opposite: true
							});

							// y 轴数据
							y2.data.push({
								name: val.name,
								type: 'spline',
								yAxis: index,
								data: val.data
							})
						} else {
							y2.info.push({
								labels: {
									format: '{value}'
								},
								title: {
									text: ''
								}
							});

							// y 轴数据
							y2.data.push({
								name: val.name,
								type: 'spline',
								dashStyle: 'shortdot',
								yAxis: index,
								data: val.data
							})
						}
					});

					// 渲染图表
					renderChart($('#overview-chart2'), {
							title: _data.name,
							x: _data.x,
							y: y2
						});
					});
				}
			}
		},
		modal: modal,
		title: '投放信息概览'
	});
});

//点击btn，请求发送不同的平台platformId,更换平台列表,获取平台审核列表数据
$('body').on('click', '.wbshowflag', function() {
	if(weiboflag === true) {
		ajax.get({
			url: '/deal/overview/countAd.do',
			param: {
				platformId: 2,
				customId: parseInt(urler.normal().cid)
			},
			cb: function(data) {
				var tpl = $('#overview-count-data-tpl').html();
				$('#overview-count-data').html(_.template(tpl)(data));
			},
		});
		$('#weibo').css('display', 'none');
		$('#tengxun').css('display', 'block');
		$('.ovplatform-btn').addClass('txshowflag');
		$('.wbshowflag').removeClass('wbshowflag');
		tengxunflag = true;
	}
});

$('body').on('click', '.txshowflag', function() {
	if(tengxunflag === true ) {
		ajax.get({
			url: '/deal/overview/countAd.do',
			param: {
				platformId: 3,
				customId: parseInt(urler.normal().cid)
			},
			cb: function(data) {
				var tpl = $('#overview-count-data-tpl').html();
				$('#overview-count-data').html(_.template(tpl)(data));
			},
		});
		$('#weibo').css('display', 'none');
		$('#tengxun').css('display', 'none');
		$('#sina').css('display', 'block');
		$('.ovplatform-btn').addClass('sinashowflag');
		$('.ovplatform-btn').removeClass('txshowflag');
		sinaflag = true;
		tengxunflag = false;
	}
});

$('body').on('click', '.sinashowflag', function() {
	if(sinaflag === true) {
		ajax.get({
			url: '/deal/overview/countAd.do',
			param: {
				platformId: 1,
				customId: parseInt(urler.normal().cid)
			},
			cb: function(data) {
				var tpl = $('#overview-count-data-tpl').html();
				$('#overview-count-data').html(_.template(tpl)(data));
			},
		});
		$('#weibo').css('display', 'block');
		$('#tengxun').css('display', 'none');
		$('#sina').css('display', 'none');
		$('.ovplatform-btn').removeClass('sinashowflag');
		$('.ovplatform-btn').addClass('wbshowflag');
		sinaflag = false;
		tengxunflag = true;
	}
});

/**
 * 渲染图图表，列表一开始是通过日期去请求数据，数据请求完成后需要将 Y 轴的 name
 * 提取出来，作为图表左上和右上两个下拉框，当用户选择左上和右上两个下拉框则重新
 * 渲染图表，图表中展示的就是左边和右边两个下拉框选择的数据
 */
function renderChart($el, chart) {
	$el.highcharts({
		chart: {
			zoomType: 'xy'
		},
		title: {
			text: chart.title
		},
		subtitle: {
			text: ''
		},
		xAxis: [{
			categories: chart.x,
			crosshair: true
		}],
		yAxis: chart.y.info,
		series: chart.y.data
	});
}
