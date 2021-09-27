// 通过 layui.form 对象定义表单校验规则 表单元素的 lay-verify 属性，同时指定具体的校验规则即可
layui.form.verify({
    password: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    samepassword: function (value) {
        if (value === $('form [name=oldPwd]').val()) {
            return '新旧密码不能相同'
        }
    },
    repassword: function (value) {
        if (value !== $('form [name=newPwd]').val()) {
            return '两次输入的密码不一致'
        }
    }
})
// 监听表达提交事件
$('form').on('submit', function (e) {
    e.preventDefault();
    console.log('dian');
    $.ajax({
        method: 'POST',
        url: '/my/updatepwd',
        data: $(this).serialize(),
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('更新密码失败！请重试！')
            }
            layui.layer.msg('修改密码成功！')
            // 修改完成重置表单
            $('form')[0].reset();
        }
    })
})
