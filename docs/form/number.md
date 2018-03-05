# 数字控件

数字控件扩展自控件[`bootstrap-touchspin`](https://github.com/istvan-ujjmeszaros/bootstrap-touchspin)。

!> [示例](demo/form/number.html)

![](./img/jx-number/926c196d.png)

## 用法

```html
<input id="demo7" name="demo7" class="jxnumber" data-min="10" data-max="200" data-decimals="2" data-step="2" value="50" >     
```

具体用法请参考[示例](demo/jx-number.html)

## 选项

| OPTION                  | DEFAULT                              | DESCRIPTION                              |
| ----------------------- | ------------------------------------ | ---------------------------------------- |
| `initval`               | `""`                                 | `data` 当input控件`value` 属性没有指定数值时指定的默认值. |
| `min`                   | `0`                                  | `data` 允许的最小值.                           |
| `max`                   | `100`                                | `data` 允许的最大值.                           |
| `step`                  | `1`                                  | `data` 步长. |
| `forcestepdivisibility` | `'round'`                            | How to force the value to be divisible by step value: `'none'` `'round'` `'floor'` `'ceil'` |
| `decimals`              | `0`                                  | `data` 小数点数.                |
| `stepinterval`          | `100`                                | Refresh rate of the spinner in milliseconds. |
| `stepintervaldelay`     | `500`                                | Time in milliseconds before the spinner starts to spin. |
| `verticalbuttons`       | `false`                              | Enables the traditional up/down buttons. |
| `verticalupclass`       | `'fa fa-chevron-up'`   | Class of the up button with vertical buttons mode enabled. |
| `verticaldownclass`     | `'fa fa-chevron-down'` | Class of the down button with vertical buttons mode enabled. |
| `prefix`                | `""`                                 | `data` Text before the input.                   |
| `postfix`               | `""`                                 | `data` Text after the input.                    |
| `prefix_extraclass`     | `""`                                 | Extra class(es) for prefix.              |
| `postfix_extraclass`    | `""`                                 | Extra class(es) for postfix.             |
| `booster`               | `true`                               | If enabled, the the spinner is continually becoming faster as holding the button. |
| `boostat`               | `10`                                 | Boost at every nth step.                 |
| `maxboostedstep`        | `false`                              | Maximum step when boosted.               |
| `mousewheel`            | `true`                               | `data` Enables the mouse wheel to change the value of the input. |
| `buttondown_class`      | `'btn btn-default'`                  | Class(es) of down button.                |
| `buttonup_class`        | `'btn btn-default'`                  | Class(es) of up button.                  |

## 事件

### 触发事件

The following events are triggered on the original input by the plugin and can be listened on.

| EVENT                        | DESCRIPTION                              |
| ---------------------------- | ---------------------------------------- |
| `change`                     | Triggered when the value is changed with one of the buttons (but not triggered when the spinner hits the limit set by `settings.min` or `settings.max`. |
| `touchspin.on.startspin`     | Triggered when the spinner starts spinning upwards or downwards. |
| `touchspin.on.startupspin`   | Triggered when the spinner starts spinning upwards. |
| `touchspin.on.startdownspin` | Triggered when the spinner starts spinning downwards. |
| `touchspin.on.stopspin`      | Triggered when the spinner stops spinning. |
| `touchspin.on.stopupspin`    | Triggered when the spinner stops upspinning. |
| `touchspin.on.stopdownspin`  | Triggered when the spinner stops downspinning. |
| `touchspin.on.min`           | Triggered when the spinner hits the limit set by `settings.min`. |
| `touchspin.on.max`           | Triggered when the spinner hits the limit set by `settings.max`. |

### 可调用事件

The following events can be triggered on the original input.

Example usages:
`$("input").trigger("touchspin.uponce");`
`$("input").trigger("touchspin.updatesettings", {max: 1000});`

| EVENT                      | DESCRIPTION                              |
| -------------------------- | ---------------------------------------- |
| `touchspin.updatesettings` | `function(newoptions)`: Update any setting of an already initialized TouchSpin instance. |
| `touchspin.uponce`         | Increase the value by one step.          |
| `touchspin.downonce`       | Decrease the value by one step.          |
| `touchspin.startupspin`    | Starts the spinner upwards.              |
| `touchspin.startdownspin`  | Starts the spinner downwards.            |
| `touchspin.stopspin`       | Stops the spinner.                       |



