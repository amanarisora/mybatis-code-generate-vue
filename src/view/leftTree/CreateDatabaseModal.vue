<template>
  <a-modal :open="props.open" title="新建数据库" @cancel="emit('update:open',false)" @ok="submit"
  style="width: 600px;">
    <div style="display: flex; justify-content: center; height: 100%;margin-bottom: 10px">
      <a-col >
        <a-row class="icon-form">
          <Vite style="transform: scale(0.6)"/>
          <div class="divider"></div> <!-- 添加分隔线 -->
          <DatabaseOn style="transform: scale(0.6);" />
        </a-row>
        <a-form ref="form"
                :model="formData"
                autocomplete="off"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 20 }"
        >
          <a-form-item
              label="数据库名称"
              name="databaseName"
              :rules="[{ required: true, message: '需要数据库名称!',trigger: 'blur' }]"
          >
            <a-input v-model:value="formData.databaseName" style="width: 280px;"/>
          </a-form-item>
          <a-form-item
              label="字符集"
              name="char"
          >
            <a-input :disabled="true" value="utf8mb4" style="width: 280px;"/>
          </a-form-item>
          <a-form-item
              label="排序规则"
              name="sort"
          >
            <a-input :disabled="true" value="utf8mb4_general_ci" style="width: 280px;"/>
          </a-form-item>
        </a-form>
      </a-col>
    </div>


  </a-modal>
</template>

<script setup lang="ts">
import DatabaseOn from "@/assets/database-on.svg";
import Vite from "@/assets/vite.svg";
import {reactive, ref} from "vue";
import {createDatabase} from "@/Api";
import {useGlobalStore} from "@/store/globalStore";
import {message} from "ant-design-vue";
const props = defineProps({open: Boolean,ds:String});
const emit = defineEmits(['update:open','reloadDataSourceList']);
const form = ref()
const formData = reactive({
  databaseName:''
})
function submit() {
  form.value.validate().then(async v=>{
    const data = await createDatabase({databaseName:formData.databaseName,user:useGlobalStore().loginUser,ds:props.ds})
    if(data.code == 200){
      message.success("创建数据库成功")
    }
    form.value.resetFields()
    emit('update:open',false)
    emit('reloadDataSourceList',props.ds)
  }).catch(err=>{

  })

}

</script>

<style scoped>
.icon-form {
  display: flex;
  align-items: center;
}
</style>