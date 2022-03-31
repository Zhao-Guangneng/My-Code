//总结自动填入“合计人民币（小写）”
$(document).on("focus", "input[name='DATA_6']", function () {
    $("input[name='DATA_6']").val($("#LV_2 tbody tr").eq(-1).find("td").eq(3).find("input").val());
    $("input[name='DATA_29']").val($("input[name='DATA_6']").val());
    moneyConversion("DATA_6", "DATA_5");
    moneyConversion("DATA_29", "DATA_28");
})
iframeLoadComplete();
/**
 * 
 * 金额小写转大写
 * @param {any} name1 小写金额控件name
 * @param {any} name2 大写金额控件name
 */
function moneyConversion(name1, name2) {
    var currencyDigits = currencyDigits = $('input[name="' + name1 + '"]').val();
    var MAXIMUM_NUMBER = 99999999999.99;
    var CN_ZERO = "零";
    var CN_DOLLAR = "元";

    var integral; //整数部分
    var decimal; //小数部分
    var outputCharacters; //转换后大写
    var parts; //以小数点进行分割
    var digits, radices, bigRadices, decimals; // 数字本身，百千，万亿，小数后缀
    var zeroCount;
    var i, p, d;
    var quotient, modulus;

    currencyDigits = currencyDigits.replace(/,/g, "");
    currencyDigits = currencyDigits.replace(/^0+/, "");
    if (Number(currencyDigits) > MAXIMUM_NUMBER) {
        alert("金额过大，应小于1000亿元！");
        return "";
    }

    parts = currencyDigits.split(".");
    if (parts.length > 1) {
        integral = parts[0];
        decimal = parts[1];
        decimal = decimal.substr(0, 2);
    }
    else {
        integral = parts[0];
        decimal = "";
    }
    digits = new Array(CN_ZERO, "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖");
    radices = new Array("", "拾", "佰", "仟");
    bigRadices = new Array("", "万", "亿");
    decimals = new Array("角", "分");
    outputCharacters = "";
    if (Number(integral) > 0) {
        zeroCount = 0;
        for (i = 0; i < integral.length; i++) {
            p = integral.length - i - 1; 34560
            d = integral.substr(i, 1);
            quotient = p / 4;
            modulus = p % 4;
            if (d == "0") {
                zeroCount++;
            }
            else {
                if (zeroCount > 0) {
                    outputCharacters += digits[0];
                }
                zeroCount = 0;
                outputCharacters += digits[Number(d)] + radices[modulus];
            }
            if (modulus == 0 && zeroCount < 4) {
                outputCharacters += bigRadices[quotient];
                zeroCount = 0;
            }
        }
        outputCharacters += CN_DOLLAR;
    }
    if (decimal != "") {
        for (i = 0; i < decimal.length; i++) {
            d = decimal.substr(i, 1);
            if (d != "0") {
                outputCharacters += digits[Number(d)] + decimals[i];
            }
        }
    }
    if (outputCharacters == "") {
        outputCharacters = CN_ZERO + CN_DOLLAR;
    }
    $('input[name="' + name2 + '"]').val(outputCharacters);
}
//金额转大写
$('input[name="DATA_6"]').bind('input propertychange', function () {
    moneyConversion("DATA_6", "DATA_5");
});
//判断iframe框是否加载完毕
function iframeLoadComplete() {
    var timer = setInterval(function () {
        var ibody = $("#L_Frame_Next").contents();
        if (ibody.find("#NextActInfo").length > 0) {
            clearInterval(timer);
            //退回签批人重置
            if ($("#hdnActivityID").val() == "25D44526-B764-48F5-AFA5-489B01DBAC75") {
                $("textarea[name='DATA_80'],textarea[name='DATA_81'],textarea[name='DATA_82']").val("");
            }
            //领导审批
            else if ($("#hdnActivityID").val() == "BF0B8AA5-520E-4B7A-BEE1-254F1B27B186" ||
                $("#hdnActivityID").val() == "92C50610-3A36-4D61-98D0-5AACCAC9ABEE") {
                $("textarea[name='DATA_80']").val($("textarea[name='DATA_80']").val() + "," + _personName);
                $("textarea[name='DATA_80']").val($("textarea[name='DATA_80']").val().replace(/(^,)|(,$)/g, ''));
            }
            //经办人
            else {
                $("textarea[name='81']").val($("textarea[name='81']").val() + "," + _personName);
                $("textarea[name='81']").val($("textarea[name='81']").val().replace(/(^,)|(,$)/g, ''))
            }
        }
    }, 100);
}
