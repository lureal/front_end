module.exports = {
    methods: {

        /**
         * 封装 http get 请求
         * @param {String} url [请求链接]
         * @param {Object} param [请求参数，默认为空]
         * @param {Function} cb [回掉函数]
         * @param {Function} error [出错时的回掉函数]
         */
        get(url, param = {}, cb = ((data) => {}), error = ((data) => {})) {
            $.get(url, param)
             .done((data) => {
                 data = JSON.parse(data);

                 if(data.code === -100) {

                     // 登陆失败
                     window.router.go({
                         path: '/login'
                     });
                     return;
                 }

                 cb(data);
             })
             .fail((data) => {
                 data = JSON.parse(data);
                 error(data);
             });
        },

        /**
         * 由于接口没有 post 请求，所以废弃
         *
         * 封装 http post 请求
         * @param {String} url [请求链接]
         * @param {Object} param [请求参数，默认为空]
         * @param {Function} cb [回掉函数]
         * @param {Function} error [出错时的回掉函数]
         */
        post(url, param = {}, cb = ((data) => {}), error = ((data) => {})) {
            $.post(url, param)
             .done((data) => {
                 data = JSON.parse(data);
                 cb(data);
             })
             .fail((data) => {
                 data = JSON.parse(data);
                 error(data);
             });
        }
    }
}
