<script setup lang="ts">
onLaunch(() => {})
</script>

<style lang="scss">
.page-wraper {
  min-height: calc(100vh - var(--window-top));
  box-sizing: border-box;
  background: #f9f9f9;
}

.wot-theme-dark.page-wraper {
  background: #222;
}

button::after {
  border: none;
}
button {
  position: relative;
  display: block;
  margin-left: initial;
  margin-right: initial;
  padding-left: initial;
  padding-right: initial;
  box-sizing: border-box;
  // font-size: 18px;
  text-align: center;
  text-decoration: none;
  // line-height: 1;
  line-height: 1.35;
  // border-radius: 5px;
  -webkit-tap-highlight-color: transparent;
  overflow: initial;
  color: initial;
  background-color: initial;
  width: fit-content;
  height: fit-content;
}
</style>
