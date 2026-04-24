import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/AdminLayout'
import API from '../../api/axios'

function AddCourse() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    level: '',
    description: ''
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      // Create a preview URL so user can see selected image
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Use FormData because we're sending an image file
      const data = new FormData()
      data.append('name', formData.name)
      data.append('level', formData.level)
      data.append('description', formData.description)
      if (image) data.append('image', image)

      await API.post('/courses', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      setSuccess('Course created successfully! Redirecting...')

      // Redirect to courses page after 1.5 seconds
      setTimeout(() => navigate('/admin/courses'), 1500)

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>➕ Add New Course</h2>
        <p style={styles.pageSubtitle}>Fill in the details to create a new course</p>
      </div>

      <div style={styles.formCard}>
        {/* Success Message */}
        {success && <div style={styles.success}>{success}</div>}

        {/* Error Message */}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Course Name */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Course Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. JavaScript Basics"
              style={styles.input}
              required
            />
          </div>

          {/* Level */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Level *</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Select a level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Description */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what this course covers..."
              style={styles.textarea}
              rows={4}
              required
            />
          </div>

          {/* Image Upload */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Course Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={styles.fileInput}
            />
            {/* Image Preview */}
            {imagePreview && (
              <div style={styles.previewContainer}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={styles.preview}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={styles.buttons}>
            <button
              type="button"
              onClick={() => navigate('/admin/courses')}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={loading ? styles.submitBtnDisabled : styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Creating...' : '✅ Create Course'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

const styles = {
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
    border: '1px solid #fed7d7'
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
  fileInput: {
    padding: '8px 0',
    fontSize: '14px'
  },
  previewContainer: {
    marginTop: '10px'
  },
  preview: {
    width: '100%',
    maxHeight: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    border: '1px solid #ddd'
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

export default AddCourse