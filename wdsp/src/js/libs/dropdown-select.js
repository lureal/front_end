
/**
 * 关闭下拉框
 */
export let closeDropdown = () => {
    $('.w-dropdown-normal').each((index, el) => {
        let $el = $(el);

        // 如果当前下拉框是打开的状态，则关闭它
        if ($el.attr('data-open', '1')) {
            $el.find('.w-select-main').hide();
            $el.attr('data-open', '0');
        }
    });
};

/**
 * 正常下拉选择框
 * @param {String} el - 元素
 * @param {Object} data - 初始化数据
 * @param {Function} cb - 确定按钮回掉函数
 * @param {Boolean} noLimitOpera - 是否需要对代码中的不限选项进行额外操作
 */
export let dropdownNormal = ({ el, initData, cb = () => {}, isComplex = false, complexTpl, noLimitOpera = false }) => {
    let $el = $(el);
    let $selectBtn = $('.w-select-btn', $el);
    let $selectMain = $('.w-select-main', $el);
    let $selectLists = $('.w-select-lists', $el);
    let $confirmBtn = $('.w-select-footer > a', $el);
    let $selectAll = $('.w-select-footer [type="checkbox"]', $el);
    let $selectAllWrap = $('.w-select-footer .w-checkbox', $el);
    let selectTarget = $el.attr('data-target');
    let $selectTarget = $(selectTarget);
    let limitNumber = Number($el.attr('data-limit')); // 限制选择的数量，留空则代表不限制
    let cacheSelectVal = []; // 缓存选中的值
    let isSelectAll = false; // 缓存当前是否全选了弹出框的项

    // 如果当前有初始化的数据，则初始化界面
    // {
    //     records: [], // 所有的 item
    //     selectItem: [] // 当前选中的 item
    // }
    if (initData) {

        // 渲染出下拉框内部的选项
        let tpl;

        if (isComplex) {
            tpl = complexTpl;
        } else {
            tpl = $('#dropdown-normal-tpl').html();
        }

        $('ul', $selectMain).html(_.template(tpl)(initData));

        // 渲染出勾选的项目
        if (initData.selectItem) {
            for (let item of initData.selectItem) {
                let $input = $parentWrap.find(`.w-checkbox [type="checkbox"][value="${item.val}"]`);
                $input.prop('checked', true);
                $input.parents('.w-checkbox').addClass('active');
            }
        }
    }

    // 弹出下拉框
    $selectBtn.unbind('click').bind('click', e => {
        let $parentWrap = $(e.currentTarget).parent();

        // 如果 $selectTarget 有数据，则初始化下拉框并将数据缓存到 cacheSelectVal
        let data = !$selectTarget.attr('data-selected') ? '[]' : $selectTarget.attr('data-selected');
        data = JSON.parse(decodeURIComponent(data));
        cacheSelectVal = data;

        // 取消选择所有的 [type="checkbox"]
        $parentWrap.find('.w-checkbox').each((index, el) => {
            let $el = $(el);

            $el.removeClass('active');
            $el.find('[type="checkbox"]').prop('checked', false);
        });

        // 勾选特定的 checkbox
        for (let item of data) {
            let $input = $parentWrap.find(`.w-checkbox [type="checkbox"][value="${item.val}"]`);
            $input.prop('checked', true);
            $input.parents('.w-checkbox').addClass('active');
        }

        // 如果当前是全选状态，则勾选全选框
        if (isSelectAll) {
            $selectAll.prop('checked', true);
            $selectAllWrap.addClass('active');
        }

        // 当前是打开状态
        if ($el.attr('data-open') === '0') {
            closeDropdown();
            $selectMain.show();
            $el.attr('data-open', '1');

        // 当前是关闭状态
        } else {
            closeDropdown();
        }
    });

    // 避免冒泡
    $el.find('*').bind('click', e => {
        e.stopPropagation();
    });

    // 获取当前用户点击
    $selectLists.find('[type="checkbox"]').change(e => {
        let self = e.currentTarget;
        let value = $(self).val();
        let name = $(self).attr('data-name');

        // 如果当前用户勾选了勾选框
        if (self.checked) {
            cacheSelectVal.push({
                val: value,
                name: name
            });

            // 复杂下拉框勾选一级框相应的二级框全部加入
            if (isComplex) {
                let $parent = $(self).parents('.w-checkbox').parent();
                $parent.find('[type="checkbox"]').prop('checked', true);
                $parent.find('ul .w-checkbox').addClass('active');

                // 将子项目推入缓存数组
                $parent.find('ul [type="checkbox"]').each((index, el) => {
                    let value = $(el).val();
                    let name = $(el).attr('data-name');
                    let isHaveItem = false; // 标识当前子项是否已经在缓存数组中

                    for (let item of cacheSelectVal) {
                        if (item.val === value) {
                            isHaveItem = true;
                        }
                    }

                    if (!isHaveItem) {
                        cacheSelectVal.push({
                            val: value,
                            name: name
                        });
                    }
                });
            }

        // 当前用户取消勾选勾选框
        } else {
            isSelectAll = false;
            $selectAll.prop('checked', false);
            $selectAllWrap.removeClass('active');

            for (let i = 0; i < cacheSelectVal.length; i++) {
                if (cacheSelectVal[i].val === value) {
                    cacheSelectVal.splice(i, 1);
                }
            }

            // 如果当前取消勾选的是一级框，则二级框则一并全部取消勾选
            if (isComplex) {
                let $parent = $(self).parents('.w-checkbox').parent();
                
                // 如果当前有子项目
                if ($parent.find('ul').length > 0) {
                    
                    // 取消勾选所有的子项
                    $parent.find('ul [type="checkbox"]').prop('checked', false);
                    $parent.find('ul .w-checkbox').removeClass('active');

                    // 从缓存数组中删除子项
                    $parent.find('ul [type="checkbox"]').each((index, el) => {
                        let value = $(el).val();

                        for (let i = 0; i < cacheSelectVal.length; i++) {
                            if (cacheSelectVal[i].val === value) {
                                cacheSelectVal.splice(i, 1);
                            }
                        }
                    });
                }   
            }
        }

        // 如果需要对代码中的不限选项进行额外操作的话（选中不限则取消勾选其他，选择其他则取消勾选不限）
        if (noLimitOpera) {
            if (value === '0') {
                if (self.checked) {
                    $selectLists.find('[type="checkbox"]:not([value="0"])').each((index, el) => {
                        $(el).prop('checked', false);
                        $(el).parent().removeClass('active');
                    });
                    cacheSelectVal = [{
                        val: '0',
                        name: '不限'
                    }];
                }
            } else {
                if (self.checked) {
                    $selectLists.find('[type="checkbox"][value="0"]').prop('checked', false);
                    $selectLists.find('[type="checkbox"][value="0"]').parent().removeClass('active');

                    for (let i = 0; i < cacheSelectVal.length; i++) {
                        if (cacheSelectVal[i].val === '0') {
                            cacheSelectVal.splice(i, 1);
                        }
                    }
                }
            }
        }
    });

    // 全选按钮，当勾选勾选框时，全选下拉框里面的所有狗选框，当取消勾选全选框时，取消勾选下拉框内的全选框
    if ($selectAll.length > 0) {
        $selectAll.change(e => {
            let self = e.currentTarget;
            let $checkboxs = $selectLists.find('[type="checkbox"]');
            let $checkboxWrap = $selectLists.find('.w-checkbox');

            // 勾选全选框
            if (self.checked) {
                isSelectAll = true;
                
                // 勾选全选框
                $checkboxs.prop('checked', true);
                $checkboxWrap.addClass('active');
                
                // // 将数据推入缓存数组
                $checkboxs.each((index, el) => {
                    let value = $(el).val();
                    let name = $(el).attr('data-name');
                    let isHaveItem = false;

                    for (let item of cacheSelectVal) {
                        if (item.val === value) {
                            isHaveItem = true;
                        }
                    }
                    
                    if (!isHaveItem) {
                        cacheSelectVal.push({
                            val: value,
                            name: name
                        });
                    }
                });

            // 取消勾选全选框
            } else {
                isSelectAll = false;

                // 取消勾选全选框
                $checkboxs.prop('checked', false);
                $checkboxWrap.removeClass('active');

                // 清空缓存数组
                cacheSelectVal = [];

            }
        });
    }

    // 下拉框确定事件
    $confirmBtn.unbind('click').bind('click', e => {

        // 当前不限制选中的数量
        if (limitNumber === 0) {

            if (cacheSelectVal.length < 1) {
                modaler.tip('至少选择一个选项');
                return;
            }

            // 将数组中的值包裹成元素，追加到目标元素里面
            if ($selectTarget.length > 0) {
                let str = ''; // 等待赋值给目标元素的 html 字符串
                for (let item of cacheSelectVal) {
                    str += `
                        <span data-val="${item.val}">
                            ${item.name}<i class="fa fa-close"></i>
                        </span>`;
                }
                $selectTarget.html(str).show();
                $selectTarget.attr('data-selected', encodeURIComponent(
                    JSON.stringify(cacheSelectVal)
                ));
            }

        // 当前限制选中的数量
        } else {

            // 如果当前选中的项已经超出了限制，则提示
            if (cacheSelectVal.length > limitNumber) {
                modaler.tip(`当前只能选择${limitNumber}个选项`);

            // 是少得选择一个选项
            } else if (cacheSelectVal.length < 1) {
                modaler.tip(`至少选择一个选项`);
            } else {

                // 将数组中的值包裹成元素，追加到目标元素里面
                if ($selectTarget.length > 0) {
                    let str = ''; // 等待赋值给目标元素的 html 字符串
                    for (let item of cacheSelectVal) {
                        str += `
                            <span data-val="${item.val}">
                                ${item.name}<i class="fa fa-close"></i>
                            </span>`;
                    }
                    $selectTarget.html(str).show();
                    $selectTarget.attr('data-selected', encodeURIComponent(
                        JSON.stringify(cacheSelectVal)
                    ));
                }
            }
        }

        cb(cacheSelectVal);
        closeDropdown();
    });

    // 复杂下拉框开启和关闭状态中的元素允许冒泡，避免绑定不了事件现象
    $selectLists.find('.dropdown-toggle *').unbind('click').bind('click', e => {
        e.cancelBubble = true;
    });

    // 复杂下拉框打开和关闭状态
    $selectLists.find('.dropdown-toggle').unbind('click').bind('click', e => {
        let $self = $(e.currentTarget);

        // 如果当前是关闭状态，则打开
        if ($self.hasClass('close-ul')) {
            $self.removeClass('close-ul').addClass('open-ul');

        // 如果当前是打开状态，则关闭
        } else {
            $self.removeClass('open-ul').addClass('close-ul');
        }
    });

    // 如果有指定特定元素，则为特定元素绑定删除选项事件
    $('body').on('click', `${selectTarget} .fa-close`, e => {
        let $self = $(e.currentTarget);
        let $parent = $self.parents(selectTarget);
        let id = $self.parent().attr('data-val');

        // 删除缓存的数据
        let data = !$parent.attr('data-selected') ? '[]' : $parent.attr('data-selected');
        data = JSON.parse(decodeURIComponent(data));

        // 拿到要删除的元素
        for (let i = 0; i < data.length; i++) {
            if (data[i].val === id) {
                data.splice(i, 1);
            }
        }

        // 从存储位置中删除
        $parent.attr('data-selected', encodeURIComponent(JSON.stringify(data)));

        // 从界面中删除
        $self.parent().remove();

        // 如果当前删除的是最后一个，则整个块隐藏
        if (data.length < 1) {
            $parent.hide();
        }
    });
};

