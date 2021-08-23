import Mock from 'mockjs'
import { itemStatusMap } from '../src/api/constant'

const allStatus = Object.keys(itemStatusMap)

export default (req) => {
	const { pageSize = 10, pageNum = 1 } = JSON.parse(req.body)
	// await wait()
	const startId = 1000 + (pageNum - 1) * pageSize

	return {
		code: 200,
		data: Mock.mock({
			pages: 6,
			nums: 58,
			items: Array.from({ length: pageSize }).map((_, id) => {
				const item = {
					id: `${startId + id}`,
					title: Mock.mock('@title(2, 4)'),
					content: Mock.mock('@cparagraph(2)'),
					'status|1': allStatus
				}

				if (id % 10 === 1) item.status = 'making'

				return item
			}) 
		})
	}
}