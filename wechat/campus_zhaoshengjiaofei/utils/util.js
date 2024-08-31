

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

function js_date_time(unixtime) {
  var dateTime = new Date(parseInt(unixtime))
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth();
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var second = dateTime.getSeconds();
  var now = new Date();
  var now_new = Date.parse(now.toDateString());  //typescript转换写法  
  var milliseconds = now_new - dateTime;
  var timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
  return timeSpanStr;
}  

function js_date(unixtime) {
  var dateTime = new Date(parseInt(unixtime))
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth();
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var second = dateTime.getSeconds();
  var now = new Date();
  var now_new = Date.parse(now.toDateString());  //typescript转换写法  
  var milliseconds = now_new - dateTime;
  var timeSpanStr = year + '-' + month + '-' + day;
  return timeSpanStr;
} 

//MakeInforFromIdCard();
function MakeInforFromIdCard(UUserCard)    {
    //获取出生日期
    var birthday = UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
    var yearmonth = UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12);
    //获取年龄
    var myDate = new Date();
    var month = myDate.getMonth() + 1;
    var day = myDate.getDate();
    var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
    if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
      age++;
    }
    var gendar = '';
    if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
      gendar = '男';
		} else {
      gendar = '女';
		}
    var RS = {};
    RS.birthday = birthday;
    RS.age = age;
    RS.gendar = gendar;
    RS.yearmonth = yearmonth;
    RS.number = UUserCard;
    //log(RS);
    return RS;
}

function GetMainData(hostLastUrl, PostData, searchfield, searchvalue, pageindex, callbackcount, callback) {
  let LOGIN_ACCESS_TOKEN    = getApp().globalData.LOGIN_ACCESS_TOKEN;
  let SYSTEM_URL = getApp().globalData.SYSTEM_URL + '' + hostLastUrl;
  //console.log(hostLastUrl);
  //console.log(SYSTEM_URL);
  wx.request({
    url: SYSTEM_URL,
    data: PostData,
    method: 'POST',
    header: { 'content-Type': 'application/x-www-form-urlencoded', 'Authorization': getApp().globalData.LOGIN_ACCESS_TOKEN },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    },
    fail(res) {
        console.log('GetMainData 请求失败')
    }
  })
}

function GetHeaderData(hostLastUrl, DATA, callback) {
  let LOGIN_ACCESS_TOKEN = getApp().globalData.LOGIN_ACCESS_TOKEN;
  let SYSTEM_URL = getApp().globalData.SYSTEM_URL + '' + hostLastUrl;
  wx.request({
    url: SYSTEM_URL,
    data: {
      DATA: DATA,
    },
    method: 'POST',
    header: { 'content-Type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      if (res.statusCode == 200) {
        callback(res.data);
      }
    },
    fail(res) {
        console.log('GetHeaderData 请求失败')
    }
  })
}

function downloadFile(mUrl) {
  wx.downloadFile({
    url: mUrl,
    type: 'image',
    success: function (res) {
      log("download success " + res.tempFilePath);
    },
    fail: function (res) {
      log("download fail");
    },
    complete: function (res) {
      log("download complete " + res.tempFilePath);
    }
  })
}

function getCurrentPageUrl() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  return url
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  var options = currentPage.options    //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = "";
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  var RS  = {};
  RS.url  = url;
  RS.args = urlWithArgs;
  RS.allurl = url + '?' + urlWithArgs;
  RS.options = options;

  return RS;
}

