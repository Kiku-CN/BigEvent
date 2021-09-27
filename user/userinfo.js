$(function () {

    // 表单添加验证规则 nickname
    layui.form.verify({
        nickname: function (value) {
            if (!/^\S{1,6}$/.test(value)) {
                return '用户昵称应该在 1 ~ 10 个字符之间，且不能包含空格'
            }
        }
    })

    // 初始化个人信息
    function initUserinfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo/',
            success: function (res) {
                if (res.status !== 0) {
                    layui.layer.msg('获取用户信息失败');
                }
                layui.form.val('userinfo', res.data);

                res.data
            }
        })
    }
    initUserinfo();

    // 重置按钮事件
    $('#reset').on('click', function (e) {
        e.preventDefault();
        initUserinfo();
    })

    $('form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/userinfo',
            method: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改用户信息失败！')
                }
                return layui.layer.msg('修改用户信息成功！')

                window.parent.getUserinfo();
            }
        })
    })
})