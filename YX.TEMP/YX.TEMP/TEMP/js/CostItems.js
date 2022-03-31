var seesionData = null; //二级项目数据
var firstItemID = ""; //判断以及节点是否变化，没有变化就直接赋值itemsNode
var itemsNode = null; //存放二级项目，这样就不用每次加载都去调用接口了
var count = 1;
var firstMoney = ""; //可用金额
var tempMoney = ""; //在途金额
var realMoney = ""; //实际金额

var temp = {};
var isUpdate = false;
//<tr>
//    <td style="width: 120px; text-align: center">发生日期</td>
//    <td style="width: 200px; text-align: center">报销项目</td>
//    <td style="width: 200px; text-align: center">报销内容</td>
//    <td style="width: 80px; text-align: center">单据张数</td>
//    <td style="width: 100px; text-align: center">金额</td>
//    <td style="width: 100px; text-align: center">备注</td>
//    <td style="width: 100px; text-align: center">实际金额</td>
//    <td style="width: 100px; text-align: center">在途金额</td>
//    <td style="width: 100px; text-align: center">可用金额</td>
//    <td style="width: 90px; text-align: center"><a onclick="addMaterialLine()" class="aBtn">新增</a></td>
//</tr>

//回写项目编码
function Data_Select_CallBack(id) {
    var filedname = id.substring(3, id.length - 3);
    $("#" + filedname).val($("#txt" + filedname + "_Name").val() + "⊙" + $("#hdn" + filedname + "_ID").val());
    $.ajax({
        url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
        type: 'get',
        async: false,
        dataType: 'text',
        data: { type: "getProjectCode", ProjectID: $("#hdnDATA_12_ID").val() },
        success: function (data) {
            $("input[name='DATA_16']").val(data);
            $("textarea[name='DATA_32']").val($("#txt" + filedname + "_Name").val());
            $("input[name='DATA_18']").val(data);

        }
    })
}
//删除项目编码
function Data_Select_Clear(id) {
    $("#" + id).val("");
    $("input[name='DATA_16']").val("");
}
iframeLoadComplete();
if (typeof _taskid == undefined || typeof _taskid == "undefined") {
    loadPrint();
}
else {
    if (_taskid != "") {
        loadPrint()
    }
    else {
        //重新提交
        //这是个bug啊每次页面还没有加载完就开始执行最后的js了，不合理
        //应该有一个页面加载完的回调才是好的
        setTimeout(function () {
            if ($("#hdnDATA_12_ID").val() != "") {
                $.ajax({
                    url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
                    type: 'post',
                    async: false,
                    dataType: 'json',
                    data: { type: "getFieYong", WorkID: _workid },
                    success: function (res) {
                        if (res.data.length > 0) {
                            isUpdate = true;
                            for (var i = 0; i < res.data.length; i++) {
                                addMaterialLine();
                                getMoney("Fee" + $("option[value='" + res.data[i].FeetestName + "']").attr("data_num"));
                                $("#itemsBox tr").eq(i).attr("data_id", res.data[i].ID);
                                $("#itemsBox tr").eq(i).find('td').eq(0).find('input').val(res.data[i].CreateTime);
                                $("#itemsBox tr").eq(i).find('td').eq(1).find('select').val(res.data[i].FeetestName);
                                $("#itemsBox tr").eq(i).find('td').eq(2).find('input').val(res.data[i].Contents);
                                $("#itemsBox tr").eq(i).find('td').eq(3).find('input').val(res.data[i].Quantity);
                                $("#itemsBox tr").eq(i).find('td').eq(4).find('input').val(res.data[i].Money);
                                $("#itemsBox tr").eq(i).find('td').eq(5).find('input').val(res.data[i].Remark);
                                $("#itemsBox tr").eq(i).find('td').eq(6).text(realMoney);
                                $("#itemsBox tr").eq(i).find('td').eq(7).text(tempMoney);
                                $("#itemsBox tr").eq(i).find('td').eq(8).text(firstMoney);
                            }
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
        $.ajax({
            url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
            type: 'post',
            async: false,
            dataType: 'json',
            data: { type: "getFieYong",WorkID: _workid },
            success: function (res) {
                if (res.data.length > 0) {
                    for (var i = 0; i < res.data.length; i++) {
                        getMoney(res.data[i].Fee);
                        var node =
                            '<tr>' +
                            '<td><div style="width: 120px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].CreateTime + '</div></td > ' +
                            '<td><div style="width: 200px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].FeetestName + '</div></td > ' +
                            '<td><div style="width: 200px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].Contents + '</div></td> ' +
                            '<td><div style="width: 80px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].Quantity + '</div></td> ' +
                            '<td><div style="width: 100px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].Money + '</div></td > ' +
                            '<td><div style="width: 100px;overflow: hidden;white-space: normal;word-break: break-all;">' + res.data[i].Remark + '</div></td > ' +
                            '<td><div style="width: 100px;overflow: hidden;white-space: normal;word-break: break-all;">' + realMoney + '</div></td>' +
                            '<td><div style="width: 100px;overflow: hidden;white-space: normal;word-break: break-all;">' + tempMoney + '</div></td>' +
                            '<td><div style="width: 90px;overflow: hidden;white-space: normal;word-break: break-all;">' + firstMoney + '</div></td>' +
                            '</tr >';
                        $("#itemsBox").append(node);
                    }
                }
            }
        })
    }, 1000);       
}
//保存/提交触发事件
function Form_Custom_Validate() {
    if (_taskid == "") {
        var result = "";
        $("#itemsBox tr").each(function () {
            var time = $(this).find('td').eq(0).find('input').val();
            var fee = "Fee" + $(this).find('td').eq(1).find('select option:selected').attr("data_num");
            var feetestname = $(this).find('td').eq(1).find('select option:selected').val();
            var contents = $(this).find('td').eq(2).find('input').val();
            var quertity = $(this).find('td').eq(3).find('input').val();
            var money = $(this).find('td').eq(4).find('input').val();
            var remark = $(this).find('td').eq(5).find('input').val();
            if (typeof ($(this).attr("data_id")) != "undefined") {
                result += $(this).attr("data_id") + "@";
            }
            result += time + "@" + fee + "@" + feetestname + "@" + contents + "@" + quertity + "@" + money + "@" + remark + "#";
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
                data: { type: "saveInFieyong", result: result, ProjectID: $("#hdnDATA_12_ID").val(), WorkID: _workid },
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
    //else {
    //    if ($("#hdnActivityID").val() == '683e1d73-c532-49a1-8e6f-ed3a81dff16b') {
    //        var flag = false;
    //        $.ajax({
    //            url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
    //            type: 'post',
    //            async: false,
    //            dataType: 'text',
    //            data: { type: "saveInFeeRecord", ProjectID: $("#hdnDATA_12_ID").val(), WorkID: _workid  },
    //            success: function (data) {
    //                if (data == "1") {
    //                    flag = true;
    //                }
    //            }
    //        })
    //        return flag;
    //    }
    //    else {
    //        return true;
    //    }
    //}
}
//添加行
function addMaterialLine() {
    var tableLen = $("#itemsBox").children().length;
    if ($("#hdnDATA_12_ID").val() == "") {
        alert("请先选择具体项目");
        return false;
    }
    if ($("#itemsBox tr").length > 0) {
        for (var i = 0; i < $("#itemsBox tr").length; i++) {
            if ($("#itemsBox tr").eq(i).find('td').eq(4).find('input').val() == "") {
                alert("第" + (i + 1) + "行金额不能为空");
                return false;
            }
        }
    }
    var node =
        '<tr>' +
        '<td>' +
        '<input  type="search" lay-verify="text" autocomplete="off" class="layui-input" readonly="true" onclick="WdatePicker({dateFmt:\'yyyy-MM-dd\'})" style="width:95%"/>' +
        '</td > ' +
        '<td>' +
        '<select  name="count_' + count + '" onchange="selectChange(this)" style="width:95%"></select>' +
        '</td > ' +
        '<td>' +
        '<input  type="search" lay-verify="text" autocomplete="off" class="layui-input" style="width:95%"/>' +
        '</td> ' +
        '<td>' +
        '<input  type="search" lay-verify="text" autocomplete="off" class="layui-input" style="width:95%"/>' +
        '</td> ' +
        '<td>' +
        '<input  type="number" lay-verify="number" autocomplete="off" class="layui-input" name="setMoney" style="width:95%"/>' +
        '</td > ' +
        '<td>' +
        '<input  type="search" lay-verify="text" autocomplete="off" class="layui-input" style="width:95%"/>' +
        '</td > ' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
        '<td><a onclick="del(this)" class="aDel">删除</a></td>' +
        '</tr >';
    $("#itemsBox").append(node);
    //var timer = setInterval(function () {
    //    if ($("#itemsBox").children().length > tableLen) {
    //        clearInterval(timer);
    //        secitems('count_' + count);
    //    }
    //}, 100);
    secitems('count_' + count);
}
//删除行
function del(obj) {
    $(obj).closest('tr').remove();
    var thisNodeName = $(obj).closest('tr').find('td').eq(1).find('select').val();
    temp[thisNodeName] = parseFloat(temp[thisNodeName]) + parseFloat($(obj).closest('tr').find('td').eq(4).find('input').val());
    $("input[name='DATA_3']").val($("input[name='DATA_3']").val() * 1 - $(obj).closest('tr').find('td').eq(4).find('input').val() * 1);
    moneyConversion("DATA_3", "DATA_15");
}
//加载二级项目列表
function secitems(docnode) {
    if (firstItemID !== $("#hdnDATA_12_ID").val()) {
        $.ajax({
            url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
            type: 'post',
            async: false,
            dataType: 'json',
            data: { type: "getContractFee", ProjectID: $("#hdnDATA_12_ID").val() },
            success: function (res) {
                seesionData = res;
                if (res.data.length > 0) {
                    var node = "";
                    $.each(res.data[0], function (key, val) {
                        //差旅费和专家咨询费要单独拎出来
                        if (val == null || val == "") {
                            return;
                        }
                        if (key.indexOf("Feetest") > -1 && val.toString().indexOf('差旅') < 0 && val.toString().indexOf('专家咨询') < 0) {
                            var data_num = key.replace("Feetest", "");
                            for (var k = 0; k < 2 - data_num.length; i++) {
                                data_num = "0" + data_num;
                            }
                            //data_num = data_num.padStart(2, '0'); ie下超多方法不支持，只能用原生js实现
                            node += '<option value="' + val + '" data_num="' + data_num + '">' + val + '</option>';
                            
                        }
                    });
                    itemsNode = node;
                    firstItemID = $("#hdnDATA_12_ID").val();
                    $("select[name='" + docnode + "']").append(node);
                    getMoney("Fee" + $("select[name='" + docnode + "'] option").eq(0).attr("data_num"));
                    temp[$("select[name='" + docnode + "'] option").eq(0).val()] = realMoney;
                }
            }
        });
    }
    else {
        $("select[name='" + docnode + "']").append(itemsNode);
    }
    getMoney("Fee" + $("select[name='" + docnode + "'] option").eq(0).attr("data_num"));
    $("select[name='" + docnode + "']").closest('tr').find('td').eq(6).text(realMoney);
    $("select[name='" + docnode + "']").closest('tr').find('td').eq(7).text(tempMoney);
    $("select[name='" + docnode + "']").closest('tr').find('td').eq(8).text(firstMoney);
    count++;
}
//二级项目列表change方法
function selectChange(obj) {
    $(obj).closest('tr').find('td').eq(6).text("");
    $(obj).closest('tr').find('td').eq(7).text("");
    $(obj).closest('tr').find('td').eq(8).text("");
    getMoney("Fee" + $(obj).find("option:selected").attr('data_num'));
    if (!($(obj).val() in temp)) {
        temp[$(obj).val()] = realMoney;
    }
    //var this_firstMoney = seesionData.data[0][moenyTitle] * 10000;
    //var this_tempMoney = getTempMoney(moenyTitle).toFixed(2);
    //var this_realMoney = (this_firstMoney - this_tempMoney).toFixed(2);
    $(obj).closest('tr').find('td').eq(6).text(realMoney)
    $(obj).closest('tr').find('td').eq(7).text(tempMoney)
    $(obj).closest('tr').find('td').eq(8).text(firstMoney)
}
//获取可用金额和在途金额，并计算出实际金额
function getMoney(selectName) {
    var thisProjectID = "";
    if ($("#hdnDATA_12_ID").length > 0) {
        thisProjectID = $("#hdnDATA_12_ID").val();
    }
    $.ajax({
        url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
        type: 'post',
        async: false,
        dataType: 'text',
        data: { type: "getMoney", ProjectID: thisProjectID, WorkID: _workid, Fee: selectName, Table: "KYPM_Project_Fieyong"},
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
//总结自动填入“合计人民币（小写）”
$(document).on("focus", "input[name='setMoney']", function () {
    var thisNodeName = $(this).closest('tr').find('td').eq(1).find('select').val();
    var thisMoney = 0;
    if ($(this).val() != "") {
        thisMoney = $(this).val();
    }
    temp[thisNodeName] = parseFloat(temp[thisNodeName]) + parseFloat(thisMoney);
})
$(document).on("blur", "input[name='setMoney']", function () {
    var thisNodeName = $(this).closest('tr').find('td').eq(1).find('select').val();
    if ($(this).val() < 0) {
        alert("禁止输入负数，请重新输入！");
        $(this).val("");
        return false;
    }
    if (parseFloat(temp[thisNodeName]) - parseFloat($(this).val()) < 0) {
        alert("该项申请金额超出了可用金额，请重新输入！");
        $(this).val("");
        return false;
    }
    else {
        var thisMoney = 0;
        if ($(this).val() != "") {
            thisMoney = $(this).val();
        }
        temp[thisNodeName] = parseFloat(temp[thisNodeName]) - parseFloat(thisMoney);
    }
    if ($("#itemsBox").children().length > 0) {
        var moneyCount = 0 * 1;
        $("#itemsBox tr").each(function (index) {
            if ($(this).find('td').eq(4).find('input').val() != "") {
                moneyCount += parseFloat($(this).find('td').eq(4).find('input').val());
            }
        })
        moneyCount = moneyCount.toFixed(2)
        $("input[name='DATA_3'],input[name='DATA_29']").val(moneyCount);
        moneyConversion("DATA_3", "DATA_15");
        moneyConversion("DATA_29", "DATA_28");
    }
})
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
//实时监听小写金额变化并转换为大写
$('input[name="DATA_3"]').bind('input propertychange', function () {
    moneyConversion("DATA_3", "DATA_15");
});

//写这块的有问题，代码里判断Feetest1-Feetest13全都是以非null的条件来判断，
//当碰见费用开支项目较少的时候，就会有null值存在
//海洋所加载这块前,sql先执行此段代码
//update KYPM_Project_ContractFee set Feetest1 = '' where Feetest1 is null
//update KYPM_Project_ContractFee set Feetest2 = '' where Feetest2 is null
//update KYPM_Project_ContractFee set Feetest3 = '' where Feetest3 is null
//update KYPM_Project_ContractFee set Feetest4 = '' where Feetest4 is null
//update KYPM_Project_ContractFee set Feetest5 = '' where Feetest5 is null
//update KYPM_Project_ContractFee set Feetest6 = '' where Feetest6 is null
//update KYPM_Project_ContractFee set Feetest7 = '' where Feetest7 is null
//update KYPM_Project_ContractFee set Feetest8 = '' where Feetest8 is null
//update KYPM_Project_ContractFee set Feetest9 = '' where Feetest9 is null
//update KYPM_Project_ContractFee set Feetest10 = '' where Feetest10 is null
//update KYPM_Project_ContractFee set Feetest11 = '' where Feetest11 is null
//update KYPM_Project_ContractFee set Feetest12 = '' where Feetest12 is null
//update KYPM_Project_ContractFee set Feetest13 = '' where Feetest13 is null

//判断iframe框是否加载完毕
function iframeLoadComplete() {
    var timer = setInterval(function () {
        var ibody = $("#L_Frame_Next").contents();
        if (ibody.find("#NextActInfo").length > 0) {
            clearInterval(timer);
            //退回签批人重置
            if ($("#hdnActivityID").val() == "93f7f4fe-6d9e-49d2-8bdd-3d30e8dbe492") {
                $("textarea[name='DATA_20'],textarea[name='DATA_21'],textarea[name='DATA_22']").val("");
            }
            //领导审批
            else if ($("#hdnActivityID").val() == "19be4b52-e8c3-4d96-8a17-9eb5be8766d6" ||
                     $("#hdnActivityID").val() == "6914864e-e7cf-413a-8d11-3336dff2039e") {
                $("textarea[name='DATA_20']").val($("textarea[name='DATA_20']").val() + "," + _personName);
                $("textarea[name='DATA_20']").val($("textarea[name='DATA_20']").val().replace(/(^,)|(,$)/g, ''));
            }
            //经办人
            else {
                $("textarea[name='DATA_22']").val($("textarea[name='DATA_22']").val() + "," + _personName);
                $("textarea[name='DATA_22']").val($("textarea[name='DATA_22']").val().replace(/(^,)|(,$)/g, ''))
            }
        }
    }, 100);
}

