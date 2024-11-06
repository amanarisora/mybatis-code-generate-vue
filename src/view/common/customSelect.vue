<template>
  <a-dropdown :trigger="['click']">
    <div>
      <a-input v-model:value="selectedLabel" readonly style="cursor: pointer">
        <template #prefix>
          <slot name="prefixIcon"/>
        </template>
        <template #suffix>
          <DownOutlined style="color: lightgray"/>
        </template>
      </a-input>
    </div>
    <template #overlay>
      <a-menu v-model:selectedKeys="selectedKeys" @click="handleMenuClick">
        <a-menu-item
            v-for="option in options"
            :key="option.value"
            :title="option.label"
        >
          <div class="tree-node-title">
            <slot name="itemIcon" style="float: left;"/>
            <span class="tree-node-text">{{ option.label }} </span>
          </div>

        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup>
import {ref, watch} from 'vue';
import { DownOutlined } from "@ant-design/icons-vue";

const value = defineModel("value")

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
});

watch(value,(newValue)=>{
  let isExist = false
  props.options.forEach((option) => {
    if (option.value === newValue) {
      isExist = true;
      selectedLabel.value = option.label;
      if (selectedLabel.value.length > 0) {
        selectedKeys.value[0] = newValue
      }else {
        selectedKeys.value.push(newValue)
      }
    }
  })
  if (!isExist){
    value.value = ''
  }
})


const selectedLabel = ref('')

const selectedKeys = ref([])

function handleMenuClick({ item,key }) {
  value.value = key
  selectedLabel.value = item.title
  if (selectedLabel.value.length > 0) {
    selectedKeys.value[0] = key
  }else {
    selectedKeys.value.push(key)
  }
}

</script>

<style scoped>
:deep(.ant-input) {
  cursor: pointer;
}
</style>