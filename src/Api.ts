import httpUtils from "./utils/axios";

export enum Api {
    getAllTableList = '/getAllTableList',
    getAllDataSource = '/getAllDataSource',
    getAllDataBases = '/getAllDataBases',
    getChildrenFolderAndFileList = '/tempFile/getChildrenFolderAndFileList',
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
export const getChildrenFolderAndFileList = (params) => httpUtils.get( Api.getChildrenFolderAndFileList,params);
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
    uploadTempFile = '/tempFile/uploadTempFile',
    renameTempFile = '/tempFile/renameTempFile',
    showTempFile = '/tempFile/showTempFile',
    editTempFileContent = '/tempFile/editTempFileContent',
    deleteTempFileBatch = '/tempFile/deleteTempFileBatch',
    pasteFolderAndTempFile = '/tempFile/pasteFolderAndTempFile',

    addFolder = '/folder/addFolder',
    reloadFolderTree = '/folder/reloadFolderTree',
    editFolderName = '/folder/editFolderName',
    deleteFolder = '/folder/deleteFolder',
    getAllFolderTree = '/folder/getAllFolderTree',

    listTempGroup = '/tempGroup/listTempGroup',
    getTempGroupSetting = '/tempGroup/getTempGroupSetting',
    addNewTempGroup = '/tempGroup/addNewTempGroup',
    updateTempGroup = '/tempGroup/updateTempGroup',
    renameTempGroup = '/tempGroup/renameTempGroup'
}

export const getAllFolderTree = (params) => httpUtils.get( TempRepApi.getAllFolderTree,params);
export const reloadFolderTree = (params) => httpUtils.get( TempRepApi.reloadFolderTree,params);
export const listTempGroup = (params) => httpUtils.get( TempRepApi.listTempGroup,params);
export const getTempGroupSetting = (params) => httpUtils.get( TempRepApi.getTempGroupSetting,params);
export const showTempFile = (params) => httpUtils.get( TempRepApi.showTempFile,params);

export const uploadTempFile = (params) => httpUtils.post( TempRepApi.uploadTempFile,params);
export const addFolder = (params) => httpUtils.post( TempRepApi.addFolder,params);
export const editFolderName = (params) => httpUtils.post( TempRepApi.editFolderName,params);
export const editTempFileContent = (params) => httpUtils.post( TempRepApi.editTempFileContent,params);
export const addNewTempGroup = (params) => httpUtils.post( TempRepApi.addNewTempGroup,params);
export const updateTempGroup = (params) => httpUtils.post( TempRepApi.updateTempGroup,params);
export const renameTempGroup = (params) => httpUtils.post( TempRepApi.renameTempGroup,params);
export const renameTempFile = (params) => httpUtils.post( TempRepApi.renameTempFile,params);
export const pasteFolderAndTempFile = (params) => httpUtils.post( TempRepApi.pasteFolderAndTempFile,params);


export const deleteFolder = (params) => httpUtils.delete( TempRepApi.deleteFolder,params);
export const deleteTempFileBatch = (params) => httpUtils.delete( TempRepApi.deleteTempFileBatch,params);

export const downloadTempFile = (params,config) => httpUtils.get( TempRepApi.showTempFile,params,config);