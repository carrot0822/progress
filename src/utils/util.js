const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function filterNull(obj){
  for(let key in obj){
    if(obj[key]){

    }else{
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