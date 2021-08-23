import Mock from 'mockjs'
import pickStatusList from './pickStatusList'
import pickStatusPolling from './pickStatusPolling'

Mock.mock('/pick/status/list', 'post', pickStatusList)
Mock.mock('/pick/stauts/polling', 'post', pickStatusPolling)