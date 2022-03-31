using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.SessionState;
using YX.Security;
using YX.TEMP.BLL;

namespace YX.TEMP.TEMP.ZNS
{
    /// <summary>
    /// getdata 的摘要说明
    /// </summary>
    public class getdata : IHttpHandler, IReadOnlySessionState
    {
        FUNC bll = new FUNC();
        public void ProcessRequest(HttpContext context)
        {
            UserInfo CurrentUserInfo = BasePage.GetUserInfo();
            string type = YX.SSO.OATools.QueryString("type");
            if (type == "getQQ")
            {
                DataTable dt = bll.SelectOASql("select Attribute1 from Base_EntryData where EntryID= (select EntryID from Base_Entry where EntryCode='QQNumber' and DeleteMark=0)");
                if (dt.Rows.Count > 0)
                {
                    context.Response.Write(dt.Rows[0]["Attribute1"].ToString());
                }
                else
                {
                    context.Response.Write("");
                }
            }
            else if (type == "comparePassword")
            {
                string Password= YX.Common.Arithmetic.Hash(YX.SSO.OATools.QueryString("Password"));
                DataTable dt = bll.SelectOASql("select Password from Sys_user where UserID='" + CurrentUserInfo.UserID + "'");
                if (dt.Rows.Count > 0)
                {
                    if (dt.Rows[0]["Password"].ToString() == Password)
                    {
                        context.Response.Write("1");
                    }
                }
            }
            else if (type == "editPassword")
            {
                string Password = YX.Common.Arithmetic.Hash(YX.SSO.OATools.QueryString("Password"));
                bll.RunbyOASql("update Sys_User set Password='" + Password + "' where UserID='" + CurrentUserInfo.UserID + "'");
                context.Response.Write("1");
            }
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