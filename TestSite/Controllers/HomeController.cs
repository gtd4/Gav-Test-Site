using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TestSite.Utilities;

namespace TestSite.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            DetectMobileBrowserUtil dmb = new DetectMobileBrowserUtil();
            var userAgent = Request.ServerVariables["HTTP_USER_AGENT"];

            if(dmb.IsMobile(userAgent))
            {
                return View("MobileIndex");
            }
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}