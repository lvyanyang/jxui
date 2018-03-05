# Markdown编辑器

Markdown编辑器扩展自控件[`editor.md`](https://github.com/pandao/editor.md)

[官方演示地址](https://pandao.github.io/editor.md/examples/index.html)

!> [示例](demo/form/editor.html)

## 使用方法

使用类`jxeditormd`标记的组件会自动引用依赖并初始化
```html
<div class="jxeditormd">
    <textarea name="mdContent" data-validate="required: [true,'请输入内容']"></textarea>
</div>
```

## 默认值

```js
{
    placeholder: '',
    autoFocus: false,
    watch: false,
    emoji: true,
    styleActiveLine: false,
    lineNumbers: false,
    width: '100%',
    height: 320,
    syncScrolling: 'single'
}
```