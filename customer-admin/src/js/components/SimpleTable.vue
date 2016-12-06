<template lang="html">
<table class="table table-hover">
    <tr class="table-thead">
        <th v-for="tr in table.trs">
            {{ tr.label }}
            <span v-if="tr.isTip" data-toggle="tooltip" data-placement="bottom" data-html="true" title="{{{ tr.tip }}}">
                <i class="fa fa-question-circle"></i>
            </span>
        </th>
    </tr>
    <tr v-for="td in table.tds">
        <td v-for="value in td">
            {{{ value }}}
        </td>
    </tr>
</table>
</template>

<script>
    export default {
        data() {
            return {};
        },
        props: ['table']
    };
</script>

<style lang="css" scoped>
.table-thead {
    background: #e6e6e6;
}
.table-thead:hover {
    background: #e6e6e6;
}
.table th,
.table td {
    height: 55px;
    text-align: center;
    vertical-align: middle;
}
[data-toggle="tooltip"] {
    font-size: 15px;
}
</style>
