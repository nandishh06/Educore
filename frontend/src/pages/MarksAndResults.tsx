import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

interface StudentMark {
  id: string
  studentName: string
  studentId: string
  grade: string
  section: string
  subject: string
  marks: number
  totalMarks: number
  percentage: number
  gradeValue: string
  examType: string
  examDate: string
  teacher: string
}

const MarksAndResults: React.FC = () => {
  const { user } = useAuth()
  const [marks, setMarks] = useState<StudentMark[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [selectedMark, setSelectedMark] = useState<StudentMark | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedGrade, setSelectedGrade] = useState<string>('')
  const [selectedSection, setSelectedSection] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')

  // Mock marks data
  const mockMarks: StudentMark[] = [
    { id: '1', studentName: 'Alice Johnson', studentId: 'STU001', grade: '10', section: 'A', subject: 'Mathematics', marks: 85, totalMarks: 100, percentage: 85, gradeValue: 'A', examType: 'Mid-Term', examDate: '2024-04-15', teacher: 'Mr. Smith' },
    { id: '2', studentName: 'Bob Smith', studentId: 'STU002', grade: '10', section: 'A', subject: 'Mathematics', marks: 72, totalMarks: 100, percentage: 72, gradeValue: 'B', examType: 'Mid-Term', examDate: '2024-04-15', teacher: 'Mr. Smith' },
    { id: '3', studentName: 'Charlie Brown', studentId: 'STU003', grade: '10', section: 'A', subject: 'Mathematics', marks: 90, totalMarks: 100, percentage: 90, gradeValue: 'A+', examType: 'Mid-Term', examDate: '2024-04-15', teacher: 'Mr. Smith' },
    { id: '4', studentName: 'Alice Johnson', studentId: 'STU001', grade: '10', section: 'A', subject: 'English', marks: 78, totalMarks: 100, percentage: 78, gradeValue: 'B+', examType: 'Mid-Term', examDate: '2024-04-16', teacher: 'Ms. Johnson' },
    { id: '5', studentName: 'Bob Smith', studentId: 'STU002', grade: '10', section: 'A', subject: 'English', marks: 88, totalMarks: 100, percentage: 88, gradeValue: 'A', examType: 'Mid-Term', examDate: '2024-04-16', teacher: 'Ms. Johnson' },
    { id: '6', studentName: 'Charlie Brown', studentId: 'STU003', grade: '10', section: 'A', subject: 'English', marks: 82, totalMarks: 100, percentage: 82, gradeValue: 'A', examType: 'Mid-Term', examDate: '2024-04-16', teacher: 'Ms. Johnson' },
    { id: '7', studentName: 'Alice Johnson', studentId: 'STU001', grade: '10', section: 'A', subject: 'Physics', marks: 65, totalMarks: 100, percentage: 65, gradeValue: 'B', examType: 'Mid-Term', examDate: '2024-04-17', teacher: 'Dr. Brown' },
    { id: '8', studentName: 'Bob Smith', studentId: 'STU002', grade: '10', section: 'A', subject: 'Physics', marks: 75, totalMarks: 100, percentage: 75, gradeValue: 'B+', examType: 'Mid-Term', examDate: '2024-04-17', teacher: 'Dr. Brown' },
    { id: '9', studentName: 'Charlie Brown', studentId: 'STU003', grade: '10', section: 'A', subject: 'Physics', marks: 92, totalMarks: 100, percentage: 92, gradeValue: 'A+', examType: 'Mid-Term', examDate: '2024-04-17', teacher: 'Dr. Brown' },
  ]

  useEffect(() => {
    setMarks(mockMarks)
  }, [])

  const canEdit = user?.role === 'admin' || user?.role === 'teacher'

  const handleAddMark = () => {
    setSelectedMark(null)
    setIsEditing(false)
    setShowModal(true)
  }

  const handleEditMark = (mark: StudentMark) => {
    setSelectedMark(mark)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleDeleteMark = (id: string) => {
    if (confirm('Are you sure you want to delete this mark?')) {
      setMarks(marks.filter(mark => mark.id !== id))
    }
  }

  const handleSaveMark = (markData: Omit<StudentMark, 'id'>) => {
    if (isEditing && selectedMark) {
      setMarks(marks.map(mark =>
        mark.id === selectedMark.id
          ? { ...markData, id: selectedMark.id }
          : mark
      ))
    } else {
      const newMark = {
        ...markData,
        id: Date.now().toString()
      }
      setMarks([...marks, newMark])
    }
    setShowModal(false)
    setSelectedMark(null)
  }

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+'
    if (percentage >= 85) return 'A'
    if (percentage >= 80) return 'A-'
    if (percentage >= 75) return 'B+'
    if (percentage >= 70) return 'B'
    if (percentage >= 65) return 'B-'
    if (percentage >= 60) return 'C+'
    if (percentage >= 55) return 'C'
    if (percentage >= 50) return 'C-'
    return 'F'
  }

  const getGradeColor = (grade: string): string => {
    if (grade.startsWith('A')) return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
    if (grade.startsWith('B')) return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
    if (grade.startsWith('C')) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
  }

  const filteredMarks = marks.filter(mark => {
    const matchesGrade = !selectedGrade || mark.grade === selectedGrade
    const matchesSection = !selectedSection || mark.section === selectedSection
    const matchesSubject = !selectedSubject || mark.subject === selectedSubject
    return matchesGrade && matchesSection && matchesSubject
  })

  const subjects = Array.from(new Set(marks.map(m => m.subject)))
  const grades = Array.from(new Set(marks.map(m => m.grade)))
  const sections = Array.from(new Set(marks.map(m => m.section)))

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Marks and Results</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {canEdit ? 'Manage student marks and exam results' : 'View student marks and exam results'}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={handleAddMark}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Mark
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Grades</option>
              {grades.map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Sections</option>
              {sections.map(section => (
                <option key={section} value={section}>Section {section}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Grade/Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Exam Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                {canEdit && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMarks.map((mark) => (
                <tr key={mark.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{mark.studentName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{mark.studentId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {mark.grade} - {mark.section}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {mark.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {mark.marks} / {mark.totalMarks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {mark.percentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGradeColor(mark.gradeValue)}`}>
                      {mark.gradeValue}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {mark.examType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {new Date(mark.examDate).toLocaleDateString()}
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditMark(mark)}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMark(mark.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {isEditing ? 'Edit Mark' : 'Add Mark'}
            </h2>
            <MarkForm
              mark={selectedMark}
              onSave={handleSaveMark}
              onCancel={() => {
                setShowModal(false)
                setSelectedMark(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

const MarkForm: React.FC<{
  mark: StudentMark | null
  onSave: (markData: Omit<StudentMark, 'id'>) => void
  onCancel: () => void
}> = ({ mark, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<StudentMark, 'id'>>({
    studentName: mark?.studentName || '',
    studentId: mark?.studentId || '',
    grade: mark?.grade || '10',
    section: mark?.section || 'A',
    subject: mark?.subject || '',
    marks: mark?.marks || 0,
    totalMarks: mark?.totalMarks || 100,
    percentage: mark?.percentage || 0,
    gradeValue: mark?.gradeValue || '',
    examType: mark?.examType || '',
    examDate: mark?.examDate || '',
    teacher: mark?.teacher || '',
  })

  const calculatePercentage = (marks: number, totalMarks: number): number => {
    if (totalMarks === 0) return 0
    return Math.round((marks / totalMarks) * 100)
  }

  const calculateGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A+'
    if (percentage >= 85) return 'A'
    if (percentage >= 80) return 'A-'
    if (percentage >= 75) return 'B+'
    if (percentage >= 70) return 'B'
    if (percentage >= 65) return 'B-'
    if (percentage >= 60) return 'C+'
    if (percentage >= 55) return 'C'
    if (percentage >= 50) return 'C-'
    return 'F'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const percentage = calculatePercentage(formData.marks, formData.totalMarks)
    const gradeValue = calculateGrade(percentage)
    onSave({
      ...formData,
      percentage,
      gradeValue
    })
  }

  const handleChange = (field: keyof Omit<StudentMark, 'id'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student Name</label>
        <input
          type="text"
          value={formData.studentName}
          onChange={(e) => handleChange('studentName', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student ID</label>
          <input
            type="text"
            value={formData.studentId}
            onChange={(e) => handleChange('studentId', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Grade</label>
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Section</label>
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marks Obtained</label>
          <input
            type="number"
            value={formData.marks}
            onChange={(e) => handleChange('marks', parseInt(e.target.value))}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Marks</label>
          <input
            type="number"
            value={formData.totalMarks}
            onChange={(e) => handleChange('totalMarks', parseInt(e.target.value))}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Type</label>
          <select
            value={formData.examType}
            onChange={(e) => handleChange('examType', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          >
            <option value="Mid-Term">Mid-Term</option>
            <option value="Final">Final</option>
            <option value="Quiz">Quiz</option>
            <option value="Assignment">Assignment</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Date</label>
          <input
            type="date"
            value={formData.examDate}
            onChange={(e) => handleChange('examDate', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teacher Name</label>
        <input
          type="text"
          value={formData.teacher}
          onChange={(e) => handleChange('teacher', e.target.value)}
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
          {mark ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  )
}

export default MarksAndResults
