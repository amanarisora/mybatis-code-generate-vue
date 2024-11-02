import {ref} from "vue";

export const columns = [
    {
        title: '序号',
        key: 'index',
        width: '5%'
    },
    {
        title: '表名',
        dataIndex: 'TABLE_NAME',
        key: 'TABLE_NAME',
        width: '30%'
    },
    {
        title: '备注',
        dataIndex: 'TABLE_COMMENT',
        key: 'TABLE_COMMENT',
        width: '30%'
    },
    {
        title: '创建时间',
        dataIndex: 'CREATE_TIME',
        key: 'CREATE_TIME',
        width: '30%'
    },
];

export interface FormState {
    id:string;
    name: string;
    url: string;
    username: string;
    password: string;
    user:string;
}
export interface TableData{
    key:string;
    TABLE_NAME: string;
    TABLE_COMMENT:string;
    CREATE_TIME:string;
}

export interface generateFormData{
    model:string;
    packageName:string;
    author:string;
    tablePrefix:string;
    needEntity:boolean;
    entityFilePathName:string;
    needMapper:boolean;
    mapperFilePathName:string;
    needController:boolean;
    controllerFilePathName:string;
    needService:boolean;
    serviceFilePathName:string;
    needServiceImpl:boolean;
    serviceImplFilePathName:string;
    needLombok:boolean;
    needChainModel:boolean;
    needRestController:boolean;
    needMapperAnno:boolean;
    needSwagger:boolean;
    needSpringDoc:boolean;
}
export function createRowSelection(selectedRowKeys: any,selectedRow?:any,columnWidth?:number) {
    return ref({
        checkStrictly: false,
        columnWidth: '2%',
        selectedRowKeys: selectedRowKeys,
        onChange: (keys,rows?) => {
            selectedRowKeys.value = keys;
            if (selectedRow) {
                selectedRow.value = rows;
            }
        }
    });
}

export function isNotBlank(str: string | null | undefined): boolean {
    return str !== null && str !== undefined && str.trim() !== '';
}

export const tabList = [
    {
        key: 'Controller',
        tab: 'Controller',
    },
    {
        key: 'Entity',
        tab: 'Entity',
    },
    {
        key: 'Mapper',
        tab: 'Mapper',
    },
    {
        key: 'Xml',
        tab: 'Xml',
    },
    {
        key: 'Service',
        tab: 'Service',
    },
    {
        key: 'ServiceImpl',
        tab: 'ServiceImpl',
    },
];

export const tabKeyToValueMap = new Map<string, number>([
    ['Controller', 1],
    ['Entity', 2],
    ['Mapper', 3],
    ['Xml', 4],
    ['Service', 5],
    ['ServiceImpl', 6],
]);