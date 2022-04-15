<template>
  <div class="com-container">
    <div class="com-chart" ref="pie_ref"></div>
  </div>
</template>

<script>
export default {
  activated() {
    // 開始輪播事件
    this.startInterval(3000)
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
    // 獲取圖表數據
    await this.getData('pie')
    // 初始化圖表對象
    this.initChart()
    this.mChart.hideLoading()
    // 分辨率自適應
    this.screenAdapter()
  },
  destroyed() {
    clearInterval(this.timerId)
    this.mChart.clear()
  },
  data() {
    return {
      mChart: null,
      dataList: [],
      timerId: null,
      currentPage: 0,
      totalPage: 0,
      titleFontSize: 0
    }
  },
  methods: {
    // 初始化圖表對象
    initChart() {
      const initOption = {
        title: [
          {
            text: '流感分析',
            left: '5%',
            top: '5%',
            textStyle: {
              fontFamily: 'serif'
            }
          },
          {
            text: 'A型流感',
            top: '85%',
            textStyle: {
              color: '#0BA82C'
            }
          },
          {
            text: 'B型流感',
            top: '85%',
            textStyle: {
              color: '#2E72BF'
            }
          },
          {
            text: 'C型流感',
            top: '85%',
            textStyle: {
              color: '#E55445'
            }
          }
        ]
      }
      // 滑鼠移到圖表時暫停輪播
      this.mChart.on('mouseover', () => {
        clearInterval(this.timerId)
      })
      // 滑鼠移出圖表時開啟輪播
      this.mChart.on('mouseout', () => {
        this.startInterval(3000)
      })
      this.mChart.setOption(initOption)
    },
    // 獲取數據
    async getData(name) {
      this.mChart = this.$echarts.init(this.$refs.pie_ref, 'vintage')
      this.mChart.showLoading()
      this.dataList = await this.$getData(name)
      this.totalPage =
        this.dataList.length % 3
          ? Math.floor(this.dataList.length / 3) + 1
          : this.dataList.length / 3
    },
    // 更新圖表
    updateChart() {
      // 圓環座標數組
      const centerArr = [
        ['18%', '50%'],
        ['50%', '50%'],
        ['82%', '50%']
      ]
      // 圓環漸變色數組
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#23E5E5', '#2E72BF'],
        ['#E8821C', '#E55445']
      ]
      const showData = this.dataList.slice(
        this.currentPage * 3,
        (this.currentPage + 1) * 3
      )
      const series = showData.map((item, index) => {
        return {
          type: 'pie',
          radius: [this.titleFontSize * 3.2, this.titleFontSize * 3.6],
          center: centerArr[index],
          labelLine: {
            show: false
          },
          data: [
            {
              name: item.name + '\n' + item.part2 + '%',
              value: item.part2,
              label: {
                show: true,
                fontSize: this.titleFontSize / 2,
                lineHeight: this.titleFontSize,
                position: 'center',
                color: colorArr[index][0]
              },
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              }
            },
            { value: item.part1, itemStyle: { color: '#FCEBD1' } }
          ],
          // 關閉滑鼠移入餅圖動畫效果
          hoverAnimation: false
        }
      })
      const dataOption = {
        series
      }
      this.mChart.setOption(dataOption)
    },
    // 輪播處理
    startInterval(time) {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage = (this.currentPage + 1) % this.totalPage
        this.updateChart()
      }, time)
    },
    // 自適應分辨率
    screenAdapter() {
      this.titleFontSize = (this.$refs.pie_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: [
          {
            textStyle: {
              fontSize: this.titleFontSize
            }
          },
          {
            left: 7 + this.titleFontSize / 10 + '%',
            textStyle: {
              fontSize: this.titleFontSize / 1.2
            }
          },
          {
            left: 39 + this.titleFontSize / 10 + '%',
            textStyle: {
              fontSize: this.titleFontSize / 1.2
            }
          },
          {
            left: 71 + this.titleFontSize / 10 + '%',
            textStyle: {
              fontSize: this.titleFontSize / 1.2
            }
          }
        ]
      }
      this.mChart.setOption(adapterOption)
      this.updateChart()
      this.mChart.resize()
    }
  }
}
</script>
