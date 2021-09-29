$(function () {
    // 裁剪区域配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 获取用户头像的src地址
    avatarSrc = window.parent.document.querySelector('.image-avatar').getAttribute('src')
    $('#image').attr('src', avatarSrc)
    // 初始化裁剪区域
    $('#image').cropper(options);

    // 为文件上传框绑定 change 事件
    $('#avatar').on('change', function (e) {
        var files = e.target.files;
        if (files.length === 0) {
            return layui.layer.msg('选择图片失败，请重新选择！')
        }
        var avatar = files[0];
        if (!/^image\//.test(avatar.type)) {
            $('#avatar').val('');

            return layui.layer.msg('请选择符合格式要求的图片！');
        }
        // 将头像转化为路径
        var avatarURl = URL.createObjectURL(e.target.files[0]);
        $('#image').cropper('destroy').attr('src', avatarURl).cropper(options);

        // $('img').cropper('destroy') // 销毁旧的裁剪区域
        //     .attr('src', avatarURl) // 重新设置图片路径
        //     .cropper(options); // 重新初始化裁剪区域
    })

    // 选择图片按钮绑定点击事件
    $('#btnSelectAvatar').on('click', function () {
        $('#avatar').trigger('click')
    })

    // 上传按钮绑定点击事件
    $('#btnUploadAvatar').on('click', function () {
        // 将用户裁剪之后的头像转换为 URL
        var avatarURL = $('#image')
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            method: 'PATCH',
            url: '/my/update/avatar',
            data: {
                avatar: avatarURL
            },
            success: function (res) {
                if (res.code !== 0) {
                    layui.layer.msg('上传头像失败，请重试！')
                }
                layui.layer.msg('修改头像成功！')
                window.parent.getUserinfo();
            }
        })
    })
})
