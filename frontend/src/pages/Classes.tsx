import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

interface Class {
  id: string
  name: string
  grade: string
  section: string
  room: string
  capacity: number
  currentStudents: number
  teacher: string
  subjects: string[]
}

const Classes: React.FC = () => {
  const { user } = useAuth()
  const [classes, setClasses] = useState<Class[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Mock classes data
  const mockClasses: Class[] = [
    { id: '1', name: 'Class 10-A', grade: '10', section: 'A', room: '101', capacity: 40, currentStudents: 35, teacher: 'Mr. Smith', subjects: ['Mathematics', 'Physics', 'Chemistry'] },
    { id: '2', name: 'Class 10-B', grade: '10', section: 'B', room: '102', capacity: 40, currentStudents: 38, teacher: 'Ms. Johnson', subjects: ['English', 'History', 'Biology'] },
    { id: '3', name: 'Class 11-A', grade: '11', section: 'A', room: '201', capacity: 35, currentStudents: 30, teacher: 'Dr. Brown', subjects: ['Physics', 'Chemistry', 'Mathematics'] },
    { id: '4', name: 'Class 11-B', grade: '11', section: 'B', room: '202', capacity: 35, currentStudents: 32, teacher: 'Prof. Davis', subjects: ['Biology', 'English', 'Chemistry'] },
    { id: '5', name: 'Class 12-A', grade: '12', section: 'A', room: '301', capacity: 30, currentStudents: 28, teacher: 'Mrs. Wilson', subjects: ['Mathematics', 'Physics', 'Chemistry'] },
    { id: '6', name: 'Class 12-B', grade: '12', section: 'B', room: '302', capacity: 30, currentStudents: 29, teacher: 'Mr. Taylor', subjects: ['English', 'History', 'Biology'] },
  ]

  useEffect(() => {
    setClasses(mockClasses)
  }, [])

  const canEdit = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'principal'

  const handleAddClass = () => {
    setSelectedClass(null)
    setIsEditing(false)
    setShowModal(true)
  }

  const handleEditClass = (classItem: Class) => {
    setSelectedClass(classItem)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleDeleteClass = (id: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(c => c.id !== id))
    }
  }

  const handleSaveClass = (classData: Omit<Class, 'id'>) => {
    if (isEditing && selectedClass) {
      setClasses(classes.map(c =>
        c.id === selectedClass.id
          ? { ...classData, id: selectedClass.id }
          : c
      ))
    } else {
      const newClass = {
        ...classData,
        id: Date.now().toString()
      }
      setClasses([...classes, newClass])
    }
    setShowModal(false)
    setSelectedClass(null)
  }

  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100
    if (percentage >= 90) return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    if (percentage >= 70) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Classes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {canEdit ? 'Manage class information and assignments' : 'View class information'}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={handleAddClass}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Class
          </button>
        )}
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => canEdit && handleEditClass(classItem)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{classItem.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{classItem.room}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCapacityColor(classItem.currentStudents, classItem.capacity)}`}>
                {classItem.currentStudents}/{classItem.capacity}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {classItem.teacher.charAt(0)}
                  </span>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{classItem.teacher}</span>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Subjects</p>
                <div className="flex flex-wrap gap-1">
                  {classItem.subjects.slice(0, 3).map((subject, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                      {subject}
                    </span>
                  ))}
                  {classItem.subjects.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                      +{classItem.subjects.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {canEdit && (
              <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditClass(classItem)
                  }}
                  className="text-xs text-primary-600 hover:text-primary-700"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteClass(classItem.id)
                  }}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {isEditing ? 'Edit Class' : 'Add Class'}
            </h2>
            <ClassForm
              classItem={selectedClass}
              onSave={handleSaveClass}
              onCancel={() => {
                setShowModal(false)
                setSelectedClass(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

const ClassForm: React.FC<{
  classItem: Class | null
  onSave: (classData: Omit<Class, 'id'>) => void
  onCancel: () => void
}> = ({ classItem, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Class, 'id'>>({
    name: classItem?.name || '',
    grade: classItem?.grade || '10',
    section: classItem?.section || 'A',
    room: classItem?.room || '',
    capacity: classItem?.capacity || 40,
    currentStudents: classItem?.currentStudents || 0,
    teacher: classItem?.teacher || '',
    subjects: classItem?.subjects || [],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof Omit<Class, 'id'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubjectsChange = (subject: string) => {
    const subjects = formData.subjects || []
    if (subjects.includes(subject)) {
      handleChange('subjects', subjects.filter(s => s !== subject))
    } else {
      handleChange('subjects', [...subjects, subject])
    }
  }

  const availableSubjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography', 'Computer Science']

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Class Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
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
            Section
          </label>
          <select
            value={formData.section}
            onChange={(e) => handleChange('section', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          >
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Room
          </label>
          <input
            type="text"
            value={formData.room}
            onChange={(e) => handleChange('room', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Capacity
          </label>
          <input
            type="number"
            value={formData.capacity}
            onChange={(e) => handleChange('capacity', parseInt(e.target.value))}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
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
          Subjects
        </label>
        <div className="grid grid-cols-2 gap-2">
          {availableSubjects.map((subject) => (
            <label key={subject} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.subjects?.includes(subject)}
                onChange={() => handleSubjectsChange(subject)}
                className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{subject}</span>
            </label>
          ))}
        </div>
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
          {classItem ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  )
}

export default Classes
