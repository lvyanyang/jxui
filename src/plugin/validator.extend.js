/**
 * 表单验证规则扩展
 */
(function ($) {

    //region 私有函数

    function isIdNumber(num) {
        var factorArr = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];
        var parityBit = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
        var varArray = [];
        var intValue;
        var lngProduct = 0;
        var intCheckDigit;
        var intStrLen = num.length;
        var idNumber = num;
        // initialize
        if ((intStrLen !== 15) && (intStrLen !== 18)) {
            return false;
        }
        // check and set value
        for (var i = 0; i < intStrLen; i++) {
            varArray[i] = idNumber.charAt(i);
            if ((varArray[i] < '0' || varArray[i] > '9') && (i !== 17)) {
                return false;
            } else if (i < 17) {
                varArray[i] = varArray[i] * factorArr[i];
            }
        }
        if (intStrLen === 18) {
            //check date
            var date8 = idNumber.substring(6, 14);
            if (isDate8(date8) === false) {
                return false;
            }
            // calculate the sum of the products
            for (i = 0; i < 17; i++) {
                lngProduct = lngProduct + varArray[i];
            }
            // calculate the check digit
            intCheckDigit = parityBit[lngProduct % 11];
            // check last digit
            if (varArray[17] !== intCheckDigit) {
                return false;
            }
        } else { //length is 15
            //check date
            var date6 = idNumber.substring(6, 12);
            if (isDate6(date6) === false) {

                return false;
            }
        }
        return true;
    }

    function isDate6(sDate) {
        if (!/^[0-9]{6}$/.test(sDate)) {
            return false;
        }
        var year, month, day;
        year = sDate.substring(0, 4);
        month = sDate.substring(4, 6);
        if (year < 1700 || year > 2500) return false;
        if (month < 1 || month > 12) return false;
        return true;
    }

    function isDate8(sDate) {
        if (!/^[0-9]{8}$/.test(sDate)) {
            return false;
        }
        var year, month, day;
        year = sDate.substring(0, 4);
        month = sDate.substring(4, 6);
        day = sDate.substring(6, 8);
        var iaMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (year < 1700 || year > 2500) return false;
        if (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)) iaMonthDays[1] = 29;
        if (month < 1 || month > 12) return false;
        if (day < 1 || day > iaMonthDays[month - 1]) return false;
        return true;
    }

    function isLicensePlateNumber(str) {
        return /(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/.test(str);
    }

    //endregion

    //region 扩展验证函数

    /**
     * 结束日期必须大于等于开始日期
     */
    $.validator.methods.compareEqualDate = function (value, element, param) {
        if ($(param).val().trim() === '' || value.trim() === '') {
            return true;
        }
        var startDate = new Date($(param).val().replace(/[-.,]/g, '/'));
        var endDate = new Date(value.replace(/[-.,]/g, "/"));
        return this.optional(element) || startDate <= endDate;
    };

    /**
     * 结束日期必须大于开始日期
     */
    $.validator.methods.compareDate = function (value, element, param) {
        if ($(param).val().trim() === '' || value.trim() === '') {
            return true;
        }
        var startDate = new Date($(param).val().replace(/[-.,]/g, '/'));
        var endDate = new Date(value.replace(/[-.,]/g, "/"));
        return this.optional(element) || startDate < endDate;
    };

    /**
     * 必须大于等于当前日期
     */
    $.validator.methods.compareEqualNowDate = function (value, element, param) {
        if (value.trim() === '') {
            return true;
        }
        var startDate = new Date(value.replace(/[-.,]/g, "/"));
        var endDate = new Date(jx.formatDate(new Date()).replace(/[-.,]/g, "/"));
        return this.optional(element) || startDate >= endDate;
    };

    /**
     * 当前数字必须大于等于指定的数字
     */
    $.validator.methods.compareNumber = function (value, element, param) {
        if ($(param).val().trim() === '' || value.trim() === '') {
            return true;
        }
        var number1 = value === '' ? '0' : value;
        var number2 = $(param).val() === "" ? '0' : $(param).val();
        return this.optional(element) || parseFloat(number1) <= parseFloat(number2);
    };

    /**
     * 身份证号码验证
     */
    $.validator.methods.idNumber = function (value, element, param) {
        return this.optional(element) || isIdNumber(value);
    };

    /**
     * 车牌号码验证
     */
    $.validator.methods.carNumber = function (value, element, param) {
        return this.optional(element) || isLicensePlateNumber(value);
    };

    /**
     * 手机号码验证
     */
    $.validator.methods.phone = function (value, element, param) {
        var length = value.length;
        var mobile = /^0?1[3|4|5|8|7][0-9]\d{8}$/;
        var tel = /^0[\d]{2,3}[\d]{7,8}$/;
        return this.optional(element) || (tel.test(value) || mobile.test(value));
    };



    /**
     * 等于指定长度验证
     */
    $.validator.methods.len = function (value, element, param) {
        var length = $.isArray(value) ? value.length : this.getLength(value, element);
        return this.optional(element) || length === param;
    };

    //设置验证规则错误消息默认值
    $.extend($.validator.messages, {
        compareEqualDate: "结束日期必须大于等于开始日期",
        compareDate: "结束日期必须大于开始日期",
        compareEqualNowDate: '必须大于等于当前日期',
        compareNumber: "当前数字必须大于等于指定的数字",
        idNumber: '请输入正确的身份证号码',
        carNumber:'请输入正确的车牌号码',
        phone: '请输入正确的手机号码',
        len: $.validator.format("必须输入 {0} 个字符")
    });

    //endregion

})(jQuery);