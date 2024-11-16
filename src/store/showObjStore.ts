import { defineStore } from 'pinia';
import {markRaw} from "vue";
import ShowObject from "@/view/common/ShowObject.vue";

export const useShowObjStore = defineStore('showObj', {
    state: () => ({
        currentSelectedDatabase:'',
        currentSelectedDatasource:'',
        //对象tab需要的数据
        tableObjData: new Map(),
        queryObjData: new Map(),
        isTableObjDataChanged: 0,
        //2表 5查询
        currentObjType: 2,
        //树数据
        datasourceTreeData: [] as any[],
        treeDataMap: new Map(),
        panes:[{ title: '对象', key: 'ShowObjectKey',component:markRaw(ShowObject),closable:false }] as { title: string; key: string; component:any; closable?: boolean;
            props?:object;databaseName?:string;datasourceName?:string;id?:string;style?:object;
        }[],
        activeKey: 'ShowObjectKey',

    }),
    actions: {
    }
});