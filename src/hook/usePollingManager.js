import { useRef, useCallback } from 'react'
import useRetryStrategy from './useRetryStrategy'

function usePollingManager(options) {
	const {
		pollingFetcher,
		getParams = (task) => null,
		key = 'id',
		interval = 500,
		doneCondition = () => true,
		retryLimit = 3,
		retryWaitMillionSeconds = 500
	} = options
	const manager = useRef({})
	const cbs = useRef([])
	const { retry } = useRetryStrategy({ 
		retryLimit,
		retryWaitMillionSeconds
	})

	const clearTask = useCallback((task) => {
		const fieldVal = task[key]
		if (manager.current[fieldVal]) {
			const timer = manager.current[fieldVal]
			clearInterval(timer)
			
			delete manager.current[fieldVal]
		}
	}, [])

	const notifySubscribers = useCallback((...args) => {
		if (cbs.current.length > 0) {
			for (let i = 0; i < cbs.current.length; i++) {
				cbs.current[i](...args)
			}
		}
	}, [])

	const startPolling = useCallback((task) => {
		let timer = null
		let res = {}
		
		const polling = async (task) => {
			const params = {
				...(getParams(task) || {}),
				progress: res.progress || 0, // mock params
			}
			try {
				res = await pollingFetcher(...params ? [params] : [])
			} catch(e) {
				let isEnd = true
				
				if (retryLimit) {
					isEnd = retry(task[key], () => {
						manager.current[task[key]] = startPolling(task)
					})
				}
				isEnd && notifySubscribers(task, null, true)

				clearTask(task)
				
				return
			}

			notifySubscribers(task, res, false)
			
			if (doneCondition(res)) {
				clearTask(task)
			}
		}
		
		timer = setInterval(() => polling(task), interval)
		
		polling(task)

		return timer
	}, [])

	const addTasks = useCallback((...tasks) => {
		const taskMap = {}

		for (let i = 0; i < tasks.length; i++) {
			const task = tasks[i]
			taskMap[task[key]] = startPolling(task)
		}

		manager.current = taskMap
	}, [])

	const notify = useCallback((cb) => {
		cbs.current.push(cb)
	}, [])

	const clear = useCallback(() => {
		for (const timer of Object.values(manager.current)) {
			clearInterval(timer)
		}

		manager.current = {}
	}, [])

	return {
		addTasks,
		notify,
		clear
	}
}

export default usePollingManager