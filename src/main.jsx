import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import App from './App'
import './index.css'

(async () => {
  if (import.meta.env.DEV) {
    await import('../mock')
  } 
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )
  
})()
