using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using YX.DAL;
using YX.SSO.BLL;

namespace YX.TEMP.BLL
{
    public class FUNC
    {
        public DataTable SelectOASql(String Sql)
        {
            DBAccess dba = DBAccessFactory.CreateAccess(CommonBLL.dbname);
            string sql = Sql;
            return dba.ExecuteFillDataTable(sql);
        }
        public void RunbyOASql(String Sql)
        {
            DBAccess dba = DBAccessFactory.CreateAccess(CommonBLL.dbname);
            string sql = Sql;
            dba.ExecuteNonQuery(sql);
        }
        public void InsertOA(DataRow row, string tablename)
        {
            DBAccess dba = DBAccessFactory.CreateAccess(CommonBLL.dbname);
            DataRow lastrow = row;
            dba.ExecuteInsertSQL(lastrow, tablename);
        }
    }
}
