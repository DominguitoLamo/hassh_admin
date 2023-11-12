import axios from 'axios'
import { message } from 'ant-design-vue'
import fileDownload from 'js-file-download'

const BASE_URL_DEV = 'http://localhost:5173/api/'
const BASE_URL_PROD = 'http://localhost:8880/api/'
const BASE_URL = BASE_URL_PROD

export const request = axios.create(
    {
        baseURL: BASE_URL,
        timeout: 10000,
    }
)

request.interceptors.request.use((config) => {
    config.headers['content-type'] = 'application/json'
    // message.success('request sent')
    return config
}, (err) => {
    message.error('request failed')
    return Promise.reject(err)
})

request.interceptors.response.use((response) => {
    if (response.headers['content-disposition'] && response.headers['content-disposition'].includes('attachment')) {
        console.log('disposition:', response.headers['content-disposition'] )
        const fileName = response.headers['content-disposition'].split(';')[1]
            .split('=')[1]
            .replaceAll('"','')
        fileDownload(response.data, fileName)
        message.success('download success')
        return response
    }

    if (response.headers['content-type'].includes('application/json')) {
        const jsonData = response.data
        // logic error
        if (jsonData.code && jsonData.code !== 200) {
            message.error(jsonData.msg)
        }

        return response.data
    }
    
    return response
}, (err) => {
    console.log(err)
    message.error('Network Error')
    return Promise.reject(err)
})
