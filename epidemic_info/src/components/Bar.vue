<template>
  <div class="com-container">
    <div class="com-chart" ref="bar_ref"></div>
  </div>
</template>

<script>
export default {
  activated() {
    // 開啟輪播計時器
    this.startInterval(2000)
    // 解決切換組件後調整大小再回來導致的圖表丟失問題
    window.addEventListener('resize', this.screenAdapter)
    // 延遲解決偶爾切換控制台報錯問題(無實質影響)
    setTimeout(() => {this.screenAdapter()}, 100)
  },
  deactivated() {
    clearInterval(this.timerId)
    // 解決切換組件後調整大小再回來導致的圖表丟失問題
    window.removeEventListener('resize', this.screenAdapter)
  },
  async mounted() {
    // 獲取圖表需要數據
    await this.getData('bar')
    // 排序獲取到的資料
    this.sortData = this.dataList.sort((a, b) => b.value - a.value)
    // 初始化ECharts實例對象
    this.initChart()
    this.mChart.hideLoading()
    // 設置圖表資料
    this.updateChart()
    // 頁面加載完成主動進行瀏覽器分辨率適配
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timerId)
    this.mChart.clear()
  },
  data() {
    return {
      // eCharts實例對象
      mChart: null,
      dataList: [],
      // 計時器id
      timerId: null,
      // 排列過的資料
      sortData: [],
      // 計數器，協助達成平移效果
      count: 0
    }
  },
  methods: {
    // 初始化echarts實例對象
    initChart() {
      // 對圖表初始化配置的控制
      const initOption = {
        title: {
          text: '疫苗注射人數',
          left: '5%',
          top: '5%',
          textStyle: {
            fontFamily: 'serif'
          }
        },
        grid: {
          top: '25%',
          left: '6%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderWidth: 0,
          padding: 7,
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          max: 6,
          axisLabel: {
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          name: '單位千人 (K) ',
          splitNumber: 3
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              color: (arg) => {
                let targetColor = []
                // 使用的色組
                const colorArr = [
                  ['#0BA82C', '#4FF778'],
                  ['#2E72BF', '#23E5E5'],
                  ['#5052EE', '#AB6EE5']
                ]
                if (arg.value > 300) {
                  targetColor = colorArr[0]
                } else if (arg.value > 200) {
                  targetColor = colorArr[1]
                } else {
                  targetColor = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColor[0]
                  },
                  {
                    offset: 1,
                    color: targetColor[1]
                  }
                ])
              },
              borderRadius: [50, 50, 0, 0]
            }
          }
        ]
      }
      this.mChart.setOption(initOption)
      // 對圖表對象進行鼠標事件的監聽
      this.mChart.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      this.mChart.on('mouseout', () => {
        this.startInterval(2000)
      })
    },
    // 獲取圖表數據
    async getData(name) {
      this.mChart = this.$echarts.init(this.$refs.bar_ref, 'vintage')
      this.mChart.showLoading()
      this.dataList = await this.$getData(name)
    },
    // 更新圖表
    updateChart() {
      // 圖表平移效果
      if (this.count > this.sortData.length / 2) {
        this.sortData.sort((a, b) => b.value - a.value)
        this.count = 0
      } else if (this.count > 0) {
        this.sortData.push(this.sortData.shift())
      }
      const xAxisData = this.sortData.map((item) => item.name)
      const yAxisData = this.sortData.map((item) => item.value)
      const dataOption = {
        xAxis: {
          data: xAxisData
        },
        series: [
          {
            data: yAxisData
          }
        ]
      }
      this.mChart.setOption(dataOption)
      this.count++
    },
    // 圖表輪播定時器
    startInterval(time) {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.updateChart()
      }, time)
    },
    // 瀏覽器分辨率自適應
    screenAdapter() {
      const titleFontSize = (this.$refs.bar_ref.offsetWidth / 100) * 3.6
      // 分辨率相關配置項
      const adapterOption = {
        yAxis: {
          nameTextStyle: {
            fontSize: titleFontSize / 2.5
          }
        },
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize
          }
        ]
      }
      this.mChart.setOption(adapterOption)
      this.mChart.resize()
    }
  }
}
</script>
