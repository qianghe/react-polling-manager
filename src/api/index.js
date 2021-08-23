import { postRequest } from "./base"

export const fetchStatusList = (params) => postRequest('/pick/status/list', {
	params
})


export const fetchPollingStatus = (params) => postRequest('/pick/stauts/polling', {
	params
})