function BankCardNumber19Check(bankno)		{
  if (bankno.length != 19) return false;
  var lastNum = bankno.substr(bankno.length - 1, 1);//取出最后一位（与luhn进行比较）
  var first15Num = bankno.substr(0, bankno.length - 1);//前15或18位
  var newArr = new Array();
  for (var i = first15Num.length - 1; i > -1; i--) {    //前15或18位倒序存进数组
    newArr.push(first15Num.substr(i, 1));
  }
  var arrJiShu = new Array();  //奇数位*2的积 <9
  var arrJiShu2 = new Array(); //奇数位*2的积 >9

  var arrOuShu = new Array();  //偶数位数组
  for (var j = 0; j < newArr.length; j++) {
    if ((j + 1) % 2 == 1) {//奇数位
      if (parseInt(newArr[j]) * 2 < 9)
        arrJiShu.push(parseInt(newArr[j]) * 2);
      else
        arrJiShu2.push(parseInt(newArr[j]) * 2);
    }
    else //偶数位
      arrOuShu.push(newArr[j]);
  }

  var jishu_child1 = new Array();//奇数位*2 >9 的分割之后的数组个位数
  var jishu_child2 = new Array();//奇数位*2 >9 的分割之后的数组十位数
  for (var h = 0; h < arrJiShu2.length; h++) {
    jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
    jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
  }

  var sumJiShu = 0; //奇数位*2 < 9 的数组之和
  var sumOuShu = 0; //偶数位数组之和
  var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
  var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
  var sumTotal = 0;
  for (var m = 0; m < arrJiShu.length; m++) {
    sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
  }

  for (var n = 0; n < arrOuShu.length; n++) {
    sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
  }

  for (var p = 0; p < jishu_child1.length; p++) {
    sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
    sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
  }
  //计算总和
  sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);

  //计算luhn值
  var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
  var luhn = 10 - k;

  if (lastNum == luhn) {
    return true;
  }
  else {
    return false;
  }
}

function array_flip(trans) {
  var key;
  var tmpArr = {};
  for (key in trans) {
    if (!trans.hasOwnProperty(key)) {
      continue
    }
    var value = trans[parseInt(key)];
    tmpArr[value] = parseInt(key);
  }
  return tmpArr;
}

function array_keys(trans) {
  var key;
  var tmpArr = [];
  var index = 0;
  for (key in trans) {
    tmpArr[index] = key;
    index = index + 1;
  }
  return tmpArr;
}

function array_values(trans) {
  var key;
  var tmpArr = [];
  var index = 0;
  for (key in trans) {
    tmpArr[index] = trans[key];
    index = index + 1;
  }
  return tmpArr;
}

function array_values_idname2name(trans) {
  var key;
  var tmpArr = [];
  var index = 0;
  for (key in trans) {
    tmpArr[index] = trans[key]['name'];
    index = index + 1;
  }
  return tmpArr;
}

function array_values_idname2id(trans) {
  var key;
  var tmpArr = [];
  var index = 0;
  for (key in trans) {
    tmpArr[index] = trans[key]['id'];
    index = index + 1;
  }
  return tmpArr;
}

function log(e)     {
  var isLog = getApp().globalData.isLog;
  if (isLog)  console.log(e);
}

function utf16to8(str) {
  var out, i, len, c;
  out = "";
  len = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i);
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    }
  }
  return out;
}
function utf8to16(str) {
  var out, i, len, c;
  var char2, char3;
  out = "";
  len = str.length;
  i = 0;
  while (i < len) {
    c = str.charCodeAt(i++);
    switch (c >> 4) {
      case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
        // 0xxxxxxx
        out += str.charAt(i - 1);
        break;
      case 12: case 13:
        // 110x xxxx   10xx xxxx
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x0F) << 12) |
          ((char2 & 0x3F) << 6) |
          ((char3 & 0x3F) << 0));
        break;
    }
  }
  return out;
}

function stringToJson(data) {
  return JSON.parse(data);
}

function jsonToString(data) {
  return JSON.stringify(data);
}
function mapToJson(map) {
  return JSON.stringify(strMapToObj(map));
}
function jsonToMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
}
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k, v] of strMap) {
    obj[k] = v;
  }
  return obj;
}
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}
function objToStrUrl(obj) {
  var url = '';
  for (let k of Object.keys(obj)) {
    var v = obj[k];
    if (v == "undefined") {
      v = '';
    }
    url = url + "&" + k + "=" + v;
  }
  return url;
}
function objToStrUrlHeader(obj) {
  var url = '';
  for (let k of Object.keys(obj)) {
    var v = obj[k];
    if (v == "undefined") {
      v = '';
    }
    url = url + "&" + k + "=" + v;
  }
  return url;
}

