using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using YX.Security;
using YX.TEMP.BLL;

namespace YX.TEMP.TEMP.SLTD.ajax
{
    /// <summary>
    /// getdata 的摘要说明
    /// </summary>
    public class getdata : IHttpHandler
    {
        FUNC bll = new FUNC();
        public void ProcessRequest(HttpContext context)
        {
            string type = YX.SSO.OATools.QueryString("type");
            string json = "";
            int f = 0;
            if (type == "getPersonMemory")
            {
                string personname = YX.SSO.OATools.QueryString("personname");
                string tableNum = YX.SSO.OATools.QueryString("tableNum");
                json = "{";
                DataTable dt = bll.SelectOASql("select DATA_1 from " + tableNum + " where DATA_1 like '%" + personname + "%' order by WorkID desc");
                if (dt.Rows.Count > 0)
                {
                    string[] items = dt.Rows[0]["DATA_1"].ToString().Split(new string[] { "\r\n" }, StringSplitOptions.None);
                    for (int j = 0; j < items.Length; j++)
                    {
                        string[] item_list = items[j].Split('`');
                        if (item_list[0] == personname)
                        {
                            json += "\"WorkUnit\":\"" + item_list[1] + "\",\"WorkTitle\":\"" + item_list[2] + "\",\"IdCard\":\"" + item_list[3] + "\",\"Bank\":\"" + item_list[4] + "\",\"BankAccount\":\"" + item_list[5] + "\"";
                            break;
                        }
                    }
                }
                json += "}";
                context.Response.Write(json);
            }
            else if (type == "getContracCode")
            {
                string ContractID = YX.SSO.OATools.QueryString("ContractID");
                DataTable dt = bll.SelectOASql("select ContracCode from KYPM_Project_Contract where DeleteMark=0 and ContractID='" + ContractID + "'");
                context.Response.Write(dt.Rows.Count > 0 ? dt.Rows[0]["ContracCode"].ToString() : "");
            }
            else if (type == "getFeeMoney")
            {

                //表单
                string tableNum = YX.SSO.OATools.QueryString("tableNum");
                //项目合同编号
                string ContractID = YX.SSO.OATools.QueryString("ContractID");
                //项目合同名称
                string ContractName = YX.SSO.OATools.QueryString("ContractName");
                //经费项目名称
                string BudgetName = YX.SSO.OATools.QueryString("BudgetName");
                //经费项目名称
                string FeeItemName = YX.SSO.OATools.QueryString("FeeItemName");
                //项目类别
                string ContractType = YX.SSO.OATools.QueryString("ContractType");
                string SP = "";
                if (ContractType== "财政")
                {
                    SP = "_Shi";
                }
                else if (ContractType == "配套")
                {
                    SP = "_Pei";
                }

                //Fee01_Pei    配套
                //Fee01_Shi    财政

                var flag = "";
                double money = 0;
                string sql = "";
                try
                {
                    DataTable dt = bll.SelectOASql("select BudgetCode from KYPM_Project_BudgetTemplateInfo where TemplateID=(select TemplateID from KYPM_Project_Contract where DeleteMark=0 and ProjectID='" + ContractID + "'  and ContractName='" + ContractName + "') and BudgetName like '%" + FeeItemName + "%'");
                    flag = flag + "0";
                    if (dt.Rows.Count > 0)
                    {
                        DataTable getMoney = bll.SelectOASql("select " + dt.Rows[0]["BudgetCode"].ToString()+ SP + " as " + dt.Rows[0]["BudgetCode"].ToString() + SP + " from KYPM_Project_ContractFee where ProjectID='" + ContractID + "'");
                        flag = flag + "1";
                        if (getMoney.Rows.Count > 0)
                        {
                            if (FeeItemName=="差旅费")
                            {
                                sql= "select SUM(CAST(DATA_24 as Money))as Money from (select * from " + tableNum + " where DATA_35='" + FeeItemName + "') a left join Form_Work b on a.WorkID=b.WorkID where b.DeleteMark=0 and (b.Status=1 or b.Status=2)";
                            }
                            else
                            {
                                sql = "select SUM(CAST(DATA_24 as Money))as Money from (select * from " + tableNum + " where DATA_35='" + BudgetName + "') a left join Form_Work b on a.WorkID=b.WorkID where b.DeleteMark=0 and (b.Status=1 or b.Status=2)";
                            }
                            DataTable getTempMoney = bll.SelectOASql(sql);
                            flag = flag + "2";
                            WriteLog("0100000001", "金额=" + getTempMoney.Rows[0]["Money"].ToString());
                            if (!string.IsNullOrEmpty(getTempMoney.Rows[0]["Money"].ToString()))
                            {
                                WriteLog("0100000001", "进来了1=" + getTempMoney.Rows[0]["Money"].ToString());
                                if (!string.IsNullOrEmpty(getMoney.Rows[0][dt.Rows[0]["BudgetCode"].ToString() + SP].ToString()))
                                {
                                    money = Convert.ToDouble(getMoney.Rows[0][dt.Rows[0]["BudgetCode"].ToString() + SP].ToString()) * 10000 - Convert.ToDouble(getTempMoney.Rows[0]["Money"].ToString());
                                }
                                else
                                {
                                    money = Convert.ToDouble(0) * 10000 - Convert.ToDouble(getTempMoney.Rows[0]["Money"].ToString());
                                }
                                
                                WriteLog("0100000001", "金额2=" + money);
                                flag = flag + "3";
                            }
                            else
                            {
                                WriteLog("0100000001", "进来了2=" + getTempMoney.Rows[0]["Money"].ToString());
                                if (!string.IsNullOrEmpty(getMoney.Rows[0][dt.Rows[0]["BudgetCode"].ToString() + SP].ToString()))
                                {
                                    money = Convert.ToDouble(getMoney.Rows[0][dt.Rows[0]["BudgetCode"].ToString() + SP].ToString()) * 10000;
                                }
                                else
                                {
                                    money = Convert.ToDouble(0) * 10000;
                                }
                                
                                flag = flag + "4";
                            }
                        }
                    }
                }
                catch
                {
                    context.Response.Write("error:" + flag);
                }
                context.Response.Write(money);
            }
            else if (type == "getFeeItems") {
                string ProjectID= YX.SSO.OATools.QueryString("ProjectID");
                string ContractName = YX.SSO.OATools.QueryString("ContractName");
                DataTable dt = bll.SelectOASql("select BudgetCode,BudgetName from KYPM_Project_BudgetTemplateInfo where TemplateID = (select TemplateID from KYPM_Project_Contract where DeleteMark = 0 and ProjectID = '"+ ProjectID + "'  and ContractName = '"+ ContractName + "')");
                json = getjosn(dt, f);
                context.Response.Write(json);
            }
            else if (type=="getYSKM")
            {
                string table = YX.SSO.OATools.QueryString("table");
                string WorkID = YX.SSO.OATools.QueryString("WorkID");
                DataTable dt = bll.SelectOASql("select * from "+ table + " where WorkID =  '" + WorkID + "'");
                string data = "";
                if (dt.Rows.Count>0)
                {
                    data = dt.Rows[0]["DATA_10"].ToString() + "☆" + dt.Rows[0]["DATA_15"].ToString() + "☆" + dt.Rows[0]["DATA_20"].ToString() + "☆" + dt.Rows[0]["DATA_25"].ToString() + "☆" + dt.Rows[0]["DATA_30"].ToString(); 
                }
                context.Response.Write(data);
            }
            else if (type == "getYSKM2")
            {
                string table = YX.SSO.OATools.QueryString("table");
                string WorkID = YX.SSO.OATools.QueryString("WorkID");
                DataTable dt = bll.SelectOASql("select * from " + table + " where WorkID =  '" + WorkID + "'");
                string data = "";
                if (dt.Rows.Count > 0)
                {
                    data = dt.Rows[0]["DATA_19"].ToString();
                }
                context.Response.Write(data);
            }
            else if (type == "getYSKM3")
            {
                string table = YX.SSO.OATools.QueryString("table");
                string WorkID = YX.SSO.OATools.QueryString("WorkID");
                DataTable dt = bll.SelectOASql("select * from " + table + " where WorkID =  '" + WorkID + "'");
                string data = "";
                if (dt.Rows.Count > 0)
                {
                    data = dt.Rows[0]["DATA_8"].ToString();
                }
                context.Response.Write(data);
            }
            else if (type == "getUseBalance")
            {

                //表单
                string tableNum = YX.SSO.OATools.QueryString("tableNum");
                //项目合同编号
                string ContractID = YX.SSO.OATools.QueryString("ContractID");
                //项目合同名称
                string ContractName = YX.SSO.OATools.QueryString("ContractName");
                //经费项目名称
                string BudgetName = YX.SSO.OATools.QueryString("BudgetName");
                //经费项目名称
                string FeeItemName = YX.SSO.OATools.QueryString("FeeItemName");
                //项目类别
                string ContractType = YX.SSO.OATools.QueryString("ContractType");
                string SP = "";
                if (ContractType == "财政")
                {
                    SP = "_Shi";
                }
                else if (ContractType == "配套")
                {
                    SP = "_Pei";
                }
                //Fee01_Pei    配套
                //Fee01_Shi    财政
                var flag = "";
                double money = 0;
                double money1 = 0;
                double money2= 0;
                double money3 = 0;
                double money4 = 0;
                double money5 = 0;
                string xmmc = ContractName + "⊙" + ContractID;
                try
                {
                    DataTable dt = bll.SelectOASql("select BudgetCode from KYPM_Project_BudgetTemplateInfo where TemplateID=(select TemplateID from KYPM_Project_Contract where DeleteMark=0 and ProjectID='" + ContractID + "'  and ContractName='" + ContractName + "') and BudgetName like '%" + FeeItemName + "%'");
                    flag = flag + "0";
                    if (dt.Rows.Count > 0)
                    {
                        DataTable getMoney = bll.SelectOASql("select " + dt.Rows[0]["BudgetCode"].ToString() + SP + " as " + dt.Rows[0]["BudgetCode"].ToString() + SP + " from KYPM_Project_ContractFee where ProjectID='" + ContractID + "'");
                        flag = flag + "1";
                        if (getMoney.Rows.Count > 0)
                        {
                            string sql1 = "select SUM(CAST(DATA_13 as Money))as Money from (select * from " + tableNum + " where DATA_7='"+ xmmc + "'and DATA_10='" + BudgetName + "') a left join Form_Work b on a.WorkID=b.WorkID where b.DeleteMark=0 and (b.Status=1 or b.Status=2)";
                            
                            DataTable getMoney1 = bll.SelectOASql(sql1);
                            if (!string.IsNullOrEmpty(getMoney1.Rows[0]["Money"].ToString()))
                            {
                                money1 = Convert.ToDouble(getMoney1.Rows[0]["Money"].ToString());
                            }

                            string sql2 = "select SUM(CAST(DATA_18 as Money))as Money from (select * from " + tableNum + " where DATA_7='" + xmmc + "'and DATA_15='" + BudgetName + "') a left join Form_Work b on a.WorkID=b.WorkID where b.DeleteMark=0 and (b.Status=1 or b.Status=2)";

                            DataTable getMoney2 = bll.SelectOASql(sql2);
                            if (!string.IsNullOrEmpty(getMoney2.Rows[0]["Money"].ToString()))
                            {
                                money2 = Convert.ToDouble(getMoney2.Rows[0]["Money"].ToString());
                            }

                            string sql3 = "select SUM(CAST(DATA_23 as Money))as Money from (select * from " + tableNum + " where DATA_7='" + xmmc + "'and DATA_20='" + BudgetName + "') a left join Form_Work b on a.WorkID=b.WorkID where b.DeleteMark=0 and (b.Status=1 or b.Status=2)";

                            DataTable getMoney3 = bll.SelectOASql(sql3);
                            if (!string.IsNullOrEmpty(getMoney3.Rows[0]["Money"].ToString()))
                            {
                                money3 = Convert.ToDouble(getMoney3.Rows[0]["Money"].ToString());
                            }

                            string sql4 = "select SUM(CAST(DATA_28 as Money))as Money from (select * from " + tableNum + " where DATA_7='" + xmmc + "'and DATA_25='" + BudgetName + "') a left join Form_Work b on a.WorkID=b.WorkID where b.DeleteMark=0 and (b.Status=1 or b.Status=2)";

                            DataTable getMoney4 = bll.SelectOASql(sql4);
                            if (!string.IsNullOrEmpty(getMoney4.Rows[0]["Money"].ToString()))
                            {
                                money4 = Convert.ToDouble(getMoney4.Rows[0]["Money"].ToString());
                            }

                            string sql5 = "select SUM(CAST(DATA_33 as Money))as Money from (select * from " + tableNum + " where DATA_7='" + xmmc + "'and DATA_30='" + BudgetName + "') a left join Form_Work b on a.WorkID=b.WorkID where b.DeleteMark=0 and (b.Status=1 or b.Status=2)";

                            DataTable getMoney5 = bll.SelectOASql(sql5);
                            if (!string.IsNullOrEmpty(getMoney5.Rows[0]["Money"].ToString()))
                            {
                                money5 = Convert.ToDouble(getMoney5.Rows[0]["Money"].ToString());
                            }

                            money = Convert.ToDouble(money1) + Convert.ToDouble(money2) + Convert.ToDouble(money3) + Convert.ToDouble(money4) + Convert.ToDouble(money5);

                            if (!string.IsNullOrEmpty(getMoney.Rows[0][dt.Rows[0]["BudgetCode"].ToString() + SP].ToString()))
                            {
                                money = Convert.ToDouble(getMoney.Rows[0][dt.Rows[0]["BudgetCode"].ToString() + SP].ToString()) * 10000 - Convert.ToDouble(money);
                            }
                            else
                            {
                                money = Convert.ToDouble(0) * 10000 - Convert.ToDouble(money);
                            }
                        }
                    }
                }
                catch
                {
                    context.Response.Write("error:" + flag);
                }
                context.Response.Write(money);
            }
            else if (type == "getUseBalance2")
            {

                //表单
                string tableNum = YX.SSO.OATools.QueryString("tableNum");
                //项目合同编号
                string ContractID = YX.SSO.OATools.QueryString("ContractID");
                //项目合同名称
                string ContractName = YX.SSO.OATools.QueryString("ContractName");
                //经费项目名称
                string BudgetName = YX.SSO.OATools.QueryString("BudgetName");
                //经费项目名称
                string FeeItemName = YX.SSO.OATools.QueryString("FeeItemName");
                //项目类别
                string ContractType = YX.SSO.OATools.QueryString("ContractType");
                string SP = "";
                if (ContractType == "财政")
                {
                    SP = "_Shi";
                }
                else if (ContractType == "配套")
                {
                    SP = "_Pei";
                }
                //Fee01_Pei    配套
                //Fee01_Shi    财政
                var flag = "";
                double money = 0;
                string xmmc = ContractName + "⊙" + ContractID;
                try
                {
                    DataTable dt = bll.SelectOASql("select BudgetCode from KYPM_Project_BudgetTemplateInfo where TemplateID=(select TemplateID from KYPM_Project_Contract where DeleteMark=0 and ProjectID='" + ContractID + "'  and ContractName='" + ContractName + "') and BudgetName like '%" + FeeItemName + "%'");
                    flag = flag + "0";
                    if (dt.Rows.Count > 0)
                    {
                        DataTable getMoney = bll.SelectOASql("select " + dt.Rows[0]["BudgetCode"].ToString() + SP + " as " + dt.Rows[0]["BudgetCode"].ToString() + SP + " from KYPM_Project_ContractFee where ProjectID='" + ContractID + "'");
                        flag = flag + "1";
                        if (getMoney.Rows.Count > 0)
                        {
                            if (!string.IsNullOrEmpty(getMoney.Rows[0][dt.Rows[0]["BudgetCode"].ToString() + SP].ToString()))
                            {
                                money = Convert.ToDouble(getMoney.Rows[0][dt.Rows[0]["BudgetCode"].ToString() + SP].ToString()) * 10000;
                            }
                            else
                            {
                                money = Convert.ToDouble(0) * 10000;
                            }
                        }
                    }
                }
                catch
                {
                    context.Response.Write("error:" + flag);
                }
                context.Response.Write(money);
            }
        }
        public string getjosn(DataTable dt, int count)
        {
            string json = "{ \"code\": 0,\"msg\": \"\",\"count\":" + count + ",\"data\":" + Newtonsoft.Json.JsonConvert.SerializeObject(dt, Newtonsoft.Json.Formatting.None, new Newtonsoft.Json.Converters.DataTableConverter()) + "}";
            return json;
        }

        private void WriteLog(string userid, string logcontent)
        {
            YX.SSO.BLL.CommonBLL bll = new YX.SSO.BLL.CommonBLL();
            UserInfo u = new UserInfo();
            u.UserID = userid;
            bll.WriteLog(logcontent, u, "省立同德调试");
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}