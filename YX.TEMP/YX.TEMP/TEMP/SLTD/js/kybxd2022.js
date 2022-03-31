//财务编号
var ContracCodeControl = "DATA_8";
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
    //项目类别变化获取预算科目
    $(document).on("change", "select[name = 'DATA_9']", function (data) {
        resetsearch();
        getCZProject();
        IsDisPlay();
    })

    //预算科目变化变化获取可用余额
    $(document).on("change", "select[name = 'DATA_10']", function (data) {
        GetUseBalance(10);
    })

    $(document).on("change", "select[name = 'DATA_15']", function (data) {
        GetUseBalance(15);
    })

    $(document).on("change", "select[name = 'DATA_20']", function (data) {
        GetUseBalance(20);
    })

    $(document).on("change", "select[name = 'DATA_25']", function (data) {
        GetUseBalance(25);
    })

    $(document).on("change", "select[name = 'DATA_30']", function (data) {
        GetUseBalance(30);
    })

    /**
     * 选人控件没有进回调方法，原因未知
     * 只能采用这种实时监听的方法来实现了
     */
    setInterval(function () {
        if (contractItemID != $("#hdnDATA_7_ID").val()) {
            contractItemID = $("#hdnDATA_7_ID").val();
            contractItemName = $("#txtDATA_7_Name").val();
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

    if ($("input[name='DATA_8']").val() != "" && $("Select[name='DATA_9']").val() != "") {
        //alert(0);
        SecondDisPlay();
    }
    //总金额大写
    var CaplMoney = "DATA_37";
    /**
    * 实时计算金额
    */
    var moneyTotal = 0;
    var aa = 0;
    var bb = 0;
    var cc = 0;
    var dd = 0;
    var ee = 0;

    if (IS_PC) {
        setInterval(function () {
            if ($("input[name='DATA_13']").val() != "") {
                aa = $("input[name='DATA_13']").val();
            }
            if ($("input[name='DATA_18']").val() != "") {
                bb = $("input[name='DATA_18']").val();
            }
            if ($("input[name='DATA_23']").val() != "") {
                cc = $("input[name='DATA_23']").val();
            }
            if ($("input[name='DATA_28']").val() != "") {
                dd = $("input[name='DATA_28']").val();
            }
            if ($("input[name='DATA_33']").val() != "") {
                ee = $("input[name='DATA_33']").val();
            }

            moneyTotal = parseFloat(aa) + parseFloat(bb) + parseFloat(cc) + parseFloat(dd) + parseFloat(ee);
            $("input[name='DATA_36']").val(moneyTotal);
            $("input[name='DATA_37']").val(moneyOfLowercaseToUppercaseFunc(moneyTotal).replace("分", 0));

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
                //moneyOfLowercaseToUppercaseFunc(moneyTotal.toString(), CaplMoney, "input");
            }
        }, 1000);
    }

    // $(document).on("change", "#" + tableList + " select", function () {
    // showItem(this);
    // })
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

    $("Select[name='DATA_10']").empty();
    $("Select[name='DATA_15']").empty();
    $("Select[name='DATA_20']").empty();
    $("Select[name='DATA_25']").empty();
    $("Select[name='DATA_30']").empty();

    $("Select[name='DATA_10']").val("");
    $("input[name='DATA_11']").val("");

    $("Select[name='DATA_15']").val("");
    $("input[name='DATA_16']").val("");

    $("Select[name='DATA_20']").val("");
    $("input[name='DATA_21']").val("");

    $("Select[name='DATA_25']").val("");
    $("input[name='DATA_26']").val("");

    $("Select[name='DATA_30']").val("");
    $("input[name='DATA_31']").val("");

}

//获取财政项目来源
function getCZProject() {
    if ($("select[name = 'DATA_9'] option:selected").val() == "财政") {
        var aa = $("input[name='txtDATA_7_Name']").val();
        //alert(aa);
        $.ajax({
            type: "POST",
            dataType: "text",
            data: { Type: aa },
            url: "/CustomDevelop/ZJSLTD/Ajax.ashx?r=" + Math.floor(Math.random() * 1000),
            success: function (s) {
                //alert(s);
                $("input[name='DATA_45']").val(s);
            }
        })
        $("input[name = 'DATA_45']").attr("validation", "type: ; len: 1; ").show();
    }
    else {
        $("input[name='DATA_45']").val("");
        $("input[name = 'DATA_45']").removeAttr("validation").hide();
    }
}

//申请时获取预算科目-2022
function IsDisPlay() {
    var type = $("Select[name='DATA_9']").val();

    if (_frompage == "new_def") {
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
                        node += '<option value="" data_num=""></option>';
                        for (var i = 0; i < res.data.length; i++) {
                            if (res.data[i].BudgetName.indexOf("劳务费") == "-1" && res.data[i].BudgetName.indexOf("咨询费") == "-1" && res.data[i].BudgetName.indexOf("差旅费") == "-1") {
                                node += '<option value="' + res.data[i].BudgetName + '" data_num="' + res.data[i].BudgetCode + '">' + res.data[i].BudgetName + '</option>';
                            }
                        }
                        //node += '</select>';
                        //$(obj).closest("td").find("input").hide();
                        //$(obj).closest("td").find("input").val(firstValue);
                        //$(obj).closest("td").append(node);

                        $("Select[name='DATA_10']").append(node);
                        $("Select[name='DATA_15']").append(node);
                        $("Select[name='DATA_20']").append(node);
                        $("Select[name='DATA_25']").append(node);
                        $("Select[name='DATA_30']").append(node);
                    }
                }
            })
        }
    }
}

