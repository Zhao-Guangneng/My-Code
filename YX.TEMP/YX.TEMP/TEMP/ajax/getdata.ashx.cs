using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using YX.TEMP.BLL;

namespace YX.TEMP.TEMP.ajax
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
            if (type == "getContractFee")
            {
                string ProjectID = YX.SSO.OATools.QueryString("ProjectID");
                DataTable dt = bll.SelectOASql("select * from  KYPM_Project_ContractFee where ProjectID='" + ProjectID + "'");
                string json = getjosn2(dt);
                context.Response.Write(json);
            }
            //获取二级类别的在途金额
            else if (type == "getFeeTempMoney")
            {
                string ProjectID = YX.SSO.OATools.QueryString("ProjectID");
                string FeeID = YX.SSO.OATools.QueryString("FeeID");
                string moneyCount = "0";
                DataTable getMoney = bll.SelectOASql("select sum(Money)as moneyCount from KYPM_Project_Fieyong where ProjectID='" + ProjectID + "' and Fee='" + FeeID + "' and DeleteMark=0 and Status=0");
                if (getMoney.Rows.Count > 0)
                {
                    if (!string.IsNullOrEmpty(getMoney.Rows[0]["moneyCount"].ToString()))
                    {
                        moneyCount = getMoney.Rows[0]["moneyCount"].ToString();
                    }
                }
                context.Response.Write(moneyCount);
            }
            else if (type == "saveInFieyong")
            {
                //"@Fee01@设备费@@@10000@#"
                string ProjectID = YX.SSO.OATools.QueryString("ProjectID");
                string WorkID = YX.SSO.OATools.QueryString("WorkID");
                string result = YX.SSO.OATools.QueryString("result");
                result = result.TrimEnd('#');
                string[] resultList = result.Split('#');

                List<string> ids = new List<string>();
                try
                {
                    for (int i = 0; i < resultList.Length; i++)
                    {
                        //['',Fee01,'设备费','','','10000','']
                        result = resultList[i];
                        string ID = YX.SSO.BLL.CommonBLL.NewID("KYPM_Project_Fieyong");
                        DataRow newRow;
                        newRow = bll.SelectOASql("select * from KYPM_Project_Fieyong where 1=2").NewRow();
                        newRow["ID"] = ID;
                        newRow["WorkID"] = WorkID;
                        newRow["ProjectID"] = ProjectID;
                        newRow["CreateTime"] = result.Split('@')[0];
                        newRow["Fee"] = result.Split('@')[1];
                        newRow["FeetestName"] = result.Split('@')[2];
                        newRow["Contents"] = result.Split('@')[3];
                        newRow["Quantity"] = result.Split('@')[4];
                        newRow["Money"] = (float)Convert.ToDouble(result.Split('@')[5]);
                        newRow["Remark"] = result.Split('@')[6];
                        newRow["DeleteMark"] = 0;
                        newRow["Status"] = 0;
                        bll.InsertOA(newRow, "KYPM_Project_Fieyong");
                        ids.Add(ID);
                    }
                    context.Response.Write("1");
                }
                catch (Exception ex)
                {
                    string exportPath = "/TEMP/Log/";//文件夹项目路径
                    string FolderPath = HttpContext.Current.Server.MapPath(exportPath);//文件夹绝对路径
                    string LogAddress = DateTime.Now.ToString("yyyy-MM-dd") + "_Log.log";
                    string FilePath = HttpContext.Current.Server.MapPath(exportPath + LogAddress);//文件绝对路径
                    WriteLog(ex, FolderPath, FilePath);

                    for (int i = 0; i < ids.Count; i++)
                    {
                        bll.RunbyOASql("delete KYPM_Project_Fieyong where ID='" + ids[i] + "'");
                    }
                    context.Response.Write("error");
                }
            }
            else if (type == "saveInFieyongByTravel")
            {
                string ProjectID = YX.SSO.OATools.QueryString("ProjectID");
                string WorkID = YX.SSO.OATools.QueryString("WorkID");
                string result = YX.SSO.OATools.QueryString("result");
                result = result.TrimEnd('#');
                string[] resultList = result.Split('#');

                List<string> ids = new List<string>();
                try
                {
                    for (int i = 0; i < resultList.Length; i++)
                    {
                        result = resultList[i];
                        string ID = YX.SSO.BLL.CommonBLL.NewID("KYPM_Project_FieyongByTravel");
                        DataRow newRow;
                        newRow = bll.SelectOASql("select * from KYPM_Project_FieyongByTravel where 1=2").NewRow();
                        newRow["ID"] = ID;
                        newRow["WorkID"] = WorkID;
                        newRow["ProjectID"] = ProjectID;
                        newRow["Fee"] = result.Split('@')[12];
                        newRow["FeetestName"] = result.Split('@')[13];
                        newRow["CreateTime"] = result.Split('@')[15];
                        newRow["Time1"] = result.Split('@')[0];
                        newRow["Address1"] = result.Split('@')[1];
                        newRow["Time2"] = result.Split('@')[2];
                        newRow["Address2"] = result.Split('@')[3];
                        newRow["TravelTicket"] = result.Split('@')[4];
                        newRow["TravelTicketBill"] = result.Split('@')[5];
                        newRow["DailySub"] = result.Split('@')[6];
                        newRow["Days"] = result.Split('@')[7];
                        newRow["TripMoney"] = result.Split('@')[8];
                        newRow["Item"] = result.Split('@')[9];
                        newRow["OtherMoneyBill"] = result.Split('@')[10];
                        newRow["OtherMoney"] = result.Split('@')[11];
                        newRow["Bills"] = (Convert.ToInt16(result.Split('@')[5]) + Convert.ToInt16(result.Split('@')[10])).ToString();
                        newRow["Money"] = (float)(Convert.ToInt32(result.Split('@')[4]) + Convert.ToInt32(result.Split('@')[8]) + Convert.ToInt32(result.Split('@')[11]));
                        newRow["Contents"] = result.Split('@')[14];
                        newRow["DeleteMark"] = 0;
                        newRow["Status"] = 0;
                        bll.InsertOA(newRow, "KYPM_Project_FieyongByTravel");
                        ids.Add(ID);
                    }
                    context.Response.Write("1");
                }
                catch
                {
                    for (int i = 0; i < ids.Count; i++)
                    {
                        bll.RunbyOASql("delete KYPM_Project_FieyongByTravel where ID='" + ids[i] + "'");
                    }
                    context.Response.Write("error");
                }
            }
            else if (type == "updateInFieyong")
            {
                //string ProjectID = YX.SSO.OATools.QueryString("ProjectID");
                string WorkID = YX.SSO.OATools.QueryString("WorkID");
                string result = YX.SSO.OATools.QueryString("result");
                result = result.TrimEnd('#');
                string[] resultList = result.Split('#');
                try
                {
                    for (int i = 0; i < resultList.Length; i++)
                    {
                        result = resultList[i];
                        string sql = "update KYPM_Project_Fieyong set CreateTime='" + result.Split('@')[1] + "',Fee='" + result.Split('@')[2] + "',FeetestName='" + result.Split('@')[3] + "',Contents='" + result.Split('@')[4] + "',Quantity='" + result.Split('@')[5] + "',Money='" + result.Split('@')[6] + "',Remark='" + result.Split('@')[7] + "' where ID='" + result.Split('@')[0] + "'";
                        bll.RunbyOASql(sql);
                    }
                    context.Response.Write("1");
                }
                catch
                {
                    context.Response.Write("error");
                }
            }
            else if (type == "updateInFieyongByTravel")
            {
                //string ProjectID = YX.SSO.OATools.QueryString("ProjectID");
                string WorkID = YX.SSO.OATools.QueryString("WorkID");
                string result = YX.SSO.OATools.QueryString("result");
                result = result.TrimEnd('#');
                string[] resultList = result.Split('#');
                try
                {
                    for (int i = 0; i < resultList.Length; i++)
                    {
                        result = resultList[i];
                        string sql =
                            "update KYPM_Project_Fieyong set " +
                            "CreateTime='" + result.Split('@')[16] + "'," +
                            "Fee='" + result.Split('@')[13] + "'," +
                            "FeetestName='" + result.Split('@')[14] + "'," +
                            "Contents='" + result.Split('@')[15] + "'," +
                            "Bills='" + (Convert.ToInt16(result.Split('@')[6]) + Convert.ToInt16(result.Split('@')[7])).ToString() + "'," +
                            "Money='" + result.Split('@')[17] + "'," +
                            "Time1='" + result.Split('@')[1] + "'," +
                            "Address1='" + result.Split('@')[2] + "'," +
                            "Time2='" + result.Split('@')[3] + "'," +
                            "Address2='" + result.Split('@')[4] + "'," +
                            "TravelTicket='" + result.Split('@')[5] + "'," +
                            "TravelTicketBill='" + result.Split('@')[6] + "'," +
                            "DailySub='" + result.Split('@')[7] + "'," +
                            "Days='" + result.Split('@')[8] + "'," +
                            "TripMoney='" + result.Split('@')[9] + "'," +
                            "Item='" + result.Split('@')[10] + "'," +
                            "OtherMoneyBill='" + result.Split('@')[11] + "'," +
                            "OtherMoney='" + result.Split('@')[12] + "' " +
                            "where ID='" + result.Split('@')[0] + "'";
                        bll.RunbyOASql(sql);
                    }
                    context.Response.Write("1");
                }
                catch
                {
                    context.Response.Write("error");
                }
            }
            else if (type == "saveInFeeRecord")
            {
                List<string> ids = new List<string>();
                string ProjectID = YX.SSO.OATools.QueryString("ProjectID");
                string WorkID = YX.SSO.OATools.QueryString("WorkID");

                DataTable dt = bll.SelectOASql("select * from KYPM_Project_Fieyong where ProjectID='" + ProjectID + "' and WorkID='" + WorkID + "' and DeleteMark=0");
                if (dt.Rows.Count > 0)
                {
                    try
                    {
                        for (int i = 0; i < dt.Rows.Count; i++)
                        {
                            string ID = dt.Rows[i]["ID"].ToString();
                            string RecordID = YX.SSO.BLL.CommonBLL.NewID("KYPM_Project_FeeRecord");
                            string sql = "insert into KYPM_Project_FeeRecord(RecordID,ProjectID,FeeItem,RealAmount,RealDate,Summary,Remark,DeleteMark,STATUS) select '" + RecordID + "','C_' + ProjectID,Fee,Money,cast(CreateTime as datetime),Contents,Remark,0,1 from KYPM_Project_Fieyong where DeleteMark = 0 and ID = '" + ID + "'";
                            bll.RunbyOASql(sql);
                            ids.Add(RecordID);
                            bll.RunbyOASql("update KYPM_Project_Fieyong set Status=1 where ID='" + ID + "'");
                            //string sql2 = "update KYPM_Project_ContractFee set " + dt.Rows[i]["Fee"].ToString() + "=(" + dt.Rows[i]["Fee"].ToString() + " *10000-" + dt.Rows[i]["Money"].ToString() + ")/10000 where ProjectID='" + ProjectID + "'";
                            //bll.RunbyOASql(sql2);

                        }
                        context.Response.Write("1");
                    }
                    catch
                    {
                        for (int i = 0; i < ids.Count; i++)
                        {
                            bll.RunbyOASql("delete KYPM_Project_FeeRecord where RecordID='" + ids[i] + "'");
                        }
                        context.Response.Write("error");
                    }
                }
            }
            else if (type == "getFieYong")
            {
                //string ProjectID = YX.SSO.OATools.QueryString("ProjectID");
                string WorkID = YX.SSO.OATools.QueryString("WorkID");
                DataTable dt = bll.SelectOASql("select * from KYPM_Project_Fieyong where WorkID='" + WorkID + "' and DeleteMark=0");
                string json = getjosn2(dt);
                context.Response.Write(json);
            }
            else if (type == "getFieYongByTravel")
            {
                //string ProjectID = YX.SSO.OATools.QueryString("ProjectID");
                string WorkID = YX.SSO.OATools.QueryString("WorkID");
                DataTable dt = bll.SelectOASql("select * from KYPM_Project_FieyongByTravel where WorkID='" + WorkID + "' and DeleteMark=0");
                string json = getjosn2(dt);
                context.Response.Write(json);
            }
            else if (type == "getMoney")
            {
                string ProjectID = YX.SSO.OATools.QueryString("ProjectID");
                string Fee = YX.SSO.OATools.QueryString("Fee");
                string WorkID = YX.SSO.OATools.QueryString("WorkID");
                string Table = YX.SSO.OATools.QueryString("Table");
                string firstMoney = "0";
                string tempMoney = "0";
                string alreadMoney = "0";

                if (string.IsNullOrEmpty(ProjectID))
                {
                    DataTable getID = bll.SelectOASql("select * from " + Table + " where DeleteMark=0 and WorkID='" + WorkID + "'");
                    ProjectID = getID.Rows[0]["ProjectID"].ToString();
                }
                //已申请费用
                DataTable dt0 = bll.SelectOASql("select * from KYPM_Project_FeeRecord where ProjectID='C_" + ProjectID + "' and FeeItem='" + Fee + "' and  DeleteMark=0 and Status=1");
                if (dt0.Rows.Count > 0)
                {
                    if (!string.IsNullOrEmpty(dt0.Rows[0]["RealAmount"].ToString()))
                        alreadMoney = dt0.Rows[0]["RealAmount"].ToString();
                }
                //可用余额
                DataTable dt1 = bll.SelectOASql("select " + Fee + ",Fee01 as CountMoney from  KYPM_Project_ContractFee where ProjectID='" + ProjectID + "'");
                if (dt1.Rows.Count > 0)
                {
                    if (!string.IsNullOrEmpty(dt1.Rows[0][Fee].ToString()))
                    {
                        firstMoney = dt1.Rows[0][Fee].ToString();
                        firstMoney = (Convert.ToDouble(firstMoney) * 10000 - Convert.ToDouble(alreadMoney)).ToString("0.00");
                    }
                    else
                    {
                        firstMoney = dt1.Rows[0]["CountMoney"].ToString();
                        firstMoney = (Convert.ToDouble(firstMoney) * 10000 - Convert.ToDouble(alreadMoney)).ToString("0.00");
                    }
                }
                //在途金额
                DataTable dt2 = bll.SelectOASql("select sum(Money)as moneyCount from " + Table + " where ProjectID='" + ProjectID + "' and Fee='" + Fee + "' and WorkID<>'" + WorkID + "' and DeleteMark=0");
                if (dt2.Rows.Count > 0)
                {
                    if (!string.IsNullOrEmpty(dt2.Rows[0]["moneyCount"].ToString()))
                        tempMoney = dt2.Rows[0]["moneyCount"].ToString();
                }
                context.Response.Write(firstMoney + "@" + tempMoney);
            }
            else if (type == "getConstracCode")
            {
                string ProjectID = YX.SSO.OATools.QueryString("ProjectID");
                DataTable dt = bll.SelectOASql("select ContracCode from KYPM_Project_Contract where ProjectID='" + ProjectID + "'");
                if (dt.Rows.Count > 0)
                {
                    context.Response.Write(dt.Rows[0]["ContracCode"].ToString());
                }
                else
                {
                    context.Response.Write("");
                }
            }
            else if (type == "getProjectCode") {
                string ProjectID = YX.SSO.OATools.QueryString("ProjectID");
                DataTable dt = bll.SelectOASql("select ProjectCode from KYPM_Project_Contract where ProjectID='" + ProjectID + "' and DeleteMark=0");
                if (dt.Rows.Count > 0)
                {
                    context.Response.Write(dt.Rows[0]["ProjectCode"].ToString());
                }
                else
                {
                    context.Response.Write("");
                }
            }
        }
        public string getjosn(DataTable dt, int count)
        {
            string json = "{ \"code\": 0,\"msg\": \"\",\"count\":" + count + ",\"data\":" + Newtonsoft.Json.JsonConvert.SerializeObject(dt, Newtonsoft.Json.Formatting.None, new Newtonsoft.Json.Converters.DataTableConverter()) + "}";
            return json;
        }
        public string getjosn2(DataTable dt)
        {
            string json = "{ \"data\":" + Newtonsoft.Json.JsonConvert.SerializeObject(dt, Newtonsoft.Json.Formatting.None, new Newtonsoft.Json.Converters.DataTableConverter()) + "}";
            return json;
        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
        public void WriteLog(Exception ex, string FolderPath, string FilePath)
        {
            //如果日志文件为空，则默认在Debug目录下新建 YYYY-mm-dd_Log.log文件
            if (Directory.Exists(FolderPath) == false)
            {
                Directory.CreateDirectory(FolderPath);
            }

            if (File.Exists(FilePath) == false)
            {
                FileStream CreateFS = File.Create(FilePath);
                CreateFS.Close();

            }
            //把异常信息输出到文件
            StreamWriter fs = new StreamWriter(FilePath, true);
            fs.WriteLine("当前时间：" + DateTime.Now.ToString());
            fs.WriteLine("异常信息：" + ex.Message);
            fs.WriteLine("异常对象：" + ex.Source);
            fs.WriteLine("调用堆栈：\n" + ex.StackTrace.Trim());
            fs.WriteLine("触发方法：" + ex.TargetSite);
            fs.WriteLine();
            fs.Close();
        }
    }
}