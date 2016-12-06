
// 提交数据
$('#next').click(() => {
    
    // 获取存储在本地的数据
    let cacheFormData = JSON.parse(localStorage.getItem('weibo_submit_data'));

    // 之前没填写信息，直接进到这个页面
    if (cacheFormData === null) {
        modaler.tip('请确保在之前的步骤填写完所有信息');
        return;
    }

    requester.post('/external/custom/submitWeibo.do', cacheFormData).then(data => {

        // 提交成功
        if (data.data === true) {
            window.location.href = `/#proj_name#/html/service/weibo/third.html?cid=${urler().cid}&id=${urler().id}`;

        // 提交失败
        } else {
            modaler.tip('提交信息失败');
        }
    });
});
