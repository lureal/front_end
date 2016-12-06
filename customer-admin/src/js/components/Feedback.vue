<template lang="html">
<div class="wrapper">
    <main-header></main-header>
    <main-sidebar :sidebar="sidebar"></main-sidebar>
    <div class="content-wrapper">
        <div class="content">
            <div class="row">
                <div class="col-md-12">
                    <div class="box box-table">
                        <div class="box-header table-box-header">
                            <h3 class="box-title">任务反馈</h3>
                            <div class="box-tools">
                                <toolbar
                                    :toolbar.sync="toolbar"
                                    :callback.sync="search">
                                </toolbar>
                            </div>
                        </div>
                        <div class="box-body table-responsive no-padding table-box-body">
                            <simple-table :table.sync="table"></simple-table>
                        </div>
                        <div class="box-footer clearfix">
                            <pagination
                                :pagination.sync="pagination"
                                :callback="loadData"
                                offset="2">
                            </pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <modal :modal.sync="modal"></div>
</div>
</template>

<script>
import adminlte from '../libs/adminlte.js';
import MainHeader from './Header.vue';
import MainSidebar from './Sidebar.vue';
import Toolbar from './Toolbar.vue';
import SimpleTable from './SimpleTable.vue';
import Pagination from './Pagination.vue';
import Modal from './Modal.vue';
import http from '../mixins/http.js';

export default {
    components: {
        MainHeader,
        MainSidebar,
        Toolbar,
        SimpleTable,
        Pagination,
        Modal
    },
    mixins: [http],
    data() {
        return {
            sidebar: 'feedback',
            toolbar: {
                dateStart: '',
                dateEnd: ''
            },
            table: {
                trs: [
                    { label: '任务名称' },
                    { label: 'idfa' },
                    { label: '反馈时间' },
                    { label: '问题描述' },
                    { label: '首次截图' },
                    { label: '绑卡注册' },
                    { label: '更多' }
                ],
                tds: []
            },
            pagination: {
                current_page: 1,
                last_page: 1
            },
            modal: {
                show: false,
                title: '用户反馈',
                content: ''
            }
        };
    },
    methods: {

        search() {
            let self = this;
            let param = {
                startDate: self.toolbar.dateStart,
                endDate: self.toolbar.dateEnd,
                page: 1
            };

            // 如果日期不正确则不给查询
            if(self.toolbar.dateStart > self.toolbar.dateEnd || (self.toolbar.dateStart === '' || self.toolbar.dateEnd === '')) {
                self.modal.content = '请确保日期选择正确';
                self.modal.show = true;
                return;
            }

            self.pagination.current_page = 1;
            self.get('/joint/api/feedback/list', param, (data) => {
                if(data.code === -1) {
                    self.modal.content = data.errmsg;
                    self.modal.show = true;
                    return;
                }

                let arr = [];
                let _record = data.result.records;

                for(let i = 0; i < data.result.records.length; i++) {
                    let moreImg;
                    if(_record[i].moreImg === '') {
                        moreImg = `<a style="cursor:default;" href="javascript:void(0);"><img src="/#proj_name#/img/default.jpg" alt="更多" height=184 width=104></a>`;
                    } else {
                        moreImg = `<a href="${_record[i].moreImg}" target="_blank"><img src="${_record[i].moreImg}" alt="更多" height=184 width=104></a>`;
                    }

                    let firstTimeImg;
                    if(_record[i].firstTimeImg === '') {
                        firstTimeImg = `<a style="cursor:default;" href="javascript:void(0);"><img src="/#proj_name#/img/default.jpg" alt="客户后台" height=184 width=104></a>`;
                    } else {
                        firstTimeImg = `<a href="${_record[i].firstTimeImg}" target="_blank"><img src="${_record[i].firstTimeImg}" alt="客户后台" height=184 width=104></a>`;
                    }

                    let registerBindCardImg;
                    if(_record[i].registerBindCardImg === '') {
                        registerBindCardImg = `<a style="cursor:default;" href="javascript:void(0);"><img src="/#proj_name#/img/default.jpg" alt="绑卡注册" height=184 width=104></a>`;
                    } else {
                        registerBindCardImg = `<a href="${_record[i].registerBindCardImg}" target="_blank"><img src="${_record[i].registerBindCardImg}" alt="绑卡注册" height=184 width=104></a>`;
                    }

                    arr.push({
                        name: _record[i].name,
                        idfa: _record[i].idfa,
                        date: _record[i].date,
                        description: _record[i].description,
                        firstTimeImg: firstTimeImg,
                        registerBindCardImg: registerBindCardImg,
                        moreImg: moreImg
                    });
                }

                self.table.tds = arr;
                self.pagination.last_page = data.result.pageCount;
            });
        },

        /**
         * 加载数据
         * @param {Number} page - 分页
         */
        loadData(page) {
            let self = this;
            let param = {
                startDate: self.toolbar.dateStart,
                endDate: self.toolbar.dateEnd,
                page: page
            };

            self.get('/joint/api/feedback/list', param, (data) => {
                if(data.code === -1) {
                    self.modal.content = data.errmsg;
                    self.modal.show = true;
                    return;
                }

                let arr = [];
                let _record = data.result.records;

                for(let i = 0; i < data.result.records.length; i++) {
                    let moreImg;
                    if(_record[i].moreImg === '') {
                        moreImg = `<a style="cursor:default;" href="javascript:void(0);"><img src="/#proj_name#/img/default.jpg" alt="更多" height=184 width=104></a>`;
                    } else {
                        moreImg = `<a href="${_record[i].moreImg}" target="_blank"><img src="${_record[i].moreImg}" alt="更多" height=184 width=104></a>`;
                    }

                    let firstTimeImg;
                    if(_record[i].firstTimeImg === '') {
                        firstTimeImg = `<a style="cursor:default;" href="javascript:void(0);"><img src="/#proj_name#/img/default.jpg" alt="客户后台" height=184 width=104></a>`;
                    } else {
                        firstTimeImg = `<a href="${_record[i].firstTimeImg}" target="_blank"><img src="${_record[i].firstTimeImg}" alt="客户后台" height=184 width=104></a>`;
                    }

                    let registerBindCardImg;
                    if(_record[i].registerBindCardImg === '') {
                        registerBindCardImg = `<a style="cursor:default;" href="javascript:void(0);"><img src="/#proj_name#/img/default.jpg" alt="绑卡注册" height=184 width=104></a>`;
                    } else {
                        registerBindCardImg = `<a href="${_record[i].registerBindCardImg}" target="_blank"><img src="${_record[i].registerBindCardImg}" alt="绑卡注册" height=184 width=104></a>`;
                    }

                    arr.push({
                        name: _record[i].name,
                        idfa: _record[i].idfa,
                        date: _record[i].date,
                        description: _record[i].description,
                        firstTimeImg: firstTimeImg,
                        registerBindCardImg: registerBindCardImg,
                        moreImg: moreImg
                    });
                }

                self.table.tds = arr;
                self.pagination.last_page = data.result.pageCount;
            });
        }
    },
    ready() {
        adminlte();
        this.loadData(1)
    }
};
</script>

<style lang="css" scoped>
.table-box-header {
    height: 55px;
    line-height: 30px;
    padding: 12px 40px 12px 17px;
}
.table-box-header .box-tools {
    right: 40px;
    top: 10px;
}
</style>
