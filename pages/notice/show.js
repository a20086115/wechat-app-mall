const app = getApp();
const WXAPI = require('apifm-wxapi')
Page({
  data: {
    goods:{}
  },
  onLoad: function (options) {
    var that = this;
    WXAPI.noticeDetail(options.id).then(function (res) {
      if (res.code == 0) {
        that.setData({
          notice: res.data
        });
        let content = res.data.content;
        let array = content.split(/(\-{5}.*?\-{5})/g)

        var contentArray = [];
        for(let str of array){
          let obj = {};
          if(str.startsWith("-----")){
            obj.data = str.substring(5, str.length - 5);
            obj.isGoods = true;
            if(!that.data.goods[obj.data]){
              that.goodsDetail(obj.data)
            }
          }else{
            if(str.startsWith("</p>")){
              str = str.substring(4);
            }else{
              str = str.substring(0, str.length - 19) 
            }
            obj.data = str;
            obj.isGoods = false;
          }
          contentArray.push(obj)
        }
        console.log(contentArray)
        that.setData({
          contentArray: contentArray,
          goods: that.data.goods
        });
      }
    })
  },
  onShareAppMessage() {
  },
  toDetailsTap: function(e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  async goodsDetail(goodsId) {
    let res = await WXAPI.goodsDetail(goodsId)
    this.data.goods[goodsId] = res.data.basicInfo
    this.setData({
      goods: this.data.goods
    });
  },
  onShareTimeline(){
    return{
      title:this.data.notice.title
    }
  }

})