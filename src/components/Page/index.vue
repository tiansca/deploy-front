<template>
  <el-pagination
    background
    :current-page="pageinationData.currentPage"
    :page-sizes="pageinationData.pageSizes"
    :page-size="pageinationData.pageSize"
    layout="sizes, prev, pager, next"
    :total="pageinationData.total"
    @size-change="pageinationData.handleSizeChange"
    @current-change="pageinationData.handleCurrentChange"
  ></el-pagination>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['pageinationData']
}
</script>
<style scoped>
  .el-pagination.is-background /deep/ .el-pager li:not(.disabled).active{
    background:rgba(0,86,178,1);
    color: #fff;
    border: 1px solid rgba(0,86,178,1);
    /*border-radius:2px;*/
  }
  .el-pagination /deep/ .el-pager li{
    background-color: transparent;
    border: 1px solid #a8afb9;
    color: #212121;
    font-size: 14px;
    min-width: 36px;
    line-height: 36px;
    height: 36px;
    font-weight: 400;
    margin: 0 7px
  }
  /*.el-pagination /deep/ .el-pager.active li{*/
  /*  color: #fff;*/
  /*  border: 1px solid ;*/
  /*}*/
  .el-pagination /deep/ button,.el-pagination /deep/ .el-input__inner{
    border: 1px solid #a8afb9;
    background-color: transparent!important;
    min-width: 36px!important;
    line-height: 36px;
    height: 36px;
    font-size: 14px;
  }
  .el-pagination.is-background /deep/ button{
    color: #0056B2!important;
  }
  .el-pagination.is-background /deep/ button:disabled{
    color: rgba(0,86,178,0.6)!important;
  }
  .el-pagination.is-background /deep/ .el-pager li:not(.active):hover{
    background:rgba(239,243,247,1);
    color: #212121!important;
    /*border-radius:2px;*/
  }
  /deep/.el-icon-arrow-right:before{
    content: "\e791";
    font-size: 14px;
  }
  /deep/.el-icon-arrow-left:before{
    font-size: 14px;
    content: "\e792";
  }

  @media all and (max-width: 1400px) {
    .el-pagination /deep/ .el-pager li{
      font-size: 13px;
      min-width: 30px;
      line-height: 30px;
      height: 30px;
    }
    /*.el-pagination /deep/ .el-pager.active li{*/
    /*  color: #fff;*/
    /*  border: 1px solid ;*/
    /*}*/
    .el-pagination /deep/ button,.el-pagination /deep/ .el-input__inner{
      min-width: 30px!important;
      line-height: 30px;
      height: 30px;
      font-size: 13px;
    }
  }
</style>

