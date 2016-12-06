export default {

    /**
     * 显示以 msg 为内容提示框
     * @param {String} msg - 纯粹的字符串或者 html 字符
     */
    tip(msg) {
        $('#tip-content').html(msg);
        $('#tip').fadeIn('fast');
        setTimeout(() => {
            $('#tip').fadeOut('fast');
        }, 1500);
    },

    /**
     * 显示确认取消弹出框（用户可以传递一个事件作为弹出框确定按钮的事件, 也可以定制确定按钮的字体）
     * @param {String} msg - 纯粹的字符串或者 html 字符
     * @param {Function} evt - 确定按钮的事件
     * @param {String} evtLabel - 确认按钮的文字
     */
    dialog({ msg, evt, evtLabel }) {
        $('#modal-dialog-btn').unbind('click').bind('click', evt);
        if(evtLabel) $('#modal-dialog-btn').html(evtLabel);
        $('#modal-dialog-content').html(msg);
        $('#modal-dialog').modal();
    },

    /**
     * 显示确认弹出框（用户可以传递一个事件作为弹出框确定按钮的事件, 也可以定制确定按钮的字体）
     * @param {String} msg - 纯粹的字符串或者 html 字符
     * @param {Function} evt - 确定按钮的事件
     * @param {String} evtLabel - 确认按钮的文字
     */
    confirm({ msg, evt, evtLabel }) {
        $('#modal-confirm-btn').unbind('click').bind('click', evt);
        if(evtLabel) $('#modal-confirm-btn').html(evtLabel);
        $('#modal-confirm-content').html(msg);
        $('#modal-confirm').modal();
    },

    /**
     * 显示完全定制弹出框（用户传递 html 字符串，将作为弹出框的内容）
     * @param {String} ctn - html 字符串
     * @param {String} className - 为弹窗设置一个类名
     */
    diy({ ctn, className = '' }) {
        $('#modal-diy').addClass(className);
        $('#modal-diy-body').html(ctn);
        $('#modal-diy').modal();
    },

    /**
     * 图片预览弹出窗（用户传递图片地址，作为弹出窗中显示的图片地址）
     * @param {String} address - 弹出窗图片地址
     */
    preview({ address }) {
        $('#modal-image-preview').find('img').attr('src', address);
        $('#modal-image-preview').modal();
        $('#modal-image-preview .modal-dialog').unbind('click').bind('click', () => {
            $('#modal-image-preview').modal('hide');
        });
    }
};
