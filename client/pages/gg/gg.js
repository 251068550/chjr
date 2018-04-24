import { HOST } from '../../config.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1
  },
  getData(page, fn) {
    wx.request({
      url: HOST + '/api/notice/list',
      data: { page },
      header: {
        'content-type': 'application/json'
      },
      success: fn
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function () {
    this.getData(1, (res) => {
      let { code, result } = res.data;

      if (code == 1) {
        this.setData({ list: result.data, page: result.current_page, total: result.last_page })
      }
    });
  },
  onPullDownRefresh: function () {
    this.getData(1, (res) => {
      let { code, result } = res.data;

      if (code == 1) {
        this.setData({ list: result.data, page: result.current_page, total: result.last_page })
      }
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    });
  },
  onReachBottom: function () {
    console.log(1);
    let { total, page, list } = this.data;
    if (page < total) {
      console.log(2);
      this.getData(parseInt(page) + 1, (res) => {
        let { code, result } = res.data;
        if (code == 1) {
          this.setData({ list: list.concat(result.data), page: result.current_page, total: result.last_page })
        }
      })
    }
  },
  handleJmup(event){
    let { url,id } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `../webview/webview?url=${url}&id=${id}`
    })
  }
});