function urltojson(url) {
  try {
    url = "?" + url;//此函数要求URL中必须包含一个?
    var index = url.indexOf('?');
    console.log(index)
    url = url.match(/\?([^#]+)/)[1];
    var obj = {}, arr = url.split('&');
    for (var i = 0; i < arr.length; i++) {
      var subArr = arr[i].split('=');
      var key = decodeURIComponent(subArr[0]);
      var value = decodeURIComponent(subArr[1]);
      obj[key] = value;
    }
    return obj;
  } catch (err) {
    return null;
  }
}

function decodeAllBase64Url(url)                {
  try {
    url = "?" + url;//此函数要求URL中必须包含一个?
    var index = url.indexOf('?');
    url = url.match(/\?([^#]+)/)[1];
    var obj = {}, arr = url.split('&');
    for (var i = 0; i < arr.length; i++)      {
      var subArr = arr[i].split('=');
      var key = decodeURIComponent(subArr[0]);
      //判断KEY是否为BASE64加密过的字符
      var isBase64Var = base64decode(key);
      if(isBase64Var.indexOf("&") != -1)    {
        //说明KEY里面的值为BASE64需要做解密处理.
        var DecodeBase64arr = isBase64Var.split('&');
        for (var ii = 0; ii < DecodeBase64arr.length; ii++) {
          var subArr  = DecodeBase64arr[ii].split('=');
          var keyX    = decodeURIComponent(subArr[0]);
          var valueX  = decodeURIComponent(subArr[1]);
          obj[keyX]   = valueX;
        }
        //obj[key] = DecodeBase64;
        //console.log(DecodeBase64);
      }
      else      {      
        var value = decodeURIComponent(subArr[1]);
        obj[key]  = value;
      }
    }
    return obj;

  } catch (err) {
    return null;
  }
}


var BASE64_MAPPING = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
  'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
  'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
  'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
  'w', 'x', 'y', 'z', '0', '1', '2', '3',
  '4', '5', '6', '7', '8', '9', '+', '/'
];

/**
 *ascii convert to binary
 */
var _toBinary = function (ascii) {
  var binary = new Array();
  while (ascii > 0) {
    var b = ascii % 2;
    ascii = Math.floor(ascii / 2);
    binary.push(b);
  }
  /*
  var len = binary.length;
  if(6-len > 0){
    for(var i = 6-len ; i > 0 ; --i){
      binary.push(0);
    }
  }*/
  binary.reverse();
  return binary;
};

/**
 *binary convert to decimal
 */
var _toDecimal = function (binary) {
  var dec = 0;
  var p = 0;
  for (var i = binary.length - 1; i >= 0; --i) {
    var b = binary[i];
    if (b == 1) {
      dec += Math.pow(2, p);
    }
    ++p;
  }
  return dec;
};

/**
 *unicode convert to utf-8
 */
var _toUTF8Binary = function (c, binaryArray) {
  var mustLen = (8 - (c + 1)) + ((c - 1) * 6);
  var fatLen = binaryArray.length;
  var diff = mustLen - fatLen;
  while (--diff >= 0) {
    binaryArray.unshift(0);
  }
  var binary = [];
  var _c = c;
  while (--_c >= 0) {
    binary.push(1);
  }
  binary.push(0);
  var i = 0, len = 8 - (c + 1);
  for (; i < len; ++i) {
    binary.push(binaryArray[i]);
  }

  for (var j = 0; j < c - 1; ++j) {
    binary.push(1);
    binary.push(0);
    var sum = 6;
    while (--sum >= 0) {
      binary.push(binaryArray[i++]);
    }
  }
  return binary;
};

var __BASE64 = {
  /**
   *BASE64 Encode
   */
  encoder: function (str) {
    var base64_Index = [];
    var binaryArray = [];
    for (var i = 0, len = str.length; i < len; ++i) {
      var unicode = str.charCodeAt(i);
      var _tmpBinary = _toBinary(unicode);
      if (unicode < 0x80) {
        var _tmpdiff = 8 - _tmpBinary.length;
        while (--_tmpdiff >= 0) {
          _tmpBinary.unshift(0);
        }
        binaryArray = binaryArray.concat(_tmpBinary);
      } else if (unicode >= 0x80 && unicode <= 0x7FF) {
        binaryArray = binaryArray.concat(_toUTF8Binary(2, _tmpBinary));
      } else if (unicode >= 0x800 && unicode <= 0xFFFF) {//UTF-8 3byte
        binaryArray = binaryArray.concat(_toUTF8Binary(3, _tmpBinary));
      } else if (unicode >= 0x10000 && unicode <= 0x1FFFFF) {//UTF-8 4byte
        binaryArray = binaryArray.concat(_toUTF8Binary(4, _tmpBinary));
      } else if (unicode >= 0x200000 && unicode <= 0x3FFFFFF) {//UTF-8 5byte
        binaryArray = binaryArray.concat(_toUTF8Binary(5, _tmpBinary));
      } else if (unicode >= 4000000 && unicode <= 0x7FFFFFFF) {//UTF-8 6byte
        binaryArray = binaryArray.concat(_toUTF8Binary(6, _tmpBinary));
      }
    }

    var extra_Zero_Count = 0;
    for (var i = 0, len = binaryArray.length; i < len; i += 6) {
      var diff = (i + 6) - len;
      if (diff == 2) {
        extra_Zero_Count = 2;
      } else if (diff == 4) {
        extra_Zero_Count = 4;
      }
      //if(extra_Zero_Count > 0){
      //	len += extra_Zero_Count+1;
      //}
      var _tmpExtra_Zero_Count = extra_Zero_Count;
      while (--_tmpExtra_Zero_Count >= 0) {
        binaryArray.push(0);
      }
      base64_Index.push(_toDecimal(binaryArray.slice(i, i + 6)));
    }

    var base64 = '';
    for (var i = 0, len = base64_Index.length; i < len; ++i) {
      base64 += BASE64_MAPPING[base64_Index[i]];
    }

    for (var i = 0, len = extra_Zero_Count / 2; i < len; ++i) {
      base64 += '=';
    }
    return base64;
  },
  /**
   *BASE64  Decode for UTF-8 
   */
  decoder: function (_base64Str) {
    var _len = _base64Str.length;
    var extra_Zero_Count = 0;
    /**
     *计算在进行BASE64编码的时候，补了几个0
     */
    if (_base64Str.charAt(_len - 1) == '=') {
      //alert(_base64Str.charAt(_len-1));
      //alert(_base64Str.charAt(_len-2));
      if (_base64Str.charAt(_len - 2) == '=') {//两个等号说明补了4个0
        extra_Zero_Count = 4;
        _base64Str = _base64Str.substring(0, _len - 2);
      } else {//一个等号说明补了2个0
        extra_Zero_Count = 2;
        _base64Str = _base64Str.substring(0, _len - 1);
      }
    }

    var binaryArray = [];
    for (var i = 0, len = _base64Str.length; i < len; ++i) {
      var c = _base64Str.charAt(i);
      for (var j = 0, size = BASE64_MAPPING.length; j < size; ++j) {
        if (c == BASE64_MAPPING[j]) {
          var _tmp = _toBinary(j);
          /*不足6位的补0*/
          var _tmpLen = _tmp.length;
          if (6 - _tmpLen > 0) {
            for (var k = 6 - _tmpLen; k > 0; --k) {
              _tmp.unshift(0);
            }
          }
          binaryArray = binaryArray.concat(_tmp);
          break;
        }
      }
    }

    if (extra_Zero_Count > 0) {
      binaryArray = binaryArray.slice(0, binaryArray.length - extra_Zero_Count);
    }

    var unicode = [];
    var unicodeBinary = [];
    for (var i = 0, len = binaryArray.length; i < len;) {
      if (binaryArray[i] == 0) {
        unicode = unicode.concat(_toDecimal(binaryArray.slice(i, i + 8)));
        i += 8;
      } else {
        var sum = 0;
        while (i < len) {
          if (binaryArray[i] == 1) {
            ++sum;
          } else {
            break;
          }
          ++i;
        }
        unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 1, i + 8 - sum));
        i += 8 - sum;
        while (sum > 1) {
          unicodeBinary = unicodeBinary.concat(binaryArray.slice(i + 2, i + 8));
          i += 8;
          --sum;
        }
        unicode = unicode.concat(_toDecimal(unicodeBinary));
        unicodeBinary = [];
      }
    }
    return unicode;
  }
};


function base64encode(EnCodeText) {
  if(EnCodeText=="" || EnCodeText==undefined) return "";
  var aaa = __BASE64.encoder(EnCodeText);
  return aaa;
}

function base64decode(EnCodeText) {
  if(EnCodeText=="" || EnCodeText==undefined) return "";
  var aaa = __BASE64.decoder(EnCodeText);
  var res = String.fromCharCode.apply(null, new Uint16Array(aaa));
  return res;
}

function idcard_checksum18(code) {
  //身份证号合法性验证
  //支持15位和18位身份证号
  //支持地址编码、出生日期、校验位验证
  var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
  if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(code)) {
    return false;
  } else if (!city[code.substr(0, 2)]) {
    return false;
  } else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      if (parity[sum % 11] != code[17].toUpperCase()) {
        return false;
      }
    }
  }
  return true;
}

