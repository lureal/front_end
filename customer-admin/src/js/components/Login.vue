<template lang="html">
<div class="login-box">
    <div class="login-logo">
        <a href="javascript:void(0);">客户后台</a>
    </div>
    <div class="login-box-body">
        <div class="form-group has-feedback">
            <input type="text" class="form-control" placeholder="手机号" v-model="username">
            <span class="glyphicon glyphicon-user form-control-feedback"></span>
        </div>
        <div class="form-group has-feedback">
            <input type="password" class="form-control" placeholder="密码" v-model="passwd">
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
        </div>
        <div class="row">
            <div class="col-md-12">
                <button type="button" class="btn-primary btn-block btn-flat login" name="button" v-on:click="login(username, passwd)">登陆</button>
            </div>
        </div>
    </div>
    <modal :modal.sync="modal"></modal>
</div>
</template>

<script>
import adminlte from '../libs/adminlte.js';
import http from '../mixins/http.js';
import Modal from './Modal.vue';

export default {
    data() {
        return {
            username: '',
            passwd: '',
            modal: {
                show: false,
                title: '登陆',
                content: '登陆成功'
            }
        };
    },
    methods: {
        login(username, passwd) {
            let self = this;

            // 数据有效性校验
            if(self.username === '' || self.passwd === '') {
                self.modal.content = '请确保输入手机号和密码';
                self.modal.show = true;
                return;
            }

            self.get('/cp/api/login', {
                mobile: self.username,
                pswd: self.passwd

            }, (data) => {

                // 登陆成功
                if(data.code === -1) {
                    self.modal.content = data.errmsg;
                    self.modal.show = true;
                    return;
                }

                // 登陆失败
                window.router.go({
                    path: '/'
                });
            });
        }
    },
    mixins: [http],
    components: {
        Modal
    },
    ready() {
        adminlte();
    }
};
</script>

<style lang="css" scoped>
.login {
    border: 0;
    height: 32px;
}
</style>
