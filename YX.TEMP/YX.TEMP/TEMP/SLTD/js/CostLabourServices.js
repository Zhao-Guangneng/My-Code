$(function () {
    //判断当前为pc端还是移动端
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var IS_PC = true; //当前是电脑端
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { IS_PC = false; break; }
    }

    //判断字符串是否以指定字符串结尾
    String.prototype.endWith = function (str) {
        var reg = new RegExp(str + "$");
        return reg.test(this);
    }
    //数据表格
    var table = "LV_1";
    //财务编号
    var ContracCodeControl = "DATA_16";
    //项目名称
    var ContracItemControl = "DATA_28";
    //预算费用
    var CostMoney = "DATA_30";
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
    /**
    * 实时计算金额
    */
    var moneyTotal = 0;
    if (IS_PC) {
        setInterval(function () {
            if (moneyTotal != $("#LV_1_sum td").eq(7).find("input").val()) {
                moneyTotal = $("#LV_1_sum td").eq(7).find("input").val();
                //$("#" + LowerMoney).val(moneyTotal);
                $("input[name='" + LowerMoney + "']").val(moneyTotal);
                moneyOfLowercaseToUppercaseFunc(moneyTotal, CaplMoney, "input");
            }
        }, 1000);
    }
    else {
        $("#txtDATA_28_Name").removeAttr("style");
        setInterval(function () {
            var moneyCount = 0;
            $("#" + table + " input").each(function (i, item) {
                if ($(this).attr("id").endWith("_6")) {
                    moneyCount += $(this).val() * 1.0;
                }
            })
            if (moneyTotal != moneyCount) {
                moneyTotal = moneyCount;
                //$("#" + LowerMoney).val(moneyTotal);
                $("input[name='" + LowerMoney + "']").val(moneyTotal);
                moneyOfLowercaseToUppercaseFunc(moneyTotal.toString(), CaplMoney, "input");
            }
        }, 1000);
    }

    //选择财政项目类别显示具体项目框
    $(document).on("change", "select[name = 'DATA_32']", function (data) {
        if ($("select[name = 'DATA_32'] option:selected").val() == "财政") {
            var aa = $("input[name='txtDATA_28_Name']").val();
            //alert(aa);
            $.ajax({
                type: "POST",
                dataType: "text",
                data: { Type: aa },
                url: "/CustomDevelop/ZJSLTD/Ajax.ashx?r=" + Math.floor(Math.random() * 1000),
                success: function (s) {
                    //alert(s);
                    $("input[name='DATA_33']").val(s);
                }
            })

            $.ajax({
                type: "POST",
                dataType: "text",
                data: { Type: aa },
                url: "/CustomDevelop/ZJSLTD/Ajax.ashx?r=" + Math.floor(Math.random() * 1000),
                success: function (s) {
                    //alert(s);
                    $("input[name='DATA_33']").val(s);
                }
            })



            $("input[name = 'DATA_33']").attr("validation", "type: ; len: 1; ").show();
        }
        else {
            $("input[name='DATA_33']").val("");
            $("input[name = 'DATA_33']").removeAttr("validation").hide();
        }
    })
    //经费项目切换
    $(document).on("change", "select[name = 'DATA_35']", function (data) {
        getFeeItemMonry(contractItemID, contractItemName);
    })
    //记忆功能，输入名称回写最近填写的数据
    $(document).on("blur", "#" + table + " input[class='FormInput']", function () {
        if ($(this).parent().attr("id").endWith("c1")) {
            if (typeof $(this).val() != "string" || $(this).val() == "") {
                return false;
            }
            else {
                var obj = $(this);
                $.ajax({
                    url: "/TEMP/SLTD/ajax/getdata.ashx?r=" + Math.random(),
                    dataType: 'json',
                    type: 'Get',
                    data: { type: "getPersonMemory", personname: $(this).val(), tableNum: tableNum },
                    success: function (res) {
                        obj.closest('tr').children().eq(2).find("input").val(res.WorkUnit);
                        obj.closest('tr').children().eq(3).find("input").val(res.WorkTitle);
                        obj.closest('tr').children().eq(4).find("input").val(res.IdCard);
                        obj.closest('tr').children().eq(5).find("input").val(res.Bank);
                        obj.closest('tr').children().eq(6).find("input").val(res.BankAccount);
                    }
                });
            }
        }
    })
    function getFeeItemMonry(contractItemID, contractItemName) {
        var FeeItemName = $("select[name='DATA_35'] option:selected").val();
        switch (FeeItemName) {
            case "预算专家咨询费":
                FeeItemName = "咨询费";
                break;
            case "预算激励费":
                FeeItemName = "激励费";
                break;
            case "预算劳务费":
                FeeItemName = "劳务费";
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
            p = integral.length - i - 1; //34560
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
    $('' + control2 + '[name="' + name2 + '"]').val(outputCharacters);
}