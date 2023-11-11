import { request } from "../request"

export async function getEchoMsg(msg) {
    return request.request({
        url: `v1/echo/${msg}`,
        method: 'get',
    })
}