<template lang="html">
<div class="main-sidebar" id="main-sidebar">
    <div class="sidebar">
        <ul class="sidebar-menu">
            <li class="treeview {{ sidebar === 'home' ? 'active' : '' }}">
                <a v-link="{path: '/'}">
                    <i class="fa fa-line-chart"></i>
                    <span>数据统计</span>
                </a>
            </li>
            <li class="treeview {{ sidebar === 'finance' ? 'active' : '' }}">
                <a href="javascript:void(0);">
                    <i class="fa fa-database"></i>
                    <span>财务管理</span>
                </a>
                <ul class="treeview-menu">
                    <li class="{{ subSidebar === 'finance-detatil' ? 'active' : '' }}">
                        <a v-link="{path: '/finance-detail'}">
                            <i class="fa"></i>
                            账户明细
                        </a>
                    </li>
                    <li class="{{ subSidebar === 'recharge' ? 'active' : '' }}">
                        <a v-link="{path: '/recharge'}">
                            <i class="fa"></i>
                            充值
                        </a>
                    </li>
                </ul>
            </li>
            <li class="treeview {{ sidebar === 'feedback' ? 'active' : '' }}">
                <a v-link="{path: '/feedback'}">
                    <i class="fa fa-commenting"></i>
                    <span>用户反馈</span>
                </a>
            </li>
            <li class="treeview {{ sidebar === 'settle' ? 'active' : '' }}">
                <a v-link="{path: '/settle'}">
                    <i class="fa fa-gear"></i>
                    <span>设置</span>
                </a>
            </li>
        </ul>
    </div>
</div>
</template>

<script>
export default {
    props: ['sidebar', 'subSidebar']
}
</script>

<style lang="css" scoped>
#main-sidebar {
    background-color: #292c30;
    padding-top: 60px;
}
#main-sidebar .sidebar-menu > .treeview:hover > a,
#main-sidebar .sidebar-menu > .treeview.active > a {
    border-left-color: #41c1a3;
    color: #41c1a3;
}

/* 覆盖侧边栏左侧三角动画 */
.sidebar-menu li > a > .fa-angle-right {
    width: auto;
    height: auto;
    padding: 0;
    margin-right: 10px;
    margin-top: 3px;
}
.sidebar-menu li.active > a > .fa-angle-right {
    -webkit-transform: rotate(90deg);
    -ms-transform: rotate(90deg);
    -o-transform: rotate(90deg);
    transform: rotate(90deg);
}
.sidebar-menu .treeview-menu > li > a > .fa-angle-right,
.sidebar-menu .treeview-menu > li > a > .fa-angle-down {
    width: auto;
}
</style>
