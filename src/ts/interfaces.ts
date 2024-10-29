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