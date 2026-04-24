import React, { useEffect, useState } from 'react'
import InstructorLayout from '../../components/InstructorLayout'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'

function InstructorDashboard() {
  const { user } = useAuth()
  // console.log('Current user:', user)
  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
  fetchMyLectures()
}
  }, [user])

  const fetchMyLectures = async () => {
    try {
     const res = await API.get(`/lectures/instructor/${user.id}`)
      setLectures(res.data.lectures)
    } catch (error) {
      console.error('Error fetching lectures:', error)
    } finally {
      setLoading(false)
    }
  }

  // Separate upcoming and past lectures
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingLectures = lectures.filter(
    (l) => new Date(l.date) >= today
  )
  const pastLectures = lectures.filter(
    (l) => new Date(l.date) < today
  )

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return { bg: '#f0fff4', color: '#38a169' }
      case 'Intermediate': return { bg: '#fffaf0', color: '#dd6b20' }
      case 'Advanced': return { bg: '#fff5f5', color: '#e53e3e' }
      default: return { bg: '#f0f0f0', color: '#666' }
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const LectureCard = ({ lecture }) => {
    const levelStyle = getLevelColor(lecture.course?.level)
    const isPast = new Date(lecture.date) < today

    return (
      <div style={{
        ...styles.card,
        opacity: isPast ? 0.7 : 1,
        borderLeft: `4px solid ${isPast ? '#ccc' : '#667eea'}`
      }}>
        {/* Course Image */}
        <div style={styles.cardImage}>
          {lecture.course?.image ? (
            <img
              src={`http://localhost:5000${lecture.course.image}`}
              alt={lecture.course.name}
              style={styles.image}
            />
          ) : (
            <div style={styles.imagePlaceholder}>📚</div>
          )}
        </div>

        {/* Lecture Details */}
        <div style={styles.cardBody}>
          <div style={styles.cardTop}>
            <h3 style={styles.lectureTitle}>{lecture.title}</h3>
            <span style={{
              ...styles.levelBadge,
              background: levelStyle.bg,
              color: levelStyle.color
            }}>
              {lecture.course?.level}
            </span>
          </div>

          <p style={styles.courseName}>📚 {lecture.course?.name}</p>

          {lecture.description && (
            <p style={styles.description}>{lecture.description}</p>
          )}

          <div style={styles.dateRow}>
            <span style={{
              ...styles.dateBadge,
              background: isPast ? '#f0f0f0' : '#ebf4ff',
              color: isPast ? '#999' : '#3182ce'
            }}>
              📅 {formatDate(lecture.date)}
            </span>
            {isPast && (
              <span style={styles.completedBadge}>✅ Completed</span>
            )}
            {!isPast && (
              <span style={styles.upcomingBadge}>🔜 Upcoming</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (loading) return (
    <InstructorLayout>
      <div style={styles.loading}>Loading your lectures...</div>
    </InstructorLayout>
  )

  return (
    <InstructorLayout>
      {/* Welcome Header */}
      <div style={styles.welcomeCard}>
        <div>
          <h2 style={styles.welcomeTitle}>
            Welcome back, {user?.name}! 👋
          </h2>
          <p style={styles.welcomeSubtitle}>
            You have {upcomingLectures.length} upcoming lecture
            {upcomingLectures.length !== 1 ? 's' : ''} scheduled
          </p>
        </div>
        <div style={styles.statsRow}>
          <div style={styles.statItem}>
            <span style={styles.statNum}>{lectures.length}</span>
            <span style={styles.statLbl}>Total</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <span style={styles.statNum}>{upcomingLectures.length}</span>
            <span style={styles.statLbl}>Upcoming</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.statItem}>
            <span style={styles.statNum}>{pastLectures.length}</span>
            <span style={styles.statLbl}>Completed</span>
          </div>
        </div>
      </div>

      {/* No lectures at all */}
      {lectures.length === 0 && (
        <div style={styles.emptyState}>
          <p style={styles.emptyIcon}>📭</p>
          <h3 style={styles.emptyTitle}>No lectures assigned yet</h3>
          <p style={styles.emptySubtitle}>
            Your admin will assign lectures to you soon.
          </p>
        </div>
      )}

      {/* Upcoming Lectures */}
      {upcomingLectures.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🔜 Upcoming Lectures</h3>
          <div style={styles.lecturesList}>
            {upcomingLectures.map((lecture) => (
              <LectureCard key={lecture._id} lecture={lecture} />
            ))}
          </div>
        </div>
      )}

      {/* Past Lectures */}
      {pastLectures.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>✅ Completed Lectures</h3>
          <div style={styles.lecturesList}>
            {pastLectures.map((lecture) => (
              <LectureCard key={lecture._id} lecture={lecture} />
            ))}
          </div>
        </div>
      )}
    </InstructorLayout>
  )
}

const styles = {
  loading: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  welcomeCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    padding: '28px 32px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  welcomeTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '6px'
  },
  welcomeSubtitle: {
    opacity: 0.85,
    fontSize: '15px'
  },
  statsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    background: 'rgba(255,255,255,0.15)',
    padding: '16px 24px',
    borderRadius: '12px'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  statNum: {
    fontSize: '28px',
    fontWeight: '700'
  },
  statLbl: {
    fontSize: '12px',
    opacity: 0.8
  },
  statDivider: {
    width: '1px',
    height: '40px',
    background: 'rgba(255,255,255,0.3)'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: '8px'
  },
  emptySubtitle: {
    color: '#999',
    fontSize: '14px'
  },
  section: {
    marginBottom: '32px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: '16px'
  },
  lecturesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    display: 'flex',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s'
  },
  cardImage: {
    width: '120px',
    flexShrink: 0,
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
    fontSize: '32px'
  },
  cardBody: {
    padding: '20px',
    flex: 1
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
    gap: '12px'
  },
  lectureTitle: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#1a1a2e'
  },
  levelBadge: {
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  courseName: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '6px'
  },
  description: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '12px',
    lineHeight: '1.5'
  },
  dateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap'
  },
  dateBadge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500'
  },
  completedBadge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    background: '#f0fff4',
    color: '#38a169',
    fontWeight: '500'
  },
  upcomingBadge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    background: '#ebf8ff',
    color: '#3182ce',
    fontWeight: '500'
  }
}

export default InstructorDashboard