// 接口文档地址：https://www.showdoc.com.cn/escook/3707158761215217
// var APIhost = 'http://api-breakingnews-web.itheima.net';

// 大事件项目最新接口地址，旧地址中文章部分接口失败
var APIhost = 'http://www.liulongbin.top:3008';
// 在发起 Ajax 请求之前统一配置
$.ajaxPrefilter(function (options) {
    // 为 /my/ 开头的有权限的接口，设置 headers 请求头
    if (options.url.startsWith('/my/')) {
        options.headers = {
            Authorization: localStorage.getItem('bigEventToken') || ''
        }
    }
    // 未登录直接访问后台页面将强制返回登录页面
    options.complete = function (res) {
        if (res.responseJSON.code === 1 && res.responseJSON.message === '身份认证失败！') {
            layui.layer.msg('请先登录！')
            localStorage.removeItem('bigEventToken');
            location.href = './login.html';
        }
    }

    // 为 Ajax 请求 url 属性拼接上主机名
    options.url = APIhost + options.url;
});