import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout'
import API from '../../api/axios'

function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await API.get('/courses')
      setCourses(res.data.courses)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return { bg: '#f0fff4', color: '#38a169' }
      case 'Intermediate': return { bg: '#fffaf0', color: '#dd6b20' }
      case 'Advanced': return { bg: '#fff5f5', color: '#e53e3e' }
      default: return { bg: '#f0f0f0', color: '#666' }
    }
  }

  if (loading) return (
    <AdminLayout>
      <div style={styles.loading}>Loading courses...</div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div>
          <h2 style={styles.pageTitle}>📚 All Courses</h2>
          <p style={styles.pageSubtitle}>
            {courses.length} course{courses.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div style={styles.empty}>No courses found. Add your first course!</div>
      ) : (
        <div style={styles.grid}>
          {courses.map((course) => {
            const levelStyle = getLevelColor(course.level)
            return (
              <div key={course._id} style={styles.card}>
                {/* Course Image */}
                <div style={styles.imageContainer}>
                  {course.image ? (
                    <img
                      src={`https://lecture-scheduler-backend-ryfk.onrender.com${course.image}`}
                      alt={course.name}
                      style={styles.image}
                    />
                  ) : (
                    <div style={styles.imagePlaceholder}>📚</div>
                  )}
                </div>

                {/* Course Info */}
                <div style={styles.cardBody}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.courseName}>{course.name}</h3>
                    <span style={{
                      ...styles.levelBadge,
                      background: levelStyle.bg,
                      color: levelStyle.color
                    }}>
                      {course.level}
                    </span>
                  </div>
                  <p style={styles.description}>{course.description}</p>
                  <p style={styles.createdBy}>
                    Created by: {course.createdBy?.name || 'Admin'}
                  </p>
                </div>
              </div>
            )
          })}
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  imageContainer: {
    height: '160px',
    overflow: 'hidden',
    background: '#f0f2f5'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px'
  },
  cardBody: {
    padding: '20px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px',
    gap: '8px'
  },
  courseName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a2e',
    flex: 1
  },
  levelBadge: {
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  description: {
    fontSize: '13px',
    color: '#666',
    lineHeight: '1.5',
    marginBottom: '12px'
  },
  createdBy: {
    fontSize: '12px',
    color: '#999'
  }
}

export default Courses