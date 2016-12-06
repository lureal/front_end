<template lang="html">
<div id="main-header" class="main-header">
    <a href="javascript:void(0);" class="logo">
        <span class="logo-mini">客户后台</span>
        <span class="logo-lg">
            <img src="/#proj_name#/img/logo-lg.png" alt="客户后台" />
        </span>
    </a>
    <nav class="navbar navbar-static-top">
        <div class="navbar-custom-menu">
            <ul class="nav navbar-nav">
                <li>
                    <a href="http://e.iyouqian.com/ferrari/list/index" class="header-nav-item">
                        <i class="fa fa-tv"></i>
                        切换系统
                    </a>
                </li>
                <li>
                    <a href="javascript:void(0);" @click="logout" class="header-nav-item">
                        <i class="fa fa-sign-out"></i>
                        退出
                    </a>
                </li>
            </ul>
        </div>
    </nav>
</div>
</template>

<script>
import http from '../mixins/http.js';

export default {
    data() {
        return {};
    },
    mixins: [http],
    methods: {
        logout() {
            let self = this;
            self.get('/joint/api/logout/', {}, (data) => {
                window.router.go({
                    path: '/login'
                });
            });
        }
    }
}
</script>

<style lang="css" scoped>

    /* 定制 Header 高度（50px -> 60px）， 色值 */
    #main-header {
        height: 60px;
    }
    #main-header .logo {
        background-color: #292c30;
        height: 60px;
        line-height: 60px;
    }
    #main-header .navbar {
        background: #fff;
    }
    #main-header .header-nav-item {
        color: #222;
    }

    @media (min-width: 768px) {
        #main-header .header-nav-item {
            padding-top: 20px;
            padding-bottom: 20px;
        }
    }

    .header-nav-item:active,
    .header-nav-item:focus,
    .header-nav-item:hover {
        background: #fff !important;
    }
</style>
