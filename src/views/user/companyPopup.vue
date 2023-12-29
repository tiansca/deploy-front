<template>
  <div class="company-popup">
    <el-dialog
      :title="tableData.ENTNAME"
      :visible.sync="showDialog"
      :before-close="beforeColse"
      width="742px"
      center
    >
      <el-table
        :data="tableData"
        border
        :show-header="false"
        class="company-popup-table"
        :span-method="arraySpanMethod"
        :cell-style="cellStyle"
      >
        <el-table-column prop="name" align="right" width="140" />
        <el-table-column prop="left" align="left" />
        <el-table-column prop="name1" align="right" width="140" />
        <el-table-column prop="right" align="left" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addFocus">关注该企业</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

export default {
  name: 'Popup',
  props: {
    tableData: {
      type: Array,
      require: true,
      default: () => {}
    },
    showDialog: {
      type: Boolean,
      require: true,
      dafault: false
    }
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 3 || rowIndex === 4) {
        if (columnIndex === 1) {
          return [1, 3]
        }
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 3) {
        return 'color:#999999'
      }
      if (columnIndex === 0 || columnIndex === 2) {
        return 'color:#333333'
      }
    },
    beforeColse() {
      this.$emit('beforeColse')
    },
    addFocus() {
      this.$emit('addFocus')
    }
  }
}
</script>
<style lang="scss" scoped>
	.company-popup  ::v-deep .el-dialog__footer{
			.el-button--primary {
					background:rgba(0,86,178,1);
					border-radius:2px;
					border-color:transparent;
			}
	}
	.company-popup-table ::v-deep {
			.el-table__body-wrapper {
					tr td {
							border:none!important;
					}
			}
	}
	.company-popup ::v-deep  tbody tr:hover>td {
    background-color:#ffffff
	}
</style>
