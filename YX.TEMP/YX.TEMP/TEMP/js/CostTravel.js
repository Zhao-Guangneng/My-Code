
var firstMoney = ""; //可用金额
var tempMoney = ""; //在途金额
var realMoney = ""; //实际金额

var isUpdate = false; //是否更新

if (typeof _taskid == undefined || typeof _taskid == "undefined") {
    loadPrint();
}
else {
    if (_taskid != "") {
        loadPrint()
    }
    else {
        //重新提交展示页面
        //这是个bug啊每次页面还没有加载完就开始执行最后的js了，不合理
        //应该有一个页面加载完的回调才是好的
        setTimeout(function () {
            if ($("#hdnDATA_4_ID").val() != "") {
                $.ajax({
                    url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
                    type: 'post',
                    async:false,
                    dataType: 'json',
                    data: { type: "getContractFee", ProjectID: $("#hdnDATA_4_ID").val() },
                    success: function (res) {
                        if (res.data.length > 0) {
                            var node = "";
                            $.each(res.data[0], function (key, val) {
                                if (val == null || val == "") {
                                    return;
                                }
                                if (key.indexOf("Feetest") > -1) {
                                    var data_num = key.replace("Feetest", "");
                                    data_num = data_num.padStart(2, '0');
                                    node += '<option value="' + val + '" data_num="' + data_num + '">' + val + '</option>';
                                }
                            });
                            if (node == "") {
                                $("select[name='DATA_17']").empty().append('<option value="">请先选择部门或课题名称</option>');
                            }
                            else {
                                $("select[name='DATA_17']").empty().append(node);
                            }
                        }
                    }
                });
                $.ajax({
                    url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
                    type: 'post',
                    dataType: 'json',
                    data: { type: "getFieYongByTravel", WorkID: _workid },
                    success: function (res) {
                        if (res.data.length > 0) {
                            isUpdate = true;
                            getMoney(res.data[0].Fee);
                            $("input[name='DATA_13']").val(firstMoney);
                            $("input[name='DATA_14']").val(tempMoney);
                            $("input[name='DATA_15']").val(realMoney);
                            $("select[name='DATA_17']").val(res.data[0].FeetestName);
                            var TravelTicketCount = 0, TravelTicketBillCount = 0, TripMoneyCount = 0, OtherMoneyBillCount = 0, OtherMoneyCount = 0;
                            for (var i = 0; i < res.data.length; i++) {
                                addMaterialLine();
                                if (res.data[i].TravelTicket != "") {
                                    TravelTicketCount += res.data[i].TravelTicket * 1;
                                }
                                if (res.data[i].TravelTicketBill != "") {
                                    TravelTicketBillCount += res.data[i].TravelTicketBill * 1;
                                }
                                if (res.data[i].TripMoney != "") {
                                    TripMoneyCount += res.data[i].TripMoney * 1;
                                }
                                if (res.data[i].OtherMoneyBill != "") {
                                    OtherMoneyBillCount += res.data[i].OtherMoneyBill * 1;
                                }
                                if (res.data[i].OtherMoney != "") {
                                    OtherMoneyCount += res.data[i].OtherMoney * 1;
                                }
                                $("#itemsBox tr").eq(i).attr("data_id", res.data[i].ID);
                                $("#itemsBox tr").eq(i).find('td').eq(0).find('input').val(res.data[i].Time1);
                                $("#itemsBox tr").eq(i).find('td').eq(1).find('input').val(res.data[i].Address1);
                                $("#itemsBox tr").eq(i).find('td').eq(2).find('input').val(res.data[i].Time2);
                                $("#itemsBox tr").eq(i).find('td').eq(3).find('input').val(res.data[i].Address2);
                                $("#itemsBox tr").eq(i).find('td').eq(4).find('input').val(res.data[i].TravelTicket);
                                $("#itemsBox tr").eq(i).find('td').eq(5).find('input').val(res.data[i].TravelTicketBill);
                                $("#itemsBox tr").eq(i).find('td').eq(6).find('input').val(res.data[i].DailySub);
                                $("#itemsBox tr").eq(i).find('td').eq(7).find('input').val(res.data[i].Days);
                                $("#itemsBox tr").eq(i).find('td').eq(8).find('input').val(res.data[i].TripMoney);
                                $("#itemsBox tr").eq(i).find('td').eq(9).find('select').val(res.data[i].Item);
                                $("#itemsBox tr").eq(i).find('td').eq(10).find('input').val(res.data[i].OtherMoneyBill);
                                $("#itemsBox tr").eq(i).find('td').eq(11).find('input').val(res.data[i].OtherMoney);
                            }
                            $("#itemsFoot tr td").eq(2).text(TravelTicketCount);
                            $("#itemsFoot tr td").eq(3).text(TravelTicketBillCount);
                            $("#itemsFoot tr td").eq(5).text(TripMoneyCount);
                            $("#itemsFoot tr td").eq(7).text(OtherMoneyBillCount);
                            $("#itemsFoot tr td").eq(8).text(OtherMoneyCount);
                        }
                    }
                })
            }
        }, 1000);
    }
}
//加载数据用于展示
function loadPrint() {
    setTimeout(function () {
        $(".aBtn").closest('td').remove();
        $("#itemsFoot tr td:last-child").remove();
        $.ajax({
            url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
            type: 'post',
            async: false,
            dataType: 'json',
            data: { type: "getContractFee", ProjectID: $("#hdnDATA_4_ID").val() },
            success: function (res) {
                if (res.data.length > 0) {
                    var node = "";
                    $.each(res.data[0], function (key, val) {
                        if (val == null || val == "") {
                            return;
                        }
                        if (key.indexOf("Feetest") > -1) {
                            var data_num = key.replace("Feetest", "");
                            data_num = data_num.padStart(2, '0');
                            node += '<option value="' + val + '" data_num="' + data_num + '">' + val + '</option>';
                        }
                    });
                    if (node == "") {
                        $("select[name='DATA_17']").empty().append('<option value="">请先选择部门或课题名称</option>');
                    }
                    else {
                        $("select[name='DATA_17']").empty().append(node);
                    }
                }
            }
        });
        $.ajax({
            url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
            type: 'post',
            async: false,
            dataType: 'json',
            data: { type: "getFieYongByTravel", WorkID: _workid },
            success: function (res) {
                if (res.data.length > 0) {
                    getMoney(res.data[0].Fee);
                    $("select[name='DATA_17']").val(res.data[0].FeetestName);
                    var TravelTicketCount = 0, TravelTicketBillCount = 0, TripMoneyCount = 0, OtherMoneyBillCount = 0, OtherMoneyCount = 0;
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].TravelTicket != "") {
                            TravelTicketCount += res.data[i].TravelTicket * 1;
                        }
                        if (res.data[i].TravelTicketBill != "") {
                            TravelTicketBillCount += res.data[i].TravelTicketBill * 1;
                        }
                        if (res.data[i].TripMoney != "") {
                            TripMoneyCount += res.data[i].TripMoney * 1;
                        }
                        if (res.data[i].OtherMoneyBill != "") {
                            OtherMoneyBillCount += res.data[i].OtherMoneyBill * 1;
                        }
                        if (res.data[i].OtherMoney != "") {
                            OtherMoneyCount += res.data[i].OtherMoney * 1;
                        }
                        var node =
                            '<tr>' +
                            '<td><div style="width: 100px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].Time1 + '</div></td > ' +
                            '<td><div style="width: 140px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].Address1 + '</div></td > ' +
                            '<td><div style="width: 100px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].Time2 + '</div></td> ' +
                            '<td><div style="width: 140px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].Address2 + '</div></td> ' +
                            '<td><div style="width: 100px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].TravelTicket + '</div></td > ' +
                            '<td><div style="width: 40px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].TravelTicketBill + '</div></td > ' +
                            '<td><div style="width: 80px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].DailySub + '</div></td > ' +
                            '<td><div style="width: 80px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].Days + '</div></td > ' +
                            '<td><div style="width: 80px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].TripMoney + '</div></td> ' +
                            '<td><div style="width: 100px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].Item + '</div></td> ' +
                            '<td><div style="width: 40px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].OtherMoneyBill + '</div></td > ' +
                            '<td><div style="width: 80px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].OtherMoney + '</div></td > ' +
                            '</tr >';
                        $("#itemsBox").append(node);
                        $("#itemsFoot tr td").eq(2).text(TravelTicketCount);
                        $("#itemsFoot tr td").eq(3).text(TravelTicketBillCount);
                        $("#itemsFoot tr td").eq(5).text(TripMoneyCount);
                        $("#itemsFoot tr td").eq(7).text(OtherMoneyBillCount);
                        $("#itemsFoot tr td").eq(8).text(OtherMoneyCount);
                        $("input[name='DATA_13']").val(firstMoney);
                        $("input[name='DATA_14']").val(tempMoney);
                        $("input[name='DATA_15']").val(realMoney);
                    }
                }
            }
        })
    }, 1000);
}
//新增行
function addMaterialLine() {
    var tableLen = $("#itemsBox").children().length;
    if ($("#hdnDATA_4_ID").val() == "") {
        alert("请先选择具体项目");
        return false;
    }
    var node =
        '<tr>' +
        '<td>' +
        '<input  type="search" lay-verify="text" autocomplete="off" class="layui-input" readonly="true" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\'})" style="width:95%"/>' +
        '</td > ' +
        '<td>' +
        '<input  type="search" lay-verify="text" autocomplete="off" class="layui-input" style="width:95%"/>' +
        '</td > ' +
        '<td>' +
        '<input  type="search" lay-verify="text" autocomplete="off" class="layui-input" readonly="true" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\'})" style="width:95%"/>' +
        '</td> ' +
        '<td>' +
        '<input  type="search" lay-verify="text" autocomplete="off" class="layui-input" style="width:95%"/>' +
        '</td> ' +
        '<td>' +
        '<input  name="TravelTicket" type="search" lay-verify="text" autocomplete="off" class="layui-input" style="width:95%"/>' +
        '</td > ' +
        '<td>' +
        '<input  name="TravelTicketBill" type="search" lay-verify="text" autocomplete="off" class="layui-input" style="width:95%"/>' +
        '</td > ' +
        '<td>' +
        '<input  type="search" lay-verify="text" autocomplete="off" class="layui-input" style="width:95%"/>' +
        '</td > ' +
        '<td>' +
        '<input  type="search" lay-verify="text" autocomplete="off" class="layui-input" style="width:95%"/>' +
        '</td > ' +
        '<td>' +
        '<input  name="TripMoney" type="search" lay-verify="text" autocomplete="off" class="layui-input" style="width:95%"/>' +
        '</td>' +
        '<td>' +
        '<select style="width:95%">' +
        '<option>行李费</option>' +
        '<option>市内车费</option>' +
        '<option>住宿费</option>' +
        '<option>邮电费</option>' +
        '<option>其他</option>' +
        '</select>' +
        '</td>' +
        '<td>' +
        '<input  name="OtherMoneyBill" type="search" lay-verify="text" autocomplete="off" class="layui-input" style="width:95%"/>' +
        '</td>' +
        '<td>' +
        '<input  name="OtherMoney" type="search" lay-verify="text" autocomplete="off" class="layui-input" style="width:95%"/>' +
        '</td>' +
        '<td><a onclick="del(this)" class="aDel">删除</a></td>' +
        '</tr >';
    $("#itemsBox").append(node);
}
//车船票合计
$(document).on("focus", "input[name='TravelTicket']", function () {
    var thisMoney = 0;
    if ($(this).val() != "") {
        thisMoney = $(this).val();
    }
    $("input[name='DATA_8']").val($("input[name='DATA_8']").val() * 1 - thisMoney * 1);
})
$(document).on("blur", "input[name='TravelTicket']", function () {
    if ($(this).val() < 0) {
        alert("禁止输入负数，请重新输入！");
        $(this).val("");
        return false;
    }
    if ($("input[name='DATA_8']").val() * 1 + $(this).val() * 1 > $("input[name='DATA_15']").val() * 1) {
        alert("申请金额已大于可申请余额，请重新输入！");
        $(this).val("");
        return false;
    }
    var thisMoney = 0;
    $("input[name='TravelTicket']").each(function () {
        if ($(this).val() != "") {
            thisMoney += $(this).val() * 1;
        }
    })
    $("#itemsFoot tr td").eq(2).text(thisMoney);
    moneyCount();
})
//车船票单据张数统计
$(document).on("blur", "input[name='TravelTicketBill']", function () {
    if ($(this).val() < 0) {
        alert("禁止输入负数，请重新输入！");
        $(this).val("");
        return false;
    }
    var thisMoney = 0;
    $("input[name='TravelTicketBill']").each(function () {
        if ($(this).val() != "") {
            thisMoney += $(this).val() * 1;
        }
    })
    $("#itemsFoot tr td").eq(3).text(thisMoney);
})
//出差补贴金额统计
$(document).on("focus", "input[name='TripMoney']", function () {
    var thisMoney = 0;
    if ($(this).val() != "") {
        thisMoney = $(this).val();
    }
    $("input[name='DATA_8']").val($("input[name='DATA_8']").val() * 1 - thisMoney * 1);
})
$(document).on("blur", "input[name='TripMoney']", function () {
    if ($(this).val() < 0) {
        alert("禁止输入负数，请重新输入！");
        $(this).val("");
        return false;
    }
    if ($("input[name='DATA_8']").val() * 1 + $(this).val() * 1 > $("input[name='DATA_15']").val() * 1) {
        alert("申请金额已大于可申请余额，请重新输入！");
        $(this).val("");
        return false;
    }
    var thisMoney = 0;
    $("input[name='TripMoney']").each(function () {
        if ($(this).val() != "") {
            thisMoney += $(this).val() * 1;
        }
    })
    $("#itemsFoot tr td").eq(5).text(thisMoney);
    moneyCount();
})
//其他费用单据张数统计
$(document).on("blur", "input[name='OtherMoneyBill']", function () {
    if ($(this).val() < 0) {
        alert("禁止输入负数，请重新输入！");
        $(this).val("");
        return false;
    }
    var thisMoney = 0;
    $("input[name='OtherMoneyBill']").each(function () {
        if ($(this).val() != "") {
            thisMoney += $(this).val() * 1;
        }
    })
    $("#itemsFoot tr td").eq(7).text(thisMoney);
})
//其他费用金额统计
$(document).on("focus", "input[name='OtherMoney']", function () {
    var thisMoney = 0;
    if ($(this).val() != "") {
        thisMoney = $(this).val();
    }
    $("input[name='DATA_8']").val($("input[name='DATA_8']").val() * 1 - thisMoney * 1);
})
$(document).on("blur", "input[name='OtherMoney']", function () {
    if ($(this).val() < 0) {
        alert("禁止输入负数，请重新输入！");
        $(this).val("");
        return false;
    }
    if ($("input[name='DATA_8']").val() * 1 + $(this).val() * 1 > $("input[name='DATA_15']").val() * 1) {
        alert("申请金额已大于可申请余额，请重新输入！");
        $(this).val("");
        return false;
    }
    var thisMoney = 0;
    $("input[name='OtherMoney']").each(function () {
        if ($(this).val() != "") {
            thisMoney += $(this).val() * 1;
        }
    })
    $("#itemsFoot tr td").eq(8).text(thisMoney);
    moneyCount();
})
//报销项目变化，对应可用额变化
$(document).on("change", "select[name='DATA_17']", function () {
    getMoney("Fee" + $(this).find("option:selected").attr("data_num"));
    $("input[name='DATA_13']").val(firstMoney);
    $("input[name='DATA_14']").val(tempMoney);
    $("input[name='DATA_15']").val(realMoney);
})
//报销总额统计
function moneyCount() {
    var TravelTicket = $("#itemsFoot tr td").eq(2).text();
    var TripMoney = $("#itemsFoot tr td").eq(5).text();
    var OtherMoney = $("#itemsFoot tr td").eq(8).text();
    if (TravelTicket == "") {
        TravelTicket = 0;
    }
    if (TripMoney == "") {
        TripMoney = 0;
    }
    if (OtherMoney == "") {
        OtherMoney = 0;
    }
    $("input[name='DATA_8']").val(TravelTicket * 1 + TripMoney * 1 + OtherMoney * 1);
    moneyConversion("DATA_8", "DATA_9");
}
//选择部门或课题项目后的回调
function Data_Select_CallBack(id) {
    var filedname = id.substring(3, id.length - 3);
    $("#" + filedname).val($("#txt" + filedname + "_Name").val() + "⊙" + $("#hdn" + filedname + "_ID").val());
    $.ajax({
        url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
        type: 'post',
        dataType: 'text',
        data: { type: "getConstracCode", ProjectID: $("#hdnDATA_4_ID").val() },
        success: function (res) {
            $("input[name='DATA_5']").val(res);
        }
    })
    $.ajax({
        url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
        type: 'post',
        dataType: 'json',
        data: { type: "getContractFee", ProjectID: $("#hdnDATA_4_ID").val() },
        success: function (res) {
            if (res.data.length > 0) {
                var node = "";
                $.each(res.data[0], function (key, val) {
                    if (val == null || val == "") {
                        return;
                    }
                    if (key.indexOf("Feetest") > -1) {
                    var data_num = key.replace("Feetest", "");
                    data_num = data_num.padStart(2, '0');
                    node += '<option value="' + val + '" data_num="' + data_num + '">' + val + '</option>';
                    }
                });
                if (node == "") {
                    $("select[name='DATA_17']").empty().append('<option value="">请先选择部门或课题名称</option>');
                }
                else {
                    $("select[name='DATA_17']").empty().append(node);
                }
                getMoney("Fee" + $("select[name='DATA_17'] option").eq(0).attr("data_num"));
                $("input[name='DATA_13']").val(firstMoney);
                $("input[name='DATA_14']").val(tempMoney);
                $("input[name='DATA_15']").val(realMoney);
            }
        }
    });
}
//获取可用金额和在途金额，并计算出实际金额
function getMoney(selectName) {
    var thisProjectID = "";
    if ($("#hdnDATA_4_ID").length > 0) {
        thisProjectID = $("#hdnDATA_4_ID").val();
    }
    $.ajax({
        url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
        type: 'post',
        dataType: 'text',
        async: false,
        data: { type: "getMoney", ProjectID: thisProjectID, WorkID: _workid, Fee: selectName, Table:"KYPM_Project_FieyongByTravel" },
        success: function (data) {
            if (data != null) {
                firstMoney = data.split('@')[0];
                tempMoney = data.split('@')[1];
                realMoney = parseFloat(firstMoney) - parseFloat(tempMoney);
                realMoney = realMoney.toFixed(2);
            }
        }
    })
    
}
//删除当前行
function del(obj) {
    $(obj).closest('tr').remove();
    var TravelTicketCount = $("#itemsFoot tr td").eq(2).text();
    var TravelTicketBillCount = $("#itemsFoot tr td").eq(3).text();
    var TripMoneyCount = $("#itemsFoot tr td").eq(5).text();
    var OtherMoneyBillCount = $("#itemsFoot tr td").eq(7).text();
    var OtherMoneyCount = $("#itemsFoot tr td").eq(8).text();
    $("#itemsFoot tr td").eq(2).text(TravelTicketCount * 1 - $(obj).closest('tr').find('td').eq(4).find('input').val() * 1);
    $("#itemsFoot tr td").eq(3).text(TravelTicketBillCount * 1 - $(obj).closest('tr').find('td').eq(5).find('input').val() * 1);
    $("#itemsFoot tr td").eq(5).text(TripMoneyCount * 1 - $(obj).closest('tr').find('td').eq(8).find('input').val() * 1);
    $("#itemsFoot tr td").eq(7).text(OtherMoneyBillCount * 1 - $(obj).closest('tr').find('td').eq(10).find('input').val() * 1);
    $("#itemsFoot tr td").eq(8).text(OtherMoneyCount * 1 - $(obj).closest('tr').find('td').eq(11).find('input').val() * 1);
    moneyCount();
}
/**
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
//实时监听小写金额变化并转换为大写
$('input[name="DATA_8"]').bind('input propertychange', function () {
    moneyConversion("DATA_8", "DATA_9");
});
//提交前触发
function Form_Custom_Validate() {
    if (_taskid == "") {
        var result = "";
        $("#itemsBox tr").each(function () {
            var time1 = $(this).find('td').eq(0).find('input').val();
            var adress1 = $(this).find('td').eq(1).find('input').val();
            var time2 = $(this).find('td').eq(2).find('input').val();
            var adress2 = $(this).find('td').eq(3).find('input').val();
            var travelTicket = $(this).find('td').eq(4).find('input').val();
            var travelTicketBill = $(this).find('td').eq(5).find('input').val();
            var dailySub = $(this).find('td').eq(6).find('input').val();
            var days = $(this).find('td').eq(7).find('input').val();
            var tripMoney = $(this).find('td').eq(8).find('input').val();
            var item = $(this).find('td').eq(9).find('select').val();
            var otherMoneyBill = $(this).find('td').eq(10).find('input').val();
            var otherMoney = $(this).find('td').eq(11).find('input').val();
            if (typeof ($(this).attr("data_id")) != "undefined") {
                result += $(this).attr("data_id") + "@";
            }
            result += time1 + "@" + adress1 + "@" + time2 + "@" + adress2 + "@" + travelTicket + "@" + travelTicketBill + "@" + dailySub + "@"
                + days + "@" + tripMoney + "@" + item + "@" + otherMoneyBill + "@" + otherMoney + "@Fee" + $("select[name='DATA_17'] option:selected").attr("data_num") + "@" +
                $("select[name='DATA_17'] option:selected").val() + "@" + $("textarea[name='DATA_7']").val() + "@"
                + $("input[name='DATA_2']").val() + "@" + $("input[name='DATA_8']").val() + "#";
        })
        var flag = false;
        //更新
        if (isUpdate) {
            $.ajax({
                url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
                type: 'post',
                dataType: 'text',
                async: false,
                data: { type: "updateInFieyong", result: result, WorkID: _workid },
                success: function (data) {
                    if (res == "1") {
                        flag = true;
                    }
                }
            });
        }
        //新增
        else {
            $.ajax({
                url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
                type: 'post',
                dataType: 'text',
                async: false,
                data: { type: "saveInFieyongByTravel", result: result, ProjectID: $("#hdnDATA_4_ID").val(), WorkID: _workid },
                success: function (data) {
                    if (res == "1") {
                        flag = true;
                    }
                }
            });
        }
        return flag;
    }
    else {
        return true;
    }
}