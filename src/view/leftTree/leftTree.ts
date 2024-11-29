import {getAllDataBases} from "@/Api";
import {useGlobalStore} from "@/store/globalStore";
import {useShowObjStore} from "@/store/showObjStore";
import {getAllQueryInDatabase} from "@/view/table/tableAboutApi";
import {generateUUID} from "@/ts/interfaces";

export const stepItems = [
    {
        title: '选择数据库类型',
        description:'',
    },
    {
        title: '设置连接属性',
        description:'',
    }]

export const DatasourceTypeListItems = [
    {
        title:'MySql',
        type:0,
    },{
        title:'Sqlite',
        type:1,
    }
]

export const reloadDatabase = async (datasourceName: string,datasourceType:number) => {
    let data: any = {}
    if (datasourceType === 1) {
        data.result = [{
            key: generateUUID(),
            title: 'main',
            type: 1,
            parentId: datasourceName,
            children: []
        }]
    }else {
        data = await getAllDataBases({user: useGlobalStore().loginUser, ds: datasourceName})
        if (data.code != 200) {
            return
        }
    }
    const dataObject = useShowObjStore().treeDataMap.get(datasourceName)
    data.result.forEach(item=>{
        const databaseItem = dataObject.childMap.get(item.title)
        if (databaseItem) {
            item.children = databaseItem.children
        }
    })
    dataObject.data.children = data.result

    let tempChildMap = new Map()
    data.result.forEach((item) => {
        tempChildMap.set(item.title, item)
    })
    dataObject.childMap = tempChildMap
}

export const reloadQuery = async (datasourceName: string,databaseName: string) => {
    const showObjStore = useShowObjStore()
    const data: any = await getAllQueryInDatabase({databaseName:databaseName,user: useGlobalStore().loginUser, ds: datasourceName})
    if (data.code == 200) {
        const queryTree = data.result.queryTree;
        const queryColumn = data.result.queryColumn;
        const datasourceMapItem = showObjStore.treeDataMap.get(datasourceName)
        if (datasourceMapItem && datasourceMapItem.childMap){
            const databaseItem = datasourceMapItem.childMap.get(databaseName)
            if (databaseItem && databaseItem.children){
                databaseItem.children.forEach(item=>{
                    //加载查询
                    if (item.type == 4){
                        item.children = []
                        item.children.push(...queryTree)
                        if(showObjStore.queryObjData.has(datasourceName)){
                            showObjStore.queryObjData.get(datasourceName).set(databaseName, queryColumn);
                        }else {
                            showObjStore.queryObjData.set(datasourceName,new Map())
                            showObjStore.queryObjData.get(datasourceName).set(databaseName, queryColumn)
                        }
                        //刷新
                        showObjStore.datasourceTreeData.push({})
                        showObjStore.datasourceTreeData.pop()
                        showObjStore.isTableObjDataChanged += 1;
                    }
                })
            }
        }
    }
}

export function getDatasourceObj(title: string) {
    const showObjStore = useShowObjStore()
    return showObjStore.treeDataMap.get(title)
}
export function getDatasourceTypeByName(title: string) {
    const showObjStore = useShowObjStore()
    return showObjStore.treeDataMap.get(title).data.datasourceType
}