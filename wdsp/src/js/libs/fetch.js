import modaler from './modaler';
import urler from './urler';
import { urlAddParam } from './tools';

// 全局设置 ajax 请求
$.ajaxSetup({
    cache: false,
    data: {
        customId: urler().cid
    }
});

/**
 * 根据 http 返回的状态码进行不同处理
 * @param {Number} code - http 状态码
 * @param {String} msg - 服务器传递过来的信息
 * @param {String} link - 需要跳转的链接
 * @returns {Number}
 */
const handleCode = ({code, msg, link}) => {

    // 如果状态码在 200 - 300 之间，直接返回，在后续的代码中做特定处理
    if (code <= 299 && code >= 200) {
        return true;
    }

    // 公共的状态码处理
    switch (code) {

        // 未登录，跳转到登录页面
        case 100:
            location.href = '/#proj_name#/html/user/login.html';
            return false;

        // 用户无权访问该请求
        case 101:
            modaler.tip('该用户无限访问该请求');
            return false;

        // 直接跳转到服务器返回的链接
        case 300:
            location.href = link;
            return false;

        // 展示给用户返回的结果，用户确认后，跳转到指定连接
        case 301:
            modaler.modal({ msg: msg, evt () {
                location.href = link;
            }});
            return false;

        // 请求错误，提示 message 给用户
        case 400:
            modaler.tip(msg);
            return false;

        // 服务器异常
        case 500:
            modaler.tip('服务器异常');
            return false;

        // 服务器停机维护
        case 501:
            modaler.tip('服务器停机维护中');
            return false;

        default:
            console.log(`当前状态码为：${code}，这个状态码没有被约定做某些特定的操作。`);
    }
};

export default {

    /**
     * http get 请求
     * @param {String} url - 请求服务器的链接
     * @param {Object} ajaxParam - 请求服务器的参数
     */
    get(url, param) {
        return new Promise((resolve, reject) => {
            $.get(url, param)
                .done(res => {
                    let _res = JSON.parse(res);

                    if (handleCode({ code: _res.code, msg: _res.message, link: _res.data })) {
                        resolve(_res);

                        // 为文中的链接添加上 cid 参数
                        urlAddParam();
                    }
                })
                .fail(err => {
                    reject(err);
                })
        });
    },

    /**
     * http post 请求
     * @param {String} url - 请求服务器的链接
     * @param {Object} param - 请求服务器的参数
     */
    post(url, param) {
        return new Promise((resolve, reject) => {
            $.post(url, param)
                .done(res => {
                    let _res = JSON.parse(res);

                    if (handleCode({ code: _res.code, msg: _res.message, link: _res.data })) {
                        resolve(_res);

                        // 为文中的链接添加上 cid 参数
                        urlAddParam();
                    }
                })
                .fail(err => {
                    reject(err);
                })
        });
    },

    /**
     * 直接使用 $.post 上传图片会报 Uncaught TypeError: Illegal invocation 错误
     * @param {String} url - 链接
     * @param {Object} param - 参数
     * @param {Object} settle - 设置
     */
    ajax(url, param, settle) {
        return new Promise((resolve, reject) => {
            let _settle = $.extend({}, { url: url, data: param }, settle);

            $.ajax(_settle)
                .done(res => {
                    let _res = JSON.parse(res);

                    if (handleCode({ code: _res.code, msg: _res.message, link: _res.data })) {
                        resolve(_res);

                        // 为文中的链接添加上 cid 参数
                        urlAddParam();
                    }
                })
                .fail(err => {
                    console.log(true);
                    reject(err);
                })
        });
    }
}
