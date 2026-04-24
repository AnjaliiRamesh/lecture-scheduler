import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import API from '../../api/axios'

function AllLectures() {
  const [lectures, setLectures] = useState([])
  const [filteredLectures, setFilteredLectures] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterInstructor, setFilterInstructor] = useState('')
  const [instructors, setInstructors] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  // Filter lectures whenever search or filter changes
  useEffect(() => {
    let result = lectures

    // Filter by instructor
    if (filterInstructor) {
      result = result.filter(
        l => l.instructor?._id === filterInstructor
      )
    }

    // Filter by search (title or course name)
    if (search) {
      result = result.filter(
        l =>
          l.title.toLowerCase().includes(search.toLowerCase()) ||
          l.course?.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFilteredLectures(result)
  }, [search, filterInstructor, lectures])

  const fetchData = async () => {
    try {
      const [lecturesRes, instructorsRes] = await Promise.all([
        API.get('/lectures'),
        API.get('/users/instructors')
      ])
      setLectures(lecturesRes.data.lectures)
      setFilteredLectures(lecturesRes.data.lectures)
      setInstructors(instructorsRes.data.instructors)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (loading) return (
    <AdminLayout>
      <div style={styles.loading}>Loading lectures...</div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      {/* Page Header */}
      <div style={styles.pageHeader}>
        <div>
          <h2 style={styles.pageTitle}>🗓️ All Lectures</h2>
          <p style={styles.pageSubtitle}>
            {filteredLectures.length} of {lectures.length} lectures shown
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/add-lecture')}
          style={styles.addBtn}
        >
          ➕ Schedule Lecture
        </button>
      </div>

      {/* Filters Row */}
      <div style={styles.filtersRow}>
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search by title or course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        {/* Instructor Filter */}
        <select
          value={filterInstructor}
          onChange={(e) => setFilterInstructor(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="">All Instructors</option>
          {instructors.map(i => (
            <option key={i._id} value={i._id}>{i.name}</option>
          ))}
        </select>

        {/* Clear Filters */}
        {(search || filterInstructor) && (
          <button
            onClick={() => { setSearch(''); setFilterInstructor('') }}
            style={styles.clearBtn}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Lectures Table */}
      <div style={styles.tableCard}>
        {filteredLectures.length === 0 ? (
          <div style={styles.empty}>
            No lectures found matching your filters.
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Course</th>
                <th style={styles.th}>Instructor</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLectures.map((lecture, index) => {
                const isPast = new Date(lecture.date) < today
                return (
                  <tr key={lecture._id} style={styles.tableRow}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>
                      <span style={styles.lectureTitle}>{lecture.title}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.courseName}>
                        {lecture.course?.name}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.instructorCell}>
                        <div style={styles.avatar}>
                          {lecture.instructor?.name.charAt(0).toUpperCase()}
                        </div>
                        {lecture.instructor?.name}
                      </div>
                    </td>
                    <td style={styles.td}>{formatDate(lecture.date)}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        background: isPast ? '#f0fff4' : '#ebf8ff',
                        color: isPast ? '#38a169' : '#3182ce'
                      }}>
                        {isPast ? '✅ Completed' : '🔜 Upcoming'}
                      </span>
                    </td>
                  </tr>
                )
              })}
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
  addBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  filtersRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none'
  },
  filterSelect: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    background: 'white',
    minWidth: '160px'
  },
  clearBtn: {
    padding: '10px 16px',
    background: '#fff5f5',
    color: '#e53e3e',
    border: '1px solid #fed7d7',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  tableCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    overflowX: 'auto'
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#999'
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
    borderBottom: '1px solid #eee',
    whiteSpace: 'nowrap'
  },
  tableRow: {
    borderBottom: '1px solid #f0f0f0'
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#333'
  },
  lectureTitle: {
    fontWeight: '600',
    color: '#1a1a2e'
  },
  courseName: {
    color: '#555'
  },
  instructorCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    flexShrink: 0
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  }
}

export default AllLectures