/**
 * 初始化正常下拉框
 * @param {String} el - 正常
 * @param {String} url - 请求的链接
 * @param {Function} handle - 数据处理函数，用来处理服务器返回的数据
 * @param {Object} data - 如果没有请求的链接，则根据数据来渲染出下拉框
 * @param {Object} cb - 回调函数
 * @param {Boolean} noLimitOpera - 是否对不限有操作
 */
export let initDropdownNormal = ({ el, url, handle, data = {}, renderCb = () => {}, confirmCb = () => {}, isComplex = false, complexTpl, noLimitOpera = false }) => {

    // 如果当前用户传递了 url，则请求服务器的数据渲染下拉框
    if (url) {
        requester.get(url).then(data => {
            let _data = data;

            if (handle) {
                _data = handle(_data);
            }

            if (isComplex === true) {
                dropdownNormal({
                    el: el,
                    initData: _data,
                    cb: confirmCb,
                    isComplex: isComplex,
                    complexTpl: complexTpl,
                    noLimitOpera: noLimitOpera
                });
            } else {
                dropdownNormal({
                    el: el,
                    initData: _data,
                    cb: confirmCb,
                    noLimitOpera: noLimitOpera
                });
            }

            renderCb(_data);
        });

    // 当前用户没有传递 url，则采用 data 来渲染数据
    } else {
        let _data = data;

        if (handle) {
            _data = handle(_data);
        }

        if (isComplex === true) {
            dropdownNormal({
                el: el,
                initData: _data,
                cb: confirmCb,
                isComplex: isComplex,
                complexTpl: complexTpl,
                noLimitOpera: noLimitOpera
            });
        } else {
            dropdownNormal({
                el: el,
                initData: _data,
                cb: confirmCb,
                noLimitOpera: noLimitOpera
            });
        }

        renderCb(_data);
    }
};

/**
 * 绑定关闭下拉框事件
 */
export let bindCloseDropdownEvt = () => {

    // 绑定事件到 body 上
    $('body').on('click', closeDropdown);
}
