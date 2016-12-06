const modaler = window.modaler;
const requester = window.requester;

// 获取存储在本地的数据
let cacheFormData = JSON.parse(localStorage.getItem('fensitong_submit_data'));

// 之前没填写信息，直接进到这个页面
if (cacheFormData === null) {
    modaler.tip('请确保在之前的步骤填写完所有信息');

// 提交粉丝通开户信息
} else {

    $('#next').click(() => {
        requester.post('/external/business/submitFans.do', {
            companyName: cacheFormData.company, // 公司名称
            weiboAccount: cacheFormData.account, // 微博账号
            contactName: cacheFormData.contact, // 联系人姓名
            url: cacheFormData.url, // 公司首页 url
            address: cacheFormData.contactSite, // 通讯地址
            phone: cacheFormData.contactNumber, // 联系电话
            weiboTradeId: cacheFormData.industry, // 内部行业 ID
            businessLicense: cacheFormData.screenshot, // 营业执照文件
            uid: cacheFormData.uid, // 微博 uid
            salesEmail: cacheFormData.email, // 销售人员邮箱
        }).then(data => {

            // 提交成功
            if (data.data === true) {
                window.location.href = '/#proj_name#/html/service/fensitong/third.html';
                return;

            // 提交失败
            } else {
                modaler.tip('提交信息失败');
            }
        });
    });
}
