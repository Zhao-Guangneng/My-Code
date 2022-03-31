
var firstMoney = ""; //可用金额
var tempMoney = ""; //在途金额
var realMoney = ""; //实际金额

$(document).on("focus", "#LV_23 tbody input[class='FormInput']", function () {
    var thisMoney = 0;
    if ($(this).val() != "") {
        thisMoney = $(this).val();
    }
    $("input[name='DATA_18']").val($("input[name='DATA_18']").val() * 1 - thisMoney * 1);
})
$(document).on('blur', '#LV_23 tbody input[class="FormInput"]', function () {
    if ($(this).val() < 0) {
        alert("禁止输入负数，请重新输入！");
        $(this).val("");
        return false;
    }
    if ($("input[name='DATA_18']").val() * 1 + $(this).val() * 1 > $("input[name='DATA_15']").val() * 1) {
        alert("申请金额已大于可申请余额，请重新输入！");
        $(this).val("");
        return false;
    }
    else {
        var thisMoney = 0;
        if ($("input[name='DATA_18']").val() != "") {
            thisMoney = $("input[name='DATA_18']").val();
        }
        $("input[name='DATA_18']").val(thisMoney * 1 + $(this).val() * 1);
    }
})
//报销项目变化，对应可用额变化
$(document).on("change", "select[name='DATA_31']", function () {
    getMoney("Fee" + $(this).find("option:selected").attr("data_num"));
    $("input[name='DATA_13']").val(firstMoney);
    $("input[name='DATA_14']").val(tempMoney);
    $("input[name='DATA_15']").val(realMoney);
})
//获取可用金额和在途金额，并计算出实际金额
function getMoney(selectName) {
    var thisProjectID = "";
    if ($("#hdnDATA_11_ID").length > 0) {
        thisProjectID = $("#hdnDATA_11_ID").val();
    }
    $.ajax({
        url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
        type: 'post',
        dataType: 'text',
        async: false,
        data: { type: "getMoney", ProjectID: thisProjectID, WorkID: _workid, Fee: selectName, Table: "KYPM_Project_Fieyong" },
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
//选择部门或课题项目后的回调
function Data_Select_CallBack(id) {
    var filedname = id.substring(3, id.length - 3);
    $("#" + filedname).val($("#txt" + filedname + "_Name").val() + "⊙" + $("#hdn" + filedname + "_ID").val());
    $.ajax({
        url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
        type: 'post',
        dataType: 'text',
        data: { type: "getConstracCode", ProjectID: $("#hdnDATA_11_ID").val() },
        success: function (res) {
            $("input[name='DATA_12']").val(res);
        }
    })
    $.ajax({
        url: '/TEMP/ajax/getdata.ashx?r=' + Math.floor(Math.random() * 1000) + '',
        type: 'post',
        dataType: 'json',
        data: { type: "getContractFee", ProjectID: $("#hdnDATA_11_ID").val() },
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
                    $("select[name='DATA_31']").empty().append('<option value="">请先选择具体项目</option>');
                }
                else {
                    $("select[name='DATA_31']").empty().append(node);
                }
                getMoney("Fee" + $("select[name='DATA_31'] option").eq(0).attr("data_num"));
                $("input[name='DATA_13']").val(firstMoney);
                $("input[name='DATA_14']").val(tempMoney);
                $("input[name='DATA_15']").val(realMoney);
            }
        }
    });
}