<template>
    <div class="table-base-view-wrapper">
        <!--顶部的工具按钮-->
        <div class="tool-wrapper">
            <el-row :gutter="10" class="mb8">
                <slot name="base-table-header"></slot>
            </el-row>
        </div>
        
        <div class="table-wrapper">
            <!--列表数据-->
            <slot name="base-table-content"></slot>
            <!--底部的分页按钮-->
            <div class="pagination-wrapper">
                <slot name="base-table-footer"></slot>
            </div>
        </div>
        
   

        <slot name="other"></slot>
    </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
    name: "",
    props: {},
    setup() {
        return {};
    },
});
</script>

<style scoped lang="scss">
.table-base-view-wrapper {
    display: flex;
    flex-direction: column;

    height: 100%;

    .tool-wrapper {
    }

    .table-wrapper {
        height: 100%;

        .pagination-wrapper {
            margin-top: 20px;
            text-align: center;
            
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: end;
        }
    }
    
  
}
</style>