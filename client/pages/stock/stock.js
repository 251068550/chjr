import { HOST } from '../../config.js';
import { calcDate } from '../../util/util.js';
import _ from '../../util/lodash.js';
const tit_map = {
  'je': 'money',
  'cdh': 'accept',
  'dqr': 'end_date',
  'sl': 'quantity'
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    source_list: [],
    list: [],
    index: 0,
    open: false,
    last_day: 0,
    order_type: '',
    order_dirc: 1, // 1向上2向下
    openFilter: false,
    openConnect:false
  },
  getData() {
    wx.request({
      url: HOST + '/api/stock/list',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        let { code, result } = res.data;

        if (code == 1) {
          result.map(r => r.money = parseFloat(r.money));
          this.setData({ list: result, source_list: result })
        }
      }
    })

    wx.request({
      url: HOST + 'api/company/info',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        let { code, result } = res.data;
        if (code == 1) {
          this.setData({ name: result.name, address: result.address, phone: result.phone })
        }
      }
    })
  },
  radioCheckedChange_je: function (e) {
    this.setData({
      radio_je: e.detail.value
    })
  },
  radioCheckedChange_yh: function (e) {
    this.setData({
      radio_yh: e.detail.value
    })
  },
  radioCheckedChange_qx: function (e) {
    this.setData({
      radio_qx: e.detail.value
    })
  },
  /**
   * 确认筛选
   */
  handRadioChange() {
    let { radio_qx, radio_je, radio_yh, source_list } = this.data;
    // 金额
    switch (parseInt(radio_je)) {
      case 1: {
        source_list = source_list.filter(({ money }) => {
          return money <= 10;
        });
        break;
      }
      case 2: {
        source_list = source_list.filter(({ money }) => {
          return money > 10 && money <= 50;
        });
        break;
      }
      case 3: {
        source_list = source_list.filter(({ money }) => {
          return money > 50 && money <= 100;
        });
        break;
      }
      case 4: {
        source_list = source_list.filter(({ money }) => {
          return money > 100;
        });
        break;
      }
    };
    // 银行
    switch (parseInt(radio_yh)) {
      case 1: {
        source_list = source_list.filter(({ cate }) => cate == '国股');
        break;
      }
      case 2: {
        source_list = source_list.filter(({ cate }) => {
          return cate == '城商';
        });
        break;
      }
      case 3: {
        source_list = source_list.filter(({ cate }) => {
          return cate == '山农';
        });
        break;
      }
      case 4: {
        source_list = source_list.filter(({ cate }) => {
          return cate == '财务公司';
        });
        break;
      }
      case 5: {
        source_list = source_list.filter(({ cate }) => {
          return cate == '商业';
        });
        break;
      }
    }

    // 期限
    switch (parseInt(radio_qx)) {
      case 1: {
        source_list = source_list.filter(({ end_date }) => {
          return calcDate(end_date) < 90;
        });
        break;
      }
      case 2: {
        source_list = source_list.filter(({ end_date }) => {
          let d = calcDate(end_date);
          return d > 90 && d <= 160;
        });
        break;
      }
      case 3: {
        source_list = source_list.filter(({ end_date }) => {
          let d = calcDate(end_date);
          return d > 160 && d <= 185;
        });
        break;
      }
      case 4: {
        source_list = source_list.filter(({ end_date }) => {
          let d = calcDate(end_date);
          return d > 185 && d <= 350;
        });
        break;
      }
      case 5: {
        source_list = source_list.filter(({ end_date }) => {
          let d = calcDate(end_date);
          return d > 350;
        });
        break;
      }
    }

    this.setData({
      openFilter: false,
      list: source_list
    })
  },
  handRadioReset() {
    this.setData({
      openFilter: false,
      list:this.data.source_list,
      radio_qx: 0, radio_je: 0, radio_yh: 0
    });
  },
  /**
   * 排序
   */
  handleOrder(event) {
    let { type } = event.target.dataset;
    let { order_dirc, list } = this.data;
    order_dirc = order_dirc === 1 ? 2 : 1;
    let dirc = order_dirc === 1 ? 1 : -1;
    list = _.sortBy(list, [function (o) { {
      let value = o[tit_map[type]];
      if (tit_map[type]==='end_date'){
        value = new Date(value).getTime()/100000;
      }
      return dirc * value; 
      }}]);
    this.setData({
      list,
      order_dirc,
      order_type: type,
    });
  },
  openFilter() {
    this.setData({
      openFilter: !this.data.openFilter
    })
  },
  openConnect() {
    this.setData({
      openConnect: !this.data.openConnect
    })
  },
  handlerSlide(event) {
    let { index = 0 } = event.target.dataset;
    let { open, list } = this.data;
    this.setData({
      index,
      last_day: calcDate(list[index].end_date),
      open: !open
    });
  },
  previewImage(event) {
    let { i = 0 } = event.target.dataset;
    let { host, list, index } = this.data;
    wx.previewImage({
      current: list[index].imgs[i],
      urls: list[index].imgs // 需要预览的图片http链接列表
    })
  },
  formSubmit: function (e) {
    let { phone, num } = e.detail.value;
    if (!phone || !/^[1][3,4,5,7,8][0-9]{9}$/.test(phone)) {
      return wx.showToast({
        title: '请输入正确的手机号！',
        icon: 'none',
        duration: 2000
      });
    }
    if (!num) {
      return wx.showToast({
        title: '请输入预定的数量！',
        icon: 'none',
        duration: 2000
      });
    }
    wx.request({
      url: HOST + '/api/reserve/reserve',
      data: e.detail.value,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        let { code, msg } = res.data;

        wx.showToast({
          title: msg,
          icon: !!!code ? 'none' : 'success',
          duration: 2000,
          complete: () => {c
            this.setData({
              open: !!!code
            });
            this.getData();
          }
        });
      }
    })
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.phone,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onLoad: function () {
    this.getData();
  },
});