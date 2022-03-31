
//$.ajaxSetup({
//    async: false
//});
//判断当前为pc端还是移动端

var x = 0;
$(function () {
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var IS_PC = true; //当前是电脑端
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { IS_PC = false; break; }
    }
    if (!IS_PC) {
        setTimeout(function () {
            $("#txtDATA_13_Name,#txtDATA_15_Name").removeAttr("style");
        }, 1000);
    }
    //财务编号
    var ContracCodeControl = "DATA_18";

    /**
     * 选人控件没有进回调方法，原因未知
     * 只能采用这种实时监听的方法来实现了
     */
    var contractItemID = "";
    setInterval(function () {
        if (contractItemID != $("#hdnDATA_13_ID").val()) {
            contractItemID = $("#hdnDATA_13_ID").val();
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


    var total = 0;
    var total1 = 0;
    $("#txtDATA_13_Name").css("width", "400px")
    $("#txtDATA_15_Name").css("width", "400px")
    $("#txtDATA_15_Name").click(function () {
        if ($("#txtDATA_15_Name").val() != "") {
            window.open("/WorkFlow/Form/print.aspx?workid=" + $('#hdnDATA_15_ID').val() + "");
        }
    });
    $.post("/KYPM/PM_Contract/Ajax.ashx", { Type: "GetDataAll", WorkID: _workid }, function (val) {
        var parsedJson = jQuery.parseJSON(val);
        $.each(parsedJson, function (i, item) {
            var test = "<tr id=\"tr" + i + "\"><td  class=\"\"><input id=\"riqi" + i + "\" value=\"" + item.CreateDate + "\" onclick=\"WdatePicker()\" size=\"12\" class=\"FormInput\" type=\"text\"></td><td class=\"\"><select onchange=\"change(" + i + ")\" id=\"leixing" + i + "\"><option value=\"课题经费\">课题经费</option><option value=\"院科教基金\">院科教基金</option></select></td><td class=\"\">  <select style=\" width:70px;\" onchange=\"loadOverAmount(" + i + ")\" id=\"ddlxiangmu" + i + "\"></select> <input style=\"display: none\"  id=\"xiangmu" + i + "\"   size=\"7\" class=\"FormInput\" type=\"text\"></td><td ><input value=\"" + item.Num + "\" id=\"zhangshu" + i + "\" size=\"7\" class=\"FormInput\" type=\"text\"></td><td ><input onblur=\"changeMoney(" + i + ")\" value=\"" + item.Money + "\" id=\"jine" + i + "\" size=\"7\" class=\"FormInput\" type=\"text\"></td><td ><input value=\"" + item.Remark + "\" id=\"beizhu" + i + "\" size=\"10\" class=\"FormInput\" type=\"text\"></td><td style=\"text-align: center\"><span id=\"shenyujine" + i + "\" size=\"10\" class=\"FormInput\" >" + item.OverAmount + "</span></td><td id=\"deltd" + i + "\" style=\"text-align: center\"><a id=\"del" + i + "\" href=\"javascript:delListItem(" + i + ")\">删除行</a></td></tr>";
            $.post("/KYPM/PM_Contract/Ajax.ashx", { Type: "GetTemplateInfo" }, function (data) {
                var parsedJson = jQuery.parseJSON(data);
                $.each(parsedJson, function (j, item3) {
                    if (item.BudgetCode == item3.BudgetCode)
                        $("#ddlxiangmu" + i).append('<option selected value="' + item3.BudgetCode + '">' + item3.BudgetName + '</option>');
                    else
                        $("#ddlxiangmu" + i).append('<option  value="' + item3.BudgetCode + '">' + item3.BudgetName + '</option>');
                })
            })
            total += item.Money == "" ? 0 : parseFloat(item.Money);
            //total1 += item.OverAmount == "" ? 0 : parseFloat(item.OverAmount);
            x = x + 1;
            $("#table1").append(test);

            $('#leixing' + i).val(item.Source);
            if (item.Source == "课题经费") {
                $("#xiangmu" + i).hide();
                $("#ddlxiangmu" + i).show();
            }
            else {
                $("#xiangmu" + i).show();
                $("#ddlxiangmu" + i).hide();
                $("#xiangmu" + i).val(item.BudgetCode)
            }
        })
        var test1 = 
		"<tr id=\"tr999\">"+
			"<td valign=\"middle\" nowrap=\"nowrap\" align=\"left\" style=\"text-align: center\">"+
				"<span style=\"font-family: 宋体\"><span style=\"font-size: 15px\">合计</span></span>"+
			"</td>"+
			"<td class=\"\"></td><td class=\"\"></td>"+
			"<td ></td>"+
			"<td align=\"center\" style=\" width:100px; \" >"+
				"<span  id=\"jine999\" size=\"7\" class=\"FormInput\">" + total + "</span>"+
			"</td>"+
			"<td ></td>"+
			// "<td id=\"deltd999\" align=\"center\" >"+
				// "<span id=\"shenyujine999\" size=\"7\" class=\"FormInput\" ></span>"+
			// "</td>"+
			"<td style=\"text-align: center\"></td>"+
		"</tr>";
        $("#table1").append(test1);
    })
    setTimeout('ReadOnly()', 500);
});


function ReadOnly() {
    if ($('#hdnActivityID').val() != "2bba290c-825a-4c08-a7fa-55ad7a89fdce") {
        $("#table1 input[id*='riqi']").each(function (index, element) {
            var num = $(this).attr("ID").replace(/[^0-9]/ig, "");
            $('#leixing' + num).attr("disabled", true);
            $('#riqi' + num).attr("disabled", true);
            $('#ddlxiangmu' + num).attr("disabled", true);
            $('#xiangmu' + num).attr("disabled", true);
            $('#zhangshu' + num).attr("disabled", true);
            $('#jine' + num).attr("disabled", true);
            $('#beizhu' + num).attr("disabled", true);
            $('#deltd' + num).hide();
            $('#del' + num).hide();
        });
        $('#deltd999').hide();
        $('#totaltd').hide()
        $('#add').hide()
    }
}
var CaplMoney = "DATA_12";
function changeMoney(i) {//累计金额

    var total = 0;
    $("#table1 input[id*='riqi']").each(function (index, element) {
        var num = $(this).attr("ID").replace(/[^0-9]/ig, "");
        total += $('#jine' + num).val() == "" ? 0 : parseFloat($('#jine' + num).val());
    });
    $('#jine999').html(total);
    moneyOfLowercaseToUppercaseFunc(total.toString(), CaplMoney, "input");
}

function DATA_SELECT_CUSTOM_DATA_13(a, b, c) {
    $.dialog({ id: 'forzindex', zIndex: 9999, show: false });
    $.dialog.open('/KYPM/PM_Contract/ListWF.aspx?workid=' + _workid + '&ProjectID=' + document.getElementById(b).value,
{ title: '选择', width: "700px", height: "450px", lock: true, background: "#ECECEC",
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

function change(i) {
    if ($('#leixing' + i).val() == "课题经费") {
        $("#xiangmu" + i).hide();
        $("#ddlxiangmu" + i).show();
        $('#shenyujine' + i).show();
        loadOverAmount(i)
    }
    else {
        $("#xiangmu" + i).show();
        $("#ddlxiangmu" + i).hide();
        $('#shenyujine' + i).hide();

    }
}

function loadOverAmount(i) {
    $.post("/KYPM/PM_Contract/Ajax.ashx", { Type: "GetOverAmount", ContractID: $('#hdnDATA_13_ID').val(), Fee: $('#ddlxiangmu' + i).val() }, function (data) {
        $('#shenyujine' + i).html(data);
    })
}

function addListItem(i) {
    if ($('#txtDATA_13_Name').val() != "") {
        var test1 = 1;
        $("#table1  input[id*='riqi']").each(function (index, element) {
            test1 += 1; //累计行数
        });
        test1 += 1;
        var test = 
		"<tr id=\"tr" + i + "\">"+
			"<td  class=\"\">"+
				"<input id=\"riqi" + i + "\" size=\"12\" class=\"FormInput\" type=\"text\">"+
			"</td>"+
			"<td class=\"\">"+
				"<select onchange=\"change(" + i + ")\" id=\"leixing" + i + "\">"+
					"<option value=\"课题经费\">课题经费</option>"+
					"<option value=\"院科教基金\">院科教基金</option>"+
				"</select>"+
			"</td>"+
			"<td class=\"\">"+
				"<select style=\" width:70px;\" id=\"ddlxiangmu" + i + "\" onchange=\"loadOverAmount(" + i + ")\" ></select>"+
				"<input style=\"display: none\"  id=\"xiangmu" + i + "\" size=\"7\" class=\"FormInput\" type=\"text\">"+
			"</td>"+
			"<td >"+
				"<input id=\"zhangshu" + i + "\" size=\"7\" class=\"FormInput\" type=\"text\">"+
			"</td>"+
			"<td >"+
				"<input onblur=\"changeMoney(" + i + ")\" id=\"jine" + i + "\" size=\"7\" class=\"FormInput\" type=\"text\">"+
			"</td>"+
			"<td >"+
				"<input id=\"beizhu" + i + "\" size=\"10\" class=\"FormInput\" type=\"text\">"+
			"</td>"+
			// "<td style=\"text-align: center\">"+
				// "<span id=\"shenyujine" + i + "\" size=\"10\" class=\"FormInput\" ></span>"+
			// "</td>"+
			"<td id=\"deltd" + i + "\" style=\"text-align: center\">"+
				"<a id=\"del" + i + "\" href=\"javascript:delListItem(" + i + ")\">删除行</a>"+
			"</td>"+
		"</tr>";
        $("#table1 tr:eq(" + test1 + ")").after(test);
        $.post("/KYPM/PM_Contract/Ajax.ashx", { Type: "GetTemplateInfo" }, function (data) {
            var parsedJson = jQuery.parseJSON(data);
            $.each(parsedJson, function (j, item3) {
                //                if (j == 0)
                //                    $("#ddlxiangmu" + i).append('<option selected=selected  value="' + item3.BudgetCode + '">' + item3.BudgetName + '</option>');
                //                else
                $("#ddlxiangmu" + i).append('<option  value="' + item3.BudgetCode + '">' + item3.BudgetName + '</option>');
            })
        })
        setTimeout('loadOverAmount(' + i + ')', 200);

        x = x + 1;
    }
    else {
        alert('请选择项目合同');
    }
}

function delListItem(i) {
    $("#table1").find("#tr" + i).remove()
}


function Form_Custom_Validate() {

    var data = "";
    var test = "";
    $("#table1 input[id*='riqi']").each(function (index, element) {
        var num = $(this).attr("ID").replace(/[^0-9]/ig, "");
        if ($('#leixing' + num).val() == "课题经费")
            test = $('#ddlxiangmu' + num).val();
        else
            test = $('#xiangmu' + num).val();
        data += $('#riqi' + num).val() + "☆" + $('#leixing' + num).val() + "☆" + test + "☆" + $('#zhangshu' + num).val() + "☆" + $('#jine' + num).val() + "☆" + $('#beizhu' + num).val() + "☆" + $('#shenyujine' + num).html() + "~";

    });


    var s = "";
    $.ajax({
        url: '/KYPM/PM_Contract/Ajax.ashx',
        type: 'post',
        async: false, //使用同步的方式,true为异步方式
        data: { Type: "SaveWF", WorkID: _workid, data: data }, //这里使用json对象
        success: function (val) {
            if (val != "1") {
                alert(val + "超出了预算金额");
            }
            else {
                s = "1";
            }
        }
    });
    if (s == "1")
        return true
    //return s == "1";
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




