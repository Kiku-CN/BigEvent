function getUserinfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'get',
        success: function (res) {
            if (res.code !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            renderAvatar(res.data);
        }
    })
}
getUserinfo();
// 渲染用户头像
function renderAvatar(data) {
    // 如果用户设置了昵称优先使用昵称，否则使用账号名称
    var username = data.nickname || data.username;
    console.log('username:' + username);
    // 根据用户名设置欢迎词
    $('#welcome').html(username + '，欢迎回来')
    // 如果用户设置了头像则隐藏文字头像，否则隐藏用户头像
    if (data.user_pic) {
        $('.image-avatar').attr('src', data.user_pic)
        $('.userinfo span').hide();
    } else {
        $('.userinfo img').hide();
        $('.userinfo span').html(username[0].toUpperCase())
    }
}
// 退出登录按钮
$('#btnLogout').on('click', function () {
    layui.layer.confirm('退出登录？', {
        icon: 3,
        title: '提示'
    }, function (index) {
        // 删除本地 token
        localStorage.removeItem('bigEventToken');
        // 跳转到登录页面
        location.href = './login.html';
        // 关闭 confirm 框
        this.close(index);
    })
})