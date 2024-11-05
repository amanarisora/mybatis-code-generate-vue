import { defineStore } from 'pinia';

export const useShowObjStore = defineStore('showObj', {
    state: () => ({
        currentSelectedDatabase:'',
        currentSelectedDatasource:'',
        tableObjData: new Map(),
        isTableObjDataChanged: 0,
        treeDataMap: new Map(),
    }),
    actions: {
    }
});