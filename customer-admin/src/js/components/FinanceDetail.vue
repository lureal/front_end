<template lang="html">
<div class="wrapper">
    <main-header></main-header>
    <main-sidebar :sidebar="sidebar" :sub-sidebar="subSidebar"></main-sidebar>
    <div class="content-wrapper">
        <div class="content">
            <div class="row">
                <div class="col-md-12">
                    <div class="box account">
                        <div class="box-header">
                            <h3 class="box-title">当前账户</h3>
                            <span class="pull-right">累计充值金额：{{ info.accumulatedAmount }}元</span>
                        </div>
                        <div class="box-body">
                            <div>
                                账户余额：<span class="money">{{ info.balance }}</span> 元（冻结金额：{{ info.freezenAmount }}元）
                                <span class="tip" data-toggle="tooltip" data-placement="top" title="冻结金额：投放任务需要冻结相应的账户金额，未消耗完的冻结金额，将在排期结束后退还至账户余额。">
                                    <i class="fa fa-question-circle"></i>
                                </span>
                            </div>
                            <a href="javascript:void(0);" class="btn btn-default recharge" v-link="{ path: '/recharge' }">立即充值</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <div class="box table-box">
                        <div class="box-header table-box-header">
                            <h3 class="box-title">收支明细</h3>
                        </div>
                        <div class="box-body table-responsive no-padding">
                            <simple-table :table="table"></simple-table>
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
import SimpleTable from './SimpleTable.vue';
import Pagination from './Pagination.vue';
import Modal from './Modal.vue';
import http from '../mixins/http.js';

export default {
    components: {
        MainHeader,
        MainSidebar,
        SimpleTable,
        Pagination,
        Modal
    },
    mixins: [http],
    data() {
        return {
            modal: {
                show: false,
                title: '账户明细',
                content: ''
            },
            info: {
                balance: '',
                freezenAmount: '',
                accumulatedAmount: ''
            },
            sidebar: 'finance',
            subSidebar: 'finance-detatil',
            table: {
                trs: [
                    { label: '交易号' },
                    { label: '交易金额（元）' },
                    { label: '交易时间' },
                    { label: '详情' }
                ],
                tds: []
            },
            pagination: {
                current_page: 1,
                last_page: 1
            }
        };
    },
    methods: {

        getInfo() {
            let self = this;
            self.get('/joint/api/finance/overview/', {}, (data) => {
                if(data.code === -1) {
                    self.modal.content = data.errmsg;
                    self.modal.show = true;
                    return;
                }

                self.info.balance = data.result.balance;
                self.info.freezenAmount = data.result.freezeAmount;
                self.info.accumulatedAmount = data.result.AccumulatedAmount;
            });
        },

        /**
         * 加载数据
         * @param {Number} page - 分页
         */
        loadData(page) {
            let self = this;

            self.get('/joint/api/finance/list', {
                page: page
            }, (data) => {
                if(data.code === -1) {
                    self.modal.content = data.errmsg;
                    self.modal.show = true;
                    return;
                }

                let arr = [];
                let _record = data.result.records;

                for(let i = 0; i < data.result.records.length; i++) {
                    arr.push({
                        title: _record[i].title,
                        amount: _record[i].amount,
                        date: _record[i].date,
                        detail: _record[i].detail
                    });
                }

                self.table.tds = arr;
                self.pagination.last_page = data.result.pageCount;
            });
        }
    },
    ready() {
        adminlte();
        this.loadData(1);
        this.getInfo();
    }
};
</script>

<style lang="css" scoped>
.account {
    border-top: 0;
}
.account .box-header {
    border-bottom: 1px solid #d9d9d9;
    color: #000;
    height: 40px;
    line-height: 40px;
    padding: 0 40px 0 17px;
}
.account .box-title {
    font-size: 14px;
}
.account .box-body {
    padding: 45px 0 45px 16px;
}
.account .box-body .money {
    color: #41c1a3;
    font-size: 24px;
}
.account .box-body .recharge {
    background: #41c1a3;
    border-radius: 0;
    border: 0;
    color: #fff;
    font-size: 14px;
    margin: 5px 0 0 16px;
    width: 84px;
}
.account .box-body > * {
    float: left;
}
</style>
