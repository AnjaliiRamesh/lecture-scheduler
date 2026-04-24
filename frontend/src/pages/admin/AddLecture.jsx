import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import API from '../../api/axios'

function AddLecture() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    course: '',
    instructor: '',
    date: '',
    title: '',
    description: ''
  })

  const [courses, setCourses] = useState([])
  const [instructors, setInstructors] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  // Fetch courses and instructors when page loads
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [coursesRes, instructorsRes] = await Promise.all([
        API.get('/courses'),
        API.get('/users/instructors')
      ])
      setCourses(coursesRes.data.courses)
      setInstructors(instructorsRes.data.instructors)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setDataLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await API.post('/lectures', formData)

      setSuccess('Lecture scheduled successfully! Redirecting...')
      setTimeout(() => navigate('/admin/dashboard'), 1500)

    } catch (err) {
      // Show clash error clearly
      setError(err.response?.data?.message || 'Failed to schedule lecture.')
    } finally {
      setLoading(false)
    }
  }

  if (dataLoading) return (
    <AdminLayout>
      <div style={styles.loading}>Loading form data...</div>
    </AdminLayout>
  )

  return (
    <AdminLayout>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>🗓️ Schedule a Lecture</h2>
        <p style={styles.pageSubtitle}>
          Assign a lecture to an instructor on a specific date
        </p>
      </div>

      <div style={styles.formCard}>
        {/* Success Message */}
        {success && <div style={styles.success}>{success}</div>}

        {/* Error Message — shows clash error here! */}
        {error && <div style={styles.error}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Lecture Title */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Lecture Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Introduction to Variables"
              style={styles.input}
              required
            />
          </div>

          {/* Course Selection */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Select Course *</label>
            <select
              name="course"
              value={formData.course}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Choose a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name} — {course.level}
                </option>
              ))}
            </select>
          </div>

          {/* Instructor Selection */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Select Instructor *</label>
            <select
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Choose an instructor</option>
              {instructors.map((instructor) => (
                <option key={instructor._id} value={instructor._id}>
                  {instructor.name} — {instructor.email}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Lecture Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {/* Description */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Description (optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What will be covered in this lecture?"
              style={styles.textarea}
              rows={3}
            />
          </div>

          {/* Info Box */}
          <div style={styles.infoBox}>
            ℹ️ If the selected instructor already has a lecture on the chosen
            date, the system will automatically block the assignment.
          </div>

          {/* Buttons */}
          <div style={styles.buttons}>
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={loading ? styles.submitBtnDisabled : styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Scheduling...' : '✅ Schedule Lecture'}
            </button>
          </div>
        </form>
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
  formCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '600px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
  },
  success: {
    background: '#f0fff4',
    color: '#38a169',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #c6f6d5'
  },
  error: {
    background: '#fff5f5',
    color: '#e53e3e',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #fed7d7',
    fontWeight: '500'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#444'
  },
  input: {
    padding: '11px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    background: 'white'
  },
  textarea: {
    padding: '11px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  infoBox: {
    background: '#ebf8ff',
    color: '#2b6cb0',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '13px',
    border: '1px solid #bee3f8'
  },
  buttons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px'
  },
  cancelBtn: {
    padding: '11px 24px',
    background: 'white',
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer'
  },
  submitBtn: {
    padding: '11px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  submitBtnDisabled: {
    padding: '11px 24px',
    background: '#ccc',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'not-allowed'
  }
}

export default AddLecture