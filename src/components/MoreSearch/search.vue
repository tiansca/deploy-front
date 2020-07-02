<template>
  <div>
    <div v-if="selectObj.length > 0" style="display:flex">
      <span class="label label-first">已筛选条件:</span>
      <div class="select-wrapper">
        <div class="select-box">
          <span v-for="item in selectObj" v-show="item.value" :key="item.name" class="on-select">
            <span style="margin-right:16px">{{ item.name }}：{{ item.value }}</span>
            <i class="close-tag" @click="delSelect(item.name)">×</i>
          </span>
        </div>
        <div v-show="selectObj.length !== 0 && showClear" class="empty" @click="emptyTags">
          <span>清空筛选</span>
        </div>
      </div>
    </div>
    <div class="select-item-box select-item-box1">
      <p class="label label-seconed">高级筛选</p>
      <span ref="text" class="text" @click="showSelect">
        {{ textFlag? '展开' : '收起' }}
        <i :class="textFlag? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i>
      </span>
    </div>
    <div ref="selectWrap" class="select-show-wrap" :class="textFlag ? null : 'active'">
      <div class="select-item-box">
        <span class="label">基本信息:</span>
        <!-- 企业状态 -->
        <my-select
          :id="select.status_id"
          :list="entStatus"
          :title="'企业状态'"
          @onSelect="selectStatus"
          @visibleChange="visibleChange(arguments)"
        />
        <!-- 成立时间 -->
        <div class="select-item-time-box">
          <my-select
            :id="select.time_id"
            ref="timeRef"
            :list="entTime"
            :title="'注册时间'"
            @onSelect="selectTime"
            @visibleChange="visibleChange(arguments, 'TIME')"
          />
          <div v-show="timeFlag" v-click-outside="() => timeFlag=false" class="time-box">
            <div class="block">
              <span style="margin-right:7px;color:#A8AFB9">从</span>
              <el-date-picker
                v-model="startTime"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                :picker-options="pickerOptionsStart"
                placeholder="选择日期"
              />
            </div>
            <div class="block">
              <span style="margin-right:7px;color:#A8AFB9">至</span>
              <el-date-picker
                v-model="endTime"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                :picker-options="pickerOptionsEnd"
                placeholder="选择日期"
              />
            </div>
            <p class="time-btn" @click="sureTime">确定</p>
          </div>
        </div>
        <!-- 企业人数 -->
        <my-select
          :id="select.person_id"
          :list="entPerson"
          :title="'企业人数'"
          @onSelect="selectPerson"
          @visibleChange="visibleChange(arguments)"
        />
        <!-- 注册地区 -->
        <my-cascader
          :id="select.region_id"
          ref="region_id"
          title="注册地区"
          @select="selectRegion"
          @visibleChange="visibleChange(arguments)"
        />
        <!-- 注册资本 -->
        <div class="select-item-time-box">
          <my-select
            :id="select.money_id"
            ref="moneyRef"
            :list="entMoney"
            :title="'注册资本'"
            @onSelect="selectMoney"
            @visibleChange="visibleChange(arguments, 'MONEY')"
          />
          <div v-show="moneyFlag" v-click-outside="() => moneyFlag=false" class="time-box">
            <el-form ref="form" class="money-form" :model="formMoney">
              <el-form-item prop="min" class="block">
                <span style="margin-right:7px;color:#A8AFB9">从</span>
                <el-input v-model="formMoney.min" />
                <span style="margin-left:7px;color:#A8AFB9">万</span>
              </el-form-item>
              <el-form-item prop="max" class="block">
                <span style="margin-right:7px;color:#A8AFB9">从</span>
                <el-input v-model="formMoney.max" />
                <span style="margin-left:7px;color:#A8AFB9">万</span>
              </el-form-item>
              <p class="time-btn" @click="sureMoney">确定</p>
            </el-form>
          </div>
        </div>
        <!-- 企业规模 -->
        <my-select
          :id="select.scale_id"
          :title="'企业规模'"
          :list="entScale"
          @onSelect="selectScale"
          @visibleChange="visibleChange(arguments)"
        ></my-select>
        <!-- 企业类型 -->
        <my-select
          :id="select.type_id"
          :title="'企业类型'"
          :list="entType"
          @onSelect="selectType"
          @visibleChange="visibleChange(arguments)"
        ></my-select>
      </div>
      <div class="select-item-box select-item-nic-box">
        <span class="label">行业信息:</span>
        <!-- 所属行业 -->
        <my-cascader-nic
          :id="select.nic_id"
          ref="nic_id"
          :title="'所属产业'"
          :list="entNic"
          @select="selectNic"
          @visibleChange="visibleChange(arguments)"
        ></my-cascader-nic>
        <div v-show="showHot" class="hotNicWrap">
          <span>热点产业：</span>
          <span v-for="item in hotNicArr" :key="item.id" class="hotNicItem" :class="item.id === hotNicId ? 'active' : ''" @click="checkHotNic(item)">{{ item.name }}</span>
        </div>
      </div>
      <div class="select-item-box">
        <span class="label">资质能力:</span>
        <my-select
          :id="select.patent_id"
          :list="entPatent"
          :title="'有无专利'"
          @onSelect="selectPatent"
          @visibleChange="visibleChange(arguments)"
        />
        <my-select
          v-if="select.patent_id==='1'"
          :id="select.patent_type_id"
          :list="entPatentType"
          :title="'专利类型'"
          @onSelect="selectPatentT"
          @visibleChange="visibleChange(arguments)"
        />
        <my-select
          :id="select.high_id"
          class="maxSelect"
          :list="entHigh"
          :title="'是否高新企业'"
          @onSelect="selectHigh"
          @visibleChange="visibleChange(arguments)"
        />
        <my-select
          v-if="select.high_id === '1'"
          :id="select.high_type_id"
          class="maxSelect"
          :list="entHighType"
          :title="'高新企业类型'"
          @onSelect="selectHighT"
          @visibleChange="visibleChange(arguments)"
        />
        <my-select
          :id="select.list_id"
          class="maxSelect"
          :list="entList"
          :title="'是否上市企业'"
          @onSelect="selectList"
          @visibleChange="visibleChange(arguments)"
        />
        <my-select
          v-if="select.list_id==='1'"
          :id="select.list_type_id"
          class="maxSelect"
          :list="entListType"
          :title="'企业上市类型'"
          @onSelect="selectListT"
          @visibleChange="visibleChange(arguments)"
        />
      </div>
      <div class="select-item-box">
        <span class="label">融资能力:</span>
        <my-select
          :id="select.finance_id"
          :list="entFinance"
          :title="'是否融资'"
          @onSelect="selectFinance"
          @visibleChange="visibleChange(arguments)"
        />
        <my-select
          v-if="select.finance_id==='1'"
          :id="select.finance_type_id"
          :list="entFinanceType"
          :title="'融资轮次'"
          @onSelect="selectFinanceT"
          @visibleChange="visibleChange(arguments)"
        />
        <div>
          <my-select
            v-if="select.finance_id==='1'"
            :id="select.finance_money_id"
            ref="financeRef"
            :list="entMoney"
            :title="'融资金额'"
            @onSelect="selectFinanceMoney"
            @visibleChange="visibleChange(arguments, 'FINANCEMONEY')"
          />
          <div v-show="FinanceMoneyFlag" v-click-outside="() => FinanceMoneyFlag=false" class="time-box">
            <el-form ref="form" class="money-form" :model="formFinanceMoney">
              <el-form-item prop="min" class="block">
                <span style="margin-right:7px;color:#A8AFB9">从</span>
                <el-input v-model="formFinanceMoney.min" />
                <span style="margin-left:7px;color:#A8AFB9">万</span>
              </el-form-item>
              <el-form-item prop="max" class="block">
                <span style="margin-right:7px;color:#A8AFB9">从</span>
                <el-input v-model="formFinanceMoney.max" />
                <span style="margin-left:7px;color:#A8AFB9">万</span>
              </el-form-item>
              <p class="time-btn" @click="sureFinanceMoney">确定</p>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mySelect from './mySelect'
