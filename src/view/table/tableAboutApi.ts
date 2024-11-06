import httpUtils from "@/utils/axios";

export enum TableAboutApi{
    getTableColumnVueList = '/getTableColumnVueList',
    queryTableDateByPage = '/queryTableDateByPage',
    runQuerySql='/runQuerySql'

}

export const getTableColumnVueList = (params) => httpUtils.get( TableAboutApi.getTableColumnVueList,params);

export const queryTableDateByPage = (params) => httpUtils.get( TableAboutApi.queryTableDateByPage,params);
export const runQuerySql = (params) => httpUtils.get( TableAboutApi.runQuerySql,params);
