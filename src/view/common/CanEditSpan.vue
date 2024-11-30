<template>
  <div>
    <span v-if="!props.isEditing" :class="props.spanClass"
          :style="props.spanStyle">{{ props.text }}</span>
    <a-input ref="editInput" v-else-if="!isTextArea" type="text" v-model:value="editTitle" @blur="submit"
             @keyup.enter="submit"/>
    <a-textarea ref="editInput" v-else type="text" v-model:value="editTitle" @blur="submit"
                @keyup.enter="submit"/>
  </div>
</template>

<script setup lang="ts">
import {nextTick, ref, watch} from "vue";
const props = defineProps({
  isEditing:{
    type:Boolean,
    required:true
  },
  text:{
    required:true
  },
  submit:{
    type:Function,
    required:true
  },
  spanStyle:{
    type: Object
  },
  spanClass: {
    type: String,
    default: ''
  },
  isTextArea:{
    type: Boolean,
  }
})
const editTitle:any = ref('')
const editInput = ref()

watch(()=>props.isEditing, async (value) => {
  if (value){
    editTitle.value = props.text;
    await nextTick(() => {
      if (editInput.value) {
        editInput.value.focus();
      }
    });
  }
})

function submit(){
  props.submit(editTitle.value)
}

</script>

<style scoped>

</style>