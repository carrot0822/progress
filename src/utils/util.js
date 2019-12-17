 function formatTime(times, fmt) {
  let obj = new Date(times)
  var o = {
      "M+": obj.getMonth() + 1, //月份
      "d+": obj.getDate(), //日
      "h+": obj.getHours(), //小时
      "m+": obj.getMinutes(), //分
      "s+": obj.getSeconds(), //秒
      "q+": Math.floor((obj.getMonth() + 3) / 3), //季度
      "S": obj.getMilliseconds() //毫秒
  };

  if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (obj.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
              RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
  }

  return fmt;
}


function filterNull(obj) {
  for (let key in obj) {
    if (obj[key]) {

    } else {
      obj[key] = '无数据'
    }
  }
}

module.exports = {
  formatTime: formatTime
}


/**
 * 微信小程序class的应用
 * e.target.dataset的使用
 * 下拉加载等使用
 * onshow
 * 封装vue router的一些方法
 */