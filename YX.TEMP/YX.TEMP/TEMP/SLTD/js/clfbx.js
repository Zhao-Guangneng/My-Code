var contractItemID = "";
var contractItemName = "";


$(function () {
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
    $(document).on("change", "select[name = 'DATA_20']", function (data) {
        getCZProject();
    })

    //预算科目变化变化获取可用余额
    $(document).on("change", "select[name = 'DATA_19']", function (data) {
        GetUseBalance(21);
    })

    $(document).on("change", "select[name = 'DATA_20']", function (data) {
        GetUseBalance(21);
    })

    if ($("input[name='DATA_18']").val() != "" && $("Select[name='DATA_20']").val() != "") {
        //alert(0);
        SecondDisPlay();
    }

})


function DATA_SELECT_CUSTOM_DATA_18(a, b, c) {
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

                DATA_SELECT_CUSTOM_DATA_18_CallBack(b);
            },
            cancel: true
        });
}


function DATA_SELECT_CUSTOM_DATA_18_CallBack(id) {
    var filedname = id.substring(3, id.length - 3);
    $("#" + filedname).val($("#txt" + filedname + "_Name").val() + "⊙" + $("#hdn" + filedname + "_ID").val());
}


//重置值
function resetsearch() {
    $("Select[name='DATA_19']").empty();
    //$("Select[name='DATA_15']").val("");
    //$("input[name='DATA_16']").val("");
}

//获取财政项目来源
function getCZProject() {
    if ($("select[name = 'DATA_20'] option:selected").val() == "财政") {
        var aa = $("input[name='txtDATA_18_Name']").val();
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
    var type = $("Select[name='DATA_20']").val();
    if (type == "横向" || type == "配套" || type == "财政" || type == "院科教基金") {
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
                        $("Select[name='DATA_19']").append(node);
                    }
                }
            })
        }
    }
}

//获取可用余额
function GetUseBalance(aa) {
    //alert(0);
    var FeeItemName = $("select[name='DATA_19'] option:selected").val();

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
            ContractType: $("Select[name='DATA_20']").val()
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
