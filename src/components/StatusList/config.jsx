import React from 'react'
import { Button, Progress } from 'antd'
import { itemStatusMap } from '../../api/constant'

export const getColumns = () => ([{
	title: '标题',
	key: 'title',
	dataIndex: 'title',
	width: 200,
	ellipsis: true,
}, {
	title: '内容',
	key: 'content',
	dataIndex: 'content',
	width: 500,
	ellipsis: true,
}, {
	title: '状态',
	key: 'status',
	dataIndex: 'status',
	render: (text, record, index) => {
		const statusTxt = itemStatusMap[text]
		let ActiveComponent = '--'

		switch(text) {
			case 'fail':
				ActiveComponent = (<Button disabled>失败了</Button>)
				break
			case 'success':
				ActiveComponent = (<Button type="primary">跳转</Button>)
				break
			case 'edit':
				ActiveComponent = <span>编辑中...</span>
				break
			case 'making':
				ActiveComponent = (
					<div style={{ width: 200 }}>
						<span>加载中...</span>
						<Progress percent={record.progress || 1} />
					</div>
			)
		}

		return (
			<div>
				{ActiveComponent}
				{
					['making', 'edit'].includes(text) ? '' : 
						<span style={{ color: '#999'}}>&nbsp;({statusTxt})</span>
				}
			</div>
		)
	}
}])