## React-Polling-Manager

#### Why

Image you face the situation:

fetch an interface, the response includes items which have unready status, developer have to filter them and then polling to fetch the items's final status.

But, the question is that:

1. What if it's a pagination situation? After trigger an paging action, the developer have to release all the resources including timer or on the way fetching.

2. What if the developer have some actions, so they have to stop all the polling actions?

#### How

> BASE ON* *[*Observer pattern*]**(*https://en.wikipedia.org/wiki/Observer_pattern*)*

1. Create an Manager, it's task is to manage all the polling tasks;

2. if any polling task is done (satisfied `done` condition), notify the developer;

3. if any polling task is fail, retry polling until reach `retryLimit`, then nofity the developer;

4. if accept stop action, clear resources.



<img src="https://tva1.sinaimg.cn/large/008i3skNly1gtqkjxyudqj60ce0djwez02.jpg" alt="polling-manager-design" style="zoom:67%;" />



#### API

#### usePollingManager（options）

| 参数           | 说明                   | 类型                | 默认值     |
| -------------- | ---------------------- | ------------------- | ---------- |
| pollingFetcher | 轮训请求               | (params) => promise | null       |
| getParams      | 轮训请求参数           | object              | null       |
| key            | 轮训任务唯一标识       | string              | 'id'       |
| interval       | 轮训请求间隔           | number              | 500ms      |
| doneCondition  | 轮训任务完成回调       | function(res)       | () => true |
| tryLimit       | 轮训请求失败，重试次数 | number              | 3          |

##### usage

```javascript
const { addTask, notify, clearTask, clear } = usePollingManager({
  pollingFetcher: fetchPollingStatus,
  getParams: (task) => ({
    id: task.id
  }),
  doneCondition: (res) => res.progress === 100 || res.progress === -1,
})

// 添加需要轮训的任务
addTask(...tasks)

// 轮训结果通知
notify((task, res) => {
  const { id: taskId } = task
  // do sth
})
```

