$(function () {

    var queryOptions = {
        pagenum: 1,     // 页码值，默认显示第一页的数据
        pagesize: 5,    // 每页显示几条数据，默认每页显示2条
        cate_id: '',    // 文章分类的 Id
        state: '',      // 文章的发布状态
    }
    initCategoryList();
    initArticleList();

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


    // 文章列表表格模板中的时间格式化过滤器
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date);
        let year = dt.getFullYear();
        let month = padZero(dt.getMonth() + 1);
        let day = padZero(dt.getDate());
        let hh = padZero(dt.getHours());
        let mm = padZero(dt.getMinutes());
        let ss = padZero(dt.getSeconds());

        function padZero(num) {
            return num > 9 ? num : '0' + num;
        }

        return year + '-' + month + '-' + day + ' ' + hh + ':' + mm + ':' + ss;

    }

    function initArticleList() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: queryOptions,
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg('获取文章列表失败！')
                }
                var htmlStr = template('tpl-articleList', res)
                $('tbody').html(htmlStr);

                layui.laypage.render({
                    elem: 'page'
                    , count: res.total //数据总数，从服务端得到
                    , limit: queryOptions.pagesize  // 每页显示的条数
                    , curr: queryOptions.pagenum    // 当前页码数
                    , layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']
                    , limits: [2, 5, 10, 20]
                    , jump: function (obj, first) {
                        // 当分页被切换时或者更改 limit 时 jump 函数被调用
                        //第一个参数包含 obj 包含了当前分页的相关属性，第二个参数判断是否初始加载

                        queryOptions.pagenum = obj.curr;
                        queryOptions.pagesize = obj.limit;

                        //首次加载列表调用 jump 函数时不能再重新渲染列表，否则导致死循环
                        if (!first) {
                            initArticleList();
                        }
                    }
                });
            }
        })
    }

    // 筛选表单提交事件
    $('#form-filter').on('submit', function (e) {
        e.preventDefault();
        queryOptions.cate_id = $('[name="cate_id"]').val();
        queryOptions.state = $('[name="state"]').val();
        initArticleList()
    })

    // 使用事件委托为删除按钮添加事件
    $('tbody').on('click', '.btn-delete', function () {
        const id = $(this).attr('data-id');
        var index = layui.layer.confirm('确定删除该篇文章吗？', function () {
            $.ajax({
                url: '/my/article/info?id=' + id,
                method: 'delete',
                success: function (res) {
                    if (res.code !== 0) {
                        layui.layer.msg('删除失败，请重试！')
                    }
                    // 根据当前页面中删除按钮的个数判断是否是本分页最后一条数据，如果是且不是第一页则
                    if ($('.btn-delete').length === 1 && queryOptions.pagenum !== 1) {
                        console.log('ssss');
                        queryOptions.pagenum--;
                    }
                    // 删除后重新刷新文章列表
                    initArticleList()
                }
            })
            // 删除成功关闭弹出框
            layer.close(index);
        })

    })

    // 使用事件委托为修改按钮添加事件
    $('tbody').on('click', '.btn-edit', function () {
        console.log('xxxx');
        const id = $(this).attr('data-id')
        // 在本地存储中保存 articleID，标识编辑模式
        localStorage.setItem('articleID', id);
        // location.href = './publish.html'
        window.parent.$('#link-articlePublish').trigger('click');
    })

    // 使用事件委托为文章标题添加点击预览事件
    $('tbody').on('click', '.articlePreview', function () {
        const id = $(this).attr('data-id')

        $.ajax({
            method: 'get',
            url: '/my/article/info',
            data: { id },
            success: function (res) {
                if (res.code !== 0) {
                    return layui.layer.msg('获取文章详情失败！')
                }

                var htmlStr = template('tpl-articlePreview', res.data)
                layer.open({
                    type: 1,
                    area: ['85%', '85%'],
                    title: '预览文章',
                    content: htmlStr
                })
            }
        })

    })


})
