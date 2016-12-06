<template lang="html">
    <nav>
        <ul class="pagination pull-right">
            <li v-if="pagination.current_page > 1">
                <a class="previous" href="javascript:void(0);" @click.prevent="changePage(pagination.current_page - 1)">
                    <span aria-hidden="true">上一页</span>
                </a>
            </li>
            <li v-for="num in array" :class="{'active': num === pagination.current_page, 'page-item': true}">
                <a class="" href="#" @click.prevent="changePage(num)">{{ num }}</a>
            </li>
            <li v-if="pagination.current_page < pagination.last_page">
                <a class="next" href="javascript:void(0);" @click.prevent="changePage(pagination.current_page + 1)">
                    <span aria-hidden="true">下一页</span>
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    props: ['pagination', 'callback', 'offset', 'data'],
    computed: {
        array() {

            let _from = this.pagination.current_page - this.offset;
            if(_from < 1) {
                _from = 1;
            }

            let to = _from + (this.offset * 2);
            if(to >= this.pagination.last_page) {
                to = this.pagination.last_page;
            }

            let arr = [];
            while (_from <= to) {
                arr.push(_from);
                _from++;
            }

            return arr;
        }
    },
    watch: {
        'pagination.per_page': function() {
            this.callback();
        }
    },
    methods: {
        changePage(page) {
            let self = this;
            if(page === this.pagination.current_page) {
                return;
            }
            this.$set('pagination.current_page', page);
            this.callback(self.pagination.current_page);
        }
    }
};
</script>

<style lang="css" scoped>
nav {
    padding-right: 20px;
}
.pagination {
    margin: 50px 0;
}
.pagination li {
    display: inline-block;
}
.pagination li a {
    border-radius: 0 !important;
}
.previous,
.previous:hover,
.next,
.next:hover {
    background: #fff;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    color: #41c1a3;
    height: 40px;
    line-height: 40px;
    padding: 0;
    text-align: center;
    width: 80px;
}
.page-item {
    margin-left: 15px;
}
.previous {
    margin-right: 11px;
}
.next {
    margin-left: 26px;
}
.page-item > a,
.page-item > a:hover {
    color: #41c1a3;
    height: 40px;
    line-height: 40px;
    padding: 0;
    text-align: center;
    width: 45px;
}

.pagination .active.page-item > a {
    background: #41c1a3;
    border-color: #41c1a3;
    color: #fff;
}
</style>
