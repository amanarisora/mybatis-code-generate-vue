import {ref} from "vue";

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

export function areCommonPropertiesEqual(obj1: any, obj2: any): boolean {
    // 获取两个对象的共有属性
    const commonKeys = Object.keys(obj1).filter(key => key in obj2);

    // 比较共有属性的值
    return commonKeys.every(key => obj1[key] === obj2[key]);
}

export function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}