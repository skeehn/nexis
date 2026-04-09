import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import ConverterApp from './pages/App'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<ConverterApp />} />
    </Routes>
  )
}

export default App
