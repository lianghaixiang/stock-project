//index.js
//获取应用实例
const tf = require('@tensorflow/tfjs-core')
const tfl = require('@tensorflow/tfjs-layers')
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showResult:'',
    last_val:0,
    pred:0
  },
  async loadModel() {

    const net = await tfl.loadLayersModel('https://656d-emotion-lrnss-1301186253.tcb.qcloud.la/model/stockModel/model.json')
    //net.summary()
    return net

  },
  
  onLoad: function () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  input1: function (e) {
    console.log(e);
    console.log(e.detail.value.input)
    this.send(e.detail.value.input)
  },
  async send(code){
    var net = await this.loadModel()
    wx.request({
      url: 'https://cq.ssajax.cn/interact/getTradedata.ashx?pic=qlpic_'+code+'_6', //仅为示例，并非真实的接口地址
      
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: (res) => {
        console.log(res)
        if (res.data ==''){
          console.log('hahahahha')
          this.setData({showResult:'请输入正确的股票代码'})
          return
        }
        wx.showLoading({
          title: "模型计算中...",
          mask: true
        })
        var result = res.data.match(/{.*}/)[0]
        var result2 = result.replace(/'/g,'"')
        var feaData = JSON.parse(result2).datas.slice(73,80)
        var myArray = new Array()
        for (var i=0;i<feaData.length;i++){
          myArray[i] = feaData[i].slice(2,5).map(i => parseFloat(i, 0))
        }
        console.log(myArray.slice(6,7)[0].slice(2,3))
        const tfData = tf.tensor(myArray).reshape([1,7,3])
        console.log(tfData)
        var that = this
        //var net = await this.loadModel()
        console.log(net)
        var min_val = tfData.min().dataSync()[0]
        var max_val = tfData.max().dataSync()[0]
        var tfDataNormalize = tfData.sub(min_val).div(max_val-min_val)
        var last_val = tfDataNormalize.dataSync()[20]
        var pred = net.predict(tfDataNormalize).dataSync()[0]
        var rate = (pred-last_val)/last_val
        if (rate>=0){
          wx.hideLoading();
          this.setData({showResult:'预测上涨幅度： '+rate.toFixed(3).toString(),
            pred:pred,
            last_val:last_val})
        }else{
          wx.hideLoading();
          this.setData({showResult:'预测下跌幅度:  '+rate.toFixed(3).toString(),
            pred:pred,
            last_val:last_val})
        }
      }
    })
  }

})
