var contractItemID = "";
var contractItemName = "";
var tableList = "LV_13";

$(function () {
    var IS_PC = true; //当前是电脑端
    //判断当前为pc端还是移动端
    //var userAgentInfo = navigator.userAgent;
    //var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    //var IS_PC = true; //当前是电脑端
    //for (var v = 0; v < Agents.length; v++) {
    //    if (userAgentInfo.indexOf(Agents[v]) > 0) { IS_PC = false; break; }
    //}

    //项目类别变化获取预算科目
    //$(document).on("change", "select[name = 'DATA_9']", function (data) {
    //    resetsearch();
    //    IsDisPlay();
    //})

    //
    $(document).on("change", "select[name = 'DATA_9']", function (data) {
        getCZProject();
    })

    //预算科目变化变化获取可用余额
    $(document).on("change", "select[name = 'DATA_8']", function (data) {
        GetUseBalance(10);
    })

    $(document).on("change", "select[name = 'DATA_9']", function (data) {
        GetUseBalance(10);
    })

    if ($("input[name='DATA_18']").val() != "" && $("Select[name='DATA_20']").val() != "") {
        //alert(0);
        SecondDisPlay();
    }
    //总金额大写
    var CaplMoney = "DATA_26";
    /**
    * 实时计算金额
    */
    var moneyTotal = 0;
    if (IS_PC) {
        setInterval(function () {
            if (moneyTotal != $("#LV_13_sum td").eq(5).find("input").val()) {
                moneyTotal = $("#LV_13_sum td").eq(5).find("input").val();
                $("input[name='DATA_17']").val(moneyTotal);
                //moneyOfLowercaseToUppercaseFunc(moneyTotal, CaplMoney, "input");

                var jfdx = changeNumMoneyToChinese(moneyTotal);
                $("input[name='DATA_26']").val(jfdx);
            }
        }, 1000);
    }
    $(document).on("change", "#" + tableList + " select", function () {
        showItem(this);
    })
})


function DATA_SELECT_CUSTOM_DATA_7(a, b, c) {
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

                contractItemID = rows.ProjectID;
                contractItemName = rows.ContractName;


                resetsearch();
                IsDisPlay(rows.ProjectID, rows.ContractName)

                DATA_SELECT_CUSTOM_DATA_7_CallBack(b);
            },
            cancel: true
        });
}


function DATA_SELECT_CUSTOM_DATA_7_CallBack(id) {
    var filedname = id.substring(3, id.length - 3);
    $("#" + filedname).val($("#txt" + filedname + "_Name").val() + "⊙" + $("#hdn" + filedname + "_ID").val());
}


//重置值
function resetsearch() {
    $("Select[name='DATA_8']").empty();
    //$("Select[name='DATA_15']").val("");
    //$("input[name='DATA_16']").val("");
}

//获取财政项目来源
function getCZProject() {
    var abc = $("select[name = 'DATA_9'] option:selected").val();
    if (abc == "财政") {
        var aa = $("input[name='txtDATA_7_Name']").val();
        //alert(aa);
        $.ajax({
            type: "POST",
            dataType: "text",
            data: { Type: aa },
            url: "/CustomDevelop/ZJSLTD/Ajax.ashx?r=" + Math.floor(Math.random() * 1000),
            success: function (s) {
                //alert(s);
                $("input[name='DATA_25']").val(s);
            }
        })
        $("input[name = 'DATA_25']").attr("validation", "type: ; len: 1; ").show();
    }
    else {
        $("input[name='DATA_25']").val("");
        $("input[name = 'DATA_25']").removeAttr("validation").hide();
    }
}

//申请时获取预算科目-2022
function IsDisPlay(contractItemID, contractItemName) {
    var type = $("Select[name='DATA_9']").val();
    if (_frompage == "new_def") {
        //var firstValue = "";
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
                //var node = "<select>";
                var node = "";
                if (res.data.length > 0) {
                    //console.log(res.data)
                    node += '<option value="" data_num=""></option>';
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].BudgetName.indexOf("劳务费") == "-1" && res.data[i].BudgetName.indexOf("咨询费") == "-1") {
                            node += '<option value="' + res.data[i].BudgetName + '" data_num="' + res.data[i].BudgetCode + '">' + res.data[i].BudgetName + '</option>';
                        }
                    }
                    $("Select[name='DATA_8']").append(node);
                }
            }
        })
    }
}

