<template>
  <div class="com-container">
    <div class="title-con">
      <!-- 標題區域 -->
      <span
        v-for="(title, index) in titleArr"
        @click="updateChart(index)"
        :key="title"
        :style="{ fontSize: titleFontSize + 'px' }"
      >
        {{ title }}
      </span>
    </div>
    <div class="com-chart" ref="line_ref"></div>
  </div>
</template>
<script>
export default {
  activated() {
    // 解決切換組件後調整大小再回來導致的圖表丟失問題
    window.addEventListener('resize', this.screenAdapter)
    // 延遲解決偶爾切換控制台報錯問題(無實質影響)
    setTimeout(() => {
      this.screenAdapter()
    }, 100)
  },
  deactivated() {
    // 解決切換組件後調整大小再回來導致的圖表丟失問題
    window.removeEventListener('resize', this.screenAdapter)
  },
  async mounted() {
    // 獲取數據
    await this.getData('line')
    // 初始化圖表實例對象
    this.initChart()
    this.mChart.hideLoading()
    // 初始化自適應字體大小
    this.screenAdapter()
  },
  destroyed() {
    this.mChart.clear()
  },
  data() {
    return {
      mChart: null,
      dataList: [],
      // 標題數組
      titleArr: [],
      // 數據數組
      dataArr: [],
      // 自適應的標題大小
      titleFontSize: 0
    }
  },
  methods: {
    // 初始化echarts實例對象
    initChart() {
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      const xAxisData = this.dataList.common.month
      const mapData = this.dataList.map
      const mapSeries = mapData.data.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: 'all',
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              },
              {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      const initOption = {
        grid: {
          top: '35%',
          left: '3%',
          right: '3%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          boundaryGap: 0,
          axisLabel: {
            interval: 1
          }
        },
        yAxis: {
          type: 'value',
          name: '單位: 人',
          nameGap: 7
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          borderWidth: 0,
          padding: 5,
          textStyle: {
            color: '#fff'
          },
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          left: '5%',
          top: '20%'
        },
        series: mapSeries
      }
      this.mChart.setOption(initOption)
    },
    // 獲取服務器數據
    async getData(name) {
      this.mChart = this.$echarts.init(this.$refs.line_ref, 'vintage')
      this.mChart.showLoading()
      this.dataList = await this.$getData(name)
      for (const key in this.dataList) {
        if (this.dataList[key].title) {
          // 做成我要的數據格式
          this.titleArr.push(this.dataList[key].title)
          this.dataArr.push(this.dataList[key])
        }
      }
      this.titleArr.splice(1)
    },
    // 更新圖表
    updateChart(index) {
      if (this.titleArr.length === 1) {
        this.dataArr.forEach((item, index) => {
          if (index) {
            this.titleArr.push(item.title)
          }
        })
      } else {
        const series = this.dataArr[index].data.map((item) => {
          return {
            name: item.name,
            data: item.data
          }
        })
        const dataOption = {
          series
        }
        this.mChart.setOption(dataOption)
        this.titleArr = []
        this.titleArr.push(this.dataArr[index].title)
        this.dataArr.unshift(this.dataArr[index])
        this.dataArr.splice(index + 1, 1)
      }
    },
    // 瀏覽器分辨率自適應
    screenAdapter() {
      this.titleFontSize = (this.$refs.line_ref.offsetWidth / 100) * 3.6
      const adapterOption = {
        yAxis: {
          nameTextStyle: {
            fontSize: this.titleFontSize / 2.5
          }
        },
        legend: {
          itemGap: this.titleFontSize / 2,
          itemWidth: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 1.5
          }
        }
      }
      this.mChart.setOption(adapterOption)
      this.mChart.resize()
    }
  }
}
</script>
<style lang="scss" scoped>
.title-con {
  font-family: serif;
  font-weight: 600;
  position: absolute;
  top: 13%;
  left: 19%;
  z-index: 10;
  color: #333333;
  background-color: #fef8ef;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
span:first-child::after {
  content: '▾';
}
</style>
