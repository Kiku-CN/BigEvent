$(function () {
    initCategory();

    var index;  // 它获取的始终是最新弹出的某个层的索引号
    // 利用事件委托给 添加分类按钮 绑定事件
    $('#addCategory').on('click', function () {
        index = layui.layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#tpl-addCategory').html(),

        })
    })

    // 利用事件委托给 添加分类表单 绑定事件
    $('body').on('submit', '#form-addCategory', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/cate/add',
            method: 'post',
            data: $(this).serialize(),
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg('新增文章分类失败，请重试！')
                }
                initCategory();
                layui.layer.msg(res.message);
                layui.layer.close(index);
            }
        })
    })

    // 利用事件委托给 修改分类表单 绑定事件
    $('body').on('submit', '#form-editCategory', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/cate/info',
            method: 'put',
            data: $(this).serialize(),
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg('修改文章分类失败，请重试！')
                }
                initCategory();
                layui.layer.msg(res.message);
                layui.layer.close(index);
            }
        })
    })

    // 请求最新的分类并渲染
    function initCategory() {
        $.ajax({
            url: '/my/cate/list',
            method: 'get',
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg('获取文章分类列表失败，请重试！')
                }
                var htmlStr = template('tpl-categoryTable', res)
                $('tbody').html(htmlStr);
            }
        })
    }

    // 利用事件委托给 修改按钮 绑定事件
    $('table').on('click', '#btn-edit', function () {
        index = layui.layer.open({
            title: '修改文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#tpl-editCategory').html(),
        })
        $('#form-editCategory [name="id"]').val($(this).attr('data-id'));
        $('#form-editCategory [name="cate_name"]').val($(this).attr('data-name'));
        $('#form-editCategory [name="cate_alias"]').val($(this).attr('data-alias'));
    })

    // 利用事件委托给 修改按钮 绑定事件
    $('table').on('click', '#btn-delete', function () {
        var id = $(this).attr('data-id');
        index = layui.layer.confirm('删除该分类？', function (index) {
            $.ajax({
                url: '/my/cate/del?id=' + id,
                method: 'delete',
                success: function (res) {
                    if (res.code !== 0) {
                        return layui.layer.msg('删除失败，请重试！')
                    }
                    layui.layer.msg(res.message + '分类下的文章仍被保留！');
                    initCategory();
                }
            })
            layui.layer.close(index);
        })
    })
})
