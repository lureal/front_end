export default () => {
    let queryString = {};

    // 获取 url 中的参数片段，如
    // xxx.com?a=1&b=2&c=3 则将获得 a=1&b=2&c=3，
    // 如果不使用 .substring(1) 则会获得 ?a=1&b=2&c=3
    let query = window.location.search.substring(1);

    // 根据 & 分割出一个个 query
    let queryArr = query.split('&');

    // 循环 query 数组
    for (let q of queryArr) {
        let pair = q.split('=');

        // 如果 queryString 中没有这个属性，则存储
        if (typeof queryString[pair[0]] === 'undefined') {
            queryString[pair[0]] = pair[1];

        // 如果有这个属性，则将之前的属性值与现在的属性值拼接成数组，然后重新复制给 queryString 中的属性
        } else if (typeof queryString[pair[0]] === 'string') {
            let arr = [queryString[prir[0]], pair[1]];
            queryString[pair[0]] = arr;

        // 如果都不是，则当作数组推进 queryString
        } else {
            queryString[pair[0]].push(pair[1]);
        }
    }

    return queryString;
};
