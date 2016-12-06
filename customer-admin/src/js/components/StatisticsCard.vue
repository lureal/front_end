<template lang="html">
<div class="info-box">
    <h2>
        <span class="title">{{ title }}</span>
        <span class="tip" v-if="isTip" data-toggle="tooltip" data-placement="bottom" title="{{ tip }}">
            <i class="fa fa-question-circle"></i>
        </span>
        <a class="btn" v-if="isLink" v-link="{path: link}">{{ linkLabel }}</a>
    </h2>
    <p class="money">
        {{ money }}
        <span>元</span>
    </p>
</div>
</template>

<script>
export default {
    data() {
        return {};
    },
    props: ['title', 'tip', 'link', 'linkLabel', 'money', 'isLink', 'isTip']
};
</script>

<style lang="css" scoped>
.info-box {
    height: 120px;
    padding: 22px 0 30px 18px;
}
h2,
p {
    line-height: 1;
    margin: 0;
}
h2 {
    font-size: 18px;
    position: relative;
}

.title {
    color: #000;
    font-size: 18px;
}

.tip {
    font-size: 18px;
}

.money {
    color: #707070;
    font-size: 24px;
    margin-top: 26px;
}
.money span {
    font-size: 18px;
}

.btn {
    border-radius: 0;
    background: #41c1a3;
    color: #fff;
    height: 32px;
    line-height: 30px;
    margin-top: -16px;
    padding: 0;
    position: absolute;
    right: 38px;
    top: 50%;
    width: 84px;
}
</style>
