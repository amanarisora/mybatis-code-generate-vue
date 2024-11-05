import { defineStore } from 'pinia';

export const useShowObjStore = defineStore('showObj', {
    state: () => ({
        currentSelectedDatabase:'',
        currentSelectedDatasource:'',
        //对象tab需要的数据
        tableObjData: new Map(),
        isTableObjDataChanged: 0,
        treeDataMap: new Map(),
    }),
    actions: {
    }
});