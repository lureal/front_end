/*!
 * 存储对 Array 相关的操作
 */

module.exports = {

    /**
     * 矩阵倒置，比如有下面的矩阵
     * [
     *   [1, 2, 3, 4],
     *   [1, 2, 3, 4],
     *   [1, 2, 3, 4]
     * ]
     *
     * 倒置后将变成
     *
     * [
     *   [1, 1, 1],
     *   [2, 2, 2],
     *   [3, 3, 3],
     *   [4, 4, 4]
     * ]
     * @param {Array} arr [矩阵形态的数组]
     * @return {Array} 返回倒置后的数组
     */
    upsideDown: function(arr) {
        var distArr = [];

        for(var i = 0; i < arr[0].length; i++) {
            distArr[i] = [];
        }

        for(var i = 0; i < arr.length; i++) {
            for(var j = 0; j < arr[i].length; j++) {
                distArr[j][i] = arr[i][j];
            }
        }

        return distArr
    }
};