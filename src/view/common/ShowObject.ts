export const TableObjectColumn = [
    {
        key: 'cs121sn801n',
        title: '序号',
        width: 60,
        fixed: "left",
        resizable: true,
    },
    {
        dataIndex: 'tableName',
        key: 'tableName',
        title: '名',
        width: 300,
        resizable: true,
    },
    {
        dataIndex: 'tableComment',
        key: 'tableComment',
        title: '注释',
        width: 300,
        resizable: true,
    },
    {
        dataIndex: 'dataLength',
        key: 'dataLength',
        title: '数据长度',
        customRender: ({text, record, index}) => `${text + 'KB'}`,
        width: 100,
        resizable: true,
    },
    {
        dataIndex: 'engine',
        key: 'engine',
        title: '引擎',
        width: 80,
        resizable: true,
    },
    {
        dataIndex: 'tableRows',
        key: 'tableRows',
        title: '行数',
        width: 60,
        resizable: true,
    },
    {
        dataIndex: 'createTime',
        key: 'createTime',
        title: '创建时间',
        width: 180,
        resizable: true,
    },
    {
        dataIndex: 'editTime',
        key: 'editTime',
        title: '修改日期',
    },

]

export const QueryObjectColumns = [
    {
        key: 'cs121sn801n',
        title: '序号',
        width: 60,
        fixed: "left",
        resizable: true,
    },
    {
        dataIndex: 'queryName',
        key: 'queryName',
        title: '名称',
    }
]