import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

interface Subject {
  id: string
  name: string
  code: string
  grade: string
  teacher: string
  description: string
}

const Subjects: React.FC = () => {
  const { user } = useAuth()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Mock subjects data
  const mockSubjects: Subject[] = [
    { id: '1', name: 'Mathematics', code: 'MATH101', grade: '10', teacher: 'Mr. Smith', description: 'Advanced mathematics including algebra and geometry' },
    { id: '2', name: 'English', code: 'ENG101', grade: '10', teacher: 'Ms. Johnson', description: 'English language and literature' },
    { id: '3', name: 'Physics', code: 'PHY101', grade: '10', teacher: 'Dr. Brown', description: 'Fundamental physics concepts' },
    { id: '4', name: 'Chemistry', code: 'CHEM101', grade: '10', teacher: 'Prof. Davis', description: 'Chemistry fundamentals and lab work' },
    { id: '5', name: 'Biology', code: 'BIO101', grade: '10', teacher: 'Mrs. Wilson', description: 'Biological sciences and lab work' },
    { id: '6', name: 'History', code: 'HIST101', grade: '10', teacher: 'Mr. Taylor', description: 'World history and civilizations' },
  ]

  useEffect(() => {
    setSubjects(mockSubjects)
  }, [])

  const canEdit = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'principal'

  const handleAddSubject = () => {
    setSelectedSubject(null)
    setIsEditing(false)
    setShowModal(true)
  }

  const handleEditSubject = (subject: Subject) => {
    setSelectedSubject(subject)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleDeleteSubject = (id: string) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      setSubjects(subjects.filter(subject => subject.id !== id))
    }
  }

  const handleSaveSubject = (subjectData: Omit<Subject, 'id'>) => {
    if (isEditing && selectedSubject) {
      setSubjects(subjects.map(subject =>
        subject.id === selectedSubject.id
          ? { ...subjectData, id: selectedSubject.id }
          : subject
      ))
    } else {
      const newSubject = {
        ...subjectData,
        id: Date.now().toString()
      }
      setSubjects([...subjects, newSubject])
    }
    setShowModal(false)
    setSelectedSubject(null)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-gray-100">Subjects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {canEdit ? 'Manage curriculum and subjects' : 'View available subjects'}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={handleAddSubject}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Subject
          </button>
        )}
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => canEdit && handleEditSubject(subject)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{subject.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{subject.code}</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded-full">
                Grade {subject.grade}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{subject.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {subject.teacher.charAt(0)}
                  </span>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{subject.teacher}</span>
              </div>
              {canEdit && (
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditSubject(subject)
                    }}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteSubject(subject.id)
                    }}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {isEditing ? 'Edit Subject' : 'Add Subject'}
            </h2>
            <SubjectForm
              subject={selectedSubject}
              onSave={handleSaveSubject}
              onCancel={() => {
                setShowModal(false)
                setSelectedSubject(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

const SubjectForm: React.FC<{
  subject: Subject | null
  onSave: (subject: Omit<Subject, 'id'>) => void
  onCancel: () => void
}> = ({ subject, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Subject, 'id'>>({
    name: subject?.name || '',
    code: subject?.code || '',
    grade: subject?.grade || '10',
    teacher: subject?.teacher || '',
    description: subject?.description || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof Omit<Subject, 'id'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subject Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subject Code
        </label>
        <input
          type="text"
          value={formData.code}
          onChange={(e) => handleChange('code', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Grade
        </label>
        <select
          value={formData.grade}
          onChange={(e) => handleChange('grade', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        >
          <option value="10">Grade 10</option>
          <option value="11">Grade 11</option>
          <option value="12">Grade 12</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Teacher
        </label>
        <input
          type="text"
          value={formData.teacher}
          onChange={(e) => handleChange('teacher', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          {subject ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  )
}

export default Subjects
