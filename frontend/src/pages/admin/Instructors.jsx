import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import API from '../../api/axios'

function Instructors() {
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    try {
      const res = await API.get('/users/instructors')
      setInstructors(res.data.instructors)
    } catch (error) {
      console.error('Error fetching instructors:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <AdminLayout>
      <div style={styles.loading}>Loading instructors...</div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>👨‍🏫 All Instructors</h2>
        <p style={styles.pageSubtitle}>
          {instructors.length} instructor{instructors.length !== 1 ? 's' : ''} registered
        </p>
      </div>

      {/* Instructors Grid */}
      {instructors.length === 0 ? (
        <div style={styles.empty}>No instructors found.</div>
      ) : (
        <div style={styles.grid}>
          {instructors.map((instructor) => (
            <div key={instructor._id} style={styles.card}>
              {/* Avatar */}
              <div style={styles.avatar}>
                {instructor.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div style={styles.info}>
                <h3 style={styles.name}>{instructor.name}</h3>
                <p style={styles.email}>✉️ {instructor.email}</p>
                <div style={styles.badge}>Instructor</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

const styles = {
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  pageHeader: {
    marginBottom: '24px'
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a2e'
  },
  pageSubtitle: {
    color: '#666',
    marginTop: '4px',
    fontSize: '14px'
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    background: 'white',
    borderRadius: '12px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s',
    cursor: 'default'
  },
  avatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
    fontWeight: '700',
    flexShrink: 0
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '4px'
  },
  email: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '8px'
  },
  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    background: '#ebf4ff',
    color: '#3182ce',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  }
}

export default Instructors