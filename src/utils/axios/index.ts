import axios, {AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios'
import { message } from 'ant-design-vue'
// 数据返回的接口
// 定义请求响应参数，不含data
interface Result {
    code: number;
    msg: string
}

// 请求响应参数，包含data
interface ResultData<T = any> extends Result {
    data?: T;
}
const URL: string = import.meta.env.VITE_URL
enum RequestEnums {
    TIMEOUT = 20000,
    OVERDUE = 600, // 登录失效
    FAIL = 999, // 请求失败
    SUCCESS = 200, // 请求成功
}
const config = {
    // 默认地址
    baseURL: URL as string,
    // 设置超时时间
    timeout: RequestEnums.TIMEOUT as number,
    // 跨域时候允许携带凭证
    withCredentials: true
}

class RequestHttp {
    // 定义成员变量并指定类型
    service: AxiosInstance;
    public constructor(config: AxiosRequestConfig) {
        // 实例化axios
        this.service = axios.create(config);

        /**
         * 响应拦截器
         * 服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
         */
        this.service.interceptors.response.use(
            (response: AxiosResponse) => {
                const {data} = response; // 解构
                if (data.code === RequestEnums.OVERDUE) {
                    // 登录信息失效，应跳转到登录页面，并清空本地的token
                    localStorage.setItem('token', '');
                    // router.replace({
                    //   path: '/login'
                    // })
                    return Promise.reject(data);
                }
                // 全局错误信息拦截（防止下载文件得时候返回数据流，没有code，直接报错）
                if (data.code && data.code !== RequestEnums.SUCCESS) {
                    message.error(data.message)
                    return Promise.reject(data)
                }
                // 检查配置决定返回 data 还是完整 response
                if (response.config.headers['X-Return-Full-Response']) {
                    return response;
                }
                return data;
            },
            (error: AxiosError) => {
                const {response} = error;
                if (response) {
                    if (response.data?.message){
                        message.error(response.data?.message);
                    }
                    // this.handleCode(response.status)
                }
                if (!window.navigator.onLine) {
                    message.error('网络连接失败');
                    // 可以跳转到错误页面，也可以不做操作
                    // return router.replace({
                    //   path: '/404'
                    // });
                }
            }
        )
    }
    handleCode(code: number):void {
        switch(code) {
            case 401:
                message.error('登录失败，请重新登录');
                break;
            default:
                message.error('请求失败');
                break;
        }
    }

    // 常用方法封装
    get<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.get(url, {params});
    }
    post<T>(url: string, params?: object,config?: AxiosRequestConfig): Promise<ResultData<T>> {
        return this.service.post(url, params,config);
    }
    put<T>(url: string, params?: object,config?: AxiosRequestConfig): Promise<ResultData<T>> {
        return this.service.put(url, params,config);
    }
    delete<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.delete(url, {params});
    }
    download<T>(url: string, params?: object): Promise<ResultData<T>> {
        return this.service.post(url, params,{ responseType: 'arraybuffer' ,headers: { 'X-Return-Full-Response': true }});
    }
}
const httpUtils =  new RequestHttp(config)
// 导出一个实例对象
export default httpUtils;