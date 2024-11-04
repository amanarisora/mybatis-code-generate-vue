import { defineStore } from 'pinia';

export const useShowObjStore = defineStore('showObj', {
    state: () => ({
        currentSelectedDatabase:'',
        tableObjData : new Map(),
        isTableObjDataChanged: 0,
    }),
    actions: {
    }
});