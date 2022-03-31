//财务编号
var ContracCodeControl = "DATA_18";
var contractItemID = "";
var contractItemName = "";
var tableList = "LV_19";
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
    /**
     * 选人控件没有进回调方法，原因未知
     * 只能采用这种实时监听的方法来实现了
     */
    setInterval(function () {
        if (contractItemID != $("#hdnDATA_13_ID").val()) {
            contractItemID = $("#hdnDATA_13_ID").val();
            contractItemName = $("#txtDATA_13_Name").val();
            $.ajax({
                url: "/TEMP/SLTD/ajax/getdata.ashx?r=" + Math.random(),
                dataType: 'text',
                type: 'Get',
                data: { type: "getContracCode", ContractID: contractItemID },
                success: function (res) {
                    $("input[name='" + ContracCodeControl + "']").val(res);
                }
            });
        }
    }, 1000);

    //总金额大写
    var CaplMoney = "DATA_12";
    /**
    * 实时计算金额
    */
    var moneyTotal = 0;
    if (IS_PC) {
        setInterval(function () {
            if (moneyTotal != $("#LV_19_sum td").eq(5).find("input").val()) {
                moneyTotal = $("#LV_19_sum td").eq(5).find("input").val();
                $("input[name='DATA_41']").val(moneyTotal);
                moneyOfLowercaseToUppercaseFunc(moneyTotal, CaplMoney, "input");
            }
        }, 1000);
    }
    else {
        $("#txtDATA_28_Name").removeAttr("style");
        setInterval(function () {
            var moneyCount = 0;
            $("#" + tableList + " input").each(function (i, item) {
                if ($(this).attr("id").endWith("_4")) {
                    moneyCount += $(this).val() * 1.0;
                }
            })
            if (moneyTotal != moneyCount) {
                moneyTotal = moneyCount;
                $("input[name='DATA_41']").val(moneyTotal.toString());
                moneyOfLowercaseToUppercaseFunc(moneyTotal.toString(), CaplMoney, "input");
            }
        }, 1000);
    }

    $(document).on("change", "#" + tableList + " select", function () {
        showItem(this);
    })
})
function DATA_SELECT_CUSTOM_DATA_13(a, b, c) {
    $.dialog({ id: 'forzindex', zIndex: 9999, show: false });
    $.dialog.open('/KYPM/PM_Contract/ListWF.aspx?workid=' + _workid + '&ProjectID=' + document.getElementById(b).value,
        {
            title: '选择', width: "700px", height: "450px", lock: true, background: "#ECECEC",
            init: function () {
                var iframe = this.iframe.contentWindow;
                if (iframe.length == "") {
                    return false;
                }
            },
            ok: function () {
                var iframe = this.iframe.contentWindow;
                if (!iframe.document.body) {
                    alert('iframe还没加载完毕呢');
                    return false;
                };
                var rows = iframe.$('#tt').datagrid("getSelected");
                document.getElementById(b).value = rows.ProjectID;
                document.getElementById(c).value = rows.ContractName;
                DATA_SELECT_CUSTOM_DATA_13_CallBack(b);
            },
            cancel: true
        });
}
function DATA_SELECT_CUSTOM_DATA_13_CallBack(id) {

    var filedname = id.substring(3, id.length - 3);
    $("#" + filedname).val($("#txt" + filedname + "_Name").val() + "⊙" + $("#hdn" + filedname + "_ID").val());
}

