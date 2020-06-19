const dataUrl = '../info.json'
  // 'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json';

class Suggestion {
  constructor(options) {
    this.options = options
    this.$input = $(options.input)
    this.$input.wrap('<form class="search-form"></form>')
    this.$wrapper = this.$input.parent()

    this.$ul = $('<ul class="suggestions"></ul>')
    this.$input.after(this.$ul)
    // 加载状态
    this.$loading = this.$loading = $('<div class="suggestion-loading"></div>')
    this.$loading.html(this.options.loadingTemplate)
    // 空状态
    this.$empty = $('<div class="suggestion-empty"></div>')
    this.$empty.html(this.options.emptyTemplate)

    this.$ul.before(this.$loading)
    this.$ul.before(this.$empty)
    this.bindEvents()
    // getCityInfo(dataUrl)
  }
  bindEvents() {
    // 搜索防抖处理
    let timerId
    this.$input.on('input', (e) => {
      if (timerId) {
        window.clearTimeout(timerId)
      }
      timerId = setTimeout(() => {
        this.search(e.currentTarget.value)
        timerId = undefined
      }, 300)
    })
    // 数据双向绑定
    this.$ul.on('click', 'li', (e) => {
      this.$input.val($(e.currentTarget).text())
    })
  }
  search(keyword) {
    // 状态 empty => loading
    this.$wrapper.addClass('loading')
    this.$wrapper.removeClass('empty')
    // 搜索
    this.options.search(keyword, (array) => {
      // 清空搜索栏
      this.$ul.empty()
      this.$wrapper.removeClass('loading')
      // 不存在则返回
      if (!array || array.length === 0) {
        this.$wrapper.addClass('empty')
        return
      }
      // 存在则加载
      this.$ul.append($('<li>根据输入筛选数据</li>'))
      array.forEach((text) => {
        this.$ul.append($('<li></li>').text(text))
      })
    })
  }
}
// 获取城市数据
function getCityInfo(url) {
  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
  // axios.get(url)
  //   .then(this.getCityInfoSucc)
  //   .catch(error=>{console.log(error)})
}

function getCityInfoSucc(res) {
  let citiesInfo = []

  for(let i in res.data){
    let cityInfo = {
      city: res.data[i].city, 
      state: res.data[i].state, 
      population: res.data[i].population
    }
    citiesInfo[i] = cityInfo
  }

  return citiesInfo
}

const s = new Suggestion({
  input: 'input',
  search: function(text, callback) {
    // 数据为空，返回 empty 状态
    if (text === '0') {
      return setTimeout(()=>callback([]), 300)
    }
    
    // let array = []
    // console.table(array)
    // let info = getCityInfo(dataUrl)
    const res =  getCityInfo(dataUrl).then(function (result) { return result })
    console.log(res)

    // async res = () => {
    //   const result = await this.getCityInfo(dataUrl)
      // let citiesInfo = []

      // for(let i in data){
      //   let cityInfo = {
      //     city: data[i].city, 
      //     state: data[i].state, 
      //     population: data[i].population
      //   }
      //   citiesInfo[i] = cityInfo
      // }

      // return citiesInfo
      // return data 
      // console.log(res)

    
    

    // console.table(info)
    // for (let i = 0; i < 5; i++) {
    //   var n = parseInt(Math.random() * 100, 10)
    //   array.push(text + n)
    // }
    // setTimeout(() => callback(array), 300)
  },
  loadingTemplate: '加载中，正在为您查找',
  emptyTemplate: '找不到,请输入正确城市名'
})