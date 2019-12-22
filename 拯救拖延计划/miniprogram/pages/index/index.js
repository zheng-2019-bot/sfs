// miniprogram/pages/index/index.js
Page({
  data: {

    info: 'hello word!',

    id: 1,

    arr: [1, 2, 3, 4, 5, 6, 'hello'],

    val: '',

    list: []

  },

  onShow:function(){
    var that = this;
    wx.cloud.callFunction({
      name: "content",
      success: function (res) {
        var result = res.result.data[res.result.data.length - 1].thing
        console.log(res)
        that.setData({
          list: result,
        })
      }
    })
  },

  getval(e) {

    // console.log(e.detail.value)

    this.setData({ val: e.detail.value })

  },

  add() {

    var data1 = this.data.list;

    data1.push(this.data.val)

    this.setData({ list: data1, val: '' })

    var db = wx.cloud.database()
    db.collection("content").add({
      data: { thing: data1 },
      success: function (res) {
        console.log(res)
      }
    })
  },

  del(e) {

    // console.log(e.target.dataset.index)

    var i = e.target.dataset.index;

    var data2 = this.data.list;

    data2.splice(i, 1)

    this.setData({ list: data2 })
    var db = wx.cloud.database()
    db.collection("content").add({
      data: { thing: data2 },
      success: function (res) {
        console.log(res)
      }
    })
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
})