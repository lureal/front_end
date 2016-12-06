export default {

    /**
     * 打开通知
     * @param {String} msg - 提醒的信息, html 或者纯粹的字符串
     */
    open(msg) {
        $('#notice-content').html(msg);
        $('body').addClass('active-notice');
    },

    /**
     * 关闭通知
     */
    close() {
        $('body').removeClass('active-notice');
    }
};
