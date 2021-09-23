// 接口文档地址：https://www.showdoc.com.cn/escook/3707158761215217
// 大事件项目最新接口地址
var APIhost = 'http://api-breakingnews-web.itheima.net';
$(function () {
    // 登录和注册表单切换事件
    $('#toregister').on('click', function () {
        $(this).parents('.login').slideUp();
        $(this).parents('.login').siblings('.register').slideDown();
    })
    $('#tologin').on('click', function () {
        $(this).parents('.register').slideUp();
        $(this).parents('.register').siblings('.login').slideDown();
    })

    // 通过 layui.form 对象定义表单校验规则 表单元素的 lay-verify 属性，同时指定具体的校验规则即可
    layui.form.verify({
        password: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repassword: function (value) {
            if (value !== $('.register [name=password]').val()) {
                return '两次输入的密码不一致'
            }
        }
    })
    // 在发起 Ajax 请求之前，根据主机名拼接请求的根路径
    $.ajaxPrefilter(function (options) {
        options.url = APIhost + options.url;
    });

    // 登录按钮事件
    $('.login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // 返回状态码不为 0 直接返回失败信息
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('登陆成功');
                console.log(res);
                location.href = './index.html'
            }
        })
    })
    // 注册按钮事件
    $('.register').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: $(this).serialize(),
            success: function (res) {
                // 返回状态码不为 0 直接返回失败信息
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录');
                $('#tologin').trigger('click');
            }
        })
    })


})




