
// 根据 url 中的参数判定当前是更新订单还是创建订单
// 如果当前是更新订单
if (urler().edit === '1') {
    $('#complete-text').html('广告订单已成功更新');

// 如果当前是创建新订单
} else {
    $('#complete-text').html('广告订单已成功创建');
}