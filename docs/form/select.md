# 下拉选择控件

!> [演示](demo/form/select.html)

下拉选择控件扩展自控件[select2](https://github.com/select2/select2)。

## 使用方法

### 自动初始化

```html
<!--单选-->
<select class="form-control jxselect"
    name="select2_mul"
    data-validate="{required: [true,'请选择城市']}"
    data-placeholder="请选择城市">
    <option></option>
    <option value="610100" data-keys="xas">西安市</option>
    <option value="610200" data-keys="tcs">铜川市</option>
    <option value="610300" data-keys="bjs">宝鸡市</option>
</select>

<!--多选-->
<select class="form-control jxselect" multiple
    name="select2_mul"
    data-validate="{required: [true,'请选择城市']}"
    data-placeholder="请选择城市">
    <option></option>
    <option value="610600" data-keys="yas">延安市</option>
    <option value="610700" data-keys="hzs">汉中市</option>
    <option value="610800" data-keys="yls">榆林市</option>
    <option value="610900" data-keys="aks">安康市</option>
    <option value="611000" data-keys="sls">商洛市</option>
</select>
```

### 手动初始化

```js
//自定义配置选项
$('select').options({
  // 配置选项
});

//手动初始化
jx.ready(function() {
    $('select').jxselect({
        // 配置选项
    });
});
```

## 数据格式
```js
var data = [
    {
        id: 0,
        text: 'enhancement'
    },
    {
        id: 1,
        text: 'bug',
        selected: true
    },
    {
        id: 2,
        text: 'duplicate'
    },
    {
        id: 3,
        text: 'invalid',
        disabled: true
    },
    {
        id: 4,
        text: 'wontfix'
    }
];
```

## 选项

```js
{
    minimumInputLength: 2,//超过这个数量的字符才开始搜索
    maximumInputLength: 4,//限制搜索词的最大长度
    minimumResultsForSearch: 10,//下拉项超过指定数量时显示搜索框，Infinity：永久隐藏搜索框
    width: '500px',//宽度数值或者50%
    selectOnClose: true, //true:下拉框关闭时自动选择当前高亮的行
    closeOnSelect: true, //ture：选择后自动关闭下拉框
    placeholder: '请选择信息',//没有选择时的占位符
    allowClear: true,//允许清空选择
    tags: true,//根据搜索框创建option
    data: [], //动态加载的数据
    escapeMarkup: function (markup) {
        return markup;
    },//字符转义处理
    templateResult: function (state) { //返回结果回调
        if (!state.id) {
            return state.text;
        }
        return state.text + '(option)';
    },
    templateSelection: function (state) { //选中项回调
        if (!state.id) {
            return state.text;
        }
        return state.text + '(选择)';
    }
}
//对于多选择框，没有单独的搜索控制。因此，为了禁用对多选择框的搜索，当下拉菜单打开或关闭时，您需要将文本框设置为true
$('#select2_mul').on('select2:opening select2:closing', function( event ) {
    var $searchfield = $(this).parent().find('.select2-search__field');
    $searchfield.prop('disabled', true);
});


//option 禁用
// <option value="two" disabled="disabled">Second (disabled)</option>
```

## 方法

```js
$('select').val("CA").trigger("change");//设置值

$('select').jxselect("open");//打开下拉框

$('select').jxselect("close");//关闭下拉框

$('select').jxselect("destroy");//销毁下拉框

$('select').val(["CA", "AL"]).trigger("change");//设置多个值

$('select').val(null).trigger("change");//清空选择

$('select').val();//获取选中的值，多选则返回数组

$('select').jxselect('data');//获取选中的对象数组
$('select').jxselect('data').map(function(i) {
    return i.text;
}).join(',');//获取选中的数据文本，用逗号隔开
//[{selected: true, disabled: false, text: "铜川市", id: "610200", title: ""},{selected: true, disabled: false, text: "咸阳市", id: "610400", title: ""}]

```

## 事件

事件调用：
```js
$('select').trigger('change.select2');
```

| Event                 | Description                              |
| --------------------- | ---------------------------------------- |
| `change`              | Triggered whenever an option is selected or removed. |
| `change.select2`      | Scoped version of `change`. See [below](https://select2.org/programmatic-control/events#limiting-the-scope-of-the-change-event) for more details. |
| `select2:closing`     | Triggered before the dropdown is closed. This event can be prevented. |
| `select2:close`       | Triggered whenever the dropdown is closed. `select2:closing` is fired before this and can be prevented. |
| `select2:opening`     | Triggered before the dropdown is opened. This event can be prevented. |
| `select2:open`        | Triggered whenever the dropdown is opened. `select2:opening` is fired before this and can be prevented. |
| `select2:selecting`   | Triggered before a result is selected. This event can be prevented. |
| `select2:select`      | Triggered whenever a result is selected. `select2:selecting` is fired before this and can be prevented. |
| `select2:unselecting` | Triggered before a selection is removed. This event can be prevented. |
| `select2:unselect`    | Triggered whenever a selection is removed. `select2:unselecting` is fired before this and can be prevented. |


## 动态加载
```js
$('#select2_dyload').jxselect({
    data: [ //数据
        {
            id: 0,
            text: 'enhancement'
        },
        {
            id: 1,
            text: 'bug',
            selected: true
        },
        {
            id: 2,
            text: 'duplicate'
        },
        {
            id: 3,
            text: 'invalid',
            disabled: true
        },
        {
            id: 4,
            text: 'wontfix'
        }
    ]
});
```

## 远程加载
```js
$('#select2_ajax').jxselect({
    ajax: {
        url: "https://api.github.com/search/repositories",
        dataType: 'json',
        delay: 250,
        data: function (params) {
            return {
                q: params.term, // search term
                page: params.page
            };
        },
        processResults: function (data, params) {
            // parse the results into the format expected by Select2
            // since we are using custom formatting functions we do not need to
            // alter the remote JSON data, except to indicate that infinite
            // scrolling can be used
            
            //返回结构：
            // {total_count:146748，items:[{id:1,name:''}]}
            
            params.page = params.page || 1;

            return {
                results: data.items,
                pagination: {
                    more: (params.page * 30) < data.total_count
                }
            };
        },
        cache: true
    },
    placeholder: 'Search for a repository',
    escapeMarkup: function (markup) {
        return markup;
    }, // let our custom formatter work
    minimumInputLength: 1,
    templateResult: formatRepo,
    templateSelection: formatRepoSelection
});


function formatRepo(repo) {
    if (repo.loading) {
        return repo.text;
    }

    var markup = "<div class='select2-result-repository clearfix'>" +
        "<div class='select2-result-repository__avatar'><img src='" + repo.owner.avatar_url + "' /></div>" +
        "<div class='select2-result-repository__meta'>" +
        "<div class='select2-result-repository__title'>" + repo.full_name + "</div>";

    if (repo.description) {
        markup += "<div class='select2-result-repository__description'>" + repo.description + "</div>";
    }

    markup += "<div class='select2-result-repository__statistics'>" +
        "<div class='select2-result-repository__forks'><i class='fa fa-flash'></i> " + repo.forks_count + " Forks</div>" +
        "<div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> " + repo.stargazers_count + " Stars</div>" +
        "<div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> " + repo.watchers_count + " Watchers</div>" +
        "</div>" +
        "</div></div>";

    return markup;
}

function formatRepoSelection(repo) {
    return repo.full_name || repo.text;
}
```