import axios from 'axios'
import { message } from 'ant-design-vue'

const BASE_URL_DEV = 'http://localhost:5173/api/'
const BASE_URL = BASE_URL_DEV

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
    if (response.headers['content-type'].includes('application/json')) {
        const jsonData = response.data
        // logic error
        if (jsonData.code && jsonData.code !== 200) {
            message.error(jsonData.msg)
        }

        if (Array.isArray(response.data)) {
            return {
                data: response.data,
                code: 200
            }
        }
    }
    return response.data
}, (err) => {
    console.log(err)
    message.error('Network Error')
    return Promise.reject(err)
})
