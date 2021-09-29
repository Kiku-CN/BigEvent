$(function () {
    // 初始化富文本编辑器
    initEditor();
    // 初始化文章类别列表
    initCategoryList();

    // 设定裁剪选项并初始化裁剪区域
    var cropperOptions = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    $('#image').cropper(cropperOptions);



    // 判断本地存储中是否有文章 ID 属性
    const id = localStorage.getItem('articleID');
    var isEdited = false;
    if (id) {
        // 如果有则说明是编辑文章模式
        getArticle(id);
    }

    function getArticle(id) {
        $.ajax({
            method: 'get',
            url: '/my/article/info',
            data: { id },
            success: function (res) {
                if (res.code !== 0) {
                    localStorage.removeItem('articleID');
                    return layui.layer.msg('获取文章详情失败！')
                }
                // 将根据 ID 查询到原文章填充进表单
                layui.form.val('articleInfo', res.data);
                // 跟换图片的 URL
                var coverURL = "http://www.liulongbin.top:3008" + res.data.cover_img;
                // 销毁旧的裁剪区域，给图片设置新的地址并重新裁剪
                $('#image').cropper('destroy').attr('src', coverURL).cropper(cropperOptions);
                // 移除本地存储中的 articleID
                localStorage.removeItem('articleID');
                // 改为编辑状态，更新而不是添加文章
                isEdited = true;

            }
        })
    }

    function initCategoryList() {
        $.ajax({
            url: '/my/cate/list',
            method: 'get',
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg('获取文章分类失败！')
                }
                var htmlStr = template('tpl-categoryList', res)
                $('[name="cate_id"]').html(htmlStr);
                layui.form.render();
            }
        })
    }



    // 上传文章的默认状态是已发布
    var articleState = '已发布';

    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btn-draft').on('click', function () {
        articleState = '草稿';
    })

    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btn-selectCover').on('click', function () {
        $('[type="file"]').trigger('click');
    })

    $('#coverFile').on('change', function (e) {
        var files = e.target.files;
        if (files.length === 0) {
            return layui.layer.msg('请选择正确格式的图片！')
        }
        var coverURL = URL.createObjectURL(files[0]);

        $('#image').cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', coverURL)  // 重新设置图片路径
            .cropper(cropperOptions)        // 重新初始化裁剪区域
    })


    $('form').on('submit', function (e) {
        e.preventDefault();
        // 基于 form 表单，快速创建一个 FormData 对象
        var formData = new FormData($(this)[0]);
        // 将文章的发布状态，存到 fd 中
        formData.append('state', articleState);
        $('#image').cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 400,
            height: 280
        }).toBlob(function (blob) {
            // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            formData.append('cover_img', blob);
            publishArticle(formData);
            // 更新文章接口失效
            // if (isEdited) {
            //     updateArtcle(formData);
            // } else {
            //     publishArticle(formData);
            // }

        })
        // 一定要在 toBlob() 中发出请求，或者延时发请求，否则可能会出现出请求时图片对象还没有被添加到 formData 中
        // window.setTimeout(publishArticle, 1000, formData)

    })

    function publishArticle(data) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: data,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg('发布文章失败，请重试！')
                }
                layui.layer.msg('发布文章成功！')
                window.parent.$('#link-articleList').click();
            }
        })
    }

    // 跟新文章接口已经失效
    // function updateArtcle(data) {
    //     $.ajax({
    //         method: 'post',
    //         url: '/my/article/edit/',
    //         data: data,
    //         contentType: false,
    //         processData: false,
    //         success: function (res) {
    //             if (res.code !== 0) {
    //                 return layui.layer.msg('更新文章失败，请重试！')
    //             }
    //             layui.layer.msg('修改文章成功！')
    //             window.parent.$('#link-articleList').click();
    //         }
    //     })
    // }
})


