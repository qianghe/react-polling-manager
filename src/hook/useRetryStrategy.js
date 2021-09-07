import { useCallback, useRef } from 'react'

const getRetryWaitTimeByStrategy = (wait, count) => {
	return Math.pow(2, count) * wait
}

function useRetryStrategy({
  retryLimit = 3,
	retryWaitMillionSeconds = 500
}) {
  const retryCountRef = useRef({})
  
  function retry(key, cb) {
    const retryCount = retryCountRef.current[key] ?? 0
    let isEnd = false
    console.log('it is retrying....', key)
    
    // 结束retry
    if (retryCount === retryLimit) {
      console.log('retry end...')
      isEnd = true
      delete retryCountRef.current[key]
    } else {
      retryCountRef.current[key] = retryCount + 1
			
      const retryWaitTime = getRetryWaitTimeByStrategy(retryWaitMillionSeconds, retryCountRef.current[key])
      // TODO: timer的clear
      const timer = setTimeout(() => {
        if (cb) cb()
        
        clearTimeout(timer)
      }, retryWaitTime)
    }
	
    return isEnd
  }

  const getCurrentRetryCount = useCallback((key) => {
    return retryCountRef.current[key]
  }, [])

  return {
    retry,
    getCurrentRetryCount
  }
}

export default useRetryStrategy