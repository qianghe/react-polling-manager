import axios from 'axios'

const instance = axios.create({
  baseURL: '',
  timeout: 1000
})

instance.interceptors.request.use(function(config) {
	return config
}, function(error) {
	return Promise.reject(error)
})
// 响应拦截器
instance.interceptors.response.use(function(response) {
	return response
}, function(error) {
	return Promise.reject(error)
})

const baseRequest = (method = 'get') => (url, {
	params,
	...restProps
}) => {
	const axiosMethodConfig = ['post', 'delete', 'put', 'patch'].includes(method) ? 
	(params ? [{
		...params
	}] : []).concat(restProps) : [{
		...params ? { params } : {},
		...restProps
	}]
	return new Promise((resolve, reject) => {
		return instance[method](url, ...axiosMethodConfig).then((response) => {
			const res = response.data
			if (res && res.code === 200) {
				resolve(res.data)
			} else {
				reject('has no data...')
			}
		}).catch(e => {
			reject(e)
		})
	})
}

export const postRequest = baseRequest('post')
export const getRequest = baseRequest('get')