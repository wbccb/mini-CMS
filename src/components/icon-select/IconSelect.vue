<template>
  <div class="icon-select-wrapper">
    <!--筛选弹出的icons列表-->
    <el-input
      v-model="iconName"
      class="icon-search"
      clearable
      placeholder="请输入图标名称"
      @clear="filterIcons"
      @input="filterIcons"
    >
      <!--没有输入文字时的图标显示-->
      <template #suffix>
        <i class="el-icon-search el-input__icon" />
      </template>
    </el-input>
    <div class="icon-list">
      <div class="list-container">
        <div
          v-for="(item, index) in iconList"
          class="icon-item-wrapper"
          :key="index"
          @click="selectedIcon(item)"
        >
          <div :class="['icon-item', {active: activeIcon === item}]">
            <svg-icon :icon-class="item" class-name="icon" class="svg-icon-content"></svg-icon>
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import icons from "./requireIcons";
import {useDebounce} from "@/common/hooks/useDebounce"; // icons=string[]

export default defineComponent({
  name: "IconSelect",
  props: {
    activeIcon: {
      type: Object,
    },
  },
  emits: ["select-icon"],
  setup(props, context) {
    const iconName = ref("");
    const iconList = ref<string[]>(icons);

    const filterIcons = () => {
      // 根据名称进行icons的筛选
      const name = iconName.value;
      const newIconList = iconList.value.filter((item) => {
        return item.indexOf(name) !== -1;
      });
      iconList.value = newIconList;
    };

    // 选中icon
    const selectedIcon = (item: string) => {
      iconName.value = "";
      context.emit("select-icon", item);
    };

    // 清除icon
    const reset = () => {
      iconName.value = "";
      iconList.value = icons;
    };

    return {
      iconName,
      filterIcons,
      iconList,
      selectedIcon,
      reset,
    };
  },
});
</script>
<style lang="scss" scoped>
.icon-select-wrapper {
  width: 100%;
  padding: 10px;

  .icon-search {
    position: relative;
    margin-bottom: 5px;
  }

  .icon-list {
    height: 200px;
    overflow: auto;

    .list-container {
      display: flex;
      flex-wrap: wrap;

      .icon-item-wrapper {
        width: calc(100% / 3);
        height: 25px;
        line-height: 25px;
        cursor: pointer;
        display: flex;

        .icon-item {
          display: flex;
          max-width: 100%;
          height: 100%;
          padding: 0 5px;

          &:hover {
            background: #ececec;
            border-radius: 5px;
          }

          .icon {
            flex-shrink: 0;
          }

          span {
            display: inline-block;
            vertical-align: -0.15em;
            fill: currentColor;
            padding-left: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .icon-item.active {
          background: #ececec;
          border-radius: 5px;
        }
      }
    }
  }
}

.svg-icon-content {
  width: 16px;
  height: 25px;
}
</style>
