import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { Table } from 'antd'
import usePollingManager from '../../hook/usePollingManager'
import { getColumns } from './config'
import { fetchStatusList, fetchPollingStatus } from '../../api/index'
import { wait } from '../../utils/async'
import './index.scss'

function StatusList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const pageInfo = useRef({
    showSizeChanger: false,
    pageSize: 10,
    total: 0
  })
  const { addTask, notify, clear } = usePollingManager({
    pollingFetcher: fetchPollingStatus,
		getParams: (task) => ({
      id: task.id
    }),
		doneCondition: (res) => res.progress === 100 || res.progress === -1,
  })
  const columns = useMemo(() => getColumns(), [])

  const getData = useCallback(async (pInfo = {
    pageSize: 10,
    pageNum: 1
  }) => {
    const init = (res) => {
      const { nums } = res
      const pageItems = res.items

      setItems(pageItems)
      pageInfo.current.total = nums

      const makingItems = pageItems.filter(({ status }) => status === 'making')
      
      if (makingItems.length > 0) {
        addTask(...makingItems)
        notify((task, res) => {
          const { id: taskId } = task
          const pageTaskItem = pageItems.find(({ id }) => id === taskId)
          if (pageTaskItem) {
            pageTaskItem.progress = res.progress || 1
            setItems([...pageItems])
          }
        })
      }
    }
    setLoading(true)
      
    await wait()
    
    const res = await fetchStatusList(pInfo)
    
    init(res)
    
    setLoading(false)
  }, [])

  useEffect(() => {
    // fetch list items
    getData()
  }, []) 

  function handlePageChange(page, pageSize) {
    clear()
    getData({
      pageSize,
      pageNum: page
    })
  }
  
  return (
    <Table
      className="statusList"
      dataSource={items || []}
      rowKey="id"
      columns={columns}
      loading={loading}
      pagination={{
        ...pageInfo.current,
        onChange: handlePageChange
      }}
    />
  );
}

export default StatusList
