<template lang="html">
<div class="wrapper">
    <main-header></main-header>
    <main-sidebar :sidebar="sidebar"></main-sidebar>
    <div class="content-wrapper">
        <div class="content">
            <div class="row">
                <div class="col-md-3 col-sm-6 col-xs-12">
                    <statistics-card
                        :title="card.one.title"
                        :money.sync="card.one.money">
                    </statistics-card>
                </div>
                <div class="col-md-3 col-sm-6 col-xs-12">
                    <statistics-card
                        :title="card.two.title"
                        :money.sync="card.two.money">
                    </statistics-card>
                </div>
                <div class="col-md-3 col-sm-6 col-xs-12">
                    <statistics-card
                        :title="card.three.title"
                        :money.sync="card.three.money"
                        :is-tip="card.three.isTip"
                        :tip="card.three.tip">
                    </statistics-card>
                </div>
                <div class="col-md-3 col-sm-6 col-xs-12">
                    <statistics-card
                        :title.sync="card.four.title"
                        :money.sync="card.four.money"
                        :is-link="card.four.isLink"
                        :link="card.four.link"
                        :link-label="card.four.linkLabel">
                    </statistics-card>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="box table-box">
                        <div class="box-header table-box-header">
                            <h3 class="box-title">任务投放明细</h3>
                            <div class="box-tools">
                                <toolbar
                                    :toolbar.sync="toolbar"
                                    :callback.sync="search">
                                </toolbar>
                            </div>
                        </div>
                        <div class="box-body table-responsive no-padding">
                            <simple-table :table.sync="table"></simple-table>
                        </div>
                        <div class="box-footer clearfix">
                            <pagination
                                :pagination.sync="pagination"
                                :callback="loadData"
                                :offset="2">
                            </pagination>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <modal :modal.sync="modal"></modal>
</div>
</template>

<script>
import adminlte from '../libs/adminlte.js';
import StatisticsCard from './StatisticsCard.vue';
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
        StatisticsCard,
        Toolbar,
        SimpleTable,
        Pagination,
        Modal
    },
    data() {
        return {

            // 标识当前导航
            sidebar: 'home',

            modal: {
                show: false,
                title: '数据统计',
                content: ''
            },

            // 顶部统计小卡片
            card: {
                one: {
                    title: '今日消耗',
                    money: '0.00'
                },
                two: {
                    title: '昨日消耗',
                    money: '0.00'
                },
                three: {
                    title: '冻结金额',
                    money: '0.00',
                    isTip: true,
                    tip: '冻结金额：投放任务需要冻结相应的账户金额，未消耗完的冻结金额，将在排期结束后退还至账户余额。'
                },
                four: {
                    title: '账户余额',
                    money: '0.00',
                    isLink: true,
                    link: '/finance-detail',
                    linkLabel: '充值'
                }
            },

            // 工具条
            toolbar: {
                dateStart: '',// moment(new Date()).format('YYYY-MM-DD'),
                dateEnd: ''// moment(new Date()).format('YYYY-MM-DD')
            },

            // 表格
            table: {
                trs: [
                    {
                        label: 'APP名称',
                    },
                    {
                        label: '计划量'
                    },
                    {
                        label: '完成量'
                    },
                    {
                        label: '任务类型'
                    },
                    {
                        label: '任务单价'
                    },
                    {
                        label: '消耗金额'
                    },
                    {
                        label: '关键词'
                    },
                    {
                        label: '开始时间'
                    },
                    {
                        label: '结束时间'
                    },
                    {
                        label: '状态',
                        isTip: true,
                        tip: `
                        <span style="color:#41c1a3">【正在投放】：</span>表示任务正在进行投放当中，用户在此阶段内可领取并完成任务。<br>
                        <span style="color:#41c1a3">【已暂停】：</span>表示任务在投放过程中停止，用户无法领取任务，但任务列表仍然会有展示。<br>
                        <span style="color:#41c1a3">【已结束】：</span>表示任务在设置的结束时间到期后下架，任务列表不再显示。</span>
                        `
                    },
                    {
                        label: '操作'
                    }
                ],
                tds: []
            },

            // 分页
            pagination: {
                current_page: 1,
                last_page: 1
            }
        }
    },
    methods: {

        search(page) {
            let self = this;
            let param = {
                startDate: self.toolbar.dateStart,
                endDate: self.toolbar.dateEnd,
                page: page
            }

            // 如果日期不正确则不给查询
            if(self.toolbar.dateStart > self.toolbar.dateEnd || (self.toolbar.dateStart === '' || self.toolbar.dateEnd === '')) {
                self.modal.content = '请确保日期选择正确';
                self.modal.show = true;
                return;
            }

            self.pagination.current_page = 1;

            self.get('/joint/api/static/list', param, (data) => {
                if(data.data === false) {
                    self.modal.content = data.errmsg;
                    self.modal.show = true;
                    return;
                }

                let arr = [];
                for(let i = 0; i < data.result.records.length; i++) {
                    arr.push({
                        name: data.result.records[i].name,
                        planAmount: data.result.records[i].planAmount,
                        completeAmount: data.result.records[i].completeAmount,
                        typeName: data.result.records[i].typeName,
                        price: data.result.records[i].price + '元',
                        consume: data.result.records[i].consume + '元',
                        keyword: data.result.records[i].keyword,
                        startDate: data.result.records[i].startDate,
                        endDate: data.result.records[i].endDate,
                        statusName: data.result.records[i].statusName,
                        export: `<a href="/joint/api/static/export_idfa/?task_id=${data.result.records[i]}.id" target="_blank">导出 idfa</a>`
                    })
                }

                self.table.tds = arr;
                self.pagination.last_page = data.result.pageCount;
            });
        },

        // 加载数据
        loadData(page) {
            let self = this;
            let param = {
                startDate: self.toolbar.dateStart,
                endDate: self.toolbar.dateEnd,
                page: page
            }

            self.get('/joint/api/static/list', param, (data) => {
                if(data.code === -1) {
                    self.modal.content = data.errmsg;
                    self.modal.show = true;
                    return;
                }

                let arr = [];
                for(let i = 0; i < data.result.records.length; i++) {
                    arr.push({
                        name: data.result.records[i].name,
                        planAmount: data.result.records[i].planAmount,
                        completeAmount: data.result.records[i].completeAmount,
                        typeName: data.result.records[i].typeName,
                        price: data.result.records[i].price + '元',
                        consume: data.result.records[i].consume + '元',
                        keyword: data.result.records[i].keyword,
                        startDate: data.result.records[i].startDate,
                        endDate: data.result.records[i].endDate,
                        statusName: data.result.records[i].statusName,
                        export: `<a href="/joint/api/static/export_idfa/?task_id=${data.result.records[i].id}" target="_blank">导出 idfa</a>`
                    })
                }

                self.table.tds = arr;
                self.pagination.last_page = data.result.pageCount;
            });
        },

    },
    mixins: [http],
    ready() {
        let self = this;

        // init page height and sidebar
        adminlte();

        // 获取统计数据
        self.get('/joint/api/static/overview', {}, (data) => {
            if(data.code === -1) {
                self.modal.content = data.errmsg;
                self.modal.show = true;
                return;
            }

            self.card.one.money = data.result.todayConsume;
            self.card.two.money = data.result.yesterdayConsume;
            self.card.three.money = data.result.freezeAmount;
            self.card.four.money = data.result.balance;
        });

        // 首次加载数据
        self.loadData(1);
    }
};
</script>

<style scoped lang="css">
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