function DATA_SELECT_CUSTOM_DATA_15(a, b, c) {
    $.dialog({ id: 'forzindex', zIndex: 9999, show: false });
    $.dialog.open('/KYPM/PM_Contract/ListBXRK.aspx?workid=' + _workid,
        {
            title: '选择', width: "700px", height: "450px",
            lock: true,
            background: "#ECECEC",
            init: function () {
                var iframe = this.iframe.contentWindow;
                if (iframe.length == "") { return false; }
            },
            ok: function () {
                var iframe = this.iframe.contentWindow;
                if (!iframe.document.body) {
                    alert('iframe还没加载完毕呢');
                    return false;
                };
                var rows = iframe.$('#tt').datagrid("getSelected");
                document.getElementById(b).value = rows.WorkID;
                document.getElementById(c).value = rows.CRapply.split('⊙')[0];
                DATA_SELECT_CUSTOM_DATA_15_CallBack(b);
            },
            cancel: true
        });
}
function DATA_SELECT_CUSTOM_DATA_15_CallBack(id) {
    var filedname = id.substring(3, id.length - 3);
    $("#" + filedname).val($("#txt" + filedname + "_Name").val() + "⊙" + $("#hdn" + filedname + "_ID").val());
}

function showItem(obj) {
    if ($(obj).closest('td').attr("id").endWith("c1")) {
        if ($(obj).find("option:selected").val() == "财政") {
            //alert(0);
            var aa = $("input[name='txtDATA_13_Name']").val();
            //alert(aa);
            $.ajax({
                type: "POST",
                dataType: "text",
                data: { Type: aa },
                url: "/CustomDevelop/ZJSLTD/Ajax.ashx?r=" + Math.floor(Math.random() * 1000),
                success: function (s) {
                    //alert(s);
                    //$("input[name='DATA_37']").val(s);
                    $(obj).closest("td").next().find("input").val(s);
                }
            })
            //$(obj).closest("td").next().find("input").val("");
        }
        else if ($(obj).find("option:selected").val() == "") {
            $(obj).closest("td").next().find("input").val("");
        }
        else {
            $(obj).closest("td").next().find("input").val("课题经费");
        }
        getFirstItem(obj)
    }
    else if ($(obj).closest('td').attr("id").endWith("c3")) {
        $(obj).prev("input").val($(obj).find("option:selected").val());
        console.log($(obj).prev("input").val());
    }
}
//获取预算科目
function getFirstItem(obj) {
    if ($(obj).find("option:selected").val() == "财政" || $(obj).find("option:selected").val() == "") {
        $(obj).closest("td").next().next().find("input").show();
        $(obj).closest("td").next().next().find("select").hide();
    }
    else {
        var firstValue = "";
        $.ajax({
            url: '/TEMP/SLTD/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
            type: 'post',
            async: false,
            dataType: 'json',
            data: {
                type: "getFeeItems",
                ProjectID: contractItemID,
                ContractName: contractItemName
            },
            success: function (res) {
                var node = "<select>";
                if (res.data.length > 0) {
                    for (var i = 0; i < res.data.length; i++) {
                        if (i == 0) {
                            firstValue = res.data[i].BudgetName;
                        }
                        node += '<option value="' + res.data[i].BudgetName + '" data_num="' + res.data[i].BudgetCode + '">' + res.data[i].BudgetName + '</option>';
                    }
                    node += '</select>';
                    $(obj).closest("td").next().next().find("input").hide();
                    $(obj).closest("td").next().next().find("input").val(firstValue);
                    $(obj).closest("td").next().next().append(node);
                }
            }
        })
    }
}

function getCostDepts() {
    $.ajax({
        url: '/TEMP/SLTD/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
        type: 'get',
        dataType: 'json',
        data: {
            type: "getFeeItems",
            ProjectID: contractItemID,
            ContractName: contractItemName
        },
        success: function (res) {
            if (res.data.length > 0) {
                for (var i = 0; i < res.data.length; i++) {
                    costDeptStr += res.data[i].DeptName + ",";
                    costDeptNameStr[res.data[i].DeptName] = res.data[i].PersonID + "@" + res.data[i].ManagePersonName;
                }
                costDeptStr = costDeptStr.substring(0, costDeptStr.length - 1);
            }
        }
    })
}
//金额小写转大写，直接转换
function moneyOfLowercaseToUppercaseFunc(money, name2, control2) {
    var currencyDigits = currencyDigits = money;
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

