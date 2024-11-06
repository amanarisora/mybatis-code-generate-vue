<template>
  <a-modal :open="props.open" title="保存查询" @cancel="emit('update:open',false)" @ok="submit"
           style="width: 600px;">
    <div style="display: flex; justify-content: center; height: 100%;margin-bottom: 10px">
      <a-col>
        <a-row class="icon-form">
          <Vite style="transform: scale(0.6)"/>
          <div class="divider"></div> <!-- 添加分隔线 -->
          <QueryOn style="transform: scale(0.6);"/>
        </a-row>
        <a-form ref="form"
                :model="formData"
                autocomplete="off"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 20 }"
        >
          <a-form-item
              label="数据库名称"
              name="queryName"
              :rules="[{ required: true, message: '需要查询名称!',trigger: 'blur' }]"
          >
            <a-input v-model:value="formData.queryName" style="width: 280px;"/>
          </a-form-item>
        </a-form>
      </a-col>
    </div>
  </a-modal>
</template>

<script setup lang="ts">

import Vite from "@/assets/vite.svg";
import QueryOn from "@/assets/query-on.svg";
import {reactive, ref} from "vue";

const props = defineProps({open: Boolean});
const emit = defineEmits(['update:open','saveQuerySubmit']);
const form = ref()
const formData = reactive({
  queryName: ''
})

function submit() {
  form.value.validate().then(async v => {
    emit('saveQuerySubmit',formData.queryName)
    form.value.resetFields()
    emit('update:open', false)
  }).catch(err => {

  })

}
</script>

<style scoped>
.icon-form {
  display: flex;
  align-items: center;
}
</style>