<template lang="html">
<div class="wrapper">
    <main-header></main-header>
    <main-sidebar :sidebar="sidebar"></main-sidebar>
    <div class="content-wrapper">
        <div class="content">
            <div class="row">
                <div class="col-md-12">
                    <div class="nav-tabs-custom" id="settle">
                        <ul class="nav nav-tabs">
                            <li class="active">
                                <a href="#tab_1" data-toggle="tab">账号信息</a>
                            </li>
                            <li>
                                <a href="#tab_2" data-toggle="tab">安全中心</a>
                            </li>
                            <li>
                                <a href="#tab_3" data-toggle="tab">短信设置</a>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane active account-info" id="tab_1">
                                <div class="info">
                                    <div class="username">
                                        <span>用户名：</span>{{ info.username }}
                                    </div>
                                    <div class="phone">
                                        <span>手机号：</span>{{ info.mobile }}
                                    </div>
                                    <div class="company">
                                        <span>公司名称：</span>{{ info.company }}
                                    </div>
                                </div>
                                <div class="tip">
                                    <div class="title">
                                        <i class="fa fa-exclamation-circle"></i>说明事项
                                    </div>
                                    <ul>
                                        <li>
                                            1. 用户名、公司名称为注册时填写，不可修改。如有疑问，请联系客户QQ：2264542252；
                                        </li>
                                        <li>
                                            2. <span class="highlight">手机号：即是登录帐号</span>，本系统仅支持手机号登录。
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="tab-pane safe-center" id="tab_2">
                                <div class="form-inline">
                                    <div class="form-group">
                                        <label>旧密码：</label>
                                        <input type="password" class="form-control" name="name" value="" v-model="oldPasswd">
                                    </div>
                                </div>
                                <div class="form-inline">
                                    <div class="form-group">
                                        <label>新密码：</label>
                                        <input type="password" class="form-control" name="name" value="" v-model="newPasswd">
                                    </div>
                                </div>
                                <div class="form-inline">
                                    <div class="form-group">
                                        <label>确认密码：</label>
                                        <input type="password" class="form-control" name="name" value="" v-model="repeatPasswd">
                                    </div>
                                </div>
                                <div class="clearfix">
                                    <button class="btn pull-right" type="button" name="button" @click="updatePwd">保存</button>
                                </div>
                            </div>
                            <div class="tab-pane sms-settle" id="tab_3">
                                <div class="form-inline {{ showBindedInput }} binded">
                                    <label>通知号码</label>
                                    <div class="form-control">
                                        {{ info.bindMobile }}
                                        <span>已绑定</span>
                                    </div>
                                    <button class="btn pull-right unbind-btn" type="button" name="button" @click="unbindMobile()">解绑</button>
                                </div>
                                <div class="form-inline {{ showBindInput }}">
                                    <div class="form-group">
                                        <label>通知号码</label>
                                        <input type="text" class="form-control" name="name" value="" v-model="notice.mobile">
                                    </div>
                                    <button class="btn pull-right verify-btn" v-bind:class="{ 'btn-gray': isCounting }" type="button" name="button" @click="sendVerifyCode">
                                        {{ isCounting === false ? '发送验证码' : countNumber + '秒' }}
                                    </button>
                                </div>
                                <div class="form-inline {{ showBindInput }}">
                                    <div class="form-group">
                                        <label>验证码</label>
                                        <input type="text" class="form-control" name="name" value="" v-model="notice.verifyCode">
                                    </div>
                                </div>

                                <div class="tip">
                                    <div class="title">
                                        <i class="fa fa-exclamation-circle"></i>说明事项
                                    </div>
                                    <ul>
                                        <li>
                                            1. 该手机号仅会接收有关技术对接的信息通知，<span class="highlight">请务必填写贵公司 技术负责人 的手机号码；</span>
                                        </li>
                                        <li>
                                            2. 请及时绑定手机号。
                                        </li>
                                    </ul>
                                </div>
                                <div class="clearfix {{ showBindInput ? 'hide' : '' }}">
                                    <button class="btn pull-right bind-btn" type="button" name="button" @click="bindMobile">绑定</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <tip :tip.sync="tip"></tip>
    <modal :modal.sync="modal" :modal-event.sync="modalEvent"></modal>
</div>
</template>

