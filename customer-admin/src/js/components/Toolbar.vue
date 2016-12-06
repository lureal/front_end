<template lang="html">
<div class="form-inline">
    <div class="form-group">
        <datepicker
            format="YYYY-MM-DD"
            :readonly="true"
            :value.sync="toolbar.dateStart" width="120px">
        </datepicker>
    </div>
    <span class="dash"></span>
    <div class="form-group">
        <datepicker
            format="YYYY-MM-DD"
            :readonly="true"
            :value.sync="toolbar.dateEnd" width="120px">
        </datepicker>
    </div>
    <div class="form-group">
        <button type="button" name="button" class="btn" @click="callback(1)">查询</button>
    </div>
</div>
</template>

<script>
import Datepicker from 'vue-date-picker';

export default {
    props: ['toolbar', 'callback'],
    components: {
        Datepicker
    }
};
</script>

<style lang="css">
.dash {
    display: inline-block;
    position: relative;
    width: 23px;
}
.dash:after {
    background: #818181;
    content: '';
    height: 2px;
    left: 50%;
    margin-top: -2px;
    margin-left: -5px;
    position: absolute;
    top: 50%;
    width: 10px;
}
.btn {
    background: #41c1a3;
    border-radius: 0;
    color: #fff;
    height: 32px;
    margin-left: 24px;
    width: 62px;
}
.btn:hover {
    color: #fff;
}
</style>
