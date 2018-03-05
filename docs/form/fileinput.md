# 文件上传控件

文件上传控件扩展自控件[`file input widgets`](https://github.com/jasny/bootstrap)。

!> [示例](demo/form/fileinput.html)

![](./img/jx-fileinput/6bfb4b45.png)

## Usage

具体用法请参考[示例](demo/form/fileinput.html)

Add `.fileinputx` to the container. Elements inside the container with `.fileinputx-new` and `.fileinputx-exists` are shown or hidden based on the current state. A preview of the selected file is placed in `.fileinputx-preview`. The text of `.fileinputx-filename` gets set to the name of the selected file.

The file input widget should be placed in a regular `<form>` replacing a standard `<input type="file">`. The server side code should handle the file upload as normal.

### Via data attributes

Add `data-provides="fileinputx"` to the `.fileinputx` element. Implement a button to clear the file with `data-dismiss="fileinputx"`. Add `data-trigger="fileinputx"` to any element within the `.fileinputx` widget to trigger the file dialog.

### Via JavaScript

```js
$('.fileinputx').fileinputx()
```

## Layout

Using the given elements, you can layout the upload widget the way you want, either with a fixed `width` and `height` or with `max-width` and `max-height`.

## 事件

| Event Type          | Description                              |
| ------------------- | ---------------------------------------- |
| change.bs.fileinputx | This event is fired after a file is selected. |
| clear.bs.fileinputx  | This event is fired when the file input is cleared. |
| reset.bs.fileinputx  | This event is fired when the file input is reset. |

## 方法

### .fileinputx(options)

Initializes a file upload widget.

### .fileinputx('clear')

Clear the selected file.

### .fileinputx('reset')

Reset the form element to the original value.