<script>
import adminlte from '../libs/adminlte.js';
import MainHeader from './Header.vue';
import MainSidebar from './Sidebar.vue';
import Modal from './Modal.vue';
import Tip from './Tip.vue';
import http from '../mixins/http.js';

export default {
    components: {
        MainHeader,
        MainSidebar,
        Tip,
        Modal
    },
    mixins: [http],
    data() {
        return {
            sidebar: 'settle',
            modal: {
                show: false,
                title: '设置',
                content: '',
                btn: ''
            },
            info: {
                username: '',
                mobile: '',
                company: '',
                bindMobile: ''
            },
            tip: {
                show: false,
                isCheckIcon: false,
                content: '保存成功'
            },
            notice: {
                mobile: '',
                verifyCode: ''
            },
            oldPasswd: '',
            newPasswd: '',
            repeatPasswd: '',
            showBindInput: '',
            showBindedInput: '',
            isCounting: false, // 当前是否在倒计时
            countNumber: 59 // 倒计时的数字
        }
    },
    ready() {
        adminlte();
        this.getUser();
        this.getBindMobile();
    },
    methods: {
        getUser() {
            let self = this;
            self.get('/joint/api/settle/account_info', {}, (data) => {
                if(data.code == -1) {
                    self.modal.content = data.errmsg;
                    self.modal.show = true;
                    self.modal.btn = '';
                    return;
                }
                self.info.username = data.result.userName;
                self.info.mobile = data.result.mobile;
                self.info.company = data.result.company;
            });
        },

        getBindMobile() {
            let self = this;
            self.get('/joint/api/setting/connect_tel/', {}, (data) => {
                self.info.bindMobile = data.result.connect_tel;
                self.showBindedInput = data.result.connect_tel !== '' ? '' : 'hide';
                self.showBindInput = data.result.connect_tel === '' ? '' : 'hide';
            });
        },

        updatePwd() {
            let self = this;
            let param = {
                oldPasswd: self.oldPasswd,
                newPasswd: self.newPasswd
            };

            if(self.oldPasswd === self.newPasswd) {
                self.modal.content = '旧密码和新密码不能相同';
                self.modal.show = true;
                self.modal.btn = '';
                return;
            }

            if(self.newPasswd != self.repeatPasswd) {
                self.modal.content = '确认密码和新密码不同';
                self.modal.show = true;
                self.modal.btn = '';
                return;
            }

            self.get('/joint/api/settle/update_pwd', param, (data) => {
                if(data.code == -1) {
                    self.modal.content = data.errmsg;
                    self.modal.show = true;
                    self.modal.btn = '';

                } else {
                    self.get('/joint/api/logout/', {}, (data) => {
                        self.modal.content = '修改成功，请重新登陆';
                        self.modal.show = true;
                        self.modal.btn = '重新登陆';
                        self.modalEvent = () => {
                            window.router.go({
                                path: '/login'
                            });
                        }
                    });
                }
            });
        },

        bindMobile() {
            let self = this;
            let param = {
                mobile: self.notice.mobile,
                verifyCode: self.notice.verifyCode
            };

            if(self.notice.mobile === '' || self.notice.verifyCode === '') {
                self.modal.content = '请确保输入通知号码和验证码';
                self.modal.show = true;
                self.modal.btn = '';
                return;
            }

            if(self.notice.mobile.length !== 11) {
                self.modal.content = '请输入正确的手机号码';
                self.modal.show = true;
                self.modal.btn = '';
                return;
            }

            self.get('/joint/api/settle/bind_mobile', param, (data) => {
                if(data.code === -1) {
                    self.modal.content = data.errmsg;
                    self.modal.show = true;
                    self.modal.btn = '';
                    return;
                }

                self.info.bindMobile = self.notice.mobile;
                self.showBindInput = 'hide';
                self.showBindedInput = '';
            });
        },

        unbindMobile() {
            let self = this;

            self.showBindedInput = 'hide';
            self.showBindInput = '';
            self.notice.mobile = '';
            self.notice.verifyCode = '';
        },

        sendVerifyCode() {
            let self = this;
            let param = {
                mobile: self.notice.mobile
            };

            // 如果当前正在倒计时则不给发送验证码
            if(self.isCounting === true) {
                return;
            }

            if(self.notice.mobile === '' || self.notice.mobile.length !== 11) {
                self.modal.content = '请输入通知号码，通知号码必须为 11 位的手机号';
                self.modal.show = true;
                self.modal.btn = '';
                return;
            }

            self.get('/cp/api/sendcode', param, (data) => {
                if(data.code === -1) {
                    self.modal.content = data.errmsg;
                    self.modal.show = true;
                    self.modal.btn = '';
                }
            });

            // 执行倒计时
            self.isCounting = true;
            let timer = setInterval(() => {
                if(self.countNumber === 0) {
                    clearInterval(timer);
                    self.isCounting = false;
                    self.countNumber = 59;
                    return;
                }
                self.countNumber--;
            }, 1000);
        },

        // 弹出框事件
        modalEvent() {
            window.router.go({
                path: '/login'
            });
        }
    }
};
</script>

