import { useRef, useCallback } from "react"

function usePollingManager(options) {
	const {
		pollingFetcher,
		getParams = (task) => null,
		key = 'id',
		interval = 500,
		doneCondition = () => true,
		tryLimit = 3,
	} = options
	const manager = useRef({})
	const cbs = useRef([])
	
	const clearTask = useCallback((task) => {
		const fieldKey = task[key]
		if (manager.current[fieldKey]) {
			const timer = manager.current[fieldKey]
			clearInterval(timer)
			
			delete manager.current[fieldKey]
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
			
			res = await pollingFetcher(...params ? [params] : [])
			
			if (cbs.current.length > 0) {
				for (let i = 0; i < cbs.current.length; i++) {
					cbs.current[i](task, res)
				}
			}
			if (doneCondition(res)) {
				clearTask(task)
			}
		}
		
		timer = setInterval(() => polling(task), interval)
		
		polling(task)

		return timer
	}, [])
	
	const addTask = useCallback((...tasks) => {
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
		addTask,
		notify,
		clear
	}
}

export default usePollingManager