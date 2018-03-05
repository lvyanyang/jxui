# 日期控件

日期控件结合了一个可编辑的文本框控件和允许用户选择日期的下拉日历面板控件。选择的日期会自动转变为一个有效的日期然后填充到文本框中。选定的日期也可以被格式化为预定格式。

日期控件扩展自控件`bootstrap-datepicker`，关于控件更详细的信息可以访问[官网](https://github.com/uxsolutions/bootstrap-datepicker)进行了解。

!> [示例](demo/form/date.html)

## 使用方法

- 自动初始化方式

使用类`jxdate`标记的组件会自动引用依赖并初始化
```html
<!--文本框模式-->
<input class="form-control jxdate" name="adate" type="text" placeholder="请选择日期"
           data-validate="{required: [true,'请选择日期']}">
           
<!--组件模式-->
 <div class="input-group date jxdate">
    <input class="form-control" name="bdate" type="text" 
           data-validate="{required: [true,'请选择日期']}" placeholder="请选择日期">
    <span class="input-group-addon">
        <i class="fa fa-calendar"></i>
    </span>
</div>

<!--内嵌模式-->
<div class="jxdate" data-date="2018-1-1"></div>
```

- 手动初始化方式

在html标签中不要使用类`jxdate`标记，并在`jx.ready()`方法中手动初始化
```html
<script>
    jx.ready(function() {
       //使用类 jxdate-control 标记
      $('.jxdate-control').jxdate({
        //配置参数
      });
    });
</script>
```

## 默认值

```javascript
{
    language: 'zh-CN',
    format: 'yyyy-mm-dd',
    todayBtn: 'linked',
    autoclose: true,
    todayHighlight: true,
    templates: {
        leftArrow: '<span class="fa fa-arrow-left"></span>',
        rightArrow: '<span class="fa fa-arrow-right"></span>'
    },
    changeValidate: true
}
```

## 属性

属性使用方法

1. 在标记上设置属性，使用`data-options`，配置选项是一个对象
```html
 <input name="adate" class="form-control jxdate" data-options="{format:'yyyy~mm~dd'}">
```

1. 组件初始化前设置属性
```js
$('.jxdate').options({
    //属性对象
});
```

1. 手动初始化并指定配置属性
```js
$('.jxdate').jxdate({
    //属性对象
});
```

All options that take a “Date” can handle a `Date` object; a String formatted according to the given `format`; or a timedelta relative to today, eg “-1d”, “+6m +1y”, etc, where valid units are “d” (day), “w” (week), “m” (month), and “y” (year). Use “0” as today. There are also aliases for the relative timedelta’s: “yesterday” equals “-1d”, “today” is equal to “+0d” and “tomorrow” is equal to “+1d”.

Most options can be provided via data-attributes. An option can be converted to a data-attribute by taking its name, replacing each uppercase letter with its lowercase equivalent preceded by a dash, and prepending “data-date-” to the result. For example, `startDate` would be `data-date-start-date`, `format` would be `data-date-format`, and `daysOfWeekDisabled` would be `data-date-days-of-week-disabled`.

See the [quick reference](#quick-reference) for an overview of all options and their default values

### autoclose

Boolean. Default: false

Whether or not to close the datepicker immediately when a date is selected.

### assumeNearbyYear

Boolean or Integer. Default: false

If true, manually-entered dates with two-digit years, such as “5/1/15”, will be parsed as “2015”, not “15”. If the year is less than 10 years in advance, the picker will use the current century, otherwise, it will use the previous one. For example “5/1/15” would parse to May 1st, 2015, but “5/1/97” would be May 1st, 1997.

To configure the number of years in advance that the picker will still use the current century, use an Integer instead of the Boolean true. E.g. “assumeNearbyYear: 20”

### beforeShowDay

Function(Date). Default: $.noop

A function that takes a date as a parameter and returns one of the following values:

> - undefined to have no effect
> - A Boolean, indicating whether or not this date is selectable
> - A String representing additional CSS classes to apply to the date’s cell
> - An object with the following properties:
>   - `enabled`: same as the Boolean value above
>   - `classes`: same as the String value above
>   - `tooltip`: a tooltip to apply to this date, via the `title` HTML attribute
>   - `content`: the content to display in the day cell, rather than the default (day of month as text)

### beforeShowMonth

Function(Date). Default: $.noop

A function that takes a date as a parameter and returns one of the following values:

> - undefined to have no effect
> - A Boolean, indicating whether or not this month is selectable
> - A String representing additional CSS classes to apply to the month’s cell
> - An object with the following properties:
>   - `enabled`: same as the Boolean value above
>   - `classes`: same as the String value above
>   - `tooltip`: a tooltip to apply to this date, via the `title` HTML attribute

### beforeShowYear

Function(Date). Default: $.noop

A function that takes a date as a parameter and returns one of the following values:

> - undefined to have no effect
> - A Boolean, indicating whether or not this year is selectable
> - A String representing additional CSS classes to apply to the year’s cell
> - An object with the following properties:
>   - `enabled`: same as the Boolean value above
>   - `classes`: same as the String value above
>   - `tooltip`: a tooltip to apply to this year, via the `title` HTML attribute

### beforeShowDecade

Function(Date). Default: $.noop

A function that takes a date as a parameter and returns one of the following values:

> - undefined to have no effect
> - A Boolean, indicating whether or not this year is selectable
> - A String representing additional CSS classes to apply to the year’s cell
> - An object with the following properties:
>   - `enabled`: same as the Boolean value above
>   - `classes`: same as the String value above
>   - `tooltip`: a tooltip to apply to this year, via the `title` HTML attribute

### beforeShowCentury

Function(Date). Default: $.noop

A function that takes a date as a parameter and returns one of the following values:

> - undefined to have no effect
> - A Boolean, indicating whether or not this year is selectable
> - A String representing additional CSS classes to apply to the year’s cell
> - An object with the following properties:
>   - `enabled`: same as the Boolean value above
>   - `classes`: same as the String value above
>   - `tooltip`: a tooltip to apply to this year, via the `title` HTML attribute

### calendarWeeks

Boolean. Default: false

Whether or not to show week numbers to the left of week rows.

![_images/option_calendarweeks.png](https://bootstrap-datepicker.readthedocs.io/en/latest/_images/option_calendarweeks.png)

### clearBtn

Boolean. Default: false

If true, displays a “Clear” button at the bottom of the datepicker to clear the input value. If “autoclose” is also set to true, this button will also close the datepicker.

![_images/option_clearbtn.png](https://bootstrap-datepicker.readthedocs.io/en/latest/_images/option_clearbtn.png)

### container

String. Default: “body”

Appends the date picker popup to a specific element; eg: container: ‘#picker-container’ (will default to “body”)

### datesDisabled

String, Array. Default: []

Array of date strings or a single date string formatted in the given date format

### daysOfWeekDisabled

String, Array. Default: []

Days of the week that should be disabled. Values are 0 (Sunday) to 6 (Saturday). Multiple values should be comma-separated. Example: disable weekends: `'06'` or `'0,6'` or `[0,6]`.

![_images/option_daysofweekdisabled.png](https://bootstrap-datepicker.readthedocs.io/en/latest/_images/option_daysofweekdisabled.png)

### daysOfWeekHighlighted

String, Array. Default: []

Days of the week that should be highlighted. Values are 0 (Sunday) to 6 (Saturday). Multiple values should be comma-separated. Example: highlight weekends: `'06'` or `'0,6'` or `[0,6]`.

### defaultViewDate

Date, String or Object with keys `year`, `month`, and `day`. Default: today

Date to view when initially opening the calendar. The internal value of the date remains today as default, but when the datepicker is first opened the calendar will open to `defaultViewDate` rather than today. If this option is not used, “today” remains the default view date.

- This option can be:

  A date, which should be in local timezone.A string which must be parsable with `format`.An object with keys `year`, `month` and `day` (can’t be set from a data attribute). If the given object is missing any of the required keys, their defaults are:`year`: the current year`month`: 0 (Note that it starts with 0 for January)`day`: 1

### disableTouchKeyboard

Boolean. Default: false

If true, no keyboard will show on mobile devices

### enableOnReadonly

Boolean. Default: true

If false the datepicker will not show on a readonly datepicker field.

### endDate

Date or String. Default: End of time

The latest date that may be selected; all later dates will be disabled.

Date should be in local timezone. String must be parsable with `format`.

![_images/option_enddate.png](https://bootstrap-datepicker.readthedocs.io/en/latest/_images/option_enddate.png)

```
<input type="text" class="form-control" data-date-end-date="0d">

```

Will disable all dates after today.

### forceParse

Boolean. Default: true

Whether or not to force parsing of the input value when the picker is closed. That is, when an invalid date is left in the input field by the user, the picker will forcibly parse that value, and set the input’s value to the new, valid date, conforming to the given format.

### format

String. Default: “mm/dd/yyyy”

The date format, combination of d, dd, D, DD, m, mm, M, MM, yy, yyyy.

- d, dd: Numeric date, no leading zero and leading zero, respectively. Eg, 5, 05.
- D, DD: Abbreviated and full weekday names, respectively. Eg, Mon, Monday.
- m, mm: Numeric month, no leading zero and leading zero, respectively. Eg, 7, 07.
- M, MM: Abbreviated and full month names, respectively. Eg, Jan, January
- yy, yyyy: 2- and 4-digit years, respectively. Eg, 12, 2012.

Object.

Custom formatting options

- toDisplay: function (date, format, language) to convert date object to string, that will be stored in input field
- toValue: function (date, format, language) to convert string object to date, that will be used in date selection

```js
$('.datepicker').datepicker({
    format: {
        /*
         * Say our UI should display a week ahead,
         * but textbox should store the actual date.
         * This is useful if we need UI to select local dates,
         * but store in UTC
         */
        toDisplay: function (date, format, language) {
            var d = new Date(date);
            d.setDate(d.getDate() - 7);
            return d.toISOString();
        },
        toValue: function (date, format, language) {
            var d = new Date(date);
            d.setDate(d.getDate() + 7);
            return new Date(d);
        }
    }
});

```

### immediateUpdates

Boolean. Default: false

If true, selecting a year or month in the datepicker will update the input value immediately. Otherwise, only selecting a day of the month will update the input value immediately.

### inputs

Array, jQuery. Default: None

A list of inputs to be used in a range picker, which will be attached to the selected element. Allows for explicitly creating a range picker on a non-standard element.

```
<div id="event_period">
    <input type="text" class="actual_range">
    <input type="text" class="actual_range">
</div>

```

```
$('#event_period').datepicker({
    inputs: $('.actual_range')
});

```

### keepEmptyValues

Boolean. Default: false

Only effective in a range picker. If true, the selected value does not get propagated to other, currently empty, pickers in the range.

### keyboardNavigation

Boolean. Default: true

Whether or not to allow date navigation by arrow keys.

Keyboard navigation is not supported at all for embedded / inline mode. Also it’s not working if input element hasn’t focus. This could be an issue if used as component or if opened by showmethod.

### language

String. Default: “en”

The IETF code (eg “en” for English, “pt-BR” for Brazilian Portuguese) of the language to use for month and day names. These will also be used as the input’s value (and subsequently sent to the server in the case of form submissions). If a full code (eg “de-DE”) is supplied the picker will first check for an “de-DE” language and if not found will fallback and check for a “de” language. If an unknown language code is given, English will be used. See [I18N](https://bootstrap-datepicker.readthedocs.io/en/latest/i18n.html).

![_images/option_language.png](https://bootstrap-datepicker.readthedocs.io/en/latest/_images/option_language.png)

### maxViewMode

Number, String. Default: 4, “centuries”

Set a maximum limit for the view mode. Accepts: 0 or “days” or “month”, 1 or “months” or “year”, 2 or “years” or “decade”, 3 or “decades” or “century”, and 4 or “centuries” or “millenium”. Gives the ability to pick only a day, a month, a year or a decade. The day is set to the 1st for “months”, the month is set to January for “years”, the year is set to the first year from the decade for “decades”, and the year is set to the first from the millennium for “centuries”.

### minViewMode

Number, String. Default: 0, “days”

Set a minimum limit for the view mode. Accepts: 0 or “days” or “month”, 1 or “months” or “year”, 2 or “years” or “decade”, 3 or “decades” or “century”, and 4 or “centuries” or “millenium”. Gives the ability to pick only a month, a year or a decade. The day is set to the 1st for “months”, and the month is set to January for “years”, the year is set to the first year from the decade for “decades”, and the year is set to the first from the millennium for “centuries”.

### multidate

Boolean, Number. Default: false

Enable multidate picking. Each date in month view acts as a toggle button, keeping track of which dates the user has selected in order. If a number is given, the picker will limit how many dates can be selected to that number, dropping the oldest dates from the list when the number is exceeded.`true` equates to no limit. The input’s value (if present) is set to a string generated by joining the dates, formatted, with `multidateSeparator`.

For selecting 2 dates as a range please see [date-range](https://bootstrap-datepicker.readthedocs.io/en/latest/markup.html#daterange)

![_images/option_multidate.png](https://bootstrap-datepicker.readthedocs.io/en/latest/_images/option_multidate.png)

### multidateSeparator

String. Default: ”,”

The string that will appear between dates when generating the input’s value. When parsing the input’s value for a multidate picker, this will also be used to split the incoming string to separate multiple formatted dates; as such, it is highly recommended that you not use a string that could be a substring of a formatted date (eg, using ‘-‘ to separate dates when your format is ‘yyyy-mm-dd’).

### orientation

String. Default: “auto”

A space-separated string consisting of one or two of “left” or “right”, “top” or “bottom”, and “auto” (may be omitted); for example, “top left”, “bottom” (horizontal orientation will default to “auto”), “right” (vertical orientation will default to “auto”), “auto top”. Allows for fixed placement of the picker popup.

“orientation” refers to the location of the picker popup’s “anchor”; you can also think of it as the location of the trigger element (input, component, etc) relative to the picker.

“auto” triggers “smart orientation” of the picker. Horizontal orientation will default to “left” and left offset will be tweaked to keep the picker inside the browser viewport; vertical orientation will simply choose “top” or “bottom”, whichever will show more of the picker in the viewport.

### showOnFocus

Boolean. Default: true

If false, the datepicker will be prevented from showing when the input field associated with it receives focus.

### startDate

Date or String. Default: Beginning of time

The earliest date that may be selected; all earlier dates will be disabled.

Date should be in local timezone. String must be parsable with `format`.

![_images/option_startdate.png](https://bootstrap-datepicker.readthedocs.io/en/latest/_images/option_startdate.png)

### startView

Number, String. Default: 0, “days”

The view that the datepicker should show when it is opened. Accepts: 0 or “days” or “month”, 1 or “months” or “year”, 2 or “years” or “decade”, 3 or “decades” or “century”, and 4 or “centuries” or “millenium”. Useful for date-of-birth datepickers.

### templates

Object. Default:

```
{
    leftArrow: '&laquo;',
    rightArrow: '&raquo;'
}

```

The templates used to generate some parts of the picker. Each property must be a string with only text, or valid html. You can use this property to use custom icons libs. for example:

```
{
    leftArrow: '<i class="fa fa-long-arrow-left"></i>',
    rightArrow: '<i class="fa fa-long-arrow-right"></i>'
}

```

### showWeekDays

Boolean. Default: true

If false, the datepicker will not append the names of the weekdays to its view. Default behavior is appending the weekdays.

### title

String. Default: “”

The string that will appear on top of the datepicker. If empty the title will be hidden.

### todayBtn

Boolean, “linked”. Default: false

If true or “linked”, displays a “Today” button at the bottom of the datepicker to select the current date. If true, the “Today” button will only move the current date into view; if “linked”, the current date will also be selected.

![_images/option_todaybtn.png](https://bootstrap-datepicker.readthedocs.io/en/latest/_images/option_todaybtn.png)

### todayHighlight

Boolean. Default: false

If true, highlights the current date.

![_images/option_todayhighlight.png](https://bootstrap-datepicker.readthedocs.io/en/latest/_images/option_todayhighlight.png)

### toggleActive

Boolean. Default: false

If true, selecting the currently active date in the datepicker will unset the respective date. This option is always true when the multidate option is being used.

### updateViewDate

Boolean. Default: true

If false viewDate is set according to value on initialization and updated * if a day in last oder next month is selected or * if dates are changed by setDate, setDates, setUTCDate and setUTCDatesmethods. If multidate option is true the last selected date or the last date in array passed to setDates or setUTCDates is used.

### weekStart

Integer. Default: 0

Day of the week start. 0 (Sunday) to 6 (Saturday)

![_images/option_weekstart.png](https://bootstrap-datepicker.readthedocs.io/en/latest/_images/option_weekstart.png)

### zIndexOffset

Integer. Default: 10

The CSS z-index of the open datepicker is the maximum z-index of the input and all of its DOM ancestors *plus* the `zIndexOffset`.

### Quick reference

This is a quick overview of all the options and their default values

| Option                | Default value            |
| --------------------- | ------------------------ |
| autoclose             | false                    |
| assumeNearbyYear      | false                    |
| beforeShowDay         |                          |
| beforeShowMonth       |                          |
| beforeShowYear        |                          |
| beforeShowDecade      |                          |
| beforeShowCentury     |                          |
| calendarWeeks         | false                    |
| clearBtn              | false                    |
| container             | ‘body’                   |
| datesDisabled         | []                       |
| daysOfWeekDisabled    | []                       |
| daysOfWeekHighlighted | []                       |
| defaultViewDate       | today                    |
| disableTouchKeyboard  | false                    |
| enableOnReadonly      | true                     |
| endDate               | Infinity                 |
| forceParse            | true                     |
| format                | ‘mm/dd/yyyy’             |
| immediateUpdates      | false                    |
| inputs                |                          |
| keepEmptyValues       | false                    |
| keyboardNavigation    | true                     |
| language              | ‘en’                     |
| maxViewMode           | 4 ‘centuries’            |
| minViewMode           | 0 ‘days’                 |
| multidate             | false                    |
| multidateSeparator    | ‘,’                      |
| orientation           | ‘auto’                   |
| showOnFocus           | true                     |
| startDate             | -Infinity                |
| startView             | 0 ‘days’ (current month) |
| templates             |                          |
| title                 | ‘’                       |
| todayBtn              | false                    |
| todayHighlight        | true                     |
| toggleActive          | false                    |
| weekStart             | 0 (Sunday)               |
| zIndexOffset          | 10                       |


## 方法

使用方法
```js
$('.jxdate').datepicker('方法名称', arg1, arg2);
```

### destroy
Arguments: None

Remove the datepicker. Removes attached events, internal attached objects, and added HTML elements.

Alias: remove

###  show
Arguments: None

Show the picker.

### hide
Arguments: None

Hide the picker.

### update
Arguments:

- date (String|Date|Array, optional)
- date (String|Date, optional)
- ...
Update the datepicker with given arguments or the current input value. The arguments can be either an array of strings, an array of Date objects, multiples strings or multiples Date objects. If date arguments are provided and they are Date objects, it is assumed to be “local” Date objects, and will be converted to UTC for internal use.
```js
$('.datepicker').datepicker('update');
$('.datepicker').datepicker('update', '2011-03-05');
$('.datepicker').datepicker('update', '2011-03-05', '2011-03-07');
$('.datepicker').datepicker('update', new Date(2011, 2, 5));
$('.datepicker').datepicker('update', [new Date(2011, 2, 5), new Date(2011, 2, 7)]);
```
To reset the datepicker and clear the selected date, pass an empty string with update:

```js
$('.datepicker').datepicker('update', '');
```
### setDate
Arguments:

- date (Date)
Sets the internal date. date is assumed to be a “local” date object, and will be converted to UTC for internal use.

### setUTCDate
Arguments:

- date (Date)
Sets the internal date. date is assumed to be a UTC date object, and will not be converted.

setDates
Arguments:

- date[, date[, ...]] (Date)
or

- [date[, date[, ...]]] (Array)
Sets the internal date list; accepts multiple dates or a single array of dates as arguments. Each date is assumed to be a “local” date object, and will be converted to UTC for internal use. For use with multidate pickers.

### clearDates
Arguments: None

Clear dates.

### setUTCDates
Arguments:

- date[, date[, ...]] (Date)
or

- [date[, date[, ...]]] (Array)
Sets the internal date list. Each date is assumed to be a UTC date object, and will not be converted. For use with multidate pickers.

### getDate
Arguments: None

Returns a localized date object representing the internal date object of the first datepicker in the selection. For multidate pickers, returns the latest date selected.

### getUTCDate
Arguments: None

Returns the internal UTC date object, as-is and unconverted to local time, of the first datepicker in the selection. For multidate pickers, returns the latest date selected.

### getDates
Arguments: None

Returns a list of localized date objects representing the internal date objects of the first datepicker in the selection. For use with multidate pickers.

### getUTCDates
Arguments: None

Returns the internal list of UTC date objects, as they are and unconverted to local time, of the first datepicker in the selection. For use with multidate pickers.

### getStartDate
Arguments: None

Returns the lower date limit on the datepicker.

### getEndDate
Arguments: None

Returns the upper date limit on the datepicker.

### setStartDate
Arguments:

- startDate (Date)
Sets a new lower date limit on the datepicker. See startDate for valid values.

Omit startDate (or provide an otherwise falsey value) to unset the limit.

### setEndDate
Arguments:

- endDate (Date)
Sets a new upper date limit on the datepicker. See endDate for valid values.

Omit endDate (or provide an otherwise falsey value) to unset the limit.

### setDatesDisabled
Arguments:

- datesDisabled (String|Array)
Sets the days that should be disabled. See datesDisabled for valid values.

Omit datesDisabled (or provide an otherwise falsey value) to unset the disabled days.

### setDaysOfWeekDisabled
Arguments:

- daysOfWeekDisabled (String|Array)
Sets the days of week that should be disabled. See daysOfWeekDisabled for valid values.

Omit daysOfWeekDisabled (or provide an otherwise falsey value) to unset the disabled days of week.

### setDaysOfWeekHighlighted
Arguments:

- daysOfWeekHighlighted (String|Array)
Sets the days of week that should be highlighted. See daysOfWeekHighlighted for valid values.

Omit daysOfWeekHighlighted (or provide an otherwise falsey value) to unset the highlighted days of week.

## 事件

事件使用方法
```js
$('.jxdate').on('事件名称', function(e) {
  // `e` here contains the extra attributes
});
```

- `date`: the relevant Date object, in local timezone. For a multidate picker, this will be the latest date picked.
- `dates`: an Array of Date objects, in local timezone, when using a multidate picker.
- `format([ix], [format])`: a function to make formatting date easier. ix can be the index of a Date in the dates array to format; if absent, the last date selected will be used. format can be any format string that datepicker supports; if absent, the format set on the datepicker will be used. Both arguments are optional.

### show
当日期选择器显示时触发
    
### hide
当日期选择器隐藏时触发
    
### clearDate
Fired when the date is cleared, normally when the “clear” button (enabled with the clearBtn option) is pressed.
    
### changeDate
当控件日期发生变化时触发
    
### changeMonth
当视图月份从年份视图更改时触发。
    
### changeYear
Fired when the view year is changed from decade view.
    
### changeDecade
Fired when the view decade is changed from century view.
    
### changeCentury
Fired when the view century is changed from millennium view.

## 多语言

可以重新定义进行覆盖重写
```js
(function($){
    $.fn.datepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        daysMin:  ["日", "一", "二", "三", "四", "五", "六"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        today: "今天",
        clear: "清除",
        format: "yyyy年mm月dd日",
        titleFormat: "yyyy年mm月",
        weekStart: 1
    };
}(jQuery));
```

