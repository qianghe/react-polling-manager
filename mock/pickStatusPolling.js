import Mock from 'mockjs'

export default (req) => {
	const { progress = 0 } = JSON.parse(req.body)

	return Mock.mock({
		code: 200,
		data: {
			progress: Math.min(progress + Mock.mock('@natural(5, 20)'), 100)
		}
	})
}