//获取可用余额
function GetUseBalance(aa) {
    var FeeItemName = $("select[name='DATA_" + aa + "'] option:selected").val();

    //回写经费项目预算金额
    $.ajax({
        url: "/TEMP/SLTD/ajax/getdata.ashx?r=" + Math.random(),
        dataType: 'text',
        type: 'Get',
        data: {
            type: "getUseBalance",
            ContractID: contractItemID,
            ContractName: contractItemName,
            tableNum: "Form_Table_042",
            BudgetName: $("select[name='DATA_" + aa + "'] option:selected").val(),
            FeeItemName: FeeItemName,
            ContractType: $("Select[name='DATA_9']").val()
        },
        success: function (res) {
            var bb = Number(aa) + 1;
            $("input[name='DATA_" + bb + "']").val(res);
        }
    });
}

//修改或审批时预算科目渲染-2022
function SecondDisPlay() {
    contractItemID = $("#hdnDATA_7_ID").val();
    contractItemName = $("#txtDATA_7_Name").val();
    var type = $("Select[name='DATA_9']").val();
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
                    console.log(res.data)
                    for (var i = 0; i < res.data.length; i++) {
                        node += '<option value="' + res.data[i].BudgetName + '" data_num="' + res.data[i].BudgetCode + '">' + res.data[i].BudgetName + '</option>';
                    }

                    $("Select[name='DATA_10']").append(node);
                    $("Select[name='DATA_15']").append(node);
                    $("Select[name='DATA_20']").append(node);
                    $("Select[name='DATA_25']").append(node);
                    $("Select[name='DATA_30']").append(node);
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
                type: "getYSKM",
                table: "Form_Table_042",
                WorkID: _workid
            },
            success: function (res) {
                //alert(res);
                var arr = res.split('☆');
                //alert(arr[0]);
                $("Select[name='DATA_10']").val(arr[0]);
                $("Select[name='DATA_15']").val(arr[1]);
                $("Select[name='DATA_20']").val(arr[2]);
                $("Select[name='DATA_25']").val(arr[3]);
                $("Select[name='DATA_30']").val(arr[4]);
            }
        })
    }
}

//手机端
function showItem(obj) {
    if ($(obj).closest('td').attr("id").endWith("c1")) {
        if ($(obj).find("option:selected").val() == "财政") {
            //alert(0);
            var aa = $("input[name='txtDATA_7_Name']").val();
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

//金额小写转大写，直接转换
function moneyOfLowercaseToUppercaseFunc(n) {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n))
        return "数据非法";
    var unit = "仟佰拾亿仟佰拾万仟佰拾元角分", str = ""; n += "00";
    var p = n.indexOf('.'); if (p >= 0) n = n.substring(0, p) + n.substr(p + 1, 2);
    unit = unit.substr(unit.length - n.length);
    for (var i = 0; i < n.length; i++)
        str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i);
    return str.replace(/零(仟|佰|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
}

//判断是否有重复预算科目选择
function checkdouble(a) {
    return /(\x0f[^\x0f]+)\x0f[\s\S]*\1/.test("\x0f" + a.join("\x0f\x0f") + "\x0f");
}

//提交二次验证
function Form_Custom_Validate() {
    //alert(0);
    if ($("#hdnDATA_7_ID").val() == "" || $("#txtDATA_7_Name").val() == "") {
        alert("项目名称不能为空");
        return false;
    }

    var TravelApproval_Text = [];
    //var str = $('#ccsp' + j + ' option:selected').val();
    if ($("Select[name='DATA_10']").val() != "") {
        TravelApproval_Text.push($("Select[name='DATA_10']").val());
    }

    if ($("Select[name='DATA_15']").val() != "") {
        TravelApproval_Text.push($("Select[name='DATA_15']").val());
    }

    if ($("Select[name='DATA_20']").val() != "") {
        TravelApproval_Text.push($("Select[name='DATA_20']").val());
    }

    if ($("Select[name='DATA_25']").val() != "") {
        TravelApproval_Text.push($("Select[name='DATA_25']").val());
    }

    if ($("Select[name='DATA_30']").val() != "") {
        TravelApproval_Text.push($("Select[name='DATA_30']").val());
    }



    if (checkdouble(TravelApproval_Text) == true) {
        alert("预算科目不允许有重复！");
        return false;
    }
    //parseFloat
    //alert(parseFloat($("input[name='DATA_11']").val()));
    //alert(parseFloat($("input[name='DATA_13']").val()));
    if (parseFloat($("input[name='DATA_11']").val()) < parseFloat($("input[name='DATA_13']").val())) {
        alert("报销明细第1行，报销金额超出可报销金额！");
        return false;
    }

    if (parseFloat($("input[name='DATA_16']").val()) < parseFloat($("input[name='DATA_18']").val())) {
        alert("报销明细第2行，报销金额超出可报销金额！");
        return false;
    }

    if (parseFloat($("input[name='DATA_21']").val()) < parseFloat($("input[name='DATA_23']").val())) {
        alert("报销明细第3行，报销金额超出可报销金额！");
        return false;
    }

    if (parseFloat($("input[name='DATA_26']").val()) < parseFloat($("input[name='DATA_28']").val())) {
        alert("报销明细第4行，报销金额超出可报销金额！");
        return false;
    }

    if (parseFloat($("input[name='DATA_31']").val()) < parseFloat($("input[name='DATA_33']").val())) {
        alert("报销明细第5行，报销金额超出可报销金额！");
        return false;
    }

    return true;
}

