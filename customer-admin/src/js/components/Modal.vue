<template lang="html">
<div class="modal" v-show="modal.show" transition="modal" @click.stop="hide">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">{{ modal.title }}</div>
            <div class="modal-body">{{{ modal.content }}}</div>
            <div v-if="modal.btn !== undefined && modal.btn !== ''" class="modal-footer">
                <button class="btn" type="button" name="button" @click="modalEvent">{{ modal.btn }}</button>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: ['modal', 'modalEvent'],
    methods: {
        hide() {
            this.modal.show = false;
        }
    }
};
</script>

<style lang="css" scoped>
.modal {
    display: block;
    transition: opacity .3s ease;
}
.modal-enter, .modal-leave {
    opacity: 0;
}
.btn {
    width: auto;
}
.modal-enter .modal-container,
.modal-leave .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>
