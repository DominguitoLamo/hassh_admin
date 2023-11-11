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
