import { useState } from 'react'
import VideoGameList from './components/VideoGameList'
import UserManagement from './components/UserManagement'
import { motion } from 'framer-motion'

function App() {
  const [section, setSection] = useState('games')

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen relative"
    >
      <main>
        <div className="container pt-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-sm uppercase tracking-[0.4em] text-text-dim">Operations Console</h2>
            <div className="flex gap-3">
              <button
                className={`btn ${section === 'games' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setSection('games')}
              >
                Video Games
              </button>
              <button
                className={`btn ${section === 'users' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setSection('users')}
              >
                Users
              </button>
            </div>
          </div>
        </div>

        {section === 'games' ? <VideoGameList /> : <UserManagement />}
      </main>

      <footer className="mt-20 py-12 border-t border-glass-border">
        <div className="container text-center">
          <p className="text-text-dim text-sm tracking-widest uppercase font-semibold">
            Built with <span className="text-primary">React</span> & <span className="text-accent">Ktor</span>
          </p>
          <div className="mt-4 flex justify-center gap-6 opacity-30 text-[10px] uppercase tracking-[0.3em]">
            <span>Secure Protocol</span>
            <span>Distributed Cache</span>
            <span>Edge Encryption</span>
          </div>
          <p className="mt-8 text-text-muted text-[10px]">
            © 2026 Game Vault Terminal. All rights reserved.
          </p>
        </div>
      </footer>
    </motion.div>
  )
}

export default App
