<template lang="html">
<button type="button" name="button">{{ counter.label }}</button>
</template>

<script>
export default {

    data() {
        return {
            interval: null
        };
    },

    // { label: '发送验证码', number: 59, triggle: false, reset: false }
    props: ['counter', 'callback'],
    methods: {
        start() {
            let self = this;
            self.interval = setInterval(function () {
                if(self.counter.number === 0) {
                    self.stop();
                    self.callback();
                }
                self.counter.number -= 1;
            }, 1000);
        },
        stop() {
            let self = this;
            clearInterval(self.interval);
        }
    },
    watch: {
        'counter.triggle': function(val) {
            let self = this;
            if(val === true) {
                self.start();
            } else {
                self.stop();
            }
        },
        'counter.reset': function(val) {
            let self = this;
            if(val === true) {
                self.counter.number = 50;
                self.counter.reset = false;
            }
        }
    },
    ready() {
        let self = this;
        if(self.counter.triggle === true) {
            self.start();
        }
    }
};
</script>

<style lang="css">
</style>