<style lang="css" scoped>
#settle .nav-tabs {
    padding-left: 17px;
}
#settle .nav-tabs > li.active {
    border-top-color: #fff;
}
#settle .nav-tabs > li.active > a {
    background: none;
    border-left-color: #fff;
    border-right-color: #fff;
    position: relative;
}
#settle .nav-tabs > li.active > a::after {
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

#settle .btn-gray {
    color: #000;
    background-color: #e6e6e6;
}

 /* 账号信息 */
.account-info {}
.account-info .info {
    padding: 42px 0 42px 30px;
}
.account-info .info > div {
    margin-bottom: 52px;
}
.account-info .info .company {
    margin-bottom: 0;
}

.account-info .info > div > span {
    display: inline-block;
    margin-right: 25px;
    width: 70px;
}

.account-info .tip {
    background: #f3f3f3;
    border: 1px dashed #dedede;
    color: #888;
    font-size: 13px;
    margin: 0 110px 30px;
    padding: 19px 0 19px 19px;
}

.account-info .tip .fa {
    margin-right: 6px;
}

.account-info .tip ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

/* 安全中心 */
.safe-center {
    padding: 30px 85px 35px 30px;
}
.safe-center .form-inline {
    margin-bottom: 30px;
    position: relative;
    padding-left: 80px;
}
.safe-center .form-group {
    display: block;
}
.safe-center label {
    display: inline-block;
    font-weight: normal;
    height: 36px;
    line-height: 36px;
    left: 0;
    margin-right: 25px;
    margin-bottom: 0;
    margin-top: -18px;
    position: absolute;
    top: 50%;
    width: 70px;
}
.safe-center input {
    height: 36px;
    width: 100%;
}

.safe-center .btn,
.safe-center .btn:active {
    background: #41c1a3;
    color: #fff;
    font-size: 14px;
    height: 36px;
    width: 94px;
}

/* 短信设置 */
.sms-settle {
    padding: 30px 85px 30px 30px;
}
.sms-settle .form-inline {
    margin-bottom: 30px;
    position: relative;
    padding-left: 80px;
}
.sms-settle .form-group {
    display: block;
}
.sms-settle label {
    display: inline-block;
    font-weight: normal;
    height: 36px;
    line-height: 36px;
    left: 0;
    margin-right: 25px;
    margin-bottom: 0;
    margin-top: -18px;
    position: absolute;
    top: 50%;
    width: 70px;
}
.sms-settle input {
    height: 36px;
    width: 100%;
}
.sms-settle .tip {
    background: #f3f3f3;
    border: 1px dashed #dedede;
    color: #888;
    font-size: 13px;
    margin: 0 0px 30px 80px;
    padding: 19px 0 19px 19px;
}
.sms-settle .tip .fa {
    margin-right: 6px;
}
.sms-settle .tip ul {
    list-style: none;
    margin: 0;
    padding: 0;
}
.sms-settle .binded > div {
    border: 0;
    background: #fff;
}
.sms-settle .binded > div span {
    color: #888;
    font-size: 14px;
    margin-left: 10px;
}
.sms-settle .unbind-btn,
.sms-settle .unbind-btn:active {
    color: #fff;
    height: 36px;
}
.sms-settle .verify-btn {
    height: 36px;
    position: absolute;
    right: 0;
    top: 0;
    width: 94px;
}
.sms-settle .bind-btn {
    height: 36px;
    width: 94px;
}
</style>
