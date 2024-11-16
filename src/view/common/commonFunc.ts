import {generateUUID} from "@/ts/interfaces";
import {markRaw} from "vue";
import Query from "@/view/table/Query.vue";
import {useShowObjStore} from "@/store/showObjStore";
import TableData from "@/view/table/TableData.vue";
import codeGenerate from "@/view/codeGenerate/codeGenerate.vue";

export function openQuery(datasourceName: string, databaseName: string, queryName: string, queryText: string) {
    const showObjStore = useShowObjStore()
    let key = generateUUID()
    const title = `${queryName} @${databaseName}(${datasourceName}) - 查询`
    if (!showObjStore.panes.some(obj => obj.title === title)) {
        showObjStore.panes.push({
            title: `${queryName} @${databaseName}(${datasourceName}) - 查询`, key: key, component: markRaw(Query),
            databaseName: databaseName, datasourceName: datasourceName,
            props: {
                datasourceName: datasourceName,
                databaseName: databaseName,
                isNewQuery: false,
                queryName: queryName,
                queryText: queryText,
                id: key
            },
            style: {height: '100%'}
        })
    }
    showObjStore.panes.forEach(item => {
        if (item.title === title) {
            key = item.key
        }
    })
    showObjStore.activeKey = key
}

export function openTableData(datasourceName: string, databaseName: string, tableName: string) {
    const showObjStore = useShowObjStore()
    const key = tableName + ' - ' + databaseName
    if (!showObjStore.panes.some(obj => obj.key === key)) {
        showObjStore.panes.push({
            title: key,
            key: key,
            component: markRaw(TableData),
            databaseName: databaseName,
            datasourceName: datasourceName,
            props: {datasourceName: datasourceName, databaseName: databaseName, tableName: tableName}
        })
    }
    showObjStore.activeKey = key
}

export function openGenerate() {
    const showObjStore = useShowObjStore()
    let key = generateUUID()
    const title = '代码生成'
    if (!showObjStore.panes.some(obj => obj.title === title)) {
        showObjStore.panes.push({
            title: title,
            key: key,
            component: markRaw(codeGenerate),
            style: {height: 'calc(100% - 20px)'}
        })
    }
    showObjStore.panes.forEach(item => {
        if (item.title === title) {
            key = item.key
        }
    })
    showObjStore.activeKey = key
}