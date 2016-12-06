export default {

    /**
     * 上传图片
     * @param {String} container - 包含块
     * @param {String} fileName - 字段名称
     * @param {Function} cb - 回调函数
     */
    image ({ container, fileName, cb = () => {} }) {
        let $input = $(container + '-upload');
        let $img = $(container + '-img');
        let $button = $(container + '-button');

        // 上传事件
        $input.unbind('change').bind('change', (e) => {

            // 构造上传数据
            let formData = new FormData();
            formData.append(fileName, e.target.files[0]);

            // 缓存按钮文字并按钮设置为 loading
            let cacheBtnText = $button.html();
            $button.html('<img src="/#proj_name#/img/loading.gif" alt="loading" style="width:14px;">');

            // 发送请求给服务器
            window.requester.ajax('/upload.do', formData, {
                method: 'POST',
                processData: false,
                contentType: false
            }).then(data => {
                // $img.show();
                $button.html(cacheBtnText);

                // 从上传路径中分离出文件名
                // $('> span', $img).html(data.data.dlUrl);
                cb(data);
            });
        });
    }
};
