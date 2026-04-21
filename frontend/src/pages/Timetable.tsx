import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

interface TimetableEntry {
  id: string
  day: string
  subject: string
  teacher: string
  time: string
  room: string
  grade: string
  section: string
}

const Timetable: React.FC = () => {
  const { user } = useAuth()
  const [timetable, setTimetable] = useState<TimetableEntry[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<TimetableEntry | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Mock timetable data
  const mockTimetable: TimetableEntry[] = [
    { id: '1', day: 'Monday', subject: 'Mathematics', teacher: 'Mr. Smith', time: '09:00 AM', room: '101', grade: '10', section: 'A' },
    { id: '2', day: 'Monday', subject: 'English', teacher: 'Ms. Johnson', time: '10:00 AM', room: '102', grade: '10', section: 'A' },
    { id: '3', day: 'Tuesday', subject: 'Physics', teacher: 'Dr. Brown', time: '09:00 AM', room: '201', grade: '10', section: 'A' },
    { id: '4', day: 'Tuesday', subject: 'Chemistry', teacher: 'Prof. Davis', time: '11:00 AM', room: '202', grade: '10', section: 'A' },
    { id: '5', day: 'Wednesday', subject: 'Biology', teacher: 'Mrs. Wilson', time: '09:00 AM', room: '103', grade: '10', section: 'A' },
    { id: '6', day: 'Wednesday', subject: 'History', teacher: 'Mr. Taylor', time: '10:00 AM', room: '104', grade: '10', section: 'A' },
    { id: '7', day: 'Thursday', subject: 'Geography', teacher: 'Ms. Anderson', time: '09:00 AM', room: '105', grade: '10', section: 'A' },
    { id: '8', day: 'Thursday', subject: 'Computer Science', teacher: 'Mr. Thomas', time: '11:00 AM', room: '206', grade: '10', section: 'A' },
    { id: '9', day: 'Friday', subject: 'Physical Education', teacher: 'Coach Miller', time: '09:00 AM', room: 'Gym', grade: '10', section: 'A' },
    { id: '10', day: 'Friday', subject: 'Art', teacher: 'Mrs. Garcia', time: '10:00 AM', room: 'Art Room', grade: '10', section: 'A' },
  ]

  useEffect(() => {
    // Load mock timetable data
    setTimetable(mockTimetable)
  }, [])

  const canEdit = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'principal'

  const handleAddEntry = () => {
    setSelectedEntry(null)
    setIsEditing(false)
    setShowModal(true)
  }

  const handleEditEntry = (entry: TimetableEntry) => {
    setSelectedEntry(entry)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleDeleteEntry = (id: string) => {
    if (confirm('Are you sure you want to delete this timetable entry?')) {
      setTimetable(timetable.filter(entry => entry.id !== id))
    }
  }

  const handleSaveEntry = (entryData: Omit<TimetableEntry, 'id'>) => {
    if (isEditing && selectedEntry) {
      setTimetable(timetable.map(entry => 
        entry.id === selectedEntry.id 
          ? { ...entryData, id: selectedEntry.id }
          : entry
      ))
    } else {
      const newEntry = {
        ...entryData,
        id: Date.now().toString()
      }
      setTimetable([...timetable, newEntry])
    }
    setShowModal(false)
    setSelectedEntry(null)
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM']

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Timetable</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {canEdit ? 'Manage class schedules and timetables' : 'View your class schedule'}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={handleAddEntry}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Entry
          </button>
        )}
      </div>

      {/* Timetable Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Time
                </th>
                {days.map(day => (
                  <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {times.map(time => (
                <tr key={time} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {time}
                  </td>
                  {days.map(day => {
                    const entry = timetable.find(e => e.day === day && e.time === time)
                    return (
                      <td key={day} className="px-6 py-4 whitespace-nowrap">
                        {entry ? (
                          <div
                            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                            onClick={() => canEdit && handleEditEntry(entry)}
                          >
                            <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                              {entry.subject}
                            </div>
                            <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                              {entry.teacher}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {entry.room}
                            </div>
                            {canEdit && (
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEditEntry(entry)
                                  }}
                                  className="text-xs text-primary-600 hover:text-primary-700"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteEntry(entry.id)
                                  }}
                                  className="text-xs text-red-600 hover:text-red-700"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 dark:text-gray-600">-</div>
                        )}
                      </td>
                    )
                  })}
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
              {isEditing ? 'Edit Timetable Entry' : 'Add Timetable Entry'}
            </h2>
            <TimetableForm
              entry={selectedEntry}
              onSave={handleSaveEntry}
              onCancel={() => {
                setShowModal(false)
                setSelectedEntry(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

const TimetableForm: React.FC<{
  entry: TimetableEntry | null
  onSave: (entry: Omit<TimetableEntry, 'id'>) => void
  onCancel: () => void
}> = ({ entry, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<TimetableEntry, 'id'>>({
    day: entry?.day || 'Monday',
    subject: entry?.subject || '',
    teacher: entry?.teacher || '',
    time: entry?.time || '09:00 AM',
    room: entry?.room || '',
    grade: entry?.grade || '10',
    section: entry?.section || 'A',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof Omit<TimetableEntry, 'id'>, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Day
        </label>
        <select
          value={formData.day}
          onChange={(e) => handleChange('day', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        >
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subject
        </label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        />
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
          Time
        </label>
        <select
          value={formData.time}
          onChange={(e) => handleChange('time', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        >
          <option value="09:00 AM">09:00 AM</option>
          <option value="10:00 AM">10:00 AM</option>
          <option value="11:00 AM">11:00 AM</option>
          <option value="12:00 PM">12:00 PM</option>
          <option value="01:00 PM">01:00 PM</option>
          <option value="02:00 PM">02:00 PM</option>
          <option value="03:00 PM">03:00 PM</option>
        </select>
      </div>

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
          {entry ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  )
}

export default Timetable
