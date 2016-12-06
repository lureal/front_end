<template lang="html">
<div class="modal" v-show="tip.show" transition="modal" @click.stop="hide">
    <div class="tip-modal">
        <div class="tip-content">
            <i class="{{ tip.isCheckIcon ? 'fa fa-check-circle' : 'fa fa-times-circle' }}"></i>
            {{tip.content}}
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ['tip'],
    methods: {
        hide() {
            this.tip.show = false;
        }
    }
};
</script>

<style lang="css" scoped>
.modal {
    background: transparent;
    display: block;
    transition: opacity .3s ease;
}
.modal-enter, .modal-leave {
    opacity: 0;
}
.modal-enter .modal-container,
.modal-leave .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}

.tip-modal {
    background: #fff;
    box-shadow: 1px 2px #b9b9b9;
    border: 1px solid #dedede;
    color: #000;
    font-size: 14px;
    left: 50%;
    min-height: 56px;
    margin-left: -65px;
    position: absolute;
    padding: 20px 0;
    text-align: center;
    top: 200px;
    width: 130px;
}

.tip-modal i {
    color: red;
    font-size: 16px;
    margin-right: 10px;
}
</style>
