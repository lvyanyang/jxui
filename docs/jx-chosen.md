# 下拉控件(Chosen)

下拉控件(Chosen)扩展自控件[`chosen`](https://github.com/harvesthq/chosen)。

!> [下拉控件(Chosen)配置选项/API/演示](../demo/docs/jx-chosen.html)

## 使用方法

使用类`jxchosen`标记的组件会自动引用依赖并初始化
```html
<select name="select_jxchosen" class="form-control jxchosen"
    data-validate="{required: [true,'请选择分类']}"
    data-placeholder="选择一个宠物...">
    <option value=""></option>
    <option value="2" data-keys="熊猫 xm">熊猫</option>
    <option value="3" data-keys="蝴蝶 hd">蝴蝶</option>
    <option value="4" data-keys="蜻蜓 qt">蜻蜓</option>
    <option value="5" data-keys="蝎子 xz">蝎子</option>
    <option value="6" data-keys="珊瑚 sh">珊瑚</option>
    <option value="7" data-keys="海牛 hn">海牛</option>
    <option value="8" data-keys="水獭 sl">水獭</option>
    <option value="9" data-keys="灵猫 lm">灵猫</option>
    <option value="10" data-keys="海豚 ht">海豚</option>
</select>
```

## 默认值

```js
{
    url: null,
    method: 'get',
    params: {},
    width: '100%',
    allow_single_deselect: true,  // 允许单选取消
    disable_search_threshold: 6,  // 10 个以下的选择项则不显示检索框
    search_contains: true,        // 从任意位置开始检索
    changeValidate: true
}
```

## 选项


## 方法
