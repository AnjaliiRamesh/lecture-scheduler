import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import API from '../../api/axios'

function Dashboard() {
  const [stats, setStats] = useState({
    courses: 0,
    instructors: 0,
    lectures: 0
  })
  const [recentLectures, setRecentLectures] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [coursesRes, instructorsRes, lecturesRes] = await Promise.all([
        API.get('/courses'),
        API.get('/users/instructors'),
        API.get('/lectures')
      ])

      setStats({
        courses: coursesRes.data.courses.length,
        instructors: instructorsRes.data.instructors.length,
        lectures: lecturesRes.data.lectures.length
      })

      // Show only 5 most recent lectures
      setRecentLectures(lecturesRes.data.lectures.slice(0, 5))

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <AdminLayout>
      <div style={styles.loading}>Loading dashboard...</div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderTop: '4px solid #667eea' }}>
          <div style={styles.statIcon}>📚</div>
          <div style={styles.statInfo}>
            <h3 style={styles.statNumber}>{stats.courses}</h3>
            <p style={styles.statLabel}>Total Courses</p>
          </div>
        </div>

        <div style={{ ...styles.statCard, borderTop: '4px solid #48bb78' }}>
          <div style={styles.statIcon}>👨‍🏫</div>
          <div style={styles.statInfo}>
            <h3 style={styles.statNumber}>{stats.instructors}</h3>
            <p style={styles.statLabel}>Total Instructors</p>
          </div>
        </div>

        <div style={{ ...styles.statCard, borderTop: '4px solid #ed8936' }}>
          <div style={styles.statIcon}>🗓️</div>
          <div style={styles.statInfo}>
            <h3 style={styles.statNumber}>{stats.lectures}</h3>
            <p style={styles.statLabel}>Total Lectures</p>
          </div>
        </div>
      </div>

      {/* Recent Lectures Table */}
      <div style={styles.tableCard}>
        <h3 style={styles.tableTitle}>📋 Recent Lectures</h3>
        {recentLectures.length === 0 ? (
          <p style={styles.empty}>No lectures scheduled yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Course</th>
                <th style={styles.th}>Instructor</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentLectures.map((lecture) => (
                <tr key={lecture._id} style={styles.tableRow}>
                  <td style={styles.td}>{lecture.title}</td>
                  <td style={styles.td}>{lecture.course?.name}</td>
                  <td style={styles.td}>{lecture.instructor?.name}</td>
                  <td style={styles.td}>
                    {new Date(lecture.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}

const styles = {
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '24px'
  },
  statCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  statIcon: {
    fontSize: '36px'
  },
  statInfo: {},
  statNumber: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a1a2e'
  },
  statLabel: {
    color: '#666',
    fontSize: '14px',
    marginTop: '4px'
  },
  tableCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  tableTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '16px'
  },
  empty: {
    color: '#999',
    textAlign: 'center',
    padding: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    background: '#f8f9fa'
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#666',
    borderBottom: '1px solid #eee'
  },
  tableRow: {
    borderBottom: '1px solid #f0f0f0'
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#333'
  }
}

export default Dashboard