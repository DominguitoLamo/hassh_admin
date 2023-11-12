import { request } from "../request"

export async function addGroup(data) {
    return request.request({
        url: `v1/groupInfo`,
        method: 'post',
        data
    })
}

export async function getGroupName() {
    return request.request({
        url: `v1/groupNames`,
        method: 'get',
    })
}

export async function addGroupTask(data) {
    return request.request({
        url: `v1/groupTask`,
        method: 'post',
        data
    })
}

export async function getGroupInfos() {
    return request.request({
        url: `v1/groupInfo`,
        method: 'get',
    })
}

export async function deleteGroupInfo(id) {
    return request.request({
        url: `v1/groupInfo/${id}`,
        method: 'delete',
    })
}

export async function runGroupTask(id) {
    return request.request({
        url: `v1/runGroupTasks/${id}`,
        method: 'get',
    })
}

export async function isGroupExist(hashKey) {
    return request.request({
        url: `v1/groupFileExist/${hashKey}`,
        method: 'get',
    })
}

export async function downloadGroupFile(hashKey) {
    return request.request({
        url: `v1/downloadGroupFile/${hashKey}`,
        method: 'get',
        responseType: 'blob'
    })
}
