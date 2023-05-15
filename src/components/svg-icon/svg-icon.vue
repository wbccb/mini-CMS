<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";

/**
 * 统一elementsPlusIcon和自己的svg
 * 暗黑模式时能够自由切换svg的背景色
 */
export default defineComponent({
  name: "svg-icon",
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const iconName = computed(() => {
      return `#icon-${props.iconClass}`;
    });

    const svgClass = computed(() => {
      if (props.className) {
        return `svg-icon ${props.className}`;
      }
      return "svg-icon";
    });

    return {
      iconName,
      svgClass,
    };
  },
});
</script>

<style scoped lang="scss">
.sub-el-icon,
.nav-icon {
  display: inline-block;
  font-size: 15px;
  margin-right: 12px;
  position: relative;
}

.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
}
</style>
