import { useState } from 'react'
import Sidebar from './components/Sidebar'
import HelloWorld1 from './components/HelloWorld1'
import HelloWorld2 from './components/HelloWorld2'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('page1')

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'page1':
        return <HelloWorld1 />
      case 'page2':
        return <HelloWorld2 />
      default:
        return <HelloWorld1 />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
      />
      <main className="flex-1 overflow-auto">
        {renderCurrentPage()}
      </main>
    </div>
  )
}

export default App

