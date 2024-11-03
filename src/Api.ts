import httpUtils from "./utils/axios";

export enum Api {
    getAllTableList = '/getAllTableList',
    getAllDataSource = '/getAllDataSource',
    getAllDataBases = '/getAllDataBases',
    addDataSource = '/addDataSource',
    createDatabase = '/createDatabase',
    renameDataSource = '/renameDataSource',
    editDataSource = '/editDataSource',
    deleteDataSource = '/deleteDataSource',
    deleteDatabase = '/deleteDatabase',
    testDataSourceConnection = '/testDataSourceConnection',
    login = '/login',
    signUp = '/signUp',
    generate = '/generate',
}
export const getAllTableList = (params) => httpUtils.get( Api.getAllTableList,params);
export const getAllDataSource = (params) => httpUtils.get( Api.getAllDataSource,params);
export const getAllDataBases = (params) => httpUtils.get( Api.getAllDataBases,params);
export const testDataSourceConnection = (params) => httpUtils.get( Api.testDataSourceConnection,params);
export const addDataSource = (params) => httpUtils.post( Api.addDataSource,params);
export const createDatabase = (params) => httpUtils.post( Api.createDatabase,{},{params:params});
export const renameDataSource = (params) => httpUtils.post( Api.renameDataSource,params);
export const editDataSource = (params) => httpUtils.post( Api.editDataSource,params);
export const deleteDataSource = (params) => httpUtils.delete( Api.deleteDataSource,params);
export const deleteDatabase = (params) => httpUtils.delete( Api.deleteDatabase,params);
export const login = (params) => httpUtils.get( Api.login,params);
export const signUp = (params) => httpUtils.post( Api.signUp,params);
export const generate = (params) => httpUtils.download( Api.generate,params);

export enum TempRepApi{
    getTempFileList = '/getTempFileList',
    uploadTempFile = '/uploadTempFile',
    getFolderTree = '/getFolderTree',
    editFolderName = '/editFolderName',
    deleteFolder = '/deleteFolder'
}

export const getTempFileList = (params) => httpUtils.get( TempRepApi.getTempFileList,params);
export const getFolderTree = (params) => httpUtils.get( TempRepApi.getFolderTree,params);

export const uploadTempFile = (params) => httpUtils.post( TempRepApi.uploadTempFile,params);
export const editFolderName = (params) => httpUtils.post( TempRepApi.editFolderName,params);

export const deleteFolder = (params) => httpUtils.delete( TempRepApi.deleteFolder,params);