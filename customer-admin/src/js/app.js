/*!
 * (Vue document)[https://vuejs.org.cn/]
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';

// 加载组件
import Home from './components/Home.vue';
import Feedback from './components/Feedback.vue';
import FinanceDetail from './components/FinanceDetail.vue';
import Recharge from './components/Recharge.vue';
import Settle from './components/Settle.vue';
import Login from './components/Login.vue';

// 配置路由
Vue.use(VueRouter);
let router = new VueRouter();

router.redirect({
    '*': '/'
});

router.map({
    '/': {
        component: Home
    },
    '/login': {
        component: Login
    },
    '/finance-detail': {
        component: FinanceDetail
    },
    '/recharge': {
        component: Recharge
    },
    '/feedback': {
        component: Feedback
    },
    '/settle': {
        component: Settle
    }
});

// 触发路由后执行的操作
router.afterEach((transition) => {
    console.log(`成功跳转到: ${transition.to.path}`);
});

router.start(App, '#app');
window.router = router;