//获取可用余额
function GetUseBalance(aa) {
    //alert(0);
    var FeeItemName = $("select[name='DATA_8'] option:selected").val();

    //回写经费项目预算金额
    $.ajax({
        url: "/TEMP/SLTD/ajax/getdata.ashx?r=" + Math.random(),
        dataType: 'text',
        type: 'Get',
        data: {
            type: "getUseBalance2",
            ContractID: contractItemID,
            ContractName: contractItemName,
            tableNum: "Form_Table_043",
            BudgetName: $("select[name='DATA_" + aa + "'] option:selected").val(),
            FeeItemName: FeeItemName,
            ContractType: $("Select[name='DATA_9']").val()
        },
        success: function (res) {
            var bb = Number(aa) + 1;
            $("input[name='DATA_" + aa + "']").val(res);
        }
    });
}

//修改或审批时预算科目渲染-2022
function SecondDisPlay() {
    contractItemID = $("#hdnDATA_18_ID").val();
    contractItemName = $("#txtDATA_18_Name").val();
    var type = $("Select[name='DATA_20']").val();
    if (type == "横向" || type == "配套" || type == "财政" || type == "院科教基金") {
        //var firstValue = "";
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
                //var node = "<select>";
                var node = "";
                if (res.data.length > 0) {
                    //console.log(res.data)
                    for (var i = 0; i < res.data.length; i++) {
                        node += '<option value="' + res.data[i].BudgetName + '" data_num="' + res.data[i].BudgetCode + '">' + res.data[i].BudgetName + '</option>';
                    }

                    $("Select[name='DATA_19']").append(node);
                }
            }
        })

        //二次渲染赋值
        $.ajax({
            url: '/TEMP/SLTD/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
            type: 'post',
            async: false,
            dataType: 'text',
            data: {
                type: "getYSKM2",
                table: "Form_Table_043",
                WorkID: _workid
            },
            success: function (res) {
                //alert(res);
                var arr = res.split('☆');
                //alert(arr[0]);
                $("Select[name='DATA_19']").val(arr[0]);
            }
        })
    }
}


//提交二次验证
function Form_Custom_Validate() {
    //alert(0);
    if ($("#hdnDATA_18_ID").val() == "" || $("#txtDATA_18_Name").val() == "") {
        alert("项目名称不能为空");
        return false;
    }

    if (parseFloat($("input[name='DATA_21']").val()) <= 0) {
        alert("该预算科目没有钱无法报销！");
        return false;
    }

    return true;
}

//转换金额大写
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

function changeNumMoneyToChinese(money) {
    var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
    var cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
    var cnIntUnits = new Array("", "万", "亿", "万亿"); //对应整数部分扩展单位
    var cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
    var cnInteger = "整"; //整数金额时后面跟的字符
    var cnIntLast = "元"; //整型完以后的单位
    var maxNum = 999999999999999.9999; //最大处理的数字
    var IntegerNum; //金额整数部分
    var DecimalNum; //金额小数部分
    var ChineseStr = ""; //输出的中文金额字符串
    var parts; //分离金额后用的数组，预定义
    var head = money < 0 ? '人民币负' : '人民币';
    if (money == "") {
        return "";
    }
    if (head == '人民币负') money = money.toString().replace("-", "");

    money = parseFloat(money);
    if (money >= maxNum) {
        alert('超出最大处理数字');
        return "";
    }
    if (money == 0) {
        ChineseStr = cnNums[0] + cnIntLast + cnInteger;
        return ChineseStr;
    }
    money = money.toString(); //转换为字符串
    if (money.indexOf(".") == -1) {
        IntegerNum = money;
        DecimalNum = '';
    } else {
        parts = money.split(".");
        IntegerNum = parts[0];
        DecimalNum = parts[1].substr(0, 4);
    }
    if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
        var zeroCount = 0;
        var IntLen = IntegerNum.length;
        for (var i = 0; i < IntLen; i++) {
            var n = IntegerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == "0") {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    ChineseStr += cnNums[0];
                }
                zeroCount = 0; //归零
                ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                ChineseStr += cnIntUnits[q];
            }
        }
        ChineseStr += cnIntLast;
        //整型部分处理完毕
    }
    if (DecimalNum != '') { //小数部分
        var decLen = DecimalNum.length;
        for (var i = 0; i < decLen; i++) {
            var n = DecimalNum.substr(i, 1);
            if (n != '0') {
                ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
            }
        }
    }
    if (ChineseStr == '') {
        ChineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (DecimalNum == '') {
        ChineseStr += cnInteger;
    }
    ChineseStr = ChineseStr;
    return ChineseStr;
}

