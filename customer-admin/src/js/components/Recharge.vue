<template lang="html">
<div class="wrapper">
    <main-header></main-header>
    <main-sidebar :sidebar="sidebar" :sub-sidebar="subSidebar"></main-sidebar>
    <div class="content-wrapper" id="recharge">
        <div class="content">
            <div class="row">
                <div class="col-md-12">
                    <div class="nav-tabs-custom">
                        <ul class="nav nav-tabs">
                            <li class="active">
                                <a href="#tab_1" data-toggle="tab">银行转账</a>
                            </li>
                            <li>
                                <a href="#tab_2" data-toggle="tab">支付宝</a>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane active transfer" id="tab_1">
                                <div class="company">
                                    公司名称：深圳赚友科技有限公司
                                </div>
                                <div class="bank">
                                    开户银行：招商银行深圳科苑支行
                                </div>
                                <div class="account">
                                    银行账号：755925081310101
                                </div>
                                <div class="tip">
                                    温馨提示：转账后，请联系您的运营经理！
                                </div>
                            </div>
                            <div class="tab-pane alipy" id="tab_2">
                                <div>
                                    <img src="/#proj_name#/img/qrcode.jpg" class="qrcode">
                                    <span class="tip">扫码支付后，请联系您的运营经理！</span>
                                </div>
                            </div>
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
import Modal from './Modal.vue';
import http from '../mixins/http.js';

export default {
    components: {
        MainHeader,
        MainSidebar,
        Modal
    },
    mixins: [http],
    data() {
        return {
            sidebar: 'finance',
            subSidebar: 'recharge',
            company: '',
            bank: '',
            account: '',
            qrcode: '',
            modal: {
                show: false,
                title: '充值',
                content: ''
            }
        }
    },
    ready() {
        adminlte();
    }
};
</script>

<style lang="css" scoped>
#recharge .nav-tabs > li.active {
    border-top-color: #fff;
}
#recharge .nav-tabs > li.active > a {
    background: none;
    border-left-color: #fff;
    border-right-color: #fff;
    position: relative;
}
#recharge .nav-tabs > li.active > a::after {
    bottom: 0;
    border-bottom: 2px solid #41c1a3;
    content: '';
    left: 50%;
    margin-left: -27.5px;
    position: absolute;
    width: 55px;
}
.tab-content {
    padding: 1px;
}
.transfer {
    padding-left: 30px;
}
.transfer > div {
    color: #000;
    font-size: 14px;
    margin-bottom: 54px;
}
.transfer .company {
    margin-top: 54px;
}
.transfer .tip {
    color: #707070;
    margin-bottom: 80px;
}
.alipy {
    min-height: 357px;
    padding-left: 30px;
}
.alipy .qrcode {
    display: block;
    margin: 56px 0 44px 56px;
    height: 100px;
    width: 100px;
}
.alipy .tip {
    color: #707070;
    font-size: 14px;
}
</style>
