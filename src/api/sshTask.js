import { request } from "../request"

export async function getEchoMsg(msg) {
    return request.request({
        url: `v1/echo/${msg}`,
        method: 'get',
    })
}

export async function getSshTasks() {
    return request.request({
        url: `v1/sshtask`,
        method: 'get',
    })
}

export async function addSshTask(data) {
    return request.request({
        url: `v1/sshtask`,
        method: 'post',
        data
    })
}

export async function deleteSshTask(id) {
    return request.request({
        url: `v1/sshtask/${id}`,
        method: 'delete',
    })
}

export async function getSwitchBrand() {
    return request.request({
        url: `v1/switchBrand`,
        method: 'get',
    })
}