function isString(str) {
  return (typeof str == 'string') && str.constructor == String;
} 

function isArray(obj) {
  return (typeof obj == 'object') && obj.constructor == Array;
} 

function isFunction(obj) {
  return (typeof obj == 'function') && obj.constructor == Function;
} 

function isObject(obj) {
  return (typeof obj == 'object') && obj.constructor == Object;
} 

function isDate(obj) {
  return (typeof obj == 'object') && obj.constructor == Date;
} 

function isNumber(obj) {
  return (typeof obj == 'number') && obj.constructor == Number;
} 

function nl2br(str) {
  return str.replace(/\n/g, '<BR>');
} 

function decodehtml(url) {
  //console.log("转义字符:", url);
  //如果为空或是未定义,则返回空值.
  if (url == undefined || url == '')   {
    return '';
  }
  //如果对数组或是对象,直接返回原值.
  if (!isString(url)) {
    return url;
  }
  url = url.replace(/&#039;/g, "'");
  url = url.replace(/&quot;/g, '"');
  url = url.replace(/&amp;/g, '&');
  url = url.replace(/&lt;/g, '<');
  url = url.replace(/&gt;/g, '>');
  url = url.replace(/&nbsp;/g, ' ');
  return url;
}

function escape2Html(str) {
  //目前没有使用,字符替换操作直接在服务器上面做了替换.所以不需要在此做处理.
  var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', '&quot;': '"' };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; }).replace('<section', '<div').replace('<img', '<img style="max-width:100%;height:auto" ');
}

//通达OA文件存储规则.
function tdoafileformatevalue_addfile(TDOAfile,ID,NAME,YM)       {
  if (ID!=''&&ID!=undefined)      {
    var TDOAfileArray = TDOAfile.split("||"); 
    if (TDOAfileArray[0] == undefined) TDOAfileArray[0] = "";
    if (TDOAfileArray[1] == undefined) TDOAfileArray[1] = "";
    var RES = TDOAfileArray[0] + NAME + "*||" + TDOAfileArray[1] + YM + "_"  + ID + "," ;
    return RES;
  }
  else  {
    return TDOAfile;
  }
}

function showModal(title = '提示', content = '软件出现异常,请与软件开发商联系.', addition=''){
  wx.showModal({
    title: title,
    content: content,
    showCancel:false,
    success(res) {
      if (res.confirm && addition=='goback')        {
        wx.navigateBack({ 
          delta: 1 
        });
      }
    }
  })
}

function in_array(search, array) {
  for (var i in array) {
    if (array[i] == search) {
      return true;
    }
  }
  return false;
}

module.exports = {
  formatTime: formatTime,
  js_date_time: js_date_time,
  js_date: js_date,
  GetMainData: GetMainData,
  GetHeaderData: GetHeaderData,
  MakeInforFromIdCard: MakeInforFromIdCard,
  downloadFile: downloadFile,
  getCurrentPageUrl: getCurrentPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs,
  BankCardNumber19Check: BankCardNumber19Check,
  array_flip: array_flip,
  log: log,
  base64decode: base64decode,
  base64encode: base64encode,
  utf16to8: utf16to8,
  utf8to16: utf8to16,
  stringToJson: stringToJson,
  jsonToString: jsonToString,
  mapToJson: mapToJson,
  jsonToMap: jsonToMap,
  strMapToObj: strMapToObj,
  objToStrMap: objToStrMap,
  objToStrUrl: objToStrUrl,
  urltojson: urltojson,
  decodeAllBase64Url: decodeAllBase64Url,
  idcard_checksum18: idcard_checksum18,
  array_keys: array_keys,
  array_values: array_values,
  array_values_idname2name: array_values_idname2name,
  array_values_idname2id: array_values_idname2id,
  escape2Html: escape2Html,
  tdoafileformatevalue_addfile: tdoafileformatevalue_addfile,
  objToStrUrlHeader: objToStrUrlHeader,
  showModal: showModal,
  decodehtml: decodehtml,

  isString: isString,
  isArray: isArray,
  isFunction: isFunction,
  isObject: isObject,
  isDate: isDate,
  isNumber: isNumber,
  nl2br: nl2br,
  in_array: in_array,

}
