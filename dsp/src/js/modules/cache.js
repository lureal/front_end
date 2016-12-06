/**
 * 简单的本地存储操作，使用 localStorage
 *
 * usage:
 *
 * 1. 引入模块
 * 2. 使用 cache.init(); 进行初始化，如果需要在离开页面的时候销毁变量，则在初始化的时候传入
 *    pageDestory 参数
 * 3. 设置值使用 cache.set(属性名，属性值) 将会以 cache 的属性的形式进行存储
 * 4. 获取值使用 cache.get(属性名) 将会拿到缓存在 cache 上的特定属性的值，如果拿不到，则返
 *    回 undefined
 */

var cache = {};

/**
 * 初始化本地缓存
 * @param {Boolean} pageDestory [判定是否在页面离开的时候对本地变量进行销毁]
 */
cache.init = function(pageDestory) {

    if(!localStorage.getItem('cache_ah333333')) {
        localStorage.setItem('cache_ah333333', '{}');
    }

    if(pageDestory) {
        $(window).unload(function(){
            localStorage.removeItem('cache_ah333333');
        });
    }
};

/**
 * 将属性值属性名绑定到 cache 变量身上，如：
 *
 * 属性名：a.b.c.d
 * 属性值：[1, 2]
 *
 * 绑定结果：
 * cache.a.b.c.d = [1, 2]
 *
 * 当你第一次设置 cache.a.b.c = 12，然后继续设置 cache.a.b = 11; 则会进行覆盖操作，也就是
 * 说 cache.a.b.c 的 .c 已经不存在了。
 *
 * @param {String} prop [属性名]
 * @param {AnyType} val [属性值]
 */
cache.set = function(prop, val) {
    var propArr = prop.split(/\./); // "a.b.c.d" 转换成 ['a', 'b', 'c', 'd']
    var cache = JSON.parse(localStorage.getItem('cache_ah333333'));

    // 当前使用的是 'a.b.c.d' 的变量名
    if(propArr.length > 1) {
        for(var i = 0, _cache = cache; i < propArr.length; i++) {

            // 当前已经到最后一个值，执行赋值操作
            if(i === (propArr.length - 1)) {
                _cache[propArr[i]] = val;

            } else {
                if(!_cache[propArr[i]]) {
                    _cache[propArr[i]] = {};
                }
                _cache = _cache[propArr[i]];
            }
        }

    // 当前使用的是正常的变量名，如，a
    } else {
        cache[prop] = val;
    }

    // 重新设置变量
    localStorage.setItem('cache_ah333333', JSON.stringify(cache));
};

/**
 * 获取存储在本地的值，如：
 * 属性名：a.b.c.d
 *
 * 将返回 cache.a.b.c.d
 *
 * 如果当发现属性值是 undefined，则直接返回 undefined
 *
 * @param {String} prop [属性名]
 */
cache.get = function(prop) {
    var propArr = prop.split(/\./); // "a.b.c.d" 转换成 ['a', 'b', 'c', 'd']
    var cache = JSON.parse(localStorage.getItem('cache_ah333333'));

    // 当前使用的是 'a.b.c.d' 的变量名
    if(propArr.length > 1) {
        for(var i = 0, _cache = cache; i < propArr.length; i++) {
            if(i === (propArr.length - 1)) {
                if(_cache[propArr[i]] !== undefined) {
                    return _cache[propArr[i]];
                } else {
                    return undefined;
                }
            } else {
                if(_cache[propArr[i]] !== undefined) {
                    _cache = _cache[propArr[i]];
                } else {
                    return undefined;
                }
            }
        }

    // 当前使用的是正常的变量名，如，a
    } else {
        return cache[prop];
    }
};


/**
 * 清除缓存在本地的所有数据
 */
cache.removeAll = function() {
    localStorage.removeItem('cache_ah333333');
}

module.exports = cache;
