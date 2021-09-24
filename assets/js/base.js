// 接口文档地址：https://www.showdoc.com.cn/escook/3707158761215217
// 大事件项目最新接口地址
var APIhost = 'http://api-breakingnews-web.itheima.net';
// 在发起 Ajax 请求之前，根据主机名拼接请求的根路径
$.ajaxPrefilter(function (options) {
    // 为 /my/ 开头的有权限的接口，设置 headers 请求头
    if (options.url.startsWith('/my/')) {
        options.headers = {
            Authorization: localStorage.getItem('bigEventToken') || ''
        }
    }
    // 未登录直接访问后台页面将强制返回登录页面
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('bigEventToken');
            location.href = './login.html';
        }
    }
    options.url = APIhost + options.url;
});