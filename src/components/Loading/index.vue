<template>
  <div v-show="isLoading" class="domestic-loading">
    <div class="loading-wrap">
      <!--      <span class="text">Loading</span>-->
      <!--      <span class="spinner" />-->
      <div class="el-loading-spinner">
        <svg viewBox="25 25 50 50" class="circular">
          <circle cx="50" cy="50" r="20" fill="none" class="path" style="stroke: #fff;stroke-width: 3;" />
          <circle cx="50" cy="50" r="20" fill="none" class="path" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      default: false,
      type: Boolean
    }
  }
}
</script>

<style scoped>
.domestic-loading{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(255,255,255,.2);
  z-index: 99999;
}
.loading-wrap {
  /*display: none;*/
  width: 120px;
  height: 120px;
  position: fixed;
  z-index: 108;
  top: calc(50% - 60px);
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  text-align: center;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: default;
}
.domestic-loading .text {
  position: absolute;
  top: 2em;
  left: 1.4em;
  z-index: 5;
  font-size: 1.1em;
  color: #fff;
  text-transform: uppercase;
  -webkit-animation: text 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite normal;
  -moz-animation: text 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite normal;
  -ms-animation: text 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite normal;
  -o-animation: text 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite normal;
  animation: text 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite normal;
}
.domestic-loading .spinner {
  position: relative;
  width: 55px;
  height: 55px;
  color: #fff;
  display: inline-block;
}
.spinner:before,
.spinner:after {
  content: '';
  position: relative;
  display: block;
}
.domestic-loading .spinner:before {
  -webkit-animation: spinner 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite normal;
  -moz-animation: spinner 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite normal;
  -ms-animation: spinner 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite normal;
  -o-animation: spinner 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite normal;
  animation: spinner 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite normal;
  width: 6em;
  height: 6em;
  left: -32%;
  top: 0;
  background-color: #22aefe;
}
.domestic-loading .spinner:after {
  -webkit-animation: shadow 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite normal;
  -moz-animation: shadow 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite normal;
  -ms-animation: shadow 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite normal;
  -o-animation: shadow 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite normal;
  animation: shadow 2.5s cubic-bezier(0.75, 0, 0.5, 1) infinite normal;
  position: relative;
  bottom: -1.75em;
  height: 0.25em;
  border-radius: 50%;
  background-color: #322b27;
}
@-webkit-keyframes spinner {
  50% {
    -webkit-border-radius: 50%;
    -webkit-transform: scale(0.5) rotate(360deg);
    background-color: #2084e4;
  }
  100% {
    -webkit-transform: scale(1) rotate(720deg);
    background-color: #22aefe;
  }
}
@-moz-keyframes spinner {
  50% {
    -moz-border-radius: 50%;
    -moz-transform: scale(0.5) rotate(360deg);
    background-color: #2084e4;
  }
  100% {
    -moz-transform: scale(1) rotate(720deg);
    background-color: #22aefe;
  }
}
@-ms-keyframes spinner {
  50% {
    -ms-border-radius: 50%;
    -ms-transform: scale(0.5) rotate(360deg);
    background-color: #2084e4;
  }
  100% {
    -ms-transform: scale(1) rotate(720deg);
    background-color: #22aefe;
  }
}
@-o-keyframes spinner {
  50% {
    -o-border-radius: 50%;
    -o-transform: scale(0.5) rotate(360deg);
    background-color: #2084e4;
  }
  100% {
    -o-transform: scale(1) rotate(720deg);
    background-color: #22aefe;
  }
}
@keyframes spinner {
  50% {
    border-radius: 50%;
    transform: scale(0.5) rotate(360deg);
    background-color: #2084e4;
  }
  100% {
    transform: scale(1) rotate(720deg);
    background-color: #22aefe;
  }
}
/* animation shadow */
@-webkit-keyframes shadow {
  50% {
    -webkit-transform: scale(0.5);
    background-color: #322b27;
  }
}
@-moz-keyframes shadow {
  50% {
    -moz-transform: scale(0.5);
    background-color: #322b27;
  }
}
@-ms-keyframes shadow {
  50% {
    -ms-transform: scale(0.5);
    background-color: #322b27;
  }
}
@-o-keyframes shadow {
  50% {
    -o-transform: scale(0.5);
    background-color: #322b27;
  }
}
@keyframes shadow {
  50% {
    transform: scale(0.5);
    background-color: #322b27;
  }
}
/* animation text */
@-webkit-keyframes text {
  0% {
    -webkit-transform: scale(1, 1);
  }
  50% {
    -webkit-transform: scale(0.5, 0.5);
  }
  100% {
    -webkit-transform: scale(1, 1);
  }
}
@-moz-keyframes text {
  0% {
    -moz-transform: scale(1, 1);
  }
  50% {
    -moz-transform: scale(0.5, 0.5);
  }
  100% {
    -moz-transform: scale(1, 1);
  }
}
@-ms-keyframes text {
  0% {
    -ms-transform: scale(1, 1);
  }
  50% {
    -ms-transform: scale(0.5, 0.5);
  }
  100% {
    -ms-transform: scale(1, 1);
  }
}
@-o-keyframes text {
  0% {
    -o-transform: scale(1, 1);
  }
  50% {
    -o-transform: scale(0.5, 0.5);
  }
  100% {
    -o-transform: scale(1, 1);
  }
}
@keyframes text {
  0% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(0.5, 0.5);
  }
  100% {
    transform: scale(1, 1);
  }
}
</style>
