//以下为通用代码.
import * as echarts from '../ec-canvas/echarts';
var WxParse = require('../wxParse/wxParse.js');
var util = require('../utils/util.js');
var bmap = require('../libs/bmap-wx.min.js');
var wxMarkerData = [];
var app = getApp();


let handler = {
  data: {
    //Setting
    AnonymousUserPageList: ['ZhuanYe','ZhuanYeView','News','NewsView','Notify'],
    //INIT
    searchFieldValue: '',        //需要搜索的字符  
    searchFieldName: '',         //搜索的字段名称
    searchMenuFieldArray: {},       //搜索的字段的值
    actionValue: 'init_default',//默认的初始化参数
    searchShenHeWord: '',     //默认的批量审核内容
    menuOperation: '',       //审核项目的选项
    ChooseRecord: '',       //多选选中的值
    pageMainList: [],       //放置返回数据的数组  
    isFirstGetData: true,   // 用于判断pageMainList数组是不是空数组，默认true，空的数组  
    pageid: 0,              // 设置加载的第几次，默认是第一次  
    pageIdEdit:'',
    callbackcount: 5,       //返回数据的个数  
    searchLoading: false,   //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    scrollHeight: 0,        //整个页面高度
    PageID: 0,              //值一般为0-15,表示最多16个页面,后面有变量会进行赋值.此变量主要用于在界定缓存中哪个URL接口地址是当前页面所需要的.所以此变量非常重要和特殊
    PageURL: "",            //此变量主要用于在界定缓存中哪个URL接口地址是当前页面所需要的.所以此变量非常重要和特殊
    PageGetUrl: "",
    PageHeaderNAME: "",      //列表页面头部TITLE显示.
    PageNoHeader: "",
    NewActionName: "",      //列表页面里面存放的右上按钮的名称
    NewActionUrl:"",        //列表页面里面存放的右上按钮的URL值
    menuDefault:"",
    IsShowBackGroundColor: false,
    operationHiddenPriv: true,
    searchHiddenPriv: true,
    headerHiddenPriv: false,
    pageListHiddenPriv: true,
    pageMemoHiddenPriv: true,
    LOGIN_ACCESS_TOKEN: getApp().globalData.LOGIN_ACCESS_TOKEN,
    pageActionView:false,
    pageActionViewNewsOrNotify: 'ListTemplate1',
    pageActionAddEdit:false,
    pageActionInit: false,
    pageActionInitNewsOrNotify: 'ListTemplate1',
    pageActionNews: false,
    pageActionNotify: false,
    //ADDEDIT
    BMapAK: "Hx1cMSuB2dMPyF7zGBU35Udx40cgkarb", //填写申请到的ak   
    BMapShow: true,
    location: "",
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    CheckIDCardArray: ['身份证号', '护照号'],
    CheckIDCardIndex: 1,
    userInfo: [],
    region: ['广东省', '广州市', '海珠区'],
    region1: ['广东省', '广州市', '海珠区'],
    customItem: '全部',
    show: false,
    focusId: '',
    hiddenLoading: true,
    formsubmit: 0,
    filterToSubmit:{},
    CSRF_TOKEN: '',
    alldata:{},
    uploadImageList: [],    //上传图片时候所使用的临时变量
    TwoSelect_one: '',      //二级下拉的第一级临时使用变量
    TwoSelect_two: '',      //二级下拉的第一级临时使用变量
    ThreeSelect_one: '',    //三级下拉的第一级临时使用变量
    ThreeSelect_two: '',    //三级下拉的第一级临时使用变量
    ThreeSelect_three: '',  //三级下拉的第一级临时使用变量
    IcampusRowColor: { "red": "crimson", "green": "green", "blue": "rgb(10, 59, 206)", "pink": "rgb(236, 49, 149)", "brown": "darkred"},
  },

  BindTapButtonView: function (e) {
    let that = this;
    var url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url + '' + that.data.searchFieldValue,
    });
  },

  //列表页面多选框选中之后,把页首的下拉框换为操作框,取消选择以后,把下拉框显示出来.
  BindTapCheckbox: function (e) {
    var ChooseRecord = e.detail.value;
    var ChooseRecordNumber = ChooseRecord.length;
    this.data.ChooseRecord = ChooseRecord;
    //util.log(ChooseRecord);
    //util.log(ChooseRecordNumber);
    //此变量赋值写法比较特殊,是利用变量指针,对动态变量进行赋值.
    let that = this;
    let updateData = {};
    var showFieldRange = e.currentTarget.dataset.range;
    var showFieldId = e.currentTarget.dataset.id;
    if (ChooseRecordNumber == 0) {
      //没有任何一个值被选中,则显示下拉框
      updateData['operationHiddenPriv'] = true;//审核
    }
    else {
      //选中其中一个记录时,则把审批区域的信息显示出来.
      updateData['operationHiddenPriv'] = true;//原有值是:false
    }
    updateData['menuOperation.number'] = ChooseRecordNumber + "条";
    that.setData(updateData);
  },

  每行记录删除操作: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '您真的要删除当前选中的记录么?',
      success: function (res) {
        util.log(res);
        if (res.confirm) {
          that.每行记录删除操作_实际删除(e);
          util.log('用户点击确定');
        } 
        else if (res.cancel) {
          util.log('用户点击取消');
        }
      }
    });
  },

  //列表模板的真实删除操作
  每行记录删除操作_实际删除: function (e) {
    let that = this;
    var PostData = {};
    PostData['T'] = "T"; 
    PostData['JSON'] = "1";
    
    PostData['openid'] = getApp().globalData.openid;
    PostData['unionid'] = getApp().globalData.unionid;
    PostData['DATETIME'] = new Date().getTime();
    PostData['LOGIN_SCHOOL_ID'] = getApp().globalData.LOGIN_SCHOOL_ID;
    PostData['SYSTEM_IS_CLOUD'] = getApp().globalData.SYSTEM_IS_CLOUD;
    PostData['SYSTEM_APPSTORE_ID'] = getApp().globalData.SYSTEM_APPSTORE_ID;
    PostData['selectedRows'] = e.currentTarget.dataset.id;
    
    console.log(e.currentTarget.dataset)

    var CSRF_TOKEN = wx.getStorageSync('DANDIAN_CSRF_TOKEN_CONTENT_'+e.currentTarget.dataset.pageid) || ''

    var url = getApp().globalData.SYSTEM_URL + that.data.PageURL + e.currentTarget.dataset.deleteurl;
    
    wx.request({  //提交表单数据
      url: url,//字段列表
      data: PostData,     //
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Authorization': getApp().globalData.LOGIN_ACCESS_TOKEN+"::::"+CSRF_TOKEN
      },
      success: function (res) {
        util.log('delete return:');
        util.log(res);
        wx.showToast({
          title: res.data['msg'],
          icon: 'success',
          duration: 2000,
        });
      }
    })
    //此变量赋值写法比较特殊,是利用变量指针,对动态变量进行赋值.
    //刷新当前页面.
    that.onLoadData(that.data.PageGetUrl, 'reload');
  },

  ////列表模板的批量审核内容输入事件--未实现
  bindShenHeWordInput: function (e) {
    util.log("输入框事件")
    this.setData({
      searchShenHeWord: e.detail.value,
    });
    this.data.searchShenHeWord = e.detail.value;
  },

  //列表模板的批量审核选项-下拉菜单事件--未实现
  selectmenuOperation: function (e) {
    //此变量赋值写法比较特殊,是利用变量指针,对动态变量进行赋值.
    let that = this;
    let updateData = {};
    var showFieldRange = e.currentTarget.dataset.range;
    var showFieldId = e.currentTarget.dataset.id;
    updateData['menuOperation.value'] = e.detail.value;
    updateData['menuOperation.chooseName'] = showFieldRange[e.detail.value];
    that.setData(updateData);
    //重置当前页面变量
    that.data.ShenHeItemName = showFieldRange[e.detail.value];
    util.log(that.data.ShenHeItemName);
  },

  //列表模板的点击批量审核按钮事件--未实现
  PiLiangShenHekeywordSearch: function (e) {
    let that = this;
    //必须至少选中一条记录
    var ChooseRecord = that.data.ChooseRecord;
    if (ChooseRecord.length == 0) {
      //提醒用户需要选项审核项
      var memo = "没有选中记录";
      wx.showToast({
        title: memo,
        icon: 'success',
        duration: 2000,
      });
      return false;
    }
    var searchShenHeWord = that.data.searchShenHeWord;
    if (searchShenHeWord == '') {
      //提醒用户需要选项审核项
      var memo = "审核内容必填";
      wx.showToast({
        title: memo,
        icon: 'success',
        duration: 2000,
      });
      return false;
    }
    //util.log(that.data.searchShenHeWord);
    var ShenHeItemName = that.data.ShenHeItemName;
    if (ShenHeItemName == '点击选择审核项') {
      //提醒用户需要选项审核项
      var memo = "请先选择审核项";
      wx.showToast({
        title: memo,
        icon: 'success',
        duration: 2000,
      });
      return false;
    }
    else {
      //提交数据进行审核操作
      //得到ACTION的变量
      var menuOperation = that.data.menuOperation;//取出变量
      var OperationNameToCode = menuOperation.keys;//得到名称到CODE的数组
      var actionName = OperationNameToCode[ShenHeItemName];//得到实际ACTION的值
      //得到SELECTID的值
      var pageMainList2 = that.data.pageMainList;
      var ChooseRecord = that.data.ChooseRecord;
      var SELECTID_TEXT = "";
      for (var i = 0, len = ChooseRecord.length; i < len; ++i) {
        var ChooseRecordIDIndex = ChooseRecord[i];
        var ChooseRecordIDValue = pageMainList2[ChooseRecordIDIndex].key;
        if (SELECTID_TEXT == "") {
          SELECTID_TEXT = ChooseRecordIDValue;
        }
        else {
          SELECTID_TEXT = SELECTID_TEXT + ',' + ChooseRecordIDValue;
        }
        util.log(SELECTID_TEXT); util.log(ChooseRecordIDValue);
      }
      //util.log(that.data.pageMainList);
      //得到审核内容的值
      var searchShenHeWord = that.data.searchShenHeWord;
      //形成实际的URL
      var actionURL = "?asdf&action=" + actionName + "&selectid=" + SELECTID_TEXT + "&SHENHEYIJIAN_ID=" + searchShenHeWord + "&adsfasd";
      //ActionBase64Text 变量不需要在此定义,是固定的值,在PHP代码中定义即可.
      var url = getApp().globalData.SYSTEM_URL + that.data.PageURL + actionURL;
      util.log(url);
      wx.request({  //提交表单数据
        url: url,//字段列表
        data: e.detail.value,     //
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {// 设置请求的 header
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Authorization': getApp().globalData.LOGIN_ACCESS_TOKEN
        },
        success: function (res) {
          //util.log('submit success');
          //util.log(res);
          var status = res.data.status;
          var result = res.data.result;
          wx.showToast({
            title: result,
            icon: 'success',
            duration: 2000,
          });
        }
      });
      //重置选中的选项的值
      that.data.ChooseRecord = '';
      var updateData = {};
      updateData['menuOperation.number'] = '';
      updateData['searchShenHeWord'] = '';
      that.setData(updateData);
      //再次刷新数据
      this.setData({
        pageid: 0,   //第一次加载，设置0 
        pageMainList: [],  //放置返回数据的数组,设为空  
        isFirstGetData: true,  //第一次加载，设置true  
        searchLoading: true,  //把"上拉加载"的变量设为true，显示  
        searchLoadingComplete: false, //把“没有数据”设为false，隐藏  
      })
      this.data.actionValue = 'init_default';
      this.fetchInitPageList();
      return true;
    }//end else

  },


  //列表模板的搜索区域下拉列表
  selectListHeaderMenuSearch: function (e) {
    //此变量赋值写法比较特殊,是利用变量指针,对动态变量进行赋值.
    let that = this;
    let updateData = {};
    var showFieldRange = e.currentTarget.dataset.range;
    console.log("showFieldRange")
    console.log(showFieldRange)
    updateData['menuSearch.value'] = e.detail.value;
    updateData['menuSearch.chooseName'] = showFieldRange[e.detail.value]['label'];
    that.setData(updateData);
    //更新当前页面变量
    that.data.searchFieldName = showFieldRange[e.detail.value]['value'];
  },

  //列表模板的搜索区域输入框
  bindKeywordInput: function (e) {
    this.setData({
      searchFieldValue: e.detail.value,
    });
    this.data.searchFieldValue = e.detail.value;
  },

  //列表模板的次级下拉
  SelectMenuOneHeader: function (e) {
    var id = e.currentTarget.id, list = this.data.filter;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (i == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      menuTwo: list
    });
  },

  //列表模板分组过滤
  FilterInList: function (e) {
    this.setData({
        pageid: 0,   //第一次加载，设置0 
        pageMainList: [],  //放置返回数据的数组,设为空  
        isFirstGetData: true,  //第一次加载，设置true  
        searchLoading: true,  //把"上拉加载"的变量设为true，显示  
        searchLoadingComplete: false, //把“没有数据”设为false，隐藏  
    })
    this.data.actionValue = 'init_default';
    let filterToSubmit = this.data.filterToSubmit
    var filtername = e.currentTarget.dataset.filtername;
    var listvalue = e.currentTarget.dataset.listvalue;
    filterToSubmit[filtername] = listvalue
    this.data.filterToSubmit = filterToSubmit
    this.fetchInitPageList();
  },

  //列表模板字段查询
  FieldSearch: function (e) {
    this.setData({
        pageid: 0,   //第一次加载，设置0 
        pageMainList: [],  //放置返回数据的数组,设为空  
        isFirstGetData: true,  //第一次加载，设置true  
        searchLoading: true,  //把"上拉加载"的变量设为true，显示  
        searchLoadingComplete: false, //把“没有数据”设为false，隐藏  
    })
    this.data.actionValue = 'init_default';
    let filterToSubmit = this.data.filterToSubmit
    var filtername = e.currentTarget.dataset.filtername;
    var listvalue = e.currentTarget.dataset.listvalue;
    filterToSubmit[filtername] = listvalue
    this.data.filterToSubmit = filterToSubmit
    this.fetchInitPageList();
  },

  报表格式_上下分组(e) {
    let that  = this;
    let id        = e.currentTarget.dataset.id;
    let FieldList = e.currentTarget.dataset.fieldlist;
    let RecordsALL = e.currentTarget.dataset.recordsall;
    FieldList.forEach(function (item) {
      if (item.id == id) {
        if (!item.flag) {
          item.flag = true
          that.setData({
            Records: RecordsALL[item.title]
          })

        }
      } else {
        item.flag = false
      }
    })
    that.setData({
      FieldList: FieldList
    })
  },

  报表图表_搜索区域_选择下拉: function (e) {
    util.log(e); 
    let alldata = e.currentTarget.dataset.alldata;
    let index = e.currentTarget.dataset.index; 
    let selectvalue = e.currentTarget.dataset.selectvalue;
    alldata['表单字段'][index]['选中值']  = selectvalue[e.detail.value];
    alldata['表单字段'][index]['选中值索引'] = e.detail.value;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      FORM_SEARCH: alldata
    })
  },

  报表图表_搜索区域_开始时间: function (e) {
    util.log(e);
    let alldata = e.currentTarget.dataset.alldata;
    let index = e.currentTarget.dataset.index;
    let selectvalue = e.currentTarget.dataset.selectvalue;
    alldata['表单字段'][index]['开始时间'] = e.detail.value;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      FORM_SEARCH: alldata
    })
  },

  报表图表_搜索区域_结束时间: function (e) {
    util.log(e);
    let alldata = e.currentTarget.dataset.alldata;
    let index = e.currentTarget.dataset.index;
    let selectvalue = e.currentTarget.dataset.selectvalue;
    alldata['表单字段'][index]['结束时间'] = e.detail.value;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      FORM_SEARCH: alldata
    })
  },

  报表图表组合_搜索区域_选择班级: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      SelectBanJiIndex: e.detail.value
    })
  },

  报表图表组合_搜索区域_开始时间(e) {
    var that = this;
    console.log(e);
    var 开始时间 = e.detail.value;
    that.setData({
      BEGIN_DATE: 开始时间
    });
  },

  报表图表组合_搜索区域_结束时间(e) {
    var that = this;
    console.log(e);
    var 结束时间 = e.detail.value;
    that.setData({
      END_DATE: 结束时间
    });
  },

  报表格式_上下分组_组合图表使用(e) {
    let that = this; 
    let id = e.currentTarget.dataset.id;
    let mainid = e.currentTarget.dataset.mainid;
    let FieldList = e.currentTarget.dataset.fieldlist;
    let RecordsALL = e.currentTarget.dataset.recordsall;
    let EcChartFunction = e.currentTarget.dataset.ecchartfunction;
    //util.log(e.currentTarget.dataset);
    FieldList.forEach(function (item) {
      if (item.id == id) {
        if (!item.flag) {
          item.flag = true;
          EcChartFunction[mainid]['记录列表'] = RecordsALL[item.title];
        }
      } else {
        item.flag = false
      }
    })
    EcChartFunction[mainid]['字段列表'] = FieldList;
    that.setData({
      EcChartFunction: EcChartFunction
    })
  },

  //列表模板的下拉搜索，得到列表数据
  获取报表接口内容: function (e) {
    let that = this;
    let searchFieldName = that.data.searchFieldName,//输入框字符串作为参数 
      searchFieldValue = that.data.searchFieldValue,//输入框字符串作为参数 
      actionValue = that.data.actionValue,//输入框字符串作为参数
      pageid = that.data.pageid,//把第几次加载次数作为参数  
      callbackcount = that.data.callbackcount; //返回数据的个数 
    let hostLastUrl = that.data.PageURL;       //从这个页面获取到当前页面所显示的信息
    let PageGetUrl = that.data.PageGetUrl;       //从这个页面获取到当前页面所显示的信息
    let LOGIN_ACCESS_TOKEN = that.data.LOGIN_ACCESS_TOKEN;

    var ActionValue = this.data.actionValue;
    //重新构建_GET参数,给下拉菜单使用.
    if (PageGetUrl != '' && ActionValue != 'init_default_search') {
      var RESET_GET_VAR = util.urltojson(PageGetUrl);
      var searchMenuFieldArray = that.data.searchMenuFieldArray;
      for (let k of Object.keys(searchMenuFieldArray)) {
        var v = searchMenuFieldArray[k];
        if (v != undefined && v != "全部") {
          RESET_GET_VAR[k] = v;
        }
      }
      RESET_GET_VAR['APPSOURCE'] = "WECHAT_INIT";
    }
    else if (PageGetUrl != '' && ActionValue == 'init_default_search') {
      var RESET_GET_VAR = util.urltojson(PageGetUrl);
      RESET_GET_VAR['searchFieldName']  = util.base64encode(searchFieldName);
      RESET_GET_VAR['searchvalue']  = util.base64encode(searchFieldValue);
      RESET_GET_VAR['searchfieldmethod']  = "base64encode";
      RESET_GET_VAR['action'] = ActionValue;
    }
    else {
      var RESET_GET_VAR = {};
    }
    //重置GET变量
    PageGetUrl = util.objToStrUrl(RESET_GET_VAR);
    //PageGetUrl = util.objToStrUrl(PostData);
    //PageGetUrl = util.base64encode(PageGetUrl);
    util.log("actionValue:" + actionValue);
    util.log(searchMenuFieldArray);
    util.log("PageGetUrl:" + PageGetUrl);

    //PostData 变量为DATA的POST提交变量
    if(e!=undefined)  {
      var PostData = e.detail.value;
    }
    else {
      var PostData = {};
    }
    PostData['openid'] = getApp().globalData.openid;
    PostData['unionid'] = getApp().globalData.unionid;
    PostData['APPSOURCE'] = "WECHAT_INIT";
    PostData['DATETIME'] = new Date().getTime();
    PostData['LOGIN_SCHOOL_ID'] = getApp().globalData.LOGIN_SCHOOL_ID;
    PostData['SYSTEM_IS_CLOUD'] = getApp().globalData.SYSTEM_IS_CLOUD;
    PostData['SYSTEM_APPSTORE_ID'] = getApp().globalData.SYSTEM_APPSTORE_ID;
    PostData['LOGIN_ACCESS_TOKEN'] = getApp().globalData.LOGIN_ACCESS_TOKEN;
    PostData['page'] = pageid;
    //显示正在加载中
    that.setData({
      searchLoading: true
    });
    //访问网络  
    util.GetMainData(hostLastUrl + '?' + PageGetUrl, PostData, searchFieldName, searchFieldValue, pageid, callbackcount, function (data) {
      //判断是否为成绩模板,还是直接的消息输出.
      if (1)              {
        util.log(data);
        if (data.无数据时提示 != "" && data.无数据时提示!= undefined && data.无数据时提示!= "undefined")   {
          //输出提示
          util.showModal("消息提示", data.无数据时提示, 'goback');
          that.setData({
            searchLoading: false,
            Records: [],
          });
          return false;
        }
        else    {
          //输出表格
          var 记录列表 = data.记录列表;
          if (data.init_default.MobileEndShowType == "无限表格")          {
            that.setData({
              报表名称: data.报表名称,
              FieldList: data.字段列表,       //通用
              FieldFilter: data.字段类型,     //简单分组 使用
              FieldNumber: 'item' + data.字段列表.length,   //简单分组 使用
              FORM_SEARCH: data.表单搜索,
              Records: 记录列表,
              备注内容: data.备注内容,
              pageActionInitNewsOrNotify: data.init_default.MobileEndShowType,
              pageActionInit: true,
              searchLoading: false,
            });
          }
          else if (data.init_default.MobileEndShowType == "简单分组") {
            that.setData({
              报表名称: data.报表名称,
              FieldList: data.字段列表,       //通用
              FieldFilter: data.字段类型,     //简单分组 使用
              FieldNumber: 'item' + data.字段列表.length,   //简单分组 使用
              FORM_SEARCH: data.表单搜索,
              Records: 记录列表,
              备注内容: data.备注内容,
              pageActionInitNewsOrNotify: data.init_default.MobileEndShowType,
              pageActionInit: true,
              searchLoading: false,
            });
          }
          else if (data.init_default.MobileEndShowType == "学生卡片") {
            that.setData({
              报表名称: data.报表名称,
              FieldList: data.字段列表,       //通用
              FieldNumber: 'item' + data.字段列表.length,   //简单分组 使用
              FORM_SEARCH: data.表单搜索,
              Records: 记录列表,
              备注内容: data.备注内容,
              pageActionInitNewsOrNotify: data.init_default.MobileEndShowType,
              pageActionInit: true,
              searchLoading: false,
            });
            util.log(记录列表);
          }
          else if (data.init_default.MobileEndShowType == "上下分组") {
            //默认为第一个分组的数据.
            data.字段列表.forEach(function (item) {
              if (item.flag == true && item.title != '' && item.title != undefined) {
                记录列表 = data.记录列表[item.title];
              }
            });
            that.setData({
              RecordsALL: data.记录列表,
            });
            that.setData({
              报表名称: data.报表名称,
              FieldList: data.字段列表,       //通用
              FieldFilter: data.字段类型,     //简单分组 使用
              FieldNumber: 'item' + data.字段列表.length,   //简单分组 使用
              FORM_SEARCH: data.表单搜索,
              Records: 记录列表,
              备注内容: data.备注内容,
              pageActionInitNewsOrNotify: data.init_default.MobileEndShowType,
              pageActionInit: true,
              searchLoading: false,
            });
          }
          else if (data.init_default.MobileEndShowType == "报表图表") {
            util.log(data.图表数据);
            //循环多个图表.
            //此变量赋值写法比较特殊,是利用变量指针,对动态变量进行赋值.
            let EcChartFunction = {};
            for (let F = 0; F < data.图表数据.length; F++)              {
              EcChartFunction[F] = {
                onInit: function (canvas, width, height) {
                  const scatterChart = echarts.init(canvas, null, {
                    width: width,
                    height: height
                  });
                  canvas.setChart(scatterChart);
                  scatterChart.setOption(data['图表数据'][F]);
                  return scatterChart;
                }
              }
            }
            util.log(EcChartFunction);
            that.setData({
              EcChartFunction: EcChartFunction,
              pageActionInitNewsOrNotify: data.init_default.MobileEndShowType,
              FORM_SEARCH: data.表单搜索,
              pageActionInit: true,
              searchLoading: false,
            });
          }
          else if (data.init_default.MobileEndShowType == "报表图表组合") {
            //util.log(data.图表数据);
            //循环多个图表.
            //此变量赋值写法比较特殊,是利用变量指针,对动态变量进行赋值.
            let EcChartFunction = {};
            for (let F = 0; F < data.图表数据.length; F++) {
              var 字段列表      = data['图表数据'][F]['WECHAT_DATA']['字段列表'];
              var 记录列表      = data['图表数据'][F]['WECHAT_DATA']['记录列表'];
              var 记录列表全部  = data['图表数据'][F]['WECHAT_DATA']['记录列表'];
              var 类型          = data['图表数据'][F]['类型'];
              if (类型=="上下分组")       {
                //默认为第一个分组的数据.
                字段列表.forEach(function (item) {
                  if (item.flag == true && item.title != '' && item.title != undefined) {
                    记录列表 = 记录列表全部[item.title];
                  }
                });
              }
              EcChartFunction[F] = {
                onInit: function (canvas, width, height) {
                  const scatterChart = echarts.init(canvas, null, {
                    width: width,
                    height: height
                  });
                  //canvas.setChart(scatterChart);
                  scatterChart.clear();
                  scatterChart.setOption(data['图表数据'][F]['WECHAT_DATA']);
                  return scatterChart;
                },
                EcChartFunctionType: data['图表数据'][F]['类型'],
                EcChartFunctionName: data['图表数据'][F]['名称'],
                字段列表: data['图表数据'][F]['WECHAT_DATA']['字段列表'],
                字段类型: data['图表数据'][F]['WECHAT_DATA']['字段类型'],
                报表名称: data['图表数据'][F]['WECHAT_DATA']['报表名称'],
                编号: data['图表数据'][F]['编号'],
                记录列表: 记录列表,
                记录列表全部: 记录列表全部,
              }
            }
            util.log(EcChartFunction);
            that.setData({
              EcChartFunction: EcChartFunction,
              pageActionInitNewsOrNotify: data.init_default.MobileEndShowType,
              pageActionInit: true,
              searchLoading: false,
              FORM_IS_USING: data['表单提交']['是否启用'],
              SEARCH_NAME: data['表单提交']['姓名搜索'],
              SEARCH_BANJI: data['表单提交']['班级搜索'],
              BEGIN_DATE: data['表单提交']['开始时间'],
              END_DATE: data['表单提交']['结束时间'],
              SelectBanJiArray: data['表单提交']['选择班级'],
              SelectBanJiIndex: data['表单提交']['选中班级索引'],
              FORM_TITLE: data['表单提交']['表单标题'],
            });
          }
        }
        return true;
      }
      //延时1秒自动启用-判断是否需要直接跳转到新建页面-结束
    })
  },

  //列表模板的下拉搜索，得到列表数据
  fetchInitPageList: function () {
    let that = this;
    let searchFieldName = that.data.searchFieldName,//输入框字符串作为参数 
      searchFieldValue = that.data.searchFieldValue,//输入框字符串作为参数 
      actionValue = that.data.actionValue,//输入框字符串作为参数
      pageid = that.data.pageid,//把第几次加载次数作为参数  
      callbackcount = that.data.callbackcount; //返回数据的个数 
    let hostLastUrl = that.data.PageURL;       //从这个页面获取到当前页面所显示的信息
    let PageGetUrl = that.data.PageGetUrl;       //从这个页面获取到当前页面所显示的信息
    console.log("hostLastUrl:"+hostLastUrl)

    //PostData 变量为DATA的POST提交变量
    var PostData = {};
    
    PostData['openid'] = getApp().globalData.openid;
    PostData['unionid'] = getApp().globalData.unionid;
    PostData['APPSOURCE'] = "WECHAT_INIT";
    PostData['DATETIME'] = new Date().getTime();
    PostData['LOGIN_SCHOOL_ID'] = getApp().globalData.LOGIN_SCHOOL_ID;
    PostData['SYSTEM_IS_CLOUD'] = getApp().globalData.SYSTEM_IS_CLOUD;
    PostData['SYSTEM_APPSTORE_ID'] = getApp().globalData.SYSTEM_APPSTORE_ID;
    PostData['page'] = pageid;
    PostData['searchFieldName'] = searchFieldName;
    PostData['searchFieldValue'] = searchFieldValue;

    //增加列表下拉菜单的参数    
    for (let k of Object.keys(that.data.filterToSubmit)) {
        var v = that.data.filterToSubmit[k];
        if (v != undefined) {
            PostData[k] = v;
        }
    }
    //访问网络  
    util.GetMainData(hostLastUrl + '?' + PageGetUrl, PostData, searchFieldName, searchFieldValue, pageid, callbackcount, function (data) {
      
      that.data.alldata       = data;
      that.data.CSRF_TOKEN    = data.init_default.CSRF_TOKEN
      that.data.curPageNumber = data.init_default.MobileEndData.length;
      that.data.allCount      = data.init_default.total;
      that.data.allPages      = Math.ceil(data.init_default.total/data.init_default.pageNumber);
      that.data.pageActionInitNewsOrNotify = data.init_default.MobileEndShowType;
      that.data.NewActionName = data.init_default.button_add;
      that.data.NewActionUrl  = "?action=add_default";
    
      wx.setStorageSync('DANDIAN_CSRF_TOKEN_CONTENT_'+that.data.pageid, data.init_default.CSRF_TOKEN);
      wx.setStorageSync('DANDIAN_ADD_DEFAULT_'+that.data.WechatCacheMark, data.add_default);
      wx.setStorageSync('DANDIAN_EDIT_DEFAULT_'+that.data.WechatCacheMark, data.edit_default);
      wx.setStorageSync('DANDIAN_VIEW_DEFAULT_'+that.data.WechatCacheMark, data.view_default);
      wx.setStorageSync('DANDIAN_INIT_DEFAULT_'+that.data.WechatCacheMark, data.init_default);

      if (data.init_default && data.init_default.filter && data.init_default.filter.length > 0) {
        that.setData({
            MobileEndShowGroupFilter: data.init_default.MobileEndShowGroupFilter,
            filter: data.init_default.filter
        });
        console.log(data.init_default.filter)
      }
      if (data.init_default && data.init_default.searchFieldArray && data.init_default.searchFieldArray.length > 0) {
            var searchFieldName = data.init_default.searchFieldName
            let menuSearch = {}
            menuSearch.name = "搜索"
            menuSearch.id = "search"
            menuSearch.open = 1
            menuSearch.value = 0
            let range = []
            data.init_default.searchFieldArray.map((item, index)=>{
                range.push(item)
                if(searchFieldName!="" && item.label == searchFieldName) {
                    menuSearch.value = index
                    menuSearch.chooseName = item.label
                }
            })
            console.log("data.init_default.MobileEndShowSearch:"+data.init_default.MobileEndShowSearch)
            console.log("data.init_default.MobileEndShowGroupFilter:"+data.init_default.MobileEndShowGroupFilter)
            console.log(menuSearch)
            menuSearch.range = range
            that.setData({
                MobileEndShowSearch: data.init_default.MobileEndShowSearch,
                menuSearch: menuSearch
            });
            that.data.searchFieldName = menuSearch.chooseName
      }
      that.setData({
        ForbiddenEditRow: data.init_default.ForbiddenEditRow,
        ForbiddenDeleteRow: data.init_default.ForbiddenDeleteRow,
        ForbiddenSelectRow: data.init_default.ForbiddenSelectRow,
        ForbiddenViewRow: data.init_default.ForbiddenViewRow,
      });
      
      //判断是否有数据，有则取数据  
      if (that.data.curPageNumber > 0)             {
        let InitPageList = [];
        //重置数据
        for (let i = 0; i < data.init_default.MobileEndData.length; i++) {
          //过滤成绩模板中数据的特殊符号
          data.init_default.MobileEndData[i]['MobileEndFirstLine'] = util.decodehtml(data.init_default.MobileEndData[i]['MobileEndFirstLine']);
          data.init_default.MobileEndData[i]['MobileEndSecondLineLeft'] = util.decodehtml(data.init_default.MobileEndData[i]['MobileEndSecondLineLeft']);
          data.init_default.MobileEndData[i]['MobileEndNewsContent'] = util.decodehtml(data.init_default.MobileEndData[i]['MobileEndNewsContent']).replace(/<[^>]+>/g, '');
          //当显示模板为:浏览器的时候,需要把URL进行BASE加密来做为参数传递.不然一个URL里面会有两个?导致链接打开失败.
          if (data.init_default.MobileEndData[i]['模板']=="浏览器")     {
            data.init_default.MobileEndData[i]['内容项URL'] = util.base64encode(data.init_default.MobileEndData[i]['内容项URL']);
          }
        }
        //如果isFirstGetData是true从data中取出数据，否则先从原来的数据继续添加  
        that.data.isFirstGetData ? InitPageList = data.init_default.MobileEndData : InitPageList = that.data.pageMainList.concat(data.init_default.MobileEndData);
        that.setData({
          pageMainList: InitPageList, //获取数据数组
          SYSTEM_URL: getApp().globalData.SYSTEM_URL,
          pageActionInitNewsOrNotify: data.init_default.MobileEndShowType,
          MainImageList: data.init_default.MainImageList
        });
        //页面多余一页是显示此提示.
        if (that.data.allPages > 1) {
          that.setData({
            pageCountTrip: "　共有" + that.data.allCount + "条记录,共" + that.data.allPages + "页"
          });
        }
        //页面等于一页是显示此提示.
        if (that.data.allPages == 1) {
          that.setData({
            pageCountTrip: ""
          });
        }
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏  
      }
      else {
        that.data.searchLoadingComplete = true;
        that.data.searchLoading = false;
        that.setData({
          searchLoadingComplete: true, //把“没有数据”设为true，显示  
          searchLoading: false,  //把"上拉加载"的变量设为false，隐藏  
          pageCountTrip: "　共有" + that.data.allCount + "条记录,共" + that.data.allPages + "页"
        });
      }

      //如果返回数据只有一页,则提示数据已经加载完成.
      //util.log("fetchInitPageList allPages:"+that.data.allPages);
      if (that.data.allPages <= 1) {
        that.setData({
          searchLoadingComplete: false, //把“没有数据”设为true，显示  
          searchLoading: false,  //把"上拉加载"的变量设为false，隐藏  
        })
      }
      //20200120时加入以下代码,因为在何种情况,只要当前页面加载完毕,就应该关掉"正在加载"的提示
      that.setData({
        searchLoading: false,  //把"上拉加载"的变量设为false，隐藏  
      })

      var 掌上校园_当列表记录为零时转新建页面 = data.掌上校园_当列表记录为零时转新建页面;
      if (掌上校园_当列表记录为零时转新建页面 !== undefined && 掌上校园_当列表记录为零时转新建页面!='NOTUSE')     {
        var 掌上校园_当列表记录为零时转新建页面_时间 = 掌上校园_当列表记录为零时转新建页面*1000;
        util.log('--------------------------判断是否需要直接跳转到新建页面--------------------------');
        //延时1秒自动启用-判断是否需要直接跳转到新建页面-开始
        setTimeout(function () {
          var menuTwoToolData = that.data.menuTwoToolData;
          util.log(menuTwoToolData); 
          //util.log(that.data.actionValue); 
          if (menuTwoToolData != undefined && that.data.actionValue=='init_default')      {
            var pages = menuTwoToolData[0]['pages'];
            if (
              (pages[0] != undefined && pages[0]['code'] == "newrecord") ||
              (pages[1] != undefined && pages[1]['code'] == "newrecord") ||
              (pages[2] != undefined && pages[2]['code'] == "newrecord")
              ) {
              //存在新增按钮,再判断当前页面有无记录.
              var MobileEndFirstLine = data.init_default.MobileEndData[0]['MobileEndFirstLine'];
              if (data.init_default.MobileEndData.length == 1 && MobileEndFirstLine.indexOf("无记录在")>=0)         {
                //处理无记录状态,可以直接跳转到新建页面
                //util.log(pages);
                if (pages[0] != undefined && pages[0]['code'] != undefined && pages[0]['code'] == "newrecord")   {
                  var url = pages[0]['url'];
                }
                if (pages[1] != undefined && pages[1]['code'] != undefined && pages[1]['code'] == "newrecord")   {
                  var url = pages[1]['url'];
                }
                if (pages[2] != undefined && pages[2]['code'] != undefined && pages[2]['code'] == "newrecord")   {
                  var url = pages[2]['url'];
                }
                //开始跳转页面
                var url = "/pages/InterfaceInit/" + that.data.PageID + "" + that.data.NewActionUrl;
                //util.log(url);
                wx.navigateTo({
                  url: url,
                });
              }
            }
          }
        }, 掌上校园_当列表记录为零时转新建页面_时间);  
      }
      //延时1秒自动启用-判断是否需要直接跳转到新建页面-结束
    })
  },


  //列表模板的点击搜索按钮，触发事件
  searchFieldValueSearch: function (e) {
    this.setData({
      pageid: 0,   //第一次加载，设置0  
      pageMainList: [],  //放置返回数据的数组,设为空  
      isFirstGetData: true,  //第一次加载，设置true  
      searchLoading: true,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false, //把“没有数据”设为false，隐藏  
    })
    this.fetchInitPageList();
  },

  //列表模板的默认显示
  keywordSearch: function (e) {
    this.setData({
      pageid: 0,   //第一次加载，设置0  
      pageMainList: [],  //放置返回数据的数组,设为空  
      isFirstGetData: true,  //第一次加载，设置true  
      searchLoading: true,  //把"上拉加载"的变量设为true，显示  
      searchLoadingComplete: false, //把“没有数据”设为false，隐藏  
    })
    this.data.actionValue = 'init_default';
    this.fetchInitPageList();
  },
  //滚动到底部触发事件  
  searchScrollLower: function () {
    let that = this;
    //总页面数量少于当前的页面数,可以下拉获取新数据.
    //util.log("滚动到底部触发事件:that.data.allPages:" + that.data.allPages);
    //util.log("滚动到底部触发事件:that.data.pageid:" + that.data.pageid);
    if (that.data.allPages > that.data.pageid)         {
      //下拉产生的数据,需要在此设置下拉标记
      that.data.isFirstGetData  = false,  //第一次加载，设置true  
      that.data.searchLoading   = true;
      that.data.searchLoadingComplete = false;
      //util.log("滚动到底部触发事件:that.data.searchLoading:" + that.data.searchLoading);
      //util.log("滚动到底部触发事件:that.data.searchLoadingComplete:" + that.data.searchLoadingComplete);
      that.setData({
        pageid: that.data.pageid + 1,  //每次触发上拉事件，把searchPageNum+1 
        searchLoading: that.data.searchLoading,  //每次触发上拉事件，把searchPageNum+1  
        searchLoadingComplete: that.data.searchLoadingComplete, 
      });
      that.fetchInitPageList();
    }
    else  {
      //已经是最后一页,不需要再做下拉刷新数据.
      that.setData({
        searchLoading: false,
        searchLoadingComplete: true,
      });
    }
  },
  onLoad: function (options) {
    let that = this;
    //util.log("options"); util.log(options);
    that.onLoadData(options,'init');
  },
  onReady: function (options) {
    let that = this;
  },
  onLoadData: function (options,methodValue) {
    let that = this;    
    //得到当前页面的PAGEID信息.然后再在缓存里面得到对应的SYSTEM_URL接口信息,然后根据不同的接口地址,显示不同的数据.
    var getCurrentPageUrl = util.getCurrentPageUrl();//PageID
    var getCurrentPageUrlArray = getCurrentPageUrl.split('/');
    that.data.PageID = getCurrentPageUrlArray.pop();
    that.data.PageType = getCurrentPageUrlArray.pop();
    console.log("that.data.PageID"+that.data.PageID)
    if(!that.data.AnonymousUserPageList.includes(that.data.PageID))  {
        //初始化getApp().globalData的值.
        getApp().globalData = wx.getStorageSync('DANDIAN_SYSTEM_USER_RESOURCE') || [];
        if (getApp().globalData.userInfo == undefined || getApp().globalData.jianjie == undefined) {
            wx.navigateTo({
                url: '/pages/login/wechatlogin',
            });
            return false;
        }
        var LOGIN_USER_EDUID = getApp().globalData.LOGIN_USER_EDUID;
        if (getApp().globalData.userInfo == undefined || LOGIN_USER_EDUID == '' || LOGIN_USER_EDUID == undefined) {
            wx.navigateTo({
                url: '/pages/login/wechatlogin',
            });
            return false;
        }
        util.log(getApp().globalData.userInfo);
        util.log(getApp().globalData.jianjie);
    }
    if(methodValue=='init')     {
      that.data.PageGetUrl = util.objToStrUrl(options);
    }
    if (methodValue == 'goback') {
      that.data.PageGetUrl = options;
    }
    if (methodValue == 'reload') {
      that.data.PageGetUrl = options;
    }
    util.log("PageID:" + that.data.PageID);
    util.log("PageType:" + that.data.PageType);
    util.log("PageGetUrl:" + that.data.PageGetUrl);

    util.log("全局页面ID:" + that.data.PageID);//得到PageID的值
    //得到当前页面的URL信息,然后得到接口数据进行显示.
    if (that.data.PageID == "News")      {
        that.data.PageURL           = "/apps/apps_293.php";
        that.data.PageHeaderNAME    = "通知";
        that.data.WechatCacheMark    = "News";
    }
    else if (that.data.PageID == "NewsView")      {
        that.data.PageURL           = "/apps/apps_293.php";
        that.data.PageHeaderNAME    = "通知";
        that.data.WechatCacheMark    = "News";
    }
    else if (that.data.PageID == "ZhuanYe")  {
        that.data.PageURL           = "/apps/apps_294.php";
        that.data.PageHeaderNAME    = "专业";
        that.data.WechatCacheMark    = "ZhuanYe";
    }
    else if (that.data.PageID == "ZhuanYeView")  {
        that.data.PageURL           = "/apps/apps_294.php";
        that.data.PageHeaderNAME    = "专业";
        that.data.WechatCacheMark    = "ZhuanYe";
    }
    else {
        var DANDIAN_SYSTEM_CACHE = wx.getStorageSync('DANDIAN_SYSTEM_CACHE') || []
        that.data.PageURL = DANDIAN_SYSTEM_CACHE.data.MainDataMap[that.data.PageID].BackEndApi;
        that.data.PageHeaderNAME = DANDIAN_SYSTEM_CACHE.data.MainDataMap[that.data.PageID].Name;
        that.data.WechatCacheMark    = "MainList";
    }
    //设置页面标题
    wx.setNavigationBarTitle({ title: that.data.PageHeaderNAME });
    //下面代码设置是进行行高的自动匹配
    wx.getSystemInfo({
      success: function (res) {
        util.log(res);
        var scrollHeight = res.windowHeight;
        that.setData({
          scrollHeight: scrollHeight,
          PageIDNumber: that.data.PageID,
          pageListHiddenPriv: false,
          pageMemoHiddenPriv: true,
          tempateType: that.data.PageType,
          tempateId: that.data.PageID,
        });
      }
    });

    var decodeAllBase64Url = util.decodeAllBase64Url(that.data.PageGetUrl);
    if (decodeAllBase64Url== undefined)   {
      var PAGE_ACTION = "";
    }
    else  {
      var PAGE_ACTION = decodeAllBase64Url['action'];
      if (PAGE_ACTION == undefined) {
        PAGE_ACTION = "";
      }
    }
    
    util.log("----------------PAGE_ACTION:" + PAGE_ACTION);
    if (PAGE_ACTION == "" || PAGE_ACTION == "init_default" || PAGE_ACTION == "init_default_search") {
      that.data.PageType = "FunctionPage";
      //列表页面的主数据区数据显示
      //人为的指定参数-开始
      //that.data.PageAction = "&adfad=&action=init_default&FLOWID=8&FORMID=145&adsf=";
      //that.data.PageGetUrl = "&adfad=&action=init_default&FLOWID=8&FORMID=145&adsf=";
      //人为的指定参数-结束

      //列表页面的头部下拉数据显示,需要做一下额外的判断,就是报表模板下面不需要执行此函数.
      var PageURLArray = that.data.PageURL.split('/');
      var FileName = PageURLArray.pop();
      var PageURLArray = FileName.split('_');
      console.log(PageURLArray)
      if (PageURLArray[0]=='apps')         {
        //功能页面
        that.setData({
          pageActionInit: true,
        });
        that.keywordSearch();
      }

      if (PageURLArray[0] == 'report')          {
        //报表专用 暂时没有开发完成
        that.获取报表接口内容();
      }

      
    }

    //这个地方不要加elseif 因为在INIT的时候,有可能返回一个EDIT_DEFAULT的行为.
    if (PAGE_ACTION == "add_default") {
        that.data.PageType = "InterfaceAddEdit";
        var getCurrentPageUrlWithArgs = util.getCurrentPageUrlWithArgs();
        var args = getCurrentPageUrlWithArgs.args;
        util.log("getCurrentPageUrlWithArgs");
        util.log(getCurrentPageUrlWithArgs);
        that.data.PageAction        = getCurrentPageUrlWithArgs['args'];
        that.data.pageIdEdit        = getCurrentPageUrlWithArgs['options']['pageid'];
        that.data.pageRowId         = 0;
        that.data.pageExternalId    = Number(getCurrentPageUrlWithArgs['options']['externalId']);
        that.setData({
            pageActionInit: false,
            pageActionAddEdit: true,
            hiddenLoading:false,
        });
        var ADD_OR_EDIT = undefined;
        ADD_OR_EDIT = wx.getStorageSync('DANDIAN_ADD_DEFAULT') || []
        if(ADD_OR_EDIT!=undefined) {
            that.AddAndEditPage(ADD_OR_EDIT);
        }
    }
    else if (PAGE_ACTION == "edit_default") {
        that.data.PageType = "InterfaceAddEdit";
        var getCurrentPageUrlWithArgs = util.getCurrentPageUrlWithArgs();
        var args = getCurrentPageUrlWithArgs.args;
        util.log("getCurrentPageUrlWithArgs");
        util.log(getCurrentPageUrlWithArgs);
        that.data.PageAction        = getCurrentPageUrlWithArgs['args'];
        that.data.pageIdEdit        = getCurrentPageUrlWithArgs['options']['pageid'];
        that.data.pageRowId         = getCurrentPageUrlWithArgs['options']['id'];
        that.data.pageExternalId    = Number(getCurrentPageUrlWithArgs['options']['externalId']);
        
        that.setData({
            pageActionInit: false,
            pageActionAddEdit: true,
            hiddenLoading:false,
        });
        var ADD_OR_EDIT = undefined;
        ADD_OR_EDIT = wx.getStorageSync('DANDIAN_EDIT_DEFAULT_'+that.data.WechatCacheMark) || []
        if(ADD_OR_EDIT!=undefined) {
            that.AddAndEditPage(ADD_OR_EDIT);
        }
    }
    else if (PAGE_ACTION == "view_default") {
        that.data.PageType = "InterfaceView";
        var getCurrentPageUrlWithArgs = util.getCurrentPageUrlWithArgs();
        var args = getCurrentPageUrlWithArgs.args;
        util.log(getCurrentPageUrlWithArgs);
        that.data.PageAction        = getCurrentPageUrlWithArgs['args'];
        that.data.pageIdEdit        = getCurrentPageUrlWithArgs['options']['pageid'];
        that.data.pageRowId         = getCurrentPageUrlWithArgs['options']['id'];
        that.data.pageExternalId    = Number(getCurrentPageUrlWithArgs['options']['externalId']);
        
        that.setData({
            pageActionInit: false,
            pageActionView: true,
            hiddenLoading:false,
        });
        var ADD_OR_EDIT = undefined;
        ADD_OR_EDIT = wx.getStorageSync('DANDIAN_VIEW_DEFAULT_'+that.data.WechatCacheMark) || []
        var INIT_DEFAULT = wx.getStorageSync('DANDIAN_INIT_DEFAULT_'+that.data.WechatCacheMark) || []
        if(ADD_OR_EDIT!=undefined) {
            that.GetFormInforForView(ADD_OR_EDIT, INIT_DEFAULT);
        }
    }
    //end onload
  },

  GetFormInforForView: function (ADD_OR_EDIT, INIT_DEFAULT) {
    var that = this;
    //测试日志输出
    util.log("url:" + getApp().globalData.SYSTEM_URL + that.data.PageURL + '?' + that.data.PageAction);
    util.log('DANDIAN_VIEW_DEFAULT_'+that.data.WechatCacheMark);
    //显示加载中提示窗口
    that.setData({
      hiddenLoading: false,
    });
    
    //构建每次提交的DATA的参数的值.
    var PostData = {};
    
    PostData['openid'] = getApp().globalData.openid;
    PostData['unionid'] = getApp().globalData.unionid;
    PostData['DATETIME'] = new Date().getTime();
    PostData['LOGIN_SCHOOL_ID'] = getApp().globalData.LOGIN_SCHOOL_ID;
    PostData['SYSTEM_IS_CLOUD'] = getApp().globalData.SYSTEM_IS_CLOUD;
    PostData['SYSTEM_APPSTORE_ID'] = getApp().globalData.SYSTEM_APPSTORE_ID;

    var CSRF_TOKEN = wx.getStorageSync('DANDIAN_CSRF_TOKEN_CONTENT_'+that.data.pageIdEdit) || ''

    wx.request({
      url: getApp().globalData.SYSTEM_URL + that.data.PageURL + '?' + that.data.PageAction,//字段列表
      method: 'POST',
      data: PostData,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Authorization': getApp().globalData.LOGIN_ACCESS_TOKEN+"::::"+CSRF_TOKEN
      },
      success: function (res) {  
        var liebiao = []  
        var allFields = ADD_OR_EDIT.allFields.Default;
        var pageActionViewNewsOrNotify = INIT_DEFAULT['MobileEndShowType'];
        util.log("pageActionViewNewsOrNotify: "+ pageActionViewNewsOrNotify)
        if (pageActionViewNewsOrNotify=='ListTemplate1')               {
            for (var i = 0; i < allFields.length;i++)     {
                if (liebiao[i]['富文本原始值'] != '' && allFields[i]['富文本原始值'] != undefined)      {
                    //liebiaos[i]['富文本原始值'] = util.base64decode(liebiaos[i]['富文本原始值']);
                }
                else    {
                    liebiao[i]['右边'] = util.decodehtml(allFields[i]['label']);
                    liebiao[i]['右边'] = util.nl2br(liebiaos[i]['右边']);
                }
            }
            that.setData({
                pageActionViewNewsOrNotify: pageActionViewNewsOrNotify,
                LeftWidth: res.data['左边宽度'],
                RightWidth: res.data['右边宽度'],
                pagetitle: res.data['标题显示'],
                FieldNameList: res.data['字段名称列表'],
                FieldTypeList: res.data['字段类型列表'],
                //HTMLAREA: res.data['init_default.MobileEndData'][0]['富文本原始值'],
                liebiao: ADD_OR_EDIT.allFields.Default,
                data: res.data.data,
                hiddenLoading: true,//关闭加载中提示窗口
                formsubmit: 1,//表单的提交按钮要显示出来.
            });
            util.log("res.data:::::::::::::::::"); 
            util.log(res.data); 
        }
        else if (pageActionViewNewsOrNotify=='NewsTemplate1' || pageActionViewNewsOrNotify=='NotificationTemplate1' || pageActionViewNewsOrNotify=='NotificationTemplate2')               {
          var setData = {};
          setData['标题名称']   = res.data['MobileEnd']['MobileEndNewsTitle'];
          setData['分类名称']   = res.data['MobileEnd']['MobileEndNewsGroup'];
          setData['内容名称']   = res.data['MobileEnd']['MobileEndNewsContent'];
          setData['发布时间']   = res.data['MobileEnd']['MobileEndNewsCreateTime'];
          setData['阅读次数']   = res.data['MobileEnd']['MobileEndNewsReadCounter'];
          setData['发布人']     = res.data['MobileEnd']['MobileEndNewsCreator'];    
          setData['图片']       = res.data['MobileEnd']['MobileEndNewsLeftImage'];       
          that.setData({
            pageActionViewNewsOrNotify: pageActionViewNewsOrNotify,
            setData: setData,
            pageActionView: true,
            hiddenLoading: true,//关闭加载中提示窗口
            SYSTEM_URL: getApp().globalData.SYSTEM_URL,
          });
          util.log(setData);
        }

      }
    })
  },

  //#################以下主要代码为ADDEDIT视图的代码.
  bindRegionChange: function (e) {
    var that = this;
    //util.log("图片上传成功:"); util.log(res.statusCode);
    util.log(e.detail.value);
    //此变量赋值写法比较特殊,是利用变量指针,对动态变量进行赋值.
    var showFieldId = e.currentTarget.dataset.id;
    let updateData = {};
    updateData['liebiao[' + showFieldId + '].value'] = e.detail.value;
    that.setData(updateData);
  },

  AddAndEditPage: function (ADD_OR_EDIT) {
    var that = this;
    //显示加载中提示窗口
    that.setData({
      hiddenLoading: false,
    });

    //得到小程序推荐人的信息.
    var DANDIAN_USER_SHARESOURCE = wx.getStorageSync('DANDIAN_USER_SHARESOURCE');

    //构建每次提交的DATA的参数的值.
    var PostData = {}; 
    
    PostData['openid'] = getApp().globalData.openid;
    PostData['unionid'] = getApp().globalData.unionid;
    PostData['DATETIME'] = new Date().getTime();
    PostData['LOGIN_SCHOOL_ID'] = getApp().globalData.LOGIN_SCHOOL_ID;
    PostData['SYSTEM_IS_CLOUD'] = getApp().globalData.SYSTEM_IS_CLOUD;
    PostData['SYSTEM_APPSTORE_ID'] = getApp().globalData.SYSTEM_APPSTORE_ID;

    var CSRF_TOKEN = wx.getStorageSync('DANDIAN_CSRF_TOKEN_CONTENT_'+that.data.pageIdEdit) || ''

    wx.request({
      url: getApp().globalData.SYSTEM_URL + that.data.PageURL + '?' + that.data.PageAction,//字段列表
      method: 'POST',
      data: PostData,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Authorization': getApp().globalData.LOGIN_ACCESS_TOKEN+"::::"+CSRF_TOKEN
      },
      success: function (res) {
          
        that.data.BMapShow  = res.data.BMapShow;//用于定义是否加载地理位置信息获取接口.
        var allfieldlist = []
        var allmustfieldlist = []
        ADD_OR_EDIT.allFields.Default.map((Item, index)=>{
            if(Item.code != "" && Item.code != undefined) {
                allfieldlist.push(Item.code)                
                if(Item.rules.required) {
                    allmustfieldlist.push(Item.code)
                }
            }
            else {
                allfieldlist.push(Item.name)              
                if(Item.rules.required) {
                    allmustfieldlist.push(Item.name)
                }
            }
        })
        var isFormSubmitButtonValueText = '';
        var isFormSubmitButtonClass = '';
        if (res.data['表单的提交按钮更换为支付']=="是")   {
          isFormSubmitButtonValueText = "进行支付";
          isFormSubmitButtonClass = "wxpay_button";
        }
        else {
          isFormSubmitButtonValueText = "提   交";
          isFormSubmitButtonClass = "ordinary_button";
        }
        util.log("isFormSubmitButtonClass" + isFormSubmitButtonClass);
        //表单按钮是否显示,正常情况下面都会显示,只有在特殊情况下面,如问卷调查的只读页面时,会从服务器接口上面返回此值,进行屏蔽提交按钮.
        var formsubmit = res.data['formsubmit'];
        if(formsubmit==undefined) formsubmit = 1;
        var liebiao = ADD_OR_EDIT.allFields.Default
        liebiao.map( (Item, ItemIndex) => {
            if(Item.type=="tablefilter" || Item.type=="tablefiltercolor" || Item.type=="radiogroup" || Item.type=="radiogroupcolor") {
                Item.options.map((optionItem, optionIndex)=>{
                    if(optionItem.value == res.data.data[Item.name]) {
                        liebiao[ItemIndex].valueIndex = optionIndex
                    }
                })
            }
            if(Item.type=="autocomplete") {
                Item.options.map((optionItem, optionIndex)=>{
                    if(optionItem.value == res.data.data[Item.code]) {
                        liebiao[ItemIndex].valueIndex = optionIndex
                    }
                })
            }
        })
        that.setData({
          pageTitle: ADD_OR_EDIT.titletext,
          liebiao: liebiao,
          submitaction: ADD_OR_EDIT.submitaction,
          submittext: ADD_OR_EDIT.submittext,
          data: res.data.data,
          FieldListArray: Object.keys(ADD_OR_EDIT.defaultValues).join(','),
          hiddenLoading: true,//显示加载中提示窗口
          formsubmit: formsubmit,//表单的提交按钮要显示出来.
          allmustfieldlist: allmustfieldlist,
          allfieldlist: allfieldlist,
          submiturl: "?action="+ADD_OR_EDIT.submitaction+"&id="+that.data.pageRowId+"&externalId="+that.data.pageExternalId,
          isFormSubmitButtonDisabled: 0,//表单的提交按钮要显示出来.
          isFormSubmitButtonValue: isFormSubmitButtonValueText,
          isFormSubmitButtonClass: isFormSubmitButtonClass,
          submitcurrentid: res.data['表单支付_当前记录编号'],
          submitcurrentpayfield: res.data['表单支付_存储金额字段'],
          submitcurrentform: res.data['表单支付_当前表单名称'],
          submitcurrentformchinese: res.data['表单支付_当前表单名称中文'],
        });


        //涉及到网络请求异步的问题,所以这个地理位置获取的代码,只能等能上一个网络请求有结果以后,才能进行判断是否要进行请求.
        util.log("that.data.BMapShow:" + Object.keys(ADD_OR_EDIT.defaultValues).join(','));
        if (that.data.BMapShow == true) {
          var BMap = new bmap.BMapWX({
            ak: that.data.BMapAK
          });

          var BMapSuccess = function (data) {
            //返回数据内，已经包含经纬度  
            //使用wxMarkerData获取数据    
            wxMarkerData = data.wxMarkerData;
            //把所有数据放在初始化data内   
            var hiddenaddress = JSON.stringify(data);

            that.setData({
              location: data.originalData.result.formatted_address,
              hiddenaddress: hiddenaddress,
            });
            //util.log(wxMarkerData); 
            //util.log(data);
          };
          var BMapFail = function (data) {
            //util.log(data);
          };
          // 发起regeocoding检索请求     
          BMap.regeocoding({
            success: BMapSuccess,
            fail: BMapFail,
          });
        }//end BMapShow === true

      }
    })
  },

  
  bindChange: function (e) {
    //util.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {

      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {
      //util.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      //  util.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }
  },
  open: function () {
    this.setData({
      condition: !this.data.condition
    })
  },
  getOpenIdTap: function () {
    var that = this;
  },

  //显示异常身份证
  tap_ch: function (e) {
    if (this.data.show) {
      this.setData({
        show: false
      });
    } else {
      this.setData({
        show: true
      });
    }
  },

  
  resetCursorLocation: function (e) {
    //不使用此函数,光标定位直接使用focus这个属性就可以.
    /*
    var value = e.detail.value;
    var pos = e.detail.cursor;
    util.log("pos:" + e.detail.cursor);
    if (pos != -1) {
      //光标在中间
      var left = e.detail.value.slice(0, pos)
      //计算光标的位置
      pos = left.replace(/11/g, '2').length
    }
    //直接返回对象，可以对输入进行过滤处理，同时可以控制光标的位置
    return {
      value: value.replace(/11/g, '2'),
      cursor: pos
    }    
    */
  },

  types: function (e) {
    var types = e.detail.value;
  },


  //组合使用第一部分,身份证号同步出生日期,年月,年龄,性别等字段
  CheckIDCardType: function (e) {
    util.log("LINE: 1792 身份证号同步出生日期,年月,年龄,性别等字段");
    var that = this;
    var ChooseValue = e.detail.value;
    var showFieldRangeName = e.currentTarget.dataset.range;
    var chooseName = showFieldRangeName[ChooseValue];
    util.log(showFieldRangeName);

    var IdCardInfor = {};
    //IdCardInfor.number = '411324198307194251';
    that.setData({
      IdCardNumberType: chooseName,
      CheckIDCardIndex: ChooseValue,
      IdCardInfor: IdCardInfor,
    });

    //其它身份类型,如护照号等
    if (chooseName != '身份证号') {
      var UserIdCardInfor = {};
      UserIdCardInfor.css = '';
      util.log(UserIdCardInfor);
      //开始指定其它几个相关的字段的值
      var IdCardInforDisabled = {};//强制指定INPUT在前台取消禁用属性.
      IdCardInforDisabled.birthday = false;
      IdCardInforDisabled.age = false;
      IdCardInforDisabled.gendar = false;
      IdCardInforDisabled.yearmonth = false;
      that.setData({
        IdCardInfor: UserIdCardInfor,
        IdCardInforDisabled: IdCardInforDisabled,
      });
    }
  },
  //组合使用第二部分,身份证号同步出生日期,年月,年龄,性别等字段
  CheckIDCardAndSysInfor: function (e) {
    //util.log(e);
    var that = this;
    var IdCardNumber = e.detail.value;
    var IDCardType = e.target.id;

    if (IDCardType == '身份证号') {
      util.log(e);
      //检查是否为空
      if (IdCardNumber.length == 0) {
        wx.showToast({
          title: '请输入身份证号',
          icon: 'success',
          duration: 1500
        })
        return false;
      }

      //检查是否是身份证格式
      var myreg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!myreg.test(IdCardNumber)) {
        wx.showToast({
          title: '身份证号错误',
          icon: 'success',
          duration: 1500
        })
        return false;
      }

      //从身份证信息得到一些有用的信息
      var UserIdCardInfor = util.MakeInforFromIdCard(IdCardNumber);
      UserIdCardInfor.css = 'disabled';
      util.log(UserIdCardInfor);

      //开始指定其它几个相关的字段的值
      var IdCardInforDisabled = {};//强制指定INPUT在前台设置禁用属性.
      IdCardInforDisabled.birthday = true;
      IdCardInforDisabled.age = true;
      IdCardInforDisabled.gendar = true;
      IdCardInforDisabled.yearmonth = true;
      that.setData({
        IdCardInfor: UserIdCardInfor,
        IdCardInforDisabled: IdCardInforDisabled,
      });
    }//end if 
    else {
      //其它身份类型,如护照号等
      var UserIdCardInfor = {};
      UserIdCardInfor.css = '';
      util.log(UserIdCardInfor);
      //开始指定其它几个相关的字段的值
      var IdCardInforDisabled = {};//强制指定INPUT在前台取消禁用属性.
      IdCardInforDisabled.birthday = false;
      IdCardInforDisabled.age = false;
      IdCardInforDisabled.gendar = false;
      IdCardInforDisabled.yearmonth = false;
      that.setData({
        IdCardInfor: UserIdCardInfor,
        IdCardInforDisabled: IdCardInforDisabled,
      });
    }
  },

  非空: function (e) {
    let that = this;   
    var 字段输入的值 = e.detail.value;
    var showFieldId = e.currentTarget.dataset.id;
    var showFieldName = e.currentTarget.dataset.name;
    var 是否必填 = e.currentTarget.dataset.ismustvalue;
    var 自定义JS函数 = e.currentTarget.dataset.userdefinejsfunction;
    util.log(e); util.log(是否必填); util.log("字段输入的值:"+字段输入的值+"自定义JS函数:"+自定义JS函数);
    if ((字段输入的值.length == 0 || 字段输入的值=="请选择") && 是否必填 == '是') {
      wx.showToast({
        title: '请输入' + showFieldName + '！',
        icon: 'success',
        duration: 1500
      });
      //禁用FORM提交按钮．
      let updateData = {};
      updateData['isFormSubmitButtonDisabled'] = true;
      updateData['isFormSubmitButtonValue'] = '请先填写' + showFieldName + '的值,禁用提交';
      updateData['liebiao[' + showFieldId + '].FieldCheckResult'] = "../../images/no01.png";
      updateData['liebiao[' + showFieldId + '].光标定位'] = true;
      this.setData(updateData);
    }
    if (字段输入的值.length > 0 && 是否必填 == '是') {
      //启用FORM提交按钮．
      let updateData = {};
      updateData['isFormSubmitButtonDisabled'] = false;
      updateData['isFormSubmitButtonValue'] = '提   交';
      updateData['liebiao[' + showFieldId + '].FieldCheckResult'] = "../../images/yes01.png";
      this.setData(updateData);
    }
    if (自定义JS函数 == 'SGZ_IDCARD_FROM_20_LENGTH_10') {
      var 考生地区字段索引  = e.currentTarget.dataset.index;
      考生地区字段索引      = 考生地区字段索引-1;
      var 整个表单字段对像 = e.currentTarget.dataset.liebiao;
      var 考生地区字段的值 = 整个表单字段对像[考生地区字段索引]['chooseName'];
      util.log(考生地区字段的值);
      var 准考证号长度 	= 字段输入的值.length;
      var 准考证号头两位 	= 字段输入的值.substr(0,2);
      if(考生地区字段的值=="苏州"||考生地区字段的值=="请选择"||考生地区字段的值=="0"||考生地区字段的值==undefined)                        {
        if(准考证号长度==10 && 准考证号头两位 == '20')		{
          //启用FORM提交按钮．
          let updateData = {};
          updateData['isFormSubmitButtonDisabled'] = false;
          updateData['isFormSubmitButtonValue'] = '提   交';
          updateData['liebiao[' + showFieldId + '].FieldCheckResult'] = "../../images/yes01.png";
          this.setData(updateData);
        }
        else			{
          //禁用FORM提交按钮．
          let updateData = {};
          updateData['isFormSubmitButtonDisabled'] = true;
          updateData['isFormSubmitButtonValue'] = '请先填写' + showFieldName + '的值,禁用提交';
          updateData['liebiao[' + showFieldId + '].FieldCheckResult'] = "../../images/no01.png";
          updateData['liebiao[' + showFieldId + '].光标定位'] = true;
          this.setData(updateData);
        }
      }
    }
    //根据学生输入的总分的多少,来自动生成可以选择的专业.
    if (自定义JS函数 == 'ZhongKaoZongFen_TongBu_ZhuanYeList') {
      var dandian_user_action = wx.getStorageSync('dandian_user_action') || '';
      var DANDIAN_SYSTEM_CACHE = wx.getStorageSync('DANDIAN_SYSTEM_CACHE') || []
      var FormID = DANDIAN_SYSTEM_CACHE.data.MainDataMap[that.data.PageID].formid;
      var FlowID = DANDIAN_SYSTEM_CACHE.data.MainDataMap[that.data.PageID].flowid;
      wx.request({
        url: getApp().globalData.SYSTEM_URL + '/general/EDU/Interface/TDFORMDATA/data_sgz_luquzhuanye_1711_1_data_list.php',
        data: { Value: e.detail.value , action: 'getcode' ,FormID:FormID,FlowID:FlowID,dandian_user_action:dandian_user_action},
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {// 设置请求的 header
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Authorization': getApp().globalData.LOGIN_ACCESS_TOKEN
        },
        success: function (res) {
          //此变量赋值写法比较特殊,是利用变量指针,对动态变量进行赋值.
          var showFieldId = e.currentTarget.dataset.id;
          var fieldlist = e.currentTarget.dataset.fieldlist;
          var fieldlistArray = fieldlist.split(',');
          var Field2Index = util.array_flip(fieldlistArray);
          //util.log(Field2Index);
          //showFieldId = 5;//showFieldId的值为要修改的字段的ID值,但是在这个地方要修改其它字段,所以需要有一个变量来存储所有的字段,并可以转换为其ID的值.
          //得到要指定同步的字段的ID值.
          showFieldId = Field2Index['专业名称'];
          util.log(Field2Index);util.log("showFieldId:"+showFieldId); util.log(res.data);  
          var 整个表单字段对像 = e.currentTarget.dataset.liebiao;
          var 专业名称字段的值 = 整个表单字段对像[showFieldId]['用户答案'];
          //要把返回的JSON文本转化为JSON的对像,然后才可以进行调用.
          var 专业名称选项 = [];
          for(var DD=0; DD<res.data.length; DD++)		{
            专业名称选项[DD] 	= res.data[DD]['专业名称'];
          }
          if(res.data.length==0)    {
            专业名称选项[0] = '请选择';
          }
          util.log(整个表单字段对像); 
          util.log(专业名称选项); 
          let updateData = {};
          updateData['liebiao[' + showFieldId + '].options']            = 专业名称选项;
          if(专业名称字段的值 == '' || 专业名称字段的值 == undefined || res.data.length==0)     {
            updateData['liebiao[' + showFieldId + '].用户答案']        = 专业名称选项[0];
            updateData['liebiao[' + showFieldId + '].chooseName']     = 专业名称选项[0];
          }   
          if(专业名称字段的值 != '' && 专业名称字段的值 != undefined && res.data.length>0)     {
            if (util.in_array(专业名称字段的值, 专业名称选项)==false)        { 
              updateData['liebiao[' + showFieldId + '].用户答案']        = 专业名称选项[0];
              updateData['liebiao[' + showFieldId + '].chooseName']     = 专业名称选项[0];
            }
          }               
          util.log("专业名称字段的值:"+专业名称字段的值);   
          that.setData(updateData);
        },
      })
    }
  },

  新建页面字段类型校验: function (e, isOrNot,formtype) {
    let that = this;
    var 字段输入的值 = e.detail.value;
    var showFieldId = e.currentTarget.dataset.id;
    var showFieldName = e.currentTarget.dataset.name;
    var 是否必填 = e.currentTarget.dataset.ismustvalue;
    util.log(e); util.log(是否必填); util.log(字段输入的值);
    if (字段输入的值.length == 0 && 是否必填=='是') {
      wx.showToast({
        title: '请输入' + showFieldName + '！',
        icon: 'success',
        duration: 1500
      }); 
      //禁用FORM提交按钮．
      let updateData = {};
      updateData['isFormSubmitButtonDisabled'] = true;
      updateData['isFormSubmitButtonValue'] = '请先填写' + showFieldName + '的值,禁用提交';
      updateData['liebiao[' + showFieldId + '].FieldCheckResult'] = "../../images/no01.png";
      updateData['liebiao[' + showFieldId + '].光标定位'] = true;
      this.setData(updateData);
      return false;
    }
    if (字段输入的值.length == 0 && 是否必填 !== '是') {
      //允许不填写
      //启用FORM提交按钮．
      let updateData = {};
      updateData['isFormSubmitButtonDisabled'] = false;
      updateData['isFormSubmitButtonValue'] = '提   交';
      updateData['liebiao[' + showFieldId + '].FieldCheckResult'] = "../../images/yes01.png";
      this.setData(updateData);
      return true;
    }
    //var myreg = /^-?\d+$/;
    if (isOrNot) {
      wx.showToast({
        title: '' + showFieldName + '格式有误！',
        icon: 'success',
        duration: 1500
      });
      //禁用FORM提交按钮．
      let updateData = {};
      updateData['isFormSubmitButtonDisabled']  = true;
      updateData['isFormSubmitButtonValue'] = showFieldName + '格式有误,禁用提交';
      updateData['liebiao[' + showFieldId + '].FieldCheckResult'] = "../../images/no01.png";
      updateData['liebiao[' + showFieldId + '].光标定位'] = true;
      this.setData(updateData); 
      return false;
    }
    else {
      //启用FORM提交按钮．
      if (formtype =='微信支付')      {
        let updateData = {};
        updateData['isFormSubmitButtonDisabled'] = false;
        updateData['isFormSubmitButtonValue'] = '进行支付';
        updateData['liebiao[' + showFieldId + '].FieldCheckResult'] = "../../images/yes01.png";
        this.setData(updateData);
      }
      else  {
        let updateData = {};
        updateData['isFormSubmitButtonDisabled'] = false;
        updateData['isFormSubmitButtonValue'] = '提   交';
        updateData['liebiao[' + showFieldId + '].FieldCheckResult'] = "../../images/yes01.png";
        this.setData(updateData);
      }      
      return true;
    }
  },

  number: function (e) {
    let that = this;
    var myreg = /^-?\d+$/;
    var isOrNot = !myreg.test(e.detail.value);
    var returnInfor = that.新建页面字段类型校验(e, isOrNot);
  },

  float: function (e) {
    let that = this;
    var myreg = /(^([-]?)[1-9]([0-9]+)?(\.[0-9]{1,2})?(\.)?$)|(^([-]?)(0){1}$)|(^([-]?)[0-9]\.[0-9]([0-9])?(\.)?$)/;
    var isOrNot = !myreg.test(e.detail.value);
    var returnInfor = that.新建页面字段类型校验(e, isOrNot);
  },

  微信支付: function (e) {
    let that = this;
    var myreg = /(^([-]?)[1-9]([0-9]+)?(\.[0-9]{1,2})?(\.)?$)|(^([-]?)(0){1}$)|(^([-]?)[0-9]\.[0-9]([0-9])?(\.)?$)/;
    var isOrNot = !myreg.test(e.detail.value);
    var returnInfor = that.新建页面字段类型校验(e, isOrNot,'微信支付');
  },

  url: function (e) {
    let that = this;
    var myreg = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;
    var isOrNot = !myreg.test(e.detail.value);
    var returnInfor = that.新建页面字段类型校验(e, isOrNot);
  },
  
  新建编辑页面身份证号信息校验: function (e) {
    let that = this;
    var name = e.currentTarget.dataset.name;
    var fieldlist = e.currentTarget.dataset.fieldlist;
    var fieldlistArray = fieldlist.split(',');
    name = name.replace("号码","类型");
    name = name.replace("号","类型");
    if(util.in_array(name,fieldlistArray))     {
      var ARRAY_FLIP = util.array_flip(fieldlistArray);
      var index = ARRAY_FLIP[name];
      var chooseName = e.currentTarget.dataset.liebiao[index]['chooseName'];
      var 用户答案   = e.currentTarget.dataset.liebiao[index]['用户答案'];
      var 身份证类型 = '';
      if(chooseName!=undefined) {
        身份证类型 = chooseName;
      }
      else      {
        身份证类型 = 用户答案;
      }
      //util.log(fieldlistArray);      util.log(ARRAY_FLIP);      util.log(index);      util.log(e.currentTarget.dataset.liebiao);      util.log(chooseName);      util.log(用户答案);      util.log(身份证类型);
      if(身份证类型=="居民身份证")      {
        var isOrNot = !util.idcard_checksum18(e.detail.value);
      }
      else      {
        //其它证件,不做身份证号类型校验.
        var isOrNot = false;
      }
    }
    else    {
      //只有身份证号,没有身份证件类型选项
      var isOrNot = !util.idcard_checksum18(e.detail.value);
    }
    var returnInfor = that.新建页面字段类型校验(e, isOrNot);
  },

  新建编辑页面身份证号同步出生日期性别年龄: function (e) {
    let that = this;
    var 字段输入的值 = e.detail.value;
    var isOrNot = !util.idcard_checksum18(e.detail.value);
    var returnInfor = that.新建页面字段类型校验(e, isOrNot);
    //此变量赋值写法比较特殊,是利用变量指针,对动态变量进行赋值.
    //得到出生日期这个字段的索引值.
    var fieldlist = e.currentTarget.dataset.fieldlist;
    var fieldlistArray = fieldlist.split(',');
    var Field2Index = util.array_flip(fieldlistArray);
    //util.log(Field2Index);
    //showFieldId = 5;//showFieldId的值为要修改的字段的ID值,但是在这个地方要修改其它字段,所以需要有一个变量来存储所有的字段,并可以转换为其ID的值.
    //得到要指定同步的字段的ID值.
    var showFieldId = Field2Index['出生日期'];
    if (showFieldId>0)        {
      var birthday = 字段输入的值.substring(6, 10) + "-" + 字段输入的值.substring(10, 12) + "-" + 字段输入的值.substring(12, 14);
      util.log("birthday:" + birthday);
      let updateData = {};
      updateData['liebiao[' + showFieldId + '].用户答案'] = birthday;//把值赋值给指定字段.
      updateData['liebiao[' + showFieldId + '].只读'] = "是";//禁止拼音字段进行编辑
      updateData['liebiao[' + showFieldId + '].控件禁用'] = true;//禁止拼音字段进行编辑
      that.setData(updateData);
    }
    var showFieldId = Field2Index['性别'];
    if (showFieldId > 0) {
      if (parseInt(字段输入的值.substr(16, 1)) % 2 == 1) {
        var 性别 = '男';
        var 性别_index = 0;
      }
      else    {
        var 性别 = '女';
        var 性别_index = 1;
      }
      util.log("性别:" + 性别);
      let updateData = {};
      updateData['liebiao[' + showFieldId + '].微信小程序_用户答案'] = 性别_index;//把值赋值给指定字段.
      updateData['liebiao[' + showFieldId + '].用户答案'] = 性别;//把值赋值给指定字段.
      updateData['liebiao[' + showFieldId + '].chooseName'] = 性别;//把值赋值给指定字段.
      updateData['liebiao[' + showFieldId + '].控件禁用'] = true;//禁止拼音字段进行编辑
      updateData['liebiao[' + showFieldId + '].FieldCheckResult'] = "../../images/yes01.png";
      that.setData(updateData);
    }
    var showFieldId = Field2Index['年龄'];
    if (showFieldId > 0) {
      var myDate = new Date();
      var month = myDate.getMonth() + 1;
      var day = myDate.getDate();
      var age = myDate.getFullYear() - 字段输入的值.substring(6, 10) - 1;
      if (字段输入的值.substring(10, 12) < month || 字段输入的值.substring(10, 12) == month && 字段输入的值.substring(12, 14) <= day) {
        age++;
      }
      util.log("age:" + age);
      let updateData = {};
      updateData['liebiao[' + showFieldId + '].用户答案'] = age;//把值赋值给指定字段.
      updateData['liebiao[' + showFieldId + '].只读'] = "是";//禁止拼音字段进行编辑
      that.setData(updateData);
    }
  },

  银行卡19位: function (e) {
    let that        = this;
    var isOrNot     = !util.BankCardNumber19Check(e.detail.value);
    var returnInfor = that.新建页面字段类型校验(e, isOrNot);
  },

  email: function (e) {
    let that = this;
    var myreg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    var isOrNot = !myreg.test(e.detail.value);
    var returnInfor = that.新建页面字段类型校验(e, isOrNot);
  },

  telephone: function (e) {
    let that = this;
    var myreg     = /^((\d{2,4})-)?(\d{7,8})(-(\d{3,}))?$/;
    var isTel     = myreg.test(e.detail.value);
    var myreg     = /^1\d{10}$/;
    var isPhone   = myreg.test(e.detail.value);
    if (isTel || isPhone) {
      var isOrNot = false;//格式正确
    }
    else  {
      var isOrNot = true;//格式有误
    }
    var returnInfor = that.新建页面字段类型校验(e, isOrNot);
  },

  mobile: function (e) {
    let that = this;
    var myreg = /^1\d{10}$/;
    var isOrNot = !myreg.test(e.detail.value);
    var returnInfor = that.新建页面字段类型校验(e, isOrNot);
  },

  点击多选控件: function (e) {
    var that = this;
    var vauleArray = e.detail.value;
    var showFieldName = e.currentTarget.dataset.name;
    util.log(e);
    //此变量赋值写法比较特殊,是利用变量指针,对动态变量进行赋值.
    var showFieldId = e.currentTarget.dataset.id;
    let updateData = {};
    var FieldValue = vauleArray.join(',');
    updateData['liebiao[' + showFieldId + '].用户答案'] = FieldValue;
    this.setData(updateData);
    that.非空(e);
  },

  date: function (e) {
    var that = this;
    var time = e.detail.value;
    var showFieldName = e.currentTarget.dataset.name;
    util.log(time);
    //此变量赋值写法比较特殊,是利用变量指针,对动态变量进行赋值.
    var showFieldId = e.currentTarget.dataset.id;
    let updateData = {};
    updateData['liebiao[' + showFieldId + '].用户答案'] = time;
    this.setData(updateData);
  },

  time: function (e) {
    var that = this;
    var time = e.detail.value;
    var showFieldName = e.currentTarget.dataset.name;
    util.log(time);
    //此变量赋值写法比较特殊,是利用变量指针,对动态变量进行赋值.
    var showFieldId = e.currentTarget.dataset.id;
    let updateData = {};
    updateData['liebiao[' + showFieldId + '].用户答案'] = time;
    this.setData(updateData);
  },

  //循环一列SELECT类型的数据,有类型,类别,民族等之类的单个下拉框.
  绑定单个RADIO选择框: function (e) {
    var that = this;
    var ChooseValue = e.detail.value;
    var showFieldRangeName  = e.currentTarget.dataset.range;
    var chooseName = showFieldRangeName[ChooseValue]['label'];
    util.log(e);
    //此变量赋值写法比较特殊,是利用变量指针,对动态变量进行赋值.
    var showFieldId = e.currentTarget.dataset.id;
    util.log("showFieldId:" + showFieldId);
    util.log("ChooseValue:" + ChooseValue);
    util.log("chooseName:" + chooseName);
    util.log(e);
    let updateData = {};
    updateData['liebiao[' + showFieldId + '].value']        = ChooseValue;
    updateData['liebiao[' + showFieldId + '].chooseName']   = chooseName;
    updateData['isFormSubmitButtonDisabled'] = false;
    updateData['isFormSubmitButtonValue'] = '提   交';
    this.setData(updateData);
  },

  //循环一列SELECT类型的数据,有类型,类别,民族等之类的单个下拉框.
  绑定单个下拉选择框: function (e) {
    var that = this;
    var ChooseValue = e.detail.value;
    var showFieldRangeName  = e.currentTarget.dataset.range;
    //此变量赋值写法比较特殊,是利用变量指针,对动态变量进行赋值.
    var showFieldId = e.currentTarget.dataset.id;
    let updateData = {};
    if(e.currentTarget.dataset.name != e.currentTarget.dataset.code) {
        updateData['liebiao[' + showFieldId + '].chooseName']       = showFieldRangeName[ChooseValue]['label'];
        updateData['liebiao[' + showFieldId + '].chooseNameCode']   = showFieldRangeName[ChooseValue]['value'];
    }
    else {
        updateData['liebiao[' + showFieldId + '].chooseName']       = showFieldRangeName[ChooseValue]['label'];
    }
    console.log(updateData['liebiao[' + showFieldId + ']'])
    updateData['liebiao[' + showFieldId + '].value']            = ChooseValue;
    updateData['liebiao[' + showFieldId + '].FieldCheckResult'] = "../../images/yes01.png";
    updateData['isFormSubmitButtonDisabled'] = false;
    updateData['isFormSubmitButtonValue'] = '提   交';
    this.setData(updateData);
    //关联更新:掌上校园的控件,选中第一列中的某个值,可以自动更改第二列中的某个值.这个跟[二级下拉]控件类型
    //区别:关联更新是两个独立字段之间的联动,[二级下拉]控件是一个字段,点击开之后,会有一级分类,二级值,实质上面是一个字段.
    var relativeupadte = e.currentTarget.dataset.relativeupadte;
    if (relativeupadte == 1) {
      var relativejsonfilter = e.currentTarget.dataset.relativejsonfilter;
      var NextshowFieldId = showFieldId+1;
      let updateData = {};
      updateData['liebiao[' + NextshowFieldId + '].options']        = relativejsonfilter[chooseName];
      updateData['liebiao[' + NextshowFieldId + '].values']         = relativejsonfilter[chooseName][0];
      updateData['liebiao[' + NextshowFieldId + '].chooseName']     = relativejsonfilter[chooseName][0];
      util.log(relativejsonfilter[chooseName]);
      this.setData(updateData);
    }
  },

  //两列菜单的左侧菜单:暂时还没有发现这个函数有什么特别的作用,可以用于记录一下操作,或是做其它的工作.
  绑定二级下拉选择框: function (e) {
    util.log(e.detail.value)
    var updateData = {
      //TwoSelectorValue: e.detail.value,
    };
    //this.setData(updateData);
  },
  /*
  两列菜单的右侧菜单 
  写法原理:需要理解微信小程序多列下拉框部分的代码写法,然后才能理解本段代码的写法.本段代码的写法本质上面就是构造官方示例代码,然后来跑起来.
  使用场景:循环两列SELECT类型的数据, 有如用户信息, 班级的学生信息, 积分的分组和明细信息等单个下拉框.
  */
  绑定二级下拉选择框_列改变: function (e) {
    var that = this;
    var showFieldName = e.currentTarget.dataset.name;//TD标签里面的左侧显示部分,如班级列表,课程列表等.
    var showFieldValue = e.currentTarget.dataset.value;//这个存储的是最初的值,是一个数组,格式如下:array(左侧菜单某一个值的数组索引,右侧菜单某一个值的数组索引)
    var answerValue = e.currentTarget.dataset.answer;//这个存储的是最初的值,是一个数组,格式如下:array(左侧菜单某一个值的数组的名称,右侧菜单某一个值的数组的名称)
    //默认值赋值
    if (that.data.TwoSelect_one == '') that.data.TwoSelect_one = answerValue[0];
    if (that.data.TwoSelect_two == '') that.data.TwoSelect_two = answerValue[1];

    var range = e.currentTarget.dataset.range;//微信小程序里面两列菜单显示所需要用到的结构,格式如下:array(array(KEY1,KEY2),array(KEY1下面的数组))
    var alldata = e.currentTarget.dataset.alldata;//最初的数据结构,array(KEY1=>array(KEY1下面的数组),KEY2=>array(KEY2下面的数组))
    //此变量赋值写法比较特殊,是利用变量指针,对动态变量进行赋值.
    var showFieldId = e.currentTarget.dataset.id;
    //util.log("showFieldId:" + showFieldId);
    util.log('修改的列为'+e.detail.column+'，值为'+e.detail.value);
    //数组赋值写法:先做变量的赋值初始化操作,如showFieldValue变量的值,然后针对这个showFieldValue的值的某一个数组下标的值,进行赋值,如下面这行代码.
    //最后把showFieldValue的值赋值给一个整体变量.
    showFieldValue[e.detail.column] = e.detail.value;//赋值操作
    var updateData = {};

    switch (e.detail.column) {
      //选中左边第一列时需要做的动作.
      case 0:
        //e.detail.value的值是一个动态变量,不需要
        var 左侧选中项名称 = range[0][e.detail.value];
        var 右侧数组显示 = util.array_values_idname2name(alldata[左侧选中项名称]);
        that.data.TwoSelect_one = 左侧选中项名称;
        //util.log("TwoSelect_one:"); util.log(that.data.TwoSelect_one);
        //util.log("右侧数组显示:"); util.log(右侧数组显示);
        range[1] = 右侧数组显示;
        showFieldValue[1] = 0;
        that.data.TwoSelect_two = 右侧数组显示[0];
        updateData['liebiao[' + showFieldId + '].微信小程序_左右下拉数组'] = range;
        break;
      case 1:
        //需要先判断一下that.data.TwoSelect_one的值是不是在左侧里面,如果不在,则默认为左侧数组的第一个值. 不然会:先点击第一个下接,再点第二个下拉菜单的时候,就会出错
        if (util.in_array(that.data.TwoSelect_one, range[0])==false)        {
          that.data.TwoSelect_one = answerValue[0];
        }
        //e.detail.value的值是一个动态变量,不需要
        //util.log("that.data.TwoSelect_one:" + that.data.TwoSelect_one);
        var 右侧选中项名称 = range[1][e.detail.value];
        //util.log("中侧选中项名称:"); util.log(中侧选中项名称);
        var 右侧数组显示 = util.array_values_idname2name(alldata[that.data.TwoSelect_one][右侧选中项名称]);
        that.data.TwoSelect_two = 右侧选中项名称;
        updateData['liebiao[' + showFieldId + '].微信小程序_左右下拉数组'] = range;
        break;
    }
    var 用户答案 = alldata[that.data.TwoSelect_one][showFieldValue[1]]['id'];
    updateData['liebiao[' + showFieldId + '].微信小程序_用户答案_INDEX'] = showFieldValue;
    updateData['liebiao[' + showFieldId + '].用户答案'] = 用户答案;
    updateData['liebiao[' + showFieldId + '].FieldCheckResult'] = "../../images/yes01.png";
    updateData['isFormSubmitButtonDisabled'] = false;
    updateData['isFormSubmitButtonValue'] = '提   交';
    this.setData(updateData);

    util.log(that.data.TwoSelect_one + that.data.TwoSelect_two);
    util.log(updateData);
  },

  绑定三级下拉选择框_列改变: function (e) {
    var that = this;
    var showFieldName = e.currentTarget.dataset.name;//TD标签里面的左侧显示部分,如班级列表,课程列表等.
    var showFieldValue = e.currentTarget.dataset.value;//这个存储的是最初的值,是一个数组,格式如下:array(左侧菜单某一个值的数组索引,右侧菜单某一个值的数组索引)
    var answerValue = e.currentTarget.dataset.answer;//这个存储的是最初的值,是一个数组,格式如下:array(左侧菜单某一个值的数组的名称,右侧菜单某一个值的数组的名称)
    //默认值赋值
    if (that.data.ThreeSelect_one == '') that.data.ThreeSelect_one = answerValue['省'];
    if (that.data.ThreeSelect_two == '') that.data.ThreeSelect_two = answerValue['市'];
    if (that.data.ThreeSelect_three == '') that.data.ThreeSelect_three = answerValue['区'];

    var range = e.currentTarget.dataset.range;//微信小程序里面两列菜单显示所需要用到的结构,格式如下:array(array(KEY1,KEY2),array(KEY1下面的数组))
    var alldata = e.currentTarget.dataset.alldata;//最初的数据结构,array(KEY1=>array(KEY1下面的数组),KEY2=>array(KEY2下面的数组))
    //此变量赋值写法比较特殊,是利用变量指针,对动态变量进行赋值.
    var showFieldId = e.currentTarget.dataset.id;
    //util.log("showFieldId:" + showFieldId);

    util.log('修改的列为' + e.detail.column + '，值为' + e.detail.value);
    //util.log('e.detail.column');
    //util.log(e.detail.column);
    util.log(answerValue);

    //数组赋值写法:先做变量的赋值初始化操作,如showFieldValue变量的值,然后针对这个showFieldValue的值的某一个数组下标的值,进行赋值,如下面这行代码.
    //最后把showFieldValue的值赋值给一个整体变量.
    showFieldValue[e.detail.column] = e.detail.value;//赋值操作

    var updateData = {};
    
    switch (e.detail.column) {
      //选中左边第一列时需要做的动作.
      case 0:
        //e.detail.value的值是一个动态变量,不需要
        var 左侧选中项名称 = range[0][e.detail.value];
        var 中侧数组显示 = util.array_keys(alldata[左侧选中项名称]);
        that.data.ThreeSelect_one = 左侧选中项名称;
        //util.log("ThreeSelect_one:"); util.log(that.data.ThreeSelect_one);
        range[1] = 中侧数组显示;    
        var 右侧数组显示 = util.array_values_idname2name(alldata[that.data.ThreeSelect_one][中侧数组显示[0]]);    
        range[2] = 右侧数组显示;
        showFieldValue[1] = 0;
        showFieldValue[2] = 0;
        that.data.ThreeSelect_two   = 中侧数组显示[0];
        that.data.ThreeSelect_three = 右侧数组显示[0];
        updateData['liebiao[' + showFieldId + '].微信小程序_左右下拉数组'] = range;
        break;
      case 1:
        //e.detail.value的值是一个动态变量,不需要
        //util.log("that.data.ThreeSelect_one"); util.log(that.data.ThreeSelect_one);
        var 中侧选中项名称 = range[1][e.detail.value];
        //util.log("中侧选中项名称:"); util.log(中侧选中项名称);
        var 右侧数组显示 = util.array_values_idname2name(alldata[that.data.ThreeSelect_one][中侧选中项名称]);
        that.data.ThreeSelect_two = 中侧选中项名称;
        //util.log("右侧数组显示:"); util.log(右侧数组显示);
        range[2] = 右侧数组显示;
        showFieldValue[2] = 0;
        that.data.ThreeSelect_three = 右侧数组显示[0];
        updateData['liebiao[' + showFieldId + '].微信小程序_左右下拉数组'] = range;
        break;
      case 2:
        //e.detail.value的值是一个动态变量,不需要
        var 左侧选中项名称 = that.data.ThreeSelect_one;
        var 中侧选中项名称 = that.data.ThreeSelect_two;
        var 右侧选中项名称 = range[2][e.detail.value];
        that.data.ThreeSelect_three = 右侧选中项名称;
        break;
    }
    var 行政区代码 = alldata[that.data.ThreeSelect_one][that.data.ThreeSelect_two][showFieldValue[2]]['id'];
    updateData['liebiao[' + showFieldId + '].微信小程序_用户答案_INDEX'] = showFieldValue
    updateData['liebiao[' + showFieldId + '].用户答案'] = 行政区代码;
    updateData['liebiao[' + showFieldId + '].FieldCheckResult'] = "../../images/yes01.png";
    this.setData(updateData);

    util.log(that.data.ThreeSelect_one + that.data.ThreeSelect_two + that.data.ThreeSelect_three);
    util.log(updateData);
  },

  phpMap2MultiSelectorUseFormat: function (phpMap) {
    var LeftArray = [];
    var RightArray = [];
    for (var Key in phpMap) {
      LeftArray.push(Key);
      RightArray.push(phpMap[Key]);
    };
    //初始化的时候,第一个数组为左侧数据,第二个数据为左侧数据当中第一列在右侧的值.
    var UseSelector = [];
    UseSelector.push(LeftArray);
    UseSelector.push(RightArray[0]);
    var ALL = [];
    ALL.push(LeftArray);//形成第一个数据,主要用于在记录对象的KEYS,但这个数据在实际使用过程中,没有被使用.
    ALL.push(RightArray);//这个是主要用于记录对象里面的数组,跟原有数据的不同在于下标是数字,而不是原有的KEY.
    ALL.push(UseSelector);//这个数组格式是小程序特有的格式,第一列是一级显示,第二列为一级显示中的第一个值下面所属的数组列表.
    return ALL;
  },

  //独立使用,姓名转拼音
  姓名汉字转换拼音后同步到拼音字段: function (e) {
    var that = this;
    var 字段输入的值 = e.detail.value;
    var showFieldId = e.currentTarget.dataset.id;
    var showFieldName = e.currentTarget.dataset.name;
    var 是否必填 = e.currentTarget.dataset.ismustvalue;
    //util.log(e); util.log(是否必填); util.log("字段输入的值:" + 字段输入的值);
    if (字段输入的值.length == 0) {
      wx.showToast({
        title: '请输入' + showFieldName + '!',
        icon: 'success',
        duration: 1500
      });
      //禁用FORM提交按钮．
      let updateData = {};
      updateData['isFormSubmitButtonDisabled'] = true;
      updateData['isFormSubmitButtonValue'] = showFieldName + '格式有误,禁用提交';
      updateData['liebiao[' + showFieldId + '].FieldCheckResult'] = "../../images/no01.png";
      updateData['liebiao[' + showFieldId + '].光标定位'] = true;
      this.setData(updateData);
    }
    else        {
      //启用FORM提交按钮．
      let updateData = {};
      updateData['isFormSubmitButtonDisabled'] = false;
      updateData['isFormSubmitButtonValue'] = '提   交';
      updateData['liebiao[' + showFieldId + '].FieldCheckResult'] = "../../images/yes01.png";
      this.setData(updateData);
    }
    //姓名转拼音,转入参数为UTF8,并且要指定格式
    wx.request({
      url: getApp().globalData.SYSTEM_URL + '/general/EDU/Enginee/lib/pinyin.php?code=utf8',
      data: { NAME: e.detail.value },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Authorization': getApp().globalData.LOGIN_ACCESS_TOKEN
      },
      success: function (res) {
        //此变量赋值写法比较特殊,是利用变量指针,对动态变量进行赋值.
        var showFieldId = e.currentTarget.dataset.id;
        var fieldlist = e.currentTarget.dataset.fieldlist;
        var fieldlistArray = fieldlist.split(',');
        var Field2Index = util.array_flip(fieldlistArray);
        //util.log(Field2Index);
        //showFieldId = 5;//showFieldId的值为要修改的字段的ID值,但是在这个地方要修改其它字段,所以需要有一个变量来存储所有的字段,并可以转换为其ID的值.
        //得到要指定同步的字段的ID值.
        showFieldId = Field2Index['拼音'];
        util.log("showFieldId:"); util.log(res.data);

        let updateData = {};
        updateData['liebiao[' + showFieldId + '].用户答案'] = res.data;//把值赋值给拼音字段.
        updateData['liebiao[' + showFieldId + '].只读'] = "是";//禁止拼音字段进行编辑
        that.setData(updateData);
      },
    })
  },
  
  查看页面点击事件: function (e) {
    util.log(e); 
    var type  = e.currentTarget.dataset.type;
    var value  = e.currentTarget.dataset.value;
    if(type=="mobile")      {
        wx.makePhoneCall({
          phoneNumber: value, //此号码仅用于测试 。
           success: function () {
             console.log("拨打电话"+value+"成功！")
           },
           fail: function () {
             console.log("拨打电话"+value+"失败！")
           }
         })
    }
  },

  图片放大: function (e) {
    util.log(e); 
    var id            = e.currentTarget.dataset.id;
    var allimagelist  = e.currentTarget.dataset.allimagelist;
    wx.previewImage({
      current: allimagelist[id],     //当前图片地址
      urls: allimagelist,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  附件下载: function (e) {
    util.log(e);
    var id  = e.currentTarget.dataset.id;
    var url = e.currentTarget.dataset.url;
    var filetype = e.currentTarget.dataset.filetype;
    util.log("附件下载时输出日志:"+url);util.log(filetype);
    wx.downloadFile({       //下载附件
      url: url,
      fileType: filetype,
      success: function (res) {
        console.log(res)
        var filePath = res.tempFilePath
        wx.openDocument({    //打开附件
          filePath: filePath,
          success: function (res) {
            console.log(res)
          },
          complete: function (e) {
            console.log(e)
          }
        })
      }
    })
  },

  上传多个图片: function (e) {
    var that = this;
    //util.log(e);
    var openid = that.data.openid;
    var unionid = that.data.unionid;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        //多选图片进行直接赋值.不需要判断上传是否成功,直接给图片进行赋值.
        //当前部分的赋值操作,只处理了微信小程序端的显示部分,并没有实质的处理上传操作.
        that.data.uploadImageList = res.tempFiles;
        //临时禁用FORM提交,以方便于图片提交
        //启用FORM提交按钮．
        let updateData = {};
        updateData['isFormSubmitButtonDisabled'] = true;
        updateData['isFormSubmitButtonValue'] = '正在上传文件,请稍候...';
        that.setData(updateData);
        //util.log("最初使用的多个图片上传:");
        //util.log(当前手动上传的图片);
        for (var j = 0; j < that.data.uploadImageList.length; j++) {
          //实际上传文件
          that.上传多个图片_上传操作(that.data.uploadImageList[j]['path'], e, j);
          //输出日志
          util.log(that.data.uploadImageList[j]);
        }
      }
    })
  },
  
  上传多个图片_上传操作: function (filePath, e, j) {
    var that = this; 
    var UID = getApp().globalData.LOGIN_USER_UID;;
    var unionid = getApp().globalData.unionid;
    var userInfo  = getApp().globalData.userInfo;
    var nickName  = util.base64encode(userInfo.nickName);
    var avatarUrl = util.base64encode(userInfo.avatarUrl);
    var tempFileStatus = "";
    var CSRF_TOKEN = wx.getStorageSync('DANDIAN_CSRF_TOKEN_CONTENT_'+that.data.pageIdEdit) || ''
    wx.uploadFile({
      url: getApp().globalData.SYSTEM_URL+"/general/EDU/Interface/TDFORMICAMPUS/wechat.file.upload.php",
      filePath: filePath,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data;', 
        'Authorization': getApp().globalData.LOGIN_ACCESS_TOKEN+"::::"+CSRF_TOKEN
      }, // 设置请求的 header
      formData: {
        nickName: nickName,
        avatarUrl: avatarUrl,
        action: 'WECHAT_UPLOAD_IMG',
        openid: openid,
        unionid: unionid,
      }, // HTTP 请求中其他额外的 form data
      success: function (res) {
        //以下代码只用于处理上传图片是否成功的状态,如果成功与否,都进行提示
        //var that = this; 这个里面不能加这行代码,如果加了之后就获取指定的对象属性.
        if (res.statusCode == 200) {
          tempFileStatus = "成功";
          //要把返回的JSON文本转化为JSON的对像,然后才可以进行调用.
          var returnJson = util.stringToJson(res.data);
          //此处赋的值为本地图片的路径.
          var showFieldId         = e.currentTarget.dataset.id; 
          var alluseranswer       = e.currentTarget.dataset.alluseranswer;
          var allimagelist        = e.currentTarget.dataset.allimagelist;
          var tdoafileformatvalue = e.currentTarget.dataset.tdoafileformatvalue;
          util.log(tdoafileformatvalue);
          let url = getApp().globalData.SYSTEM_URL + returnJson['WECHAT_UPLOAD_URL'];
          that.data.uploadImageList[j]['url'] = url;
          that.data.uploadImageList[j]['typeicon'] = url;
          if (alluseranswer == '' || alluseranswer==undefined)  {
            alluseranswer = [];
          }
          alluseranswer.push(that.data.uploadImageList[j]);
          allimagelist.push(url);
          //通达OA格式文件上传规则
          var 微信小程序_通达OA附件格式 = util.tdoafileformatevalue_addfile(tdoafileformatvalue, returnJson['ATTACHMENT_ID'], returnJson['ATTACHMENT_NAME'], returnJson['ATTACHMENT_YM']);
          let updateData = {};
          updateData['liebiao[' + showFieldId + '].用户答案']           = alluseranswer;
          updateData['liebiao[' + showFieldId + '].微信小程序_图片列表'] = allimagelist;
          updateData['liebiao[' + showFieldId + '].微信小程序_通达OA附件格式'] = 微信小程序_通达OA附件格式;
          updateData['isFormSubmitButtonDisabled'] = false;
          updateData['isFormSubmitButtonValue'] = '提   交';
          that.setData(updateData);
          util.log("文件上传成功以后返回的文件路径:"+that.data.uploadImageList[j]['url']);
        }
        else {
          tempFileStatus = "失败";
          let updateData = {};
          updateData['isFormSubmitButtonDisabled'] = false;
          updateData['isFormSubmitButtonValue'] = '提   交';
          that.setData(updateData);
          return false;
        }
      },
      fail: function (res) {
        util.log(res);//仅限于提交失败,并不代表上传失败
        let updateData = {};
        updateData['isFormSubmitButtonDisabled'] = false;
        updateData['isFormSubmitButtonValue'] = '提   交';
        that.setData(updateData);
        return false;
      }
    });
  },

  弹出多选窗口: function(e) {
    util.log(e);
    let that = this;
    var showFieldId = e.currentTarget.dataset.id;
    let updateData = {};
    updateData['liebiao[' + showFieldId + '].DisabledJumpMultiChoice'] = true;//点击之后禁用
    that.setData(updateData);
    wx.navigateTo({
      url: '../login/JumpToMultiChoice?id=' + showFieldId,
    });
    //延时两秒自动启用[弹出窗口]按钮,防止用户在新弹出窗口以后,点击返回,无法找到[弹出窗口]的问题.
    setTimeout(function () {
      let updateData = {};
      updateData['liebiao[' + showFieldId + '].DisabledJumpMultiChoice'] = false;//两秒后自动启用
      that.setData(updateData);
    }, 2000);    
  },

  弹出多选窗口_删除某一个记录时的弹出窗: function(e) {
    let that = this;
    var showFieldId = e.currentTarget.dataset.id; 
    let studentinfo = e.currentTarget.dataset.studentinfo;
    let deleteindex = e.currentTarget.dataset.deleteindex;
    wx.showModal({
      title: '删除确认',
      content: '您确认要删除此项[' + studentinfo.studentname + '][' + studentinfo.studentid + ']记录么?',
      success(res) {
        if (res.confirm) {
          //确认删除指定的记录
          that.弹出多选窗口_确认删除按钮(e);
        }
        else    {
          //取消删除操作,什么也不需要做
        }
      }
    })
    //console.log(e)
    let updateData = {};    
    updateData['liebiao[' + showFieldId + '].isShowDeleteStudent'] = true;
    updateData['liebiao[' + showFieldId + '].deleteStudentInfo'] = studentinfo;
    that.setData(updateData);
  },

  // 点击确认删除
  弹出多选窗口_确认删除按钮(e) {
    let that = this;
    var showFieldId = e.currentTarget.dataset.id;
    let height = e.currentTarget.dataset.height;
    let studentinfo = e.currentTarget.dataset.studentinfo;
    let deleteindex = e.currentTarget.dataset.deleteindex;
    let allselected = e.currentTarget.dataset.allselected;
    allselected.splice(deleteindex, 1);
    var 用户答案ID列表ARRAY = [];
    for (var i = 0; i < allselected.length; i++) {
      用户答案ID列表ARRAY.push(allselected[i]['studentid']);
    }
    let updateData = {}; 
    updateData['liebiao[' + showFieldId + '].微信小程序_弹出多选高度'] = height-52;
    updateData['liebiao[' + showFieldId + '].微信小程序_已选数组结构'] = allselected;
    updateData['liebiao[' + showFieldId + '].用户答案ID列表'] = 用户答案ID列表ARRAY.join(',');;
    that.setData(updateData);
  },

  表单校验: function (e) {
    var that = this; 
    var 提交地址 = e.detail.target.dataset.submiturl;
    var 表单所有字段 = e.detail.target.dataset.allfieldlist;
    var 所有必填字段 = e.detail.target.dataset.allmustfieldlist;
    var 表单提交还是支付 = e.detail.target.dataset.submitaction;
    var 表单支付_当前记录编号 = e.detail.target.dataset.submitcurrentid;
    var 表单支付_存储金额字段 = e.detail.target.dataset.submitcurrentpayfield;
    var 表单支付_当前表单名称 = e.detail.target.dataset.submitcurrentform;
    var 表单支付_当前表单名称中文 = e.detail.target.dataset.submitcurrentformchinese;
    var 表单提交字段 = e.detail.value;
    //用于后台PHP程序处理数据时,做为判断来源和依据.
    表单提交字段['DataSource']    = "MiniProgram";
    表单提交字段['allfieldlist']  = 表单所有字段;
    
    var liebiaoArray = e.detail.target.dataset.liebiao;
    var fieldlistArray = e.detail.target.dataset.fieldlist.split(',');
    var Field2Index = util.array_flip(fieldlistArray);
    util.log(liebiaoArray);util.log(fieldlistArray);util.log(Field2Index);
    for ( var i = 0; i < 所有必填字段.length;i++)    {
      var 字段名称  = 所有必填字段[i];
      var 字段值    = 表单提交字段[字段名称];
      util.log("(必填字段)" + 字段名称 + ":" + 字段值);
      var showFieldId = Field2Index[字段名称];
      
      if (字段值 == undefined || 字段值 == '' || 字段值 == '请选择' || 字段值 == '||')      {
        //禁用FORM提交按钮．
        let updateData = {};
        updateData['isFormSubmitButtonDisabled'] = true;
        updateData['isFormSubmitButtonValue'] = 字段名称 + '为空,禁用提交';
        that.setData(updateData);
        //弹出消息提示
        wx.showToast({
          title: 字段名称 + '为空',
          icon: 'success',
          duration: 2000,
        });
        //延时两秒自动启用[提交]按钮
        setTimeout(function () {
          let updateData = {};
          updateData['isFormSubmitButtonDisabled'] = false;//
          updateData['isFormSubmitButtonValue'] = '提   交';
          that.setData(updateData);
        }, 2000);  
        return false;
      }
      if (0)      {
        //禁用FORM提交按钮．
        let updateData = {};
        updateData['isFormSubmitButtonDisabled'] = true;
        updateData['isFormSubmitButtonValue'] = 字段名称 + '不合规,禁用提交';
        that.setData(updateData);
        //弹出消息提示
        util.showModal("错误提示", "["+字段名称+"]不合规!如果内容正确,请再次点击数值进行确认.");
        //延时两秒自动启用[提交]按钮
        setTimeout(function () {
          let updateData = {};
          updateData['isFormSubmitButtonDisabled'] = false;//
          updateData['isFormSubmitButtonValue'] = '提   交';
          that.setData(updateData);
        }, 2000);  
        return false;
      }
    }

    //数据提交以后,禁用表单操作按钮.防止二次提交
    let updateData = {};
    updateData['isFormSubmitButtonDisabled'] = true;//调试期间,可以把此设置为 false ,以方便多次点击.
    updateData['isFormSubmitButtonValue'] = '正在为您提交数据,请稍等.';
    that.setData(updateData);

    util.log(getApp().globalData.SYSTEM_URL + that.data.PageURL + 提交地址);
    
    //构建每次提交的DATA的参数的值.
    //var PostData = {};
    表单提交字段['表单支付_当前表单名称中文'] = 表单支付_当前表单名称中文;
    表单提交字段['表单支付_当前表单名称'] = 表单支付_当前表单名称;
    表单提交字段['表单支付_存储金额字段'] = 表单支付_存储金额字段;
    表单提交字段['表单支付_当前记录编号'] = 表单支付_当前记录编号;
    表单提交字段['openid'] = getApp().globalData.openid;
    表单提交字段['unionid'] = getApp().globalData.unionid;
    表单提交字段['LOGIN_SCHOOL_ID'] = getApp().globalData.LOGIN_SCHOOL_ID;
    表单提交字段['SYSTEM_IS_CLOUD'] = getApp().globalData.SYSTEM_IS_CLOUD;
    表单提交字段['SYSTEM_APPSTORE_ID'] = getApp().globalData.SYSTEM_APPSTORE_ID;

    util.log("表单提交还是支付:" + 表单提交还是支付);

    if (表单提交还是支付=="进行支付")     {
      //表单支付
      util.log('开始支付-----------------------------------------------------');
      util.log(表单提交字段);
      //前置判断,判断金额是否为空
      var 支付金额 = 表单提交字段[表单支付_存储金额字段];
      if (支付金额 == 0 || 支付金额 == "" || 支付金额 == undefined) {
        let updateData = {};
        updateData['isFormSubmitButtonDisabled'] = false;
        updateData['submitaction'] = "进行支付";
        updateData['isFormSubmitButtonValue'] = "点击重新支付";
        that.setData(updateData);
        util.showModal("错误提示", "您输入的支付金额为零!");
        return false;
      }
      //第一步:申请预支付操作,同时返回下面所需要的操作.
      表单提交字段['action'] = "prepay";
      var CSRF_TOKEN = wx.getStorageSync('DANDIAN_CSRF_TOKEN_CONTENT_'+that.data.pageIdEdit) || ''
      wx.request({  //
        url: getApp().globalData.SYSTEM_URL + getApp().globalData.PayMentInterface,//字段列表
        data: 表单提交字段,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {// 设置请求的 header
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Authorization': getApp().globalData.LOGIN_ACCESS_TOKEN+"::::"+CSRF_TOKEN
        },
        success: function (res) {
          util.log('prepay submit success----------------------------------');
          util.log(res);
          var ress = res.data;
          if (ress['return_code'] == "SUCCESS" && ress['result_code'] == "SUCCESS")         {
            //第二步,发起支付
            wx.requestPayment(
              {
                'timeStamp': ress['paydata']['timeStamp'],
                'nonceStr': ress['paydata']['nonceStr'],
                'package': ress['paydata']['package'],
                'signType': ress['paydata']['signType'],
                'paySign': ress['paydata']['paySign'],
                'success': function (res) { 
                  //成功,禁用表单
                  let updateData = {}; 
                  updateData['isFormSubmitButtonDisabled'] = true;
                  updateData['submitaction'] = "进行支付";
                  updateData['isFormSubmitButtonValue'] = "支付成功";
                  that.setData(updateData);
                  wx.showToast({
                    title: "支付成功",
                    icon: 'success',
                    duration: 2000,
                  });
                  //再次向服务器发起一个请求,来存储到数据库里面.
                  表单提交字段['action'] = "successpay";
                  表单提交字段['ORDERID'] = ress['ORDERID'];
                  var CSRF_TOKEN = wx.getStorageSync('DANDIAN_CSRF_TOKEN_CONTENT_'+that.data.pageIdEdit) || ''
                  wx.request({  //
                    url: getApp().globalData.SYSTEM_URL + getApp().globalData.PayMentInterface,//字段列表
                    data: 表单提交字段,
                    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                    header: {// 设置请求的 header
                      'Content-Type': 'application/x-www-form-urlencoded', 
                      'Authorization': getApp().globalData.LOGIN_ACCESS_TOKEN+"::::"+CSRF_TOKEN
                    },
                    success: function (res) {
                      util.log('再次向服务器发起一个请求,来存储到数据库里面----------------------------------');
                      util.log(res);
                    }
                  });
                  //返回到上一个页面-开始
                  var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
                  var currentPage = pages[pages.length - 1]  // 获取当前页面
                  var prevPage = pages[pages.length - 2]    //获取上一个页面
                  if (prevPage != undefined) {
                    // 设置上一个页面的数据（可以修改，也可以新增）
                    var PageGetUrl = prevPage.data.PageGetUrl;
                    if(PageGetUrl!=undefined)       {
                      util.log("prevPage.data.PageGetUrl:"+prevPage.data.PageGetUrl);
                      prevPage.onLoadData(PageGetUrl, 'goback');
                      //返回成功,不需要延时
                      wx.navigateBack({
                        delta: 1
                      });
                    }
                  }
                  //返回到上一个页面-结束
                },
                'fail': function (res) {
                  let updateData = {};
                  updateData['isFormSubmitButtonDisabled'] = false;
                  updateData['submitaction'] = "进行支付";
                  updateData['isFormSubmitButtonValue'] = "进行支付";
                  that.setData(updateData);
                  util.showModal("支付失败", "提示信息:"+res['errMsg']);
                },
                'complete': function (res) { }
              })
            //end 表单支付
          }
          else if (ress['return_code'] == "FAIL") {
            let updateData = {};
            updateData['isFormSubmitButtonDisabled'] = false;
            updateData['submitaction'] = "进行支付";
            updateData['isFormSubmitButtonValue'] = "进行支付";
            that.setData(updateData);
            util.showModal("支付失败", ress['return_msg']);
            return false;
          }
          else if (ress['result_code'] == "FAIL") {
            let updateData = {};
            updateData['isFormSubmitButtonDisabled'] = false;
            updateData['submitaction'] = "进行支付";
            updateData['isFormSubmitButtonValue'] = "进行支付";
            that.setData(updateData);
            util.showModal("支付失败", ress['err_code_des']);
            return false;
          }
          else {
            //let updateData = {};
            //updateData['isFormSubmitButtonDisabled'] = false;
            //updateData['isFormSubmitButtonValue'] = "点击重新支付";
            //that.setData(updateData);
            //换另外一种消息输出方式,以方便用户来查看提示和处理数据.
            let updateData = {};
            updateData['isFormSubmitButtonDisabled'] = false;
            updateData['submitaction'] = "进行支付";
            updateData['isFormSubmitButtonValue'] = "进行支付";
            that.setData(updateData);
            util.showModal("支付失败", "服务器异常!预支付操作失败!");
            return false;
            //需要延时执行两秒,以便于充分时间来显示提示信息
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '网络异常',
            icon: 'success',
            duration: 2000,
          });
          //启用表单
          let updateData = {};
          updateData['isFormSubmitButtonDisabled'] = false;
          updateData['submitaction'] = "进行支付";
          updateData['isFormSubmitButtonValue'] = "进行支付";
          that.setData(updateData);
        },
      })//end repay 
      util.log('结束支付-----------------------------------------------------');
    }
    else  {
      //表单提交
      var CSRF_TOKEN = wx.getStorageSync('DANDIAN_CSRF_TOKEN_CONTENT_'+that.data.pageIdEdit) || ''
      wx.request({  //提交表单数据
        url: getApp().globalData.SYSTEM_URL + that.data.PageURL + 提交地址,//字段列表
        data: 表单提交字段,
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {// 设置请求的 header
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Authorization': getApp().globalData.LOGIN_ACCESS_TOKEN+"::::"+CSRF_TOKEN
        },
        success: function (res) {
          util.log('submit success');
          util.log(res);
          var ress = res.data;
          if (ress['status'] == "OK") {
            //成功,禁用表单
            let updateData = {};
            updateData['isFormSubmitButtonDisabled'] = true;
            updateData['isFormSubmitButtonValue'] = ress['msg'];
            that.setData(updateData);
            wx.showToast({
              title: ress['msg'],
              icon: 'success',
              duration: 3000,
            });
            //返回到上一个页面
            var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
            var currentPage = pages[pages.length - 1]  // 获取当前页面
            var prevPage = pages[pages.length - 2]    //获取上一个页面
            if (prevPage!= undefined)           {
              // 设置上一个页面的数据（可以修改，也可以新增）
              var PageGetUrl = prevPage.data.PageGetUrl;
              if(PageGetUrl!=undefined)       {
                util.log("prevPage.data.PageGetUrl:"+prevPage.data.PageGetUrl);
                prevPage.onLoadData(PageGetUrl, 'goback');
                //返回成功,不需要延时
                wx.navigateBack({
                  delta: 1
                });
              }
            }
          }
          else    {
            //有异常情况,需要重新填写表单,启用表单
            let updateData = {};
            updateData['isFormSubmitButtonDisabled'] = false;
            updateData['isFormSubmitButtonValue'] = "请重新填写数据后进行提交";
            that.setData(updateData);
            //换另外一种消息输出方式,以方便用户来查看提示和处理数据.
            util.showModal("消息提示", ress['msg']);
            //需要延时执行两秒,以便于充分时间来显示提示信息
          }
        },
        fail: function (res) {
          wx.showToast({
            title: '网络异常',
            icon: 'success',
            duration: 2000,
          });
          //启用表单
          let updateData = {};
          updateData['isFormSubmitButtonDisabled']  = false;
          updateData['isFormSubmitButtonValue']     = '提   交';
          that.setData(updateData);
        },
      })
    }//end 表单提交
  },

  表单重置: function (e) {
    var that = this;
    var 所有必填字段 = e.detail.target.dataset.allmustfieldlist;
    var 表单提交字段 = e.detail.value;
    //未定义
  },

  新生报名登记OPENURL: function (e) {
    var that = this;
    //构造URL参数
    var d = new Date();
    var n = d.getTime();
    var targetURL = getApp().globalData.SYSTEM_NEW_STUDENT_URL+"?time="+n;
    var url = "/pages/login/webview?url=" + util.base64encode(targetURL);
    wx.navigateTo({
      url: url,
    });
    util.log(targetURL);
  },

  goBack: function (e) {
    wx.navigateBack({
      delta: 2,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    util.log('-------------------------')
    util.log(getApp().globalData)
    var UID = getApp().globalData.LOGIN_USER_UID;
    var nickName = getApp().globalData.userInfo.nickName
    var sharesource = util.base64encode(UID);
    var Title = getApp().globalData.Title+"(来自["+nickName+"]的分享)"
    return {
      title: Title,
      path: 'pages/MainData/index?sharesource=' + sharesource
    }
  }

};

module.exports = {
  handler: handler
}

