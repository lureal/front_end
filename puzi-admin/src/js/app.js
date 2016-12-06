/*!
 * 项目主文件
 * 用于引用其他文件
 */

// 引用模块
var ajax = require('./modules/ajax.js');
var modal = require('./modules/modal.js');
var regexp = require('./modules/regexp.js');
var usr = require('./modules/usr.js');
var time = require('./modules/time.js');
var storage = require('./modules/storage.js');
var util = require('./modules/util.js');

// 登录状态判定
// 根据当前 cookie 中是否有 JsessionId 这个字段来判定是否登录
// if(usr.isLogin()) {
// 	$('body').css('display', 'block');
// } else {
//
// 	// 如果当前已经在登录页面就不再跳转
// 	if(location.href.indexOf('/user/login') === -1) {
// 		location.href = '/#proj_name#/html/user/login.html';
// 	}
// }

// 根据 url 引用页面 js
// 通过判定当前的 url 是否有特定标识符片段来判定引用哪个 js
var url = location.href;

// 引用登录页面 js
if(url.indexOf('/user/login') !== -1) {
	require('./pages/login.js')(ajax, modal, regexp);
}

// 引用首页 js
if(url.indexOf('/home/index') !== -1) {
	require('./pages/home.js')(ajax, modal, time, storage);
}

// 引用活动列表页面 js
if(url.indexOf('/activity/list') !== -1) {
	require('./pages/activity-list.js')(ajax, modal, time, storage);
}

// 引用添加活动页面 js
if(url.indexOf('/activity/add') !== -1) {
	require('./pages/activity-add.js')(ajax, modal, time, util);
}

// 引用活动页面详情 js
if(url.indexOf('/activity/detail') !== -1) {
	require('./pages/activity-detail.js')(ajax, modal, time, storage, util);
}

// 引用文章列表页面 js
if(url.indexOf('/article/list') !== -1) {
	require('./pages/article-list.js')(ajax, modal, time, storage);
}

// 引用添加文章页面 js
if(url.indexOf('/article/add') !== -1) {
	require('./pages/article-add.js')(ajax, modal, time, util);
}

// 引用文章详情页面 js
if(url.indexOf('/article/detail') !== -1) {
	require('./pages/article-detail.js')(ajax, modal, storage, util);
}

// 引用添加标签页面 js
if(url.indexOf('/article/type') !== -1) {
	require('./pages/article-add-tag.js')(ajax, modal, storage, util);
}

// 引用作者列表页面 js
if(url.indexOf('/author/list') !== -1) {
	require('./pages/author-list.js')(ajax, modal, time, storage);
}

// 引用添加作者页面 js
if(url.indexOf('/author/add') !== -1) {
	require('./pages/author-add.js')(ajax, modal);
}

// 引用作者详情页面 js
if(url.indexOf('/author/detail') !== -1) {
	require('./pages/author-detail.js')(ajax, modal, storage);
}

// 引用合作方列表页面 js
if(url.indexOf('/parner/list') !== -1) {
	require('./pages/parner-list.js')(ajax, modal, time, storage);
}

// 引用添加合作方页面 js
if(url.indexOf('/parner/add') !== -1) {
	require('./pages/parner-add.js')(ajax, modal);
}

// 引用合作方详情页面
if(url.indexOf('/parner/detail') !== -1) {
	require('./pages/parner-detail.js')(ajax, modal, storage);
}

// 引用换量合作方列表 js
if(url.indexOf('/stream-parner/list') !== -1) {
	require('./pages/stream-parner-list.js')(ajax, modal, time, storage);
}

// 引用添加换量合作方 js
if(url.indexOf('/stream-parner/add') !== -1) {
	require('./pages/stream-parner-add.js')(ajax, modal);
}

// 引用换量合作方详情 js
if(url.indexOf('/stream-parner/detail') !== -1) {
	require('./pages/stream-parner-detail.js')(ajax, modal, storage);
}

// 引用订阅列表 js
if(url.indexOf('/feed/list') !== -1) {
	require('./pages/feed-list.js')(ajax, modal, time);
}

// 引用发送订阅 js
if(url.indexOf('/feed/send') !== -1) {
	require('./pages/feed-send.js')(ajax, modal, time, regexp);
}

// 引用活动注册 js
if(url.indexOf('/registration/list') !== -1) {
	require('./pages/registration-list.js')(ajax, modal, time);
}

// 引用 banner js
if(url.indexOf('/banner/list') !== -1) {
	require('./pages/banner-list.js')(ajax, modal, time);
}

// 引用添加 banner js
if(url.indexOf('/banner/add') !== -1) {
	require('./pages/banner-add.js')(ajax, modal, time);
}

// 引用广告 js
if(url.indexOf('/ad/list') !== -1) {
	require('./pages/ad-list.js')(ajax, modal, time);
}

// 引用添加广告 js
if(url.indexOf('/ad/add') !== -1) {
	require('./pages/ad-add.js')(ajax, modal, time);
}

// 引用用户管理js
if(url.indexOf('/comsumer/list') !== -1) {
	require('./pages/comsumer-list.js')(ajax, modal, time);
}

// 引用反馈管理js
if(url.indexOf('/feedback/list') !== -1) {
	require('./pages/feedback-list.js')(ajax, modal, time);
}

// 引用用户管理详情js
if(url.indexOf('/comsumer/detail') !== -1) {
	require('./pages/comsumer-detail.js')(ajax, modal, time);
}