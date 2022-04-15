<template>
  <div class="com-container">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
export default {
  activated() {
    // 解決切換組件後調整大小再回來導致的圖表丟失問題
    window.addEventListener('resize', this.screenAdapter)
    // 延遲解決偶爾切換控制台報錯問題(無實質影響)
    setTimeout(() => {this.screenAdapter()}, 100)
  },
  deactivated() {
    // 解決切換組件後調整大小再回來導致的圖表丟失問題
    window.removeEventListener('resize', this.screenAdapter)
  },
  async mounted() {
    // 獲取數據
    await this.getData('map')
    // 初始化實例對象
    this.initChart()
    this.mChart.hideLoading()
    // 自適應分辨率
    this.screenAdapter()
  },
  destroyed() {
    this.mChart.clear()
  },
  data() {
    return {
      mChart: null,
      dataList: []
    }
  },
  methods: {
    // 初始化圖表實例對象
    initChart() {
      const series = this.dataList.map((item) => {
        return {
          type: 'effectScatter',
          symbolSize: 12,
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo',
          rippleEffect: {
            scale: 6,
            brushType: 'stroke'
          }
        }
      })
      const initOption = {
        title: [
          {
            text: '流感分布',
            left: '5%',
            top: '5%',
            textStyle: {
              fontFamily: 'serif'
            }
          },
          {
            text: '單位千人 (K)',
            subtext: '一點表示一千人',
            right: '5%',
            bottom: '5%'
          },
          {
            text: 'A 型流感推估人數:',
            subtext: '≈' + this.dataList[0].children.length * 1000 + '人',
            left: '65%',
            top: '15%'
          },
          {
            text: 'B 型流感推估人數:',
            subtext: '≈' + this.dataList[1].children.length * 1000 + '人',
            left: '65%',
            top: '35%'
          },
          {
            text: 'C 型流感推估人數:',
            subtext: '≈' + this.dataList[2].children.length * 1000 + '人',
            left: '65%',
            top: '55%'
          }
        ],
        geo: {
          map: 'taiwan',
          top: '1%',
          bottom: '10%',
          itemStyle: {
            areaColor: '#019858',
            borderColor: '#333'
          },
          emphasis: {
            itemStyle: {
              areaColor: '#019858',
              borderColor: '#333'
            }
          }
        },
        legend: {
          bottom: '5%',
          left: '5%',
          orient: 'vertical'
        },
        series
      }
      this.mChart.setOption(initOption)
    },
    // 獲取數據
    async getData(name) {
      this.mChart = this.$echarts.init(this.$refs.map_ref, 'vintage')
      this.mChart.showLoading()
      this.dataList = await this.$getData(name)
    },
    // 分辨率自適應
    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: [
          {
            textStyle: {
              fontSize: titleFontSize
            }
          },
          {
            textStyle: {
              fontSize: titleFontSize / 2
            },
            subtextStyle: {
              fontSize: titleFontSize / 3
            }
          },
          {
            textStyle: {
              fontSize: titleFontSize / 2
            },
            subtextStyle: {
              fontSize: titleFontSize / 2
            }
          },
          {
            textStyle: {
              fontSize: titleFontSize / 2
            },
            subtextStyle: {
              fontSize: titleFontSize / 2
            }
          },
          {
            textStyle: {
              fontSize: titleFontSize / 2
            },
            subtextStyle: {
              fontSize: titleFontSize / 2
            }
          }
        ],
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2.5,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.mChart.setOption(adapterOption)
      this.mChart.resize()
    }
  }
}
</script>
