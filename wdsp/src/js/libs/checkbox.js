export default {

    /**
     * 渲染 checkbox
     * @param {String} selector - checkbox 的选择器
     */
    render({ selector }) {
        let $wrap = $(selector); // 包含块
        let $input = $('[type="checkbox"]', $wrap); // input 框

        // 如果用户点击了 checkbox，则相应的变化 shadowInput 的显示样式
        $input.change(e => {
            let self = e.currentTarget;
            let $parent = $(self).parent(selector);

            // 如果用户选中了 checkbox
            if (self.checked) {
                $parent.addClass('active');

            // 用户没选中 checkbox
            } else {
                $parent.removeClass('active');
            }
        });
    }
}
