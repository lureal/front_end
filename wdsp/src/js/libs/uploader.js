import {
    compareFileSize,
    convertToBytes,
    getImgFileInfo,
    getVideoFileInfo
} from './tools';

export default {

    /**
     * 单图片上传
     * @param {String} container - 包含块
     * @param {String} fileName - 传递给服务器的字段名称
     * @param {Function} cb - 回调函数
     * @param {Object} verify - 校验对象，大小，高宽
     * @param {Function} uploadCb - 上传图片后的回调函数
     * @param {Function} delCb - 删除图片后的回调函数
     */
    singleImage ({ container, fileName, cb = () => {}, verify, uploadCb = () => {}, delCb = () => {}}) {

        // 为 [type="upload"] 绑定事件
        $(container).on('change', '[type="file"]', e => {
            let $self = $(e.currentTarget);
            let $parent = $self.parents('.single-upload-item');
            let $addWrap = $parent.find('.add-wrap');
            let $uploadWrap = $parent.find('.upload-wrap');
            let $img = $parent.find('img');

            // 获取文件信息
            getImgFileInfo(e.target.files[0], (size, height, width) => {
                
                // 当前需要校验文件大小
                if (verify && verify.size) {
                    
                    // 获取单位
                    let _size, _unit;

                    // 如果当前单位是 bytes
                    if (verify.size.indexOf('bytes') !== -1) {
                        _unit = 'bytes';
                        _size = verify.size.slice(0, verify.size.indexOf('bytes'));
                    }

                    // 如果当前单位是 kb
                    if (verify.size.indexOf('kb') !== -1) {
                        _unit = 'kb';
                        _size = verify.size.slice(0, verify.size.indexOf('kb'));
                    }

                    // 如果当前单位是 mb
                    if (verify.size.indexOf('mb') !== -1) {
                        _unit = 'mb';
                        _size = verify.size.slice(0, verify.size.indexOf('mb'));
                    }

                    // 如果当前单位是 kb
                    if (verify.size.indexOf('kb') !== -1) {
                        _unit = 'kb';
                        _size = verify.size.slice(0, verify.size.indexOf('kb'));
                    }
                    
                    if (size > convertToBytes(Number(_size), _unit)) {
                        modaler.tip('<i class="fa fa-exclamation-circle"></i>当前文件过大，请缩小文件尺寸');
                        return;
                    }
                }

                // 当前需要校验文件高宽
                if (verify && verify.height && verify.width) {

                    // 如果当前需要校验多个尺寸
                    if (String(verify.height).indexOf(',') !== -1 || String(verify.width).indexOf(',') !== -1) {
                        
                        let heightArr = verify.height.replace(/\s/g, '').split(',');
                        let widthArr = verify.width.replace(/\s/g, '').split(',');

                        if (
                            !(
                                (height !== Number(heightArr[0]) && width !== Number(widthArr[0])) ||
                                (height !== Number(heightArr[1]) && width !== Number(widthArr[1]))
                            )
                        ) {
                            modaler.tip('<i class="fa fa-exclamation-circle"></i>请上传正确高宽的文件');
                            return;
                        }
                    
                    // 当前只需要校验一个尺寸
                    } else {
                        if (height !== verify.height || width !== verify.width) {
                            modaler.tip('<i class="fa fa-exclamation-circle"></i>请上传正确高宽的文件');
                            return;
                        }
                    }
                }

                // 构造上传数据
                let formData = new FormData();
                formData.append(fileName, e.target.files[0]);

                // 将数据发给服务器拿到图片链接
                requester.ajax('/upload.do', formData, {
                    method: 'POST',
                    processData: false,
                    contentType: false
                }).then(data => {
                    $img.attr('src', data.data.dlUrl);
                    $parent.removeClass('add').addClass('upload')

                    // 将链接绑定到元素上
                    $parent.attr('data-url', data.data.dlUrl);

                    uploadCb();
                });
            });
        });

        // 删除已上传的图片
        $(container).on('click', '.upload-wrap button', e => {
            let $self = $(e.currentTarget);
            let $parent = $self.parents('.single-upload-item');
            $parent.attr('data-url', '');
            $parent.removeClass('upload').addClass('add');

            delCb();
        });
    },

    /**
     * 多图片上传
     * @param {String} container - 包含块
     * @param {String} fileName - 传递给服务器的字段名称
     * @param {Function} cb - 回调函数
     * @param {Number} minEdge - 最小边界，默认为 0
     * @param {Number} maxEdge - 最大边界，默认为 9
     * @param {Object} verify - 校验对象，大小，高宽
     * @param {Function} uploadCb - 上传后的回调函数
     * @param {Function} delCb - 删除后的回调函数
     */
    multiImage ({ container, fileName, cb = () => {}, minEdge = 0, maxEdge = 9, verify, uploadCb = () => {}, delCb = () => {} }) {

        /**
         * @returns {Number} 获取已经上传的项的数目
         */
        let getItemSize = () => {
            return $(container + ' .multi-upload-item.upload').size();
        };

        // 为 [type="upload"] 绑定事件
        $(container).off('change').on('change', '[type="file"]', e => {
            let $self = $(e.currentTarget);
            let $parent = $self.parents('.multi-upload-item');
            let $addWrap = $parent.find('.add-wrap');
            let $uploadWrap = $parent.find('.upload-wrap');
            let $img = $parent.find('img');

            // 获取文件信息
            getImgFileInfo(e.target.files[0], (size, height, width) => {
                
                // 当前需要校验文件大小
                if (verify && verify.size) {
                    
                    // 获取单位
                    let _size, _unit;

                    // 如果当前单位是 bytes
                    if (verify.size.indexOf('bytes') !== -1) {
                        _unit = 'bytes';
                        _size = verify.size.slice(0, verify.size.indexOf('bytes'));
                    }

                    // 如果当前单位是 kb
                    if (verify.size.indexOf('kb') !== -1) {
                        _unit = 'kb';
                        _size = verify.size.slice(0, verify.size.indexOf('kb'));
                    }

                    // 如果当前单位是 mb
                    if (verify.size.indexOf('mb') !== -1) {
                        _unit = 'mb';
                        _size = verify.size.slice(0, verify.size.indexOf('mb'));
                    }

                    // 如果当前单位是 kb
                    if (verify.size.indexOf('kb') !== -1) {
                        _unit = 'kb';
                        _size = verify.size.slice(0, verify.size.indexOf('kb'));
                    }
                    
                    if (size > convertToBytes(Number(_size), _unit)) {
                        modaler.tip('<i class="fa fa-exclamation-circle"></i>当前文件过大，请缩小文件尺寸');
                        return;
                    }
                }

                // 当前需要校验文件高宽
                if (verify && verify.height && verify.width) {
                    if (height !== verify.height || width !== verify.width) {
                        modaler.tip('<i class="fa fa-exclamation-circle"></i>请上传正确高宽的文件');
                        return;
                    }
                }

                // 构造上传数据
                let formData = new FormData();
                formData.append(fileName, e.target.files[0]);

                // 将数据发给服务器拿到图片链接
                requester.ajax('/upload.do', formData, {
                    method: 'POST',
                    processData: false,
                    contentType: false
                }).then(data => {
                    $img.attr('src', data.data.dlUrl);
                    $parent.removeClass('add').addClass('upload')

                    // 将链接绑定到元素上
                    $parent.attr('data-url', data.data.dlUrl);

                    if (getItemSize() < maxEdge) {
                        let tpl = $('#multi-upload-item-tpl').html();
                        $(container).append(tpl);
                    }

                    uploadCb()
                });
            });
        });

        // 删除已上传的图片
        $(container).off('click').on('click', '.upload-wrap button', e => {
            let $self = $(e.currentTarget);
            let $parent = $self.parents('.multi-upload-item');
            $parent.remove();

            if (getItemSize() === (maxEdge - 1)) {
                let tpl = $('#multi-upload-item-tpl').html();
                $(container).append(tpl);
            }

            delCb();
        });
    },

    /**
     * 多图片上传，选择图片的时候可以选择多张图片
     * @param {String} container - 包含块
     * @param {String} fileName - 传递给服务器的字段名称
     * @param {Function} cb - 回调函数
     * @param {Number} minEdge - 最小边界，默认为 0
     * @param {Number} maxEdge - 最大边界，默认为 9
     * @param {Object} verify - 校验对象，大小，高宽
     * @param {Function} uploadCb - 上传后的回调函数
     * @param {Function} delCb - 删除后的回调函数
     */
    multiSelectImage ({ container, fileName, cb = () => {}, minEdge = 0, maxEdge = 9, verify, uploadCb = () => {}, delCb = () => {} }) {
        
        /**
         * @returns {Number} 获取已经上传的项的数目
         */
        let getItemSize = () => {
            return $(container + ' .multi-upload-item.upload').size();
        };

        // 为 [type="upload"] 绑定事件
        $(container).off('change').on('change', '[type="file"]', e => {
            let $self = $(e.currentTarget);
            let $parent = $self.parents('.multi-upload-item');
            let $addWrap = $parent.find('.add-wrap');
            let $uploadWrap = $parent.find('.upload-wrap');
            let $img = $parent.find('img');
            let minEdge = $(container).attr('data-minedge');
            let maxEdge = $(container).attr('data-maxedge');

            let isCheckDone = new Array(e.target.files.length);
            let errMsg = '';

            // 如果当前上传的数量已经超过限制的数量，则不给上传
            if (getItemSize() + e.target.files.length > Number(maxEdge)) {
                modaler.tip('<i class="fa fa-exclamation-circle"></i>请按照指定数量上传图片');
                return;
            }

            // 数据校验
            for (let i = 0; i < e.target.files.length; i++) {
                let file = e.target.files[i];

                getImgFileInfo(file, (size, height, width) => {
                    
                    // 校验文件大小
                    if (verify && verify.size) {

                        // 获取单位
                        let _size, _unit;

                        // 如果当前单位是 bytes
                        if (verify.size.indexOf('bytes') !== -1) {
                            _unit = 'bytes';
                            _size = verify.size.slice(0, verify.size.indexOf('bytes'));
                        }

                        // 如果当前单位是 kb
                        if (verify.size.indexOf('kb') !== -1) {
                            _unit = 'kb';
                            _size = verify.size.slice(0, verify.size.indexOf('kb'));
                        }

                        // 如果当前单位是 mb
                        if (verify.size.indexOf('mb') !== -1) {
                            _unit = 'mb';
                            _size = verify.size.slice(0, verify.size.indexOf('mb'));
                        }

                        // 如果当前单位是 kb
                        if (verify.size.indexOf('kb') !== -1) {
                            _unit = 'kb';
                            _size = verify.size.slice(0, verify.size.indexOf('kb'));
                        }
                        
                        if (size > convertToBytes(Number(_size), _unit)) {
                            errMsg = '当前文件过大，请缩小文件尺寸';
                            isCheckDone[i] = false;
                            return;
                        } else {
                            isCheckDone[i] = true;
                        }
                    }

                    // 校验文件高宽
                    if (verify && verify.height && verify.width) {
                        if (height !== verify.height || width !== verify.width) {
                            errMsg = '请上传正确高宽的文件';
                            isCheckDone[i] = false
                            return;
                        } else {
                            isCheckDone[i] = true;
                        }
                    }
                });
            }

            let checkTimer = setInterval(() => {
                let _isCheckDone = true;

                // 当前是否已经校验
                for (let item of isCheckDone) {
                    if (item === undefined) {
                        _isCheckDone = false;
                    }
                }

                // 当前图片校验已经完成
                if (_isCheckDone = true) {
                    clearInterval(checkTimer);
                    let isPass = true;
                    
                    for (let item of isCheckDone) {
                        if (item === false) {
                            isPass = false;
                        }
                    }

                    // 校验失败
                    if (isPass === false) {
                        modaler.tip(`<i class="fa fa-exclamation-circle"></i>${errMsg}`);

                    // 校验成功
                    } else {
                        let isUploadDone = new Array(e.target.files.length);
                        modaler.tip('<img src="/#proj_name#/img/loading.gif" style="height:15px; width: 15px;"> 上传中', true)

                        // 构造上传数据并获取图片链接
                        for (let i = 0; i < e.target.files.length; i++) {
                            let file = e.target.files[i];
                            let formData = new FormData();
                            formData.append(fileName, file);
                            
                            // 将数据发给服务器拿到图片链接
                            requester.ajax('/upload.do', formData, {
                                method: 'POST',
                                processData: false,
                                contentType: false
                            }).then(data => {
                                isUploadDone[i] = {
                                    dlUrl: data.data.dlUrl
                                };
                            });
                        }

                        // 校验当前是否上传完成
                        let timer = setInterval(() => {
                            let _isUploadDone = true;
                
                            for (let item of isUploadDone) {
                                if (item === undefined) {
                                    _isUploadDone = false;
                                }
                            }

                            // 当前数据已经全部返回
                            if (_isUploadDone) {
                                $('#tip').fadeOut('fast');
                                clearInterval(timer);

                                // 插入图片
                                if (getItemSize() < 1) {
                                    for (let i = 0; i < isUploadDone.length; i++) {
                                        let tpl = $('#multi-upload-item-upload-tpl').html();
                                        
                                        if (i === 0) {
                                            $(container).html(_.template(tpl)({
                                                url: isUploadDone[i].dlUrl
                                            }));
                                        } else {
                                            $(container).append(_.template(tpl)({
                                                url: isUploadDone[i].dlUrl
                                            }));
                                        }
                                    }
                                } else {

                                    // 删除添加按钮，避免显示出错
                                    $(container).find('.multi-upload-item.add').remove();

                                    for (let i = 0; i < isUploadDone.length; i++) {
                                        let tpl = $('#multi-upload-item-upload-tpl').html();
                                        $(container).append(_.template(tpl)({
                                            url: isUploadDone[i].dlUrl
                                        }));
                                    }
                                }

                                // 如果当前还可以继续增加图片的话
                                if (getItemSize() < Number(maxEdge)) {
                                    let tpl = $('#multi-upload-select-item-tpl').html();
                                    $(container).append(tpl);
                                    $(container)
                                        .attr('data-minedge', minEdge)
                                        .attr('data-maxEdge', maxEdge)
                                }

                                uploadCb();
                            }
                        }, 300);
                    }
                }

            }, 300);
        });

        // 删除已上传的图片
        $(container).off('click').on('click', '.upload-wrap button', e => {
            let $self = $(e.currentTarget);
            let $parent = $self.parents('.multi-upload-item');
            let minEdge = Number($(container).attr('data-minedge'));
            let maxEdge = Number($(container).attr('data-maxedge'));
            $parent.remove();

            if (getItemSize() === (maxEdge - 1)) {
                let tpl = $('#multi-upload-select-item-tpl').html();
                $(container).append(tpl);
                $(container)
                    .attr('data-minEdge', minEdge)
                    .attr('data-maxEdge', maxEdge)
            }

            delCb();
        });
    },

    /**
     * 单视频上传
     * @param {String} container - 包含块
     * @param {String} fileName - 传递给服务器的字段名称
     * @param {Function} cb - 回调函数
     */
    singleVideo ({ container, fileName, cb = () => {} }) {

        // 为 [type="upload"] 绑定事件
        $(container).on('change', '[type="file"]', e => {
            let $self = $(e.currentTarget);
            let $parent = $self.parents('.video-upload-item');
            
            // 构造上传数据
            let formData = new FormData();
            formData.append(fileName, e.target.files[0]);

            modaler.tip('<img src="/#proj_name#/img/loading.gif" style="height:15px; width: 15px;"> 上传中', true)

            // 将数据发给服务器并拿到服务器返回的链接
            requester.ajax('/upload.do', formData, {
                method: 'POST',
                processData: false,
                contentType: false
            }).then(data => {
               $('#tip').fadeOut('fast');
               $self.attr('data-url', data.data.dlUrl);
            });
        });
    }
};
