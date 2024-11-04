import httpUtils from "@/utils/axios";

export enum TableAboutApi{
    getTableColumnVueList = '/getTableColumnVueList',
    queryTableDateByPage = '/queryTableDateByPage',
    test='/test'

}

export const getTableColumnVueList = (params) => httpUtils.get( TableAboutApi.getTableColumnVueList,params);

export const queryTableDateByPage = (params) => httpUtils.get( TableAboutApi.queryTableDateByPage,params);
export const test = (params) => httpUtils.get( TableAboutApi.test,params);