import myCascader from './myCascader'
import myCascaderNic from './myCascaderNic'
import { getIndustryApi } from '@/api/common.js'
import paramsObj from '@/assets/js/apiParams'
import getTime from '@/utils/get-time'
import clickOutside from '@/directive/clickoutside'
export default {
  components: {
    mySelect,
    myCascader,
    myCascaderNic
  },
  directives: {
    clickOutside
  },
  props: {
    obj: {
      type: Object,
      default: () => {}
    },
    showHot: { // 是否显示热点产业
      type: Boolean,
      default: false
    },
    showClear: { // 是否显示清空按钮
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      textFlag: true,
      flag: true,
      select: { // 默认id显示
        status_id: '0',
        time_id: '0',
        person_id: '0',
        region_id: '',
        money_id: '0',
        scale_id: '0',
        type_id: '0',
        nic_id: '',
        hotNicId: '',
        patent_id: '0',
        patent_type_id: '',
        high_id: '0',
        high_type_id: '',
        list_id: '-1',
        list_type_id: '-1',
        finance_id: '-1',
        finance_type_id: '0',
        finance_money_id: '0'
      },
      hotNicId: '',
      selectObj: [], // 已选中的数组
      entStatus: [
        { name: '不限', id: '0' },
        { name: '在营', id: '1' },
        { name: '吊销', id: '2' },
        { name: '注销', id: '3' },
        { name: '迁出', id: '4' }
      ],
      entTime: [
        { name: '不限', min: 0, max: 0, id: '0' },
        { name: '1年内', min: 0, max: 1, id: '1' },
        { name: '成立1-5年', min: 1, max: 5, id: '2' },
        { name: '成立5-10年', min: 5, max: 10, id: '3' },
        { name: '成立10-15年', min: 10, max: 15, id: '4' },
        { name: '成立15年以上', min: 15, max: 9999, id: '5' },
        { name: '自定义', id: '6' }
      ],
      startTime: '',
      endTime: '',
      timeFlag: false,
      pickerOptionsStart: {
        disabledDate: (time) => {
          let state
          if (this.endTime !== '') {
            state = time.getTime() > Date.now() || time.getTime() > new Date(this.endTime).getTime()
          } else {
            state = time.getTime() > Date.now()
          }
          return state
        }
      }, // 开始日期配置
      pickerOptionsEnd: {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.startTime).getTime() - 86400000 || time.getTime() > Date.now()
        }
      }, // 结束日期配置
      entPerson: [
        { name: '不限', min: 0, max: 0, id: '0' },
        { name: '50人以内', min: 0, max: 49, id: '1' },
        { name: '50-100人', min: 50, max: 100, id: '2' },
        { name: '100-200人', min: 100, max: 200, id: '3' },
        { name: '200-500人', min: 200, max: 500, id: '4' },
        { name: '500人以上', min: 500, max: 99999999999999999, id: '5' }
      ],
      entMoney: [
        { name: '不限', min: 0, max: 0, id: '0' },
        { name: '0-100万', min: 0, max: 100, id: '1' },
        { name: '100-200万', min: 100, max: 200, id: '2' },
        { name: '200-500万', min: 200, max: 500, id: '3' },
        { name: '500-1000万', min: 500, max: 1000, id: '4' },
        { name: '1000万以上', min: 1000, max: 99999999999999999, id: '5' },
        { name: '自定义', min: 0, max: 0, id: '6' }
      ],
      formMoney: {
        min: null,
        max: null
      },
      moneyFlag: false,
      entScale: [
        { name: '不限', id: '0' },
        { name: '大型企业', id: '1' },
        { name: '中型企业', id: '2' },
        { name: '小型企业', id: '3' },
        { name: '微型企业', id: '4' }
      ],
      entType: [
        { name: '不限', id: '0' },
        { name: '国有企业', id: '1' },
        { name: '民营企业', id: '2' },
        { name: '外资企业', id: '3' },
        { name: '港澳台企业', id: '4' },
        { name: '其它企业', id: '5' }
      ],
      entNic: [],
      hotNicArr: [{
        name: '采矿产业',
        id: 'B'
      }, {
        name: '房地产业',
        id: 'K'
      }, {
        name: '建筑产业',
        id: 'E'
      }, {
        name: '交通物流',
        id: 'G'
      }, {
        name: '教育产业',
        id: 'P'
      }],
      entPatent: [
        { name: '不限', id: '0' },
        { name: '有', id: '1' },
        { name: '无', id: '2' }
      ],
      entPatentType: [
        { name: '无限', id: '' },
        { name: '发明专利', id: 'A' },
        { name: '实用专利', id: 'B' },
        { name: '外观专利', id: 'C' }
      ],
      entHigh: [
        { name: '不限', id: '0' },
        { name: '是', id: '1' },
        { name: '否', id: '2' }
      ],
      entHighType: [
        { name: '无限', id: '' },
        { name: '高新技术企业', id: 'A' },
        { name: '中关村高新企业', id: 'B' }
      ],
      entList: [
        { name: '不限', id: '-1' },
        { name: '是', id: '1' },
        { name: '否', id: '0' }
      ],
      entListType: [
        { name: '不限', id: '-1' },
        { name: '主板', id: '1' },
        { name: '创业板', id: '2' },
        { name: '中小板', id: '3' },
        { name: '科创板', id: '4' },
        { name: '新三板', id: '5' },
        { name: '港股', id: '6' }
      ],
      entFinance: [
        { name: '不限', id: '-1' },
        { name: '是', id: '1' },
        { name: '否', id: '0' }
      ],
      entFinanceType: [
        { name: '不限', id: '0' },
        { name: '种子轮', id: '1' },
        { name: '天使轮', id: '2' },
        { name: 'preA轮', id: '3' },
        { name: 'A轮', id: '4' },
        { name: 'A+轮', id: '5' },
        { name: 'preB轮', id: '6' },
        { name: 'B轮', id: '7' },
        { name: 'B+轮', id: '8' },
        { name: 'preC轮', id: '9' },
        { name: 'C轮', id: '10' },
        { name: 'C+轮', id: '11' },
        { name: 'D轮', id: '12' },
        { name: 'E轮', id: '13' },
        { name: 'F轮', id: '14' },
        { name: 'G轮', id: '15' },
        { name: 'BAT轮', id: '16' },
        { name: 'preIPO轮', id: '17' },
        { name: 'IPO轮', id: '18' },
        { name: '其他', id: '99' },
        { name: '无法分类', id: '100' },
        { name: '定向增发', id: '101' },
        { name: '战略投资', id: '102' }
      ],
      FinanceFlag: false,
      formFinanceMoney: {
        min: null,
        max: null
      },
      FinanceMoneyFlag: false,
      searchObj: {} // 检索条件处理后的对象（接口参数）
    }
  },
  watch: {
    obj: {
      handler(n, o) {
        this.obj = n
        this.defaultTag(this.obj)
      },
      deep: true
    },
    selectObj: {
      handler(n, o) {
        var obj = []
        for (let i = 0; i < n.length; i++) {
          obj.push(n[i].name)
        }
        let dataIndex = obj.indexOf('企业状态')
        if (dataIndex !== -1) {
          this.searchObj.ent_status = n[dataIndex].id
        } else {
          this.searchObj.ent_status = '0'
        }
        dataIndex = obj.indexOf('注册时间')
        if (dataIndex !== -1) {
          this.searchObj.es_date_gte = n[dataIndex].min
          this.searchObj.es_date_lte = n[dataIndex].max
        } else {
          this.searchObj.es_date_gte = ''
          this.searchObj.es_date_lte = ''
        }
        dataIndex = obj.indexOf('企业人数')
        if (dataIndex !== -1) {
          this.searchObj.empnum_gte = n[dataIndex].min
          this.searchObj.empnum_lte = n[dataIndex].max
        } else {
          this.searchObj.empnum_gte = 0
          this.searchObj.empnum_lte = 0
        }
        dataIndex = obj.indexOf('注册地区')
        if (dataIndex !== -1) {
          this.searchObj.region_id = n[dataIndex].id
        } else {
          this.searchObj.region_id = 100000
        }
        dataIndex = obj.indexOf('注册资本')
        if (dataIndex !== -1) {
          this.searchObj.regcap_gte = n[dataIndex].min
          this.searchObj.regcap_lte = n[dataIndex].max
        } else {
          this.searchObj.regcap_gte = 0
          this.searchObj.regcap_lte = 0
        }
        dataIndex = obj.indexOf('企业规模')
        if (dataIndex !== -1) {
          this.searchObj.scale_type = n[dataIndex].id
        } else {
          this.searchObj.scale_type = 0
        }
        dataIndex = obj.indexOf('企业类型')
        if (dataIndex !== -1) {
          this.searchObj.ent_type = n[dataIndex].id
        } else {
          this.searchObj.ent_type = 0
        }
        dataIndex = obj.indexOf('所属产业')
        if (dataIndex !== -1) {
          this.searchObj.nic_id = n[dataIndex].id
        } else {
          this.searchObj.nic_id = ''
        }
        dataIndex = obj.indexOf('有无专利')
        if (dataIndex !== -1) {
          this.searchObj.has_patent = n[dataIndex].id
        } else {
          this.searchObj.has_patent = 0
        }
        dataIndex = obj.indexOf('专利类型')
        if (dataIndex !== -1) {
          this.searchObj.patent_type = n[dataIndex].id
        } else {
          this.searchObj.patent_type = ''
        }
        dataIndex = obj.indexOf('是否高新企业')
        if (dataIndex !== -1) {
          this.searchObj.hightech_check = n[dataIndex].id
        } else {
          this.searchObj.hightech_check = 0
        }
        dataIndex = obj.indexOf('高新企业类型')
        if (dataIndex !== -1) {
          this.searchObj.hightech_type = n[dataIndex].id
        } else {
          this.searchObj.hightech_type = ''
        }
        dataIndex = obj.indexOf('是否上市企业')
        if (dataIndex !== -1) {
          this.searchObj.is_listed = n[dataIndex].id
        } else {
          this.searchObj.is_listed = -1
        }
        // 判断上市类型
        dataIndex = obj.indexOf('企业上市类型')
        if (dataIndex !== -1) {
          this.searchObj.listed_type = n[dataIndex].id
        } else {
          this.searchObj.listed_type = -1
        }
        dataIndex = obj.indexOf('是否融资')
        if (dataIndex !== -1) {
          this.searchObj.funding_type = n[dataIndex].id
        } else {
          this.searchObj.funding_type = -1
        }
        dataIndex = obj.indexOf('融资轮次')
        if (dataIndex !== -1) {
          this.searchObj.vc_phase = n[dataIndex].id
        } else {
          this.searchObj.vc_phase = 0
        }
        dataIndex = obj.indexOf('融资金额')
        if (dataIndex !== -1) {
          this.searchObj.sum_amount_gte = n[dataIndex].min
          this.searchObj.sum_amount_lte = n[dataIndex].max
        } else {
          this.searchObj.sum_amount_gte = 0
          this.searchObj.sum_amount_lte = 0
        }
        this.$parent.getEntList({ ...paramsObj, ...this.searchObj })
      },
      deep: true
    }
  },
  created() {
    const that = this
    this.getIndustry()
    this.$nextTick(() => {
      that.$refs.text.style.color = '#26C196'
    })
  },
  methods: {
    // 清空筛选
    emptyTags() {
      this.hotNicId = ''
      this.selectObj = []
      this.select = {
        status_id: '0',
        time_id: '0',
        person_id: '0',
        region_id: '',
        money_id: '0',
        scale_id: '0',
        type_id: '0',
        nic_id: '',
        hotNicId: '',
        patent_id: '0',
        patent_type_id: '0',
        high_id: '0',
        high_type_id: '',
        list_id: '-1',
        list_type_id: '-1',
        finance_id: '-1',
        finance_type_id: '0',
        finance_money_id: '0'
      }
    },
    // 下拉框的显示隐藏事件
    visibleChange() {
      const type = arguments[0][0].type
      const flag = arguments[0][0].flag
      const t = arguments[1]
      if (type === '自定义' && !flag) {
        if (t === 'TIME') {
          this.timeFlag = true
          if (!this.startTime && !this.endTime) {
            this.$refs.timeRef.value = '0'
          }
        } else if (t === 'MONEY') {
          this.moneyFlag = true
          if (!this.formMoney.min && !this.formMoney.max) {
            this.$refs.moneyRef.value = '0'
          }
        } else {
          this.FinanceMoneyFlag = true
          if (!this.formFinanceMoney.min && !this.formFinanceMoney.max) {
            this.$refs.financeRef.value = '0'
          }
        }
      } else {
        this.timeFlag = false
        this.moneyFlag = false
        this.FinanceMoneyFlag = false
      }
    },
    // 默认检索条件
    defaultTag(obj) {
      this.selectObj = []
      this.select = {
        status_id: '0',
        time_id: '0',
        person_id: '0',
        region_id: '',
        money_id: '0',
        scale_id: '0',
        type_id: '0',
        nic_id: '',
        hotNicId: '',
        patent_id: '0',
        patent_type_id: '0',
        high_id: '0',
        high_type_id: '',
        list_id: '-1',
        list_type_id: '-1',
        finance_id: '-1',
        finance_type_id: '0',
        finance_money_id: '0'
      }
      if (JSON.stringify(obj) !== '{}') {
        const region_id = obj.region_id ? obj.region_id : 100000
        const region_name = obj.region_name ? obj.region_name : ''
        // 注册时间相关
        const time_id = obj.regist_time ? obj.regist_time.slice(0, 4) : 0
        let timeMax = time_id + '-12-31'
        this.startTime = time_id + '-01-01'
        if (time_id) {
          if (new Date(timeMax) > new Date()) {
            timeMax = getTime().slice(0, 10)
          }
        }
        this.endTime = timeMax
        const nic_id = obj.nic_id ? obj.nic_id : ''
        const nic_name = obj.nic_name ? obj.nic_name : ''
        // 注册资金
        const money = obj.funds ? Number(obj.funds.substring(0, obj.funds.indexOf('.'))) : 0
        let moneyMin
        let moneyMax
        if (money) {
          moneyMin = money - 50
          moneyMax = money * 1 + 50
          if (money - 50 <= 0) {
            moneyMin = 0
          }
        } else {
          moneyMin = 0
          moneyMax = 0
        }
        this.formMoney.min = moneyMin
        this.formMoney.max = moneyMax
        // 融资相关
        let f
        if (obj.financ !== null) {
          this.FinanceFlag = true
          f = this.entFinanceType.filter(item => {
            if (item.id === String(obj.financ)) {
              return item
            }
          })
        }
        const finance_type_id = f ? Number(obj.financ) : 0
        const finance_type_name = f ? f[0].name : ''
        const finance_type_money = f && obj.financ_money ? obj.financ_money : 0
        let finance_type_moneyMin
        let finance_type_moneyMax
        if (finance_type_money) {
          finance_type_moneyMin = finance_type_money - 50
          finance_type_moneyMax = finance_type_money * 1 + 50
          if (finance_type_money - 50 <= 0) {
            finance_type_moneyMin = 0
          }
        } else {
          finance_type_moneyMin = 0
          finance_type_moneyMax = 0
        }
        this.formFinanceMoney.min = finance_type_moneyMin
        this.formFinanceMoney.max = finance_type_moneyMax
        // 添加已筛选条件框
        const arr = ['注册地区', '注册时间', '所属产业', '注册资本', '是否融资', '融资轮次', '融资金额']
        const brr = [
          { name: '注册地区', value: region_name, id: region_id },
          { name: '注册时间', value: time_id + '-01-01至' + timeMax, min: time_id ? time_id + '-01-01' : 0, max: time_id ? timeMax : 0 },
          { name: '所属产业', value: nic_name, id: nic_id },
          { name: '注册资本', value: moneyMin + '-' + moneyMax + '万', min: moneyMin, max: moneyMax },
          { name: '是否融资', value: f ? '是' : '', id: f ? '1' : '-1' },
          { name: '融资轮次', value: finance_type_name, id: finance_type_id },
          { name: '融资金额', value: finance_type_money ? finance_type_moneyMin + '-' + finance_type_moneyMax + '万' : '', min: finance_type_moneyMin, max: finance_type_moneyMax }
        ]
        for (var i = 0; i < arr.length; i++) {
          if (brr[i].value !== null && brr[i].value !== '') {
            this.filterTags(arr[i], brr[i])
          }
        }
        // 下拉框默认颜色
        this.select.region_id = obj.region_id
        this.select.time_id = time_id ? '6' : '0'
        this.select.nic_id = obj.nic_id === null ? '' : obj.nic_id
        this.select.money_id = obj.funds ? '6' : '0'
        this.select.finance_id = obj.financ === null ? '-1' : '1'
        this.select.finance_type_id = obj.financ === null ? '0' : '1'
        this.select.finance_money_id = obj.financ_money === null ? '0' : '6'
      }
    },
    // 自定义融资金额
    sureFinanceMoney() {
      this.FinanceMoneyFlag = false
      if (!this.formFinanceMoney.min && !this.formFinanceMoney.max) {
        this.$refs.financeRef.value = '0'
        const t = this.findIndex(this.selectObj, 'name', '融资金额')
        if (t !== undefined && t > -1) this.selectObj.splice(t, 1)
        return
      }
      this.$refs.financeRef.value = '6'
      if (!this.formFinanceMoney.min && this.formFinanceMoney.max) {
        this.formFinanceMoney.min = this.formFinanceMoney.max
      }
      if (this.formFinanceMoney.min && !this.formFinanceMoney.max) {
        this.formFinanceMoney.max = this.formFinanceMoney.min
      }
      if (Number(this.formFinanceMoney.min) > Number(this.formFinanceMoney.max)) {
        const n1 = this.formFinanceMoney.min
        const n2 = this.formFinanceMoney.max
        this.formFinanceMoney.min = n2
        this.formFinanceMoney.max = n1
      }
      const obj = { name: '融资金额', value: this.formFinanceMoney.min + '-' + this.formFinanceMoney.max + '万', min: this.formFinanceMoney.min, max: this.formFinanceMoney.max }
      this.filterTags('融资金额', obj)
    },
    // 融资金额
    selectFinanceMoney({ title, value }) {
      const val = this.filterTree(this.entMoney, value.id)
      if (value.name !== '自定义') {
        this.select.finance_money_id = value.id
        this.formFinanceMoney.min = value.min
        this.formFinanceMoney.max = value.max
        const obj = { name: title, value: val, max: value.max, min: value.min }
        this.filterTags(title, obj)
      } else {
        this.FinanceMoneyFlag = true
      }
    },
    // 融资轮次
    selectFinanceT({ title, value }) {
      this.select.finance_type_id = value.id
      const val = this.filterTree(this.entFinanceType, value.id)
      const obj = { name: title, value: val, id: value.id }
      this.filterTags(title, obj)
    },
    // 选择是否融资
    selectFinance({ title, value }) {
      if (value.id === '0') {
        this.select.finance_type_id = '0'
        this.select.finance_money_id = '0'
        const obj = { name: '融资轮次', value: '', id: '0' }
        const obj1 = { name: '融资金额', value: '', id: '0', max: 0, min: 0 }
        this.filterTags('融资轮次', obj)
        this.filterTags('融资金额', obj1)
      }
      this.select.finance_id = value.id
      const val = this.filterTree(this.entFinance, value.id)
      const obj = { name: title, value: val, id: value.id }
      this.filterTags(title, obj)
    },
    // 企业上市类型
    selectListT({ title, value }) {
      this.select.list_type_id = value.id
      const val = this.filterTree(this.entListType, value.id)
      const obj = { name: title, value: val, id: value.id }
      this.filterTags(title, obj)
    },
    // 选择上市企业
    selectList({ title, value }) {
      if (value.id === '0') {
        this.select.list_type_id = '-1'
        const obj = { name: '企业上市类型', value: '', id: '-1' }
        this.filterTags('企业上市类型', obj)
      }
      this.select.list_id = value.id
      const val = this.filterTree(this.entList, value.id)
      const obj = { name: title, value: val, id: value.id }
      this.filterTags(title, obj)
    },
    // 高新企业类型
    selectHighT({ title, value }) {
      this.select.high_type_id = value.id
      const val = this.filterTree(this.entHighType, value.id)
      const obj = { name: title, value: val, id: value.id }
      this.filterTags(title, obj)
    },
    // 选择高新企业
    selectHigh({ title, value }) {
      if (value.id === '2') {
        this.select.high_type_id = ''
        const obj = { name: '高新企业类型', value: '', id: '' }
        this.filterTags('高新企业类型', obj)
      }
      this.select.high_id = value.id
      const val = this.filterTree(this.entHigh, value.id)
      const obj = { name: title, value: val, id: value.id }
      this.filterTags(title, obj)
    },
    // 专利类型
    selectPatentT({ title, value }) {
      this.select.patent_type_id = value.id
      const val = this.filterTree(this.entPatentType, value.id)
      const obj = { name: title, value: val, id: value.id }
      this.filterTags(title, obj)
    },
    // 选择专利
    selectPatent({ title, value }) {
      if (value.id === '2') {
        this.select.patent_type_id = ''
        const obj = { name: '专利类型', value: '', id: '' }
        this.filterTags('专利类型', obj)
      }
      this.select.patent_id = value.id
      const val = this.filterTree(this.entPatent, value.id)
      const obj = { name: title, value: val, id: value.id }
      this.filterTags(title, obj)
    },
    checkHotNic(value) {
      this.select.nic_id = ''
      this.select.hotNicId = value.id
      this.hotNicId = value.id
      const obj = { name: '所属产业', value: value.name, id: value.id }
      this.filterTags('所属产业', obj)
    },
    // 选择行业
    selectNic({ title, value }) {
      this.select.nic_id = value.id
      this.select.hotNicId = ''
      this.hotNicId = ''
      const obj = { name: title, value: value.name, id: value.id }
      this.filterTags(title, obj)
    },
    // 选择企业类型
    selectType({ title, value }) {
      this.select.type_id = value.id
      const val = this.filterTree(this.entType, value.id)
      const obj = { name: title, value: val, id: value.id }
      this.filterTags(title, obj)
    },
    // 选择企业规模
    selectScale({ title, value }) {
      this.timeFlag = false
      this.select.scale_id = value.id
      const val = this.filterTree(this.entScale, value.id)
      const obj = { name: title, value: val, id: value.id }
      this.filterTags(title, obj)
    },
    // 自定义注册资金
    sureMoney() {
      this.moneyFlag = false
      if (!this.formMoney.min && !this.formMoney.max) {
        this.$refs.moneyRef.value = '0'
        const t = this.findIndex(this.selectObj, 'name', '注册资本')
        if (t !== undefined && t > -1) this.selectObj.splice(t, 1)
        return
      }
      this.$refs.moneyRef.value = '6'
      if (!this.formMoney.min && this.formMoney.max) {
        this.formMoney.min = this.formMoney.max
      }
      if (this.formMoney.min && !this.formMoney.max) {
        this.formMoney.max = this.formMoney.min
      }
      if (Number(this.formMoney.min) > Number(this.formMoney.max)) {
        const n1 = this.formMoney.min
        const n2 = this.formMoney.max
        this.formMoney.min = n2
        this.formMoney.max = n1
      }
      const obj = { name: '注册资本', value: this.formMoney.min + '-' + this.formMoney.max + '万', max: this.formMoney.max, min: this.formMoney.min }
      this.filterTags('注册资本', obj)
    },
    // 选择注册资本
    selectMoney({ title, value }) {
      const val = this.filterTree(this.entMoney, value.id)
      if (value.name !== '自定义') {
        this.select.money_id = value.id
        this.formMoney.min = value.min
        this.formMoney.max = value.max
        const obj = { name: title, value: val, min: value.min, max: value.max }
        this.filterTags(title, obj)
      } else {
        this.moneyFlag = true
      }
    },
    // 选择注册地区
    selectRegion(param) {
      this.select.region_id = param.value.id
      const value = param.value.name
      const obj = { name: '注册地区', value: value, id: param.value.id }
      this.filterTags('注册地区', obj)
    },
    // 选择企业人数
    selectPerson({ title, value }) {
      this.select.person_id = value.id
      const val = this.filterTree(this.entPerson, value.id)
      const obj = { name: title, value: val, max: value.max, min: value.min }
      this.filterTags(title, obj)
    },
    // 选择时间
    selectTime({ title, value }) {
      const val = this.filterTree(this.entTime, value.id)
      if (value.name !== '自定义') {
        this.select.time_id = value.id
        var date = new Date()
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        var dd = date.getDay()
        if (m < 10) {
          m = '0' + m
        }
        if (dd < 10) {
          dd = '0' + dd
        }
        if (value.max > y) {
          this.startTime = 1000 + '-01-01'
        } else {
          this.startTime = y - value.max + '-' + m + '-' + dd
        }
        this.endTime = y - value.min + '-' + m + '-' + dd
        const obj = { name: title, value: val, min: this.startTime, max: this.endTime }
        this.filterTags(title, obj)
      }
    },
    // 自定义添加时间
    sureTime() {
      this.timeFlag = false
      if (!this.startTime && !this.endTime) {
        this.$refs.timeRef.value = '0'
        const t = this.findIndex(this.selectObj, 'name', '注册时间')
        if (t !== undefined && t > -1) this.selectObj.splice(t, 1)
        return
      }
      this.$refs.timeRef.value = '6'
      if (!this.startTime && this.endTime) {
        this.startTime = this.endTime
      }
      if (this.startTime && !this.endTime) {
        this.endTime = this.startTime
      }
      const obj = { name: '注册时间', value: this.startTime + '至' + this.endTime, min: this.startTime, max: this.endTime }
      this.filterTags('注册时间', obj)
    },
    // 选择状态
    selectStatus({ title, value }) {
      this.timeFlag = false
      this.select.status_id = value.id
      const val = this.filterTree(this.entStatus, value.id)
      const obj = { name: title, value: val, id: value.id }
      this.filterTags(title, obj)
    },
    // 删除标签
    delSelect(name) {
      switch (name) {
        case '企业状态':
          this.select.status_id = '0'
          break
        case '注册时间':
          this.select.time_id = '0'
          this.startTime = ''
          this.endTime = ''
          break
        case '企业人数':
          this.select.person_id = '0'
          break
        case '注册地区':
          this.select.region_id = ''
          break
        case '注册资本':
          this.select.money_id = '0'
          this.formMoney.min = ''
          this.formMoney.max = ''
          break
        case '企业规模':
          this.select.scale_id = '0'
          break
        case '企业类型':
          this.select.type_id = '0'
          break
        case '所属产业':
          this.select.nic_id = ''
          this.select.hotNicId = ''
          this.hotNicId = ''
          break
        case '有无专利':
          this.select.patent_id = '0'
          this.select.patent_type_id = ''
          break
        case '专利类型':
          this.select.patent_type_id = ''
          break
        case '是否高新企业':
          this.select.high_id = '0'
          this.select.high_type_id = ''
          break
        case '高新企业类型':
          this.select.high_type_id = ''
          break
        case '是否上市企业':
          this.select.list_id = '-1'
          this.select.list_type_id = '-1'
          break
        case '企业上市类型':
          this.select.list_type_id = '-1'
          break
        case '是否融资':
          this.select.finance_id = '-1'
          this.select.finance_type_id = '0'
          this.select.finance_money_id = '0'
          this.formFinanceMoney.min = ''
          this.formFinanceMoney.max = ''
          break
        case '融资轮次':
          this.select.finance_type_id = '0'
          break
        case '融资金额':
          this.select.finance_money_id = '0'
          this.formFinanceMoney.min = ''
          this.formFinanceMoney.max = ''
          break
      }
      for (var i = 0; i < this.selectObj.length; i++) {
        if ((this.selectObj[i].name).indexOf(name) > -1) { // 判断key为999的对象是否存在
          if (name === '是否融资') {
            const t1 = this.findIndex(this.selectObj, 'name', '融资金额')
            const t2 = this.findIndex(this.selectObj, 'name', '融资轮次')
            if (t1 !== undefined && t1 > -1) this.selectObj.splice(t1, 1)
            if (t2 !== undefined && t2 > -1) this.selectObj.splice(t2, 1)
          } else if (name === '是否上市企业') {
            const t = this.findIndex(this.selectObj, 'name', '上市企业类型')
            if (t !== undefined && t > -1) this.selectObj.splice(t, 1)
          } else if (name === '是否高新企业') {
            const t = this.findIndex(this.selectObj, 'name', '高新企业类型')
            if (t !== undefined && t > -1) this.selectObj.splice(t, 1)
          } else if (name === '有无专利') {
            const t = this.findIndex(this.selectObj, 'name', '专利类型')
            if (t !== undefined && t > -1) this.selectObj.splice(t, 1)
          }
          const index = i
          this.selectObj.splice(index, 1) // 存在即删除
        }
      }
    },
    // 查找下标
    findIndex(arr, key, word) {
      return arr.findIndex((o, n) => {
        if (o[key] === word) {
          return n
        }
      })
    },
    filterTags(name, obj) {
      for (let i = 0; i < this.selectObj.length; i++) {
        if ((this.selectObj[i].name).indexOf(name) > -1) { // 判断key为name的对象是否存在
          const index = i
          this.selectObj.splice(index, 1, obj) // 存在即替换
          return
        }
      }
      this.selectObj.push(obj)
    },
    // 返回下拉框对应值
    filterTree(arr, val) {
      var str
      arr.forEach(item => {
        if (item.id === val) {
          str = item.name
        }
      })
      return str
    },
    showSelect() {
      this.textFlag = !this.textFlag
      if (this.textFlag) {
        this.flag = false
        this.$refs.text.style.color = '#26C196'
      }
      if (!this.textFlag) {
        this.flag = true
        this.$refs.text.style.color = '#E55C73'
      }
    },
    // 获取行业
    getIndustry() {
      getIndustryApi().then(res => {
        if (res.code === 0) {
          this.entNic = res.data.map(item => {
            return {
              name: item.name,
              code: item.code,
              children: item.child ? item.child.map(innerItem => {
                return {
                  name: innerItem.name,
                  code: innerItem.code,
                  leaf: true
                }
              }) : []
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.select-item-box {
  display: flex;
  margin: 15px 0;
}
.select-item-box1 {
  margin-bottom: 10px;
}
.select-item-nic-box /deep/ .el-input__inner {
  height: 32px;
  line-height: 32px;
}
.select-item-nic-box /deep/ .el-cascader {
  // height: 34px;
  line-height: 32px;
}
.select-item-nic-box .label {
  line-height: 21px;
}
.select-box {
  width: 90%;
  display: flex;
  flex-wrap: wrap;
  margin-left: 10px;
  span {
    margin: 5px 10px;
    flex-shrink: 0;
  }
}
.select-wrapper {
  width: 95%;
  display: flex;
  justify-content: space-between;
}
.empty>span{
  padding: 5px 10px;
  cursor: pointer;
  color: #464C5B;
  font-size: 14px;
  letter-spacing: 3px;
  white-space: nowrap;
  line-height: 34px;
  font-weight: 600;
}
.empty:hover>span{
  color: #E55C73;
}
.text {
  cursor: pointer;
  // line-height: 30px;
  font-size: 12px;
  margin-left: 15px;
}
.select-item-time-box {
  position: relative;
}
.maxSelect /deep/ .select-box {
  width: 125px !important;
}
.select-show-wrap {
  overflow: hidden;
  height: 0;
  transition: height .2s;
}
.select-show-wrap.active {
  height: 199px;
}
.time-box {
  position: absolute;
  width: 170px;
  height: 105px;
  padding: 5px 10px;
  background:rgba(255,255,255,1);
  border:1px solid rgba(215,221,228,1);
  box-shadow:0px 3px 5px 0px rgba(0, 0, 0, 0.1);
  border-radius:2px;
  z-index: 10;
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 90%;
    height: 24px;
    font-size: 12px;
  }
  /deep/ .el-input__inner {
    height: 24px;
    line-height: 24px;
    font-size: 12px;
  }
  /deep/ .el-input__icon {
    line-height: 24px;
  }
  .block {
    display: flex;
    margin: 5px 0;
    font-size: 12px;
    line-height: 24px;
  }
  .time-btn {
    font-size: 14px;
    margin-top: 8px;
    cursor: pointer;
  }
  /deep/ .el-form-item {
    height: 24px;
    margin: 8px 0;
    display: flex;
  }
  /deep/ .el-form-item__content {
    display: flex;
  }
}
.hotNicWrap{
  font-size: 14px;
  color: #212121;
  letter-spacing: 2px;
  margin-left: 20px;
  line-height: 24px;
}
.hotNicItem{
  margin-right: 25px;
  cursor: pointer;
}
.hotNicItem.active{
  color: #0056B2;
}
.on-select{
    /*display: inline-block;*/
    font-size: 14px;
    border:1px solid rgba(215,221,228,1);
    border-radius:4px;
    padding: 5px 18px 5px 8px;
    margin: 0 10px;
    position: relative;
    background: #0056B2;
    color: #fff;
    .close-tag {
      font-style: normal;
      font-size: 15px;
      position: absolute;
      right: 10px;
      top:50%;
      transform: translateY(-60%);
      cursor: pointer;
    }
}
.label {
  flex-shrink: 0;
  font-size:14px;
  font-family:Source Han Sans CN;
  font-weight:bold;
  color:rgba(33,33,33,1);
  line-height:25px;
}
.label-first {
  line-height: 40px;
}
.label-seconed {
  font-size: 16px;
  line-height: 16px;
}
</style>
