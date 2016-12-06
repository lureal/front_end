<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    }
};
</script>

<style lang="css">

    /* 登陆页面所需 */
    body {
        background: #d2d6de;
    }

    .table-box {
        border-top: 0;
    }

    /* 重置日期插件样式 */
    .table-box-header .datetime-picker > input {
        height: 32px !important;
        line-height: 32px !important;
        padding: 0 10px !important;
    }

    /* 提示 */
    .tooltip,
    .tooltip * {
        text-align: left;
    }
    .tooltip.bottom .tooltip-arrow {
        border-bottom-color: rgba(0, 0, 0, .7);
    }
    .tooltip-inner {
        background: rgba(0, 0, 0, .7);
        padding: 10px;
    }

</style>
