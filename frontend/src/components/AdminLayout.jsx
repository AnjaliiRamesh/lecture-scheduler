import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Navigation menu items
 const menuItems = [
  { path: '/admin/dashboard', label: '📊 Dashboard' },
  { path: '/admin/instructors', label: '👨‍🏫 Instructors' },
  { path: '/admin/courses', label: '📚 Courses' },
  { path: '/admin/add-course', label: '➕ Add Course' },
  { path: '/admin/add-lecture', label: '🗓️ Add Lecture' },
  { path: '/admin/all-lectures', label: '📋 All Lectures' },
]

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={{
        ...styles.sidebar,
        width: sidebarOpen ? '250px' : '0px',
        overflow: sidebarOpen ? 'visible' : 'hidden'
      }}>
        {/* Logo */}
        <div style={styles.logo}>
          <h2 style={styles.logoText}>📚 LectureApp</h2>
          <p style={styles.logoSub}>Admin Panel</p>
        </div>

        {/* Menu Items */}
        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <div
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                ...styles.menuItem,
                background: location.pathname === item.path
                  ? 'rgba(255,255,255,0.2)'
                  : 'transparent'
              }}
            >
              {item.label}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div style={styles.logoutSection}>
          <p style={styles.userName}>👤 {user?.name}</p>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={styles.menuToggle}
          >
            ☰
          </button>
          <h2 style={styles.headerTitle}>
            {menuItems.find(m => m.path === location.pathname)?.label || 'Admin Panel'}
          </h2>
        </div>

        {/* Page Content */}
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f0f2f5'
  },
  sidebar: {
    background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s ease',
    position: 'fixed',
    height: '100vh',
    zIndex: 100
  },
  logo: {
    padding: '24px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'white'
  },
  logoSub: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    marginTop: '4px'
  },
  nav: {
    flex: 1,
    padding: '16px 0'
  },
  menuItem: {
    padding: '14px 20px',
    cursor: 'pointer',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.85)',
    borderRadius: '8px',
    margin: '4px 8px',
    transition: 'background 0.2s'
  },
  logoutSection: {
    padding: '20px',
    borderTop: '1px solid rgba(255,255,255,0.1)'
  },
  userName: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '10px'
  },
  logoutBtn: {
    width: '100%',
    padding: '10px',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  main: {
    flex: 1,
    marginLeft: '250px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'margin 0.3s ease'
  },
  header: {
    background: 'white',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 99
  },
  menuToggle: {
    background: 'none',
    border: 'none',
    fontSize: '22px',
    cursor: 'pointer',
    color: '#444'
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a2e'
  },
  content: {
    padding: '24px',
    flex: 1
  }
}

export default AdminLayout