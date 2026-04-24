import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function InstructorLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.logo}>📚 LectureApp</h1>
          <span style={styles.panel}>Instructor Panel</span>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.avatar}>
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div style={styles.userInfo}>
            <p style={styles.userName}>{user?.name}</p>
            <p style={styles.userRole}>Instructor</p>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {children}
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f0f2f5'
  },
  header: {
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  logo: {
    color: 'white',
    fontSize: '22px',
    fontWeight: '700'
  },
  panel: {
    background: 'rgba(255,255,255,0.15)',
    color: 'rgba(255,255,255,0.8)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: '700'
  },
  userInfo: {
    textAlign: 'right'
  },
  userName: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '600'
  },
  userRole: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '12px'
  },
  logoutBtn: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px'
  },
  content: {
    padding: '32px',
    maxWidth: '1000px',
    margin: '0 auto'
  }
}

export default InstructorLayout