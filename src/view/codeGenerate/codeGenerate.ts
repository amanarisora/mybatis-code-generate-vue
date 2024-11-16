import {ref} from "vue";

export const columns = ref([
    {
        key: 'cs121sn801n',
        title: '序号',
        width: 60,
        fixed: "left",
        ellipsis: true,
        resizable: true,
    },
    {
        dataIndex: 'tableName',
        key: 'tableName',
        title: '名',
        width: 300,
        ellipsis: true,
        resizable: true,
    },
    {
        dataIndex: 'tableComment',
        key: 'tableComment',
        title: '注释',
        width: 300,
        ellipsis: true,
        resizable: true,
    },
    {
        dataIndex: 'createTime',
        key: 'createTime',
        title: '创建时间',
        width: 180,
        ellipsis: true,
        resizable: true,
    },
    {
        dataIndex: 'editTime',
        key: 'editTime',
        ellipsis: true,
        title: '修改日期',
    },
])

export interface historyObj {
    id:string,
    type:number,
    parentId:string|null
}