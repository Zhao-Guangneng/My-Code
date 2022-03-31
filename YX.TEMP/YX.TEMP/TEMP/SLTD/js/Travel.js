$(function () {
    //判断当前为pc端还是移动端
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var IS_PC = true; //当前是电脑端
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            IS_PC = false;
            break;
        }
    }
    //if($("#hdnActivityID").val()=="83AC26E7-2691-4CE6-93C8-7ACE6227C0E0"){
    //	if ($("select[name='DATA_36'] option:selected").val() == "财政") {
    //		$("#DATA_37_div").show();
    //    }
    //    else {
    //		$("#DATA_37_div").hide();
    //    }
    //}else{
    //	if ($("select[name='DATA_36'] option:selected").val() == "财政") {
    //		$("#DATA_37_div").show();
    //   }
    //   else {
    //		$("#DATA_37_div").hide();
    //   }
    //}
    //判断字符串是否以指定字符串结尾
    String.prototype.endWith = function (str) {
        var reg = new RegExp(str + "$");
        return reg.test(this);
    }

    //财务编号
    var ContracCodeControl = "DATA_16";

    /**
     * 选人控件没有进回调方法，原因未知
     * 只能采用这种实时监听的方法来实现了
     */
    var contractItemID = "";
    var contractItemName = "";
    setInterval(function () {
        if (contractItemID != $("#hdnDATA_28_ID").val()) {
            contractItemID = $("#hdnDATA_28_ID").val();
            contractItemName = $("#txtDATA_28_Name").val();
            $.ajax({
                url: "/TEMP/SLTD/ajax/getdata.ashx?r=" + Math.random(),
                dataType: 'text',
                type: 'Get',
                data: { type: "getContracCode", ContractID: contractItemID },
                success: function (res) {
                    $("input[name='" + ContracCodeControl + "']").val(res);
                }
            });
            getFeeItemMonry(contractItemID, contractItemName);
        }
    }, 1000);

    //总金额大写
    var CaplMoney = "DATA_23";
    //总金额小写
    var LowerMoney = "DATA_24";

    var tableList = "LV_17";
    //预算费用
    var CostMoney = "DATA_30";
    /**
     * 实时计算金额
     */
    var moneyTotal = 0;
    if (IS_PC) {
        setInterval(function () {
            if (moneyTotal != $("#LV_17_sum td").eq(13).find("input").val()) {
                moneyTotal = $("#LV_17_sum td").eq(13).find("input").val();
                $("#" + LowerMoney).val(moneyTotal);
                moneyOfLowercaseToUppercaseFunc(moneyTotal, CaplMoney, "input");
            }
        }, 1000);
    } else {
        $("#txtDATA_28_Name").removeAttr("style");
        setInterval(function () {
            var moneyCount = 0;
            $("#" + tableList + " input").each(function (i, item) {
                if ($(this).attr("id").endWith("_12")) {
                    moneyCount += $(this).val() * 1.0;
                }
            })
            if (moneyTotal != moneyCount) {
                moneyTotal = moneyCount;
                $("#" + LowerMoney).val(moneyTotal);
                moneyOfLowercaseToUppercaseFunc(moneyTotal.toString(), CaplMoney, "input");
            }
        }, 1000);
    }

    $(document).change("select[name='DATA_36']", function () {
        if ($("select[name='DATA_36'] option:selected").val() == "财政") {
            var aa = $("input[name='txtDATA_28_Name']").val();
            //alert(aa);
            $.ajax({
                type: "POST",
                dataType: "text",
                data: { Type: aa },
                url: "/CustomDevelop/ZJSLTD/Ajax.ashx?r=" + Math.floor(Math.random() * 1000),
                success: function (s) {
                    //alert(s);
                    $("input[name='DATA_37']").val(s);
                }
            })

            $("input[name='DATA_37']").attr("validation", "type:;len:1;").show();
            //$("#DATA_37_div").show();
        } else {
            $("input[name='DATA_37']").val();
            $("input[name='DATA_37']").removeAttr("validation").hide();
            //$("#DATA_37_div").hide();
        }
    })

    function getFeeItemMonry(contractItemID, contractItemName) {
        var FeeItemName = $("select[name='DATA_35'] option:selected").val();
        switch (FeeItemName) {
            case "预算差旅费":
                FeeItemName = "差旅费";
                break;
            default:
                FeeItemName = "其他";
                break;


        }
        //回写经费项目预算金额
        $.ajax({
            url: "/TEMP/SLTD/ajax/getdata.ashx?r=" + Math.random(),
            dataType: 'text',
            type: 'Get',
            data: {
                type: "getFeeMoney",
                ContractID: contractItemID,
                ContractName: contractItemName,
                tableNum: tableNum,
                BudgetName: $("select[name='DATA_35'] option:selected").val(),
                FeeItemName: FeeItemName
            },
            success: function (res) {
                $("input[name='" + CostMoney + "']").val(res);
            }
        });
    }

})

//金额小写转大写，直接转换
function moneyOfLowercaseToUppercaseFunc(moneyTotal, name2, control2) {
    var currencyDigits = currencyDigits = moneyTotal;
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
    } else {
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
            p = integral.length - i - 1; //34560
            d = integral.substr(i, 1);
            quotient = p / 4;
            modulus = p % 4;
            if (d == "0") {
                zeroCount++;
            } else {
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
    $('' + control2 + '[name="' + name2 + '"]').val(outputCharacters);
}
