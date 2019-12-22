//logs.js
const App = getApp();

import Path from "../etc/config.js";



Page({



  /**

   * 页面的初始数据

   */

  data: {

    picAddress: Path.picAddress + 'homePageSearch/',

    hasEmptyGrid: false,

    cur_year: '',

    cur_month: '',

    clickToday: '',

    daysArr: [],
    schedule: ''
  },

  onLoad(options) {

    this.setNowDate();

    const date = new Date();

    const cur_year = date.getFullYear();

    this.setData({

      nowTodayIndex: date.getDate() - 1,

      clickToday: date.getDate() - 1

    })

    this.spotShow()


  },

  onShow:function(){
    var that = this;
    wx.cloud.callFunction({
      name: "content",
      success: function (res) {
        var result = res.result.data[res.result.data.length - 1].thing
        console.log(res)
        that.setData({
          schedule: result,
        })
      }
    })
  },



  // 点击当前日期

  dateSelectAction: function (e) {

    let month = this.data.cur_month

    if (month < 10) {

      month = '0' + month

    }

    let day = cur_day + 1

    if (day < 10) {

      day = '0' + day

    }

    let year = this.data.cur_year

    var cur_day = e.currentTarget.dataset.idx;

    this.setData({

      todayIndex: cur_day,

      clickToday: cur_day,

      clickMonth: month,

      clickYear: year

    })

    console.log(`点击的日期:${this.data.cur_year}年${this.data.cur_month}月${cur_day + 1}日`);

  },



  // 课程列表

  getMySchedule: function (scheduleDate) {

    let that = this;

    wx.request({

      url: Path.basePath + 'event/onlineClass/course/get-my-schedule-ajax',

      header: {

        'token': wx.getStorageSync('token'),

        'content-type': 'application/json'

      },

      method: "POST",

      data: {

        scheduleDate: scheduleDate

      },

      success(res) {

        console.log(res);

        if (res.statusCode === 200) {

          if (res.data.errorCode == 710000) {

            var data = res.data.data.list;

            that.setData({

              list: data

            })

            console.log(data)

          }

        } else {

          App.showModal(res.data.msg);

        }

        wx.hideLoading();

      }

    });

  },



  setNowDate: function () {

    const date = new Date();

    const cur_year = date.getFullYear();

    const cur_month = date.getMonth() + 1;

    const now_year = date.getFullYear();

    const now_month = date.getMonth() + 1;

    const todayIndex = date.getDate() - 1;

    const now_day = date.getDate() - 1;

    console.log(`日期：${todayIndex}`)

    const weeks_ch = ['日', '一', '二', '三', '四', '五', '六'];

    this.calculateEmptyGrids(cur_year, cur_month);

    this.calculateDays(cur_year, cur_month);

    this.setData({

      cur_year: cur_year,

      cur_month: cur_month,

      now_year: now_year,

      now_month: now_month,

      now_day: now_day,

      clickMonth: now_month,

      clickYear: now_year,

      weeks_ch,

      todayIndex,

    })

  },



  getThisMonthDays(year, month) {

    return new Date(year, month, 0).getDate();

  },

  getFirstDayOfWeek(year, month) {

    return new Date(Date.UTC(year, month - 1, 1)).getDay();

  },

  calculateEmptyGrids(year, month) {

    const firstDayOfWeek = this.getFirstDayOfWeek(year, month);

    let empytGrids = [];

    if (firstDayOfWeek > 0) {

      for (let i = 0; i < firstDayOfWeek; i++) {

        empytGrids.push(i);

      }

      this.setData({

        hasEmptyGrid: true,

        empytGrids

      });

    } else {

      this.setData({

        hasEmptyGrid: false,

        empytGrids: []

      });

    }

  },



  // 展示日期

  calculateDays(year, month) {

    let days = [];

    let daysObj = {};

    const thisMonthDays = this.getThisMonthDays(year, month);

    let daysArr = this.data.daysArr

    for (let i = 1; i <= thisMonthDays; i++) {

      daysObj = { name: i, spot: false };

      days.push(daysObj);

    }

    this.setData({

      days

    });

  },



  // 控制有课的点点的显示

  spotShow: function () {

    let days = [];

    let daysObj = {};

    const thisMonthDays = this.getThisMonthDays(this.data.cur_year, this.data.cur_month);

    let daysArr = this.data.daysArr

    for (let i = 1; i <= thisMonthDays; i++) {

      daysObj = { name: i, spot: false };

      for (let v in daysArr) {

        if (daysArr[v] == i) {

          daysObj = { name: i, spot: true };

        }

      }

      days.push(daysObj);

    }

    this.setData({

      days

    });

  },




  // 点击上下个月

  handleCalendar(e) {

    const date = new Date();

    const handle = e.currentTarget.dataset.handle;

    const cur_year = this.data.cur_year;

    const cur_month = this.data.cur_month;

    if (handle === 'prev') {

      let newMonth = cur_month - 1;

      let newYear = cur_year;

      if (this.data.now_month == newMonth && this.data.now_year == newYear) {

        this.setData({

          nowTodayIndex: date.getDate() - 1

        })

      } else {

        this.setData({

          nowTodayIndex: 100

        })

      }

      // 显示选中的日期

      if (this.data.clickMonth == newMonth && this.data.clickYear == newYear) {

        this.setData({

          todayIndex: this.data.clickToday,

        })

      } else {

        this.setData({

          todayIndex: 100,

        })

      }



      if (newMonth < 1) {

        newYear = cur_year - 1;

        newMonth = 12;

      }



      this.calculateDays(newYear, newMonth);

      this.calculateEmptyGrids(newYear, newMonth);



      this.setData({

        cur_year: newYear,

        cur_month: newMonth

      })



    } else {

      let newMonth = cur_month + 1;

      let newYear = cur_year;

      if (this.data.now_month == newMonth && this.data.now_year == newYear) {

        this.setData({

          nowTodayIndex: date.getDate() - 1

        })

      } else {

        this.setData({

          nowTodayIndex: 100

        })

      }

      // 显示选中的日期

      if (this.data.clickMonth == newMonth && this.data.clickYear == newYear) {

        this.setData({

          todayIndex: this.data.clickToday,

        })

      } else {

        this.setData({

          todayIndex: 100,

        })

      }

      if (newMonth > 12) {

        newYear = cur_year + 1;

        newMonth = 1;

      }



      this.calculateDays(newYear, newMonth);

      this.calculateEmptyGrids(newYear, newMonth);



      this.setData({

        cur_year: newYear,

        cur_month: newMonth

      })

    }

    this.spotShow()

  }



})
