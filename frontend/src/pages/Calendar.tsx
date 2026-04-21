import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'exam' | 'holiday' | 'meeting' | 'event'
  description: string
}

const Calendar: React.FC = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Mock calendar events
  const mockEvents: CalendarEvent[] = [
    { id: '1', title: 'Mid-Term Exams', date: '2024-04-15', type: 'exam', description: 'Mid-term examinations for all grades' },
    { id: '2', title: 'Spring Break', date: '2024-04-20', type: 'holiday', description: 'Spring break holiday' },
    { id: '3', title: 'Parent-Teacher Meeting', date: '2024-04-25', type: 'meeting', description: 'Quarterly parent-teacher meeting' },
    { id: '4', title: 'Sports Day', date: '2024-05-10', type: 'event', description: 'Annual sports day event' },
    { id: '5', title: 'Final Exams', date: '2024-05-20', type: 'exam', description: 'Final examinations for all grades' },
    { id: '6', title: 'Summer Break', date: '2024-06-01', type: 'holiday', description: 'Summer break begins' },
  ]

  useEffect(() => {
    setEvents(mockEvents)
  }, [])

  const canEdit = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'principal'

  const handleAddEvent = () => {
    setSelectedEvent(null)
    setIsEditing(false)
    setShowModal(true)
  }

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsEditing(true)
    setShowModal(true)
  }

  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== id))
    }
  }

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (isEditing && selectedEvent) {
      setEvents(events.map(e =>
        e.id === selectedEvent.id
          ? { ...eventData, id: selectedEvent.id }
          : e
      ))
    } else {
      const newEvent = {
        ...eventData,
        id: Date.now().toString()
      }
      setEvents([...events, newEvent])
    }
    setShowModal(false)
    setSelectedEvent(null)
  }

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'exam': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
      case 'holiday': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'
      case 'meeting': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800'
      case 'event': return 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800'
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700'
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(e => e.date === dateStr)
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const days = getDaysInMonth(currentMonth)

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Academic Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {canEdit ? 'Manage academic calendar and events' : 'View academic calendar'}
          </p>
        </div>
        {canEdit && (
          <button
            onClick={handleAddEvent}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Add Event
          </button>
        )}
      </div>

      {/* Calendar Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            →
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
          {dayNames.map(day => (
            <div key={day} className="bg-gray-50 dark:bg-gray-800 p-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="bg-white dark:bg-gray-800 p-2 min-h-24" />
            }
            const dayEvents = getEventsForDate(day)
            const isToday = day.toDateString() === new Date().toDateString()
            return (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 p-2 min-h-24 ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary-600' : 'text-gray-900 dark:text-gray-100'}`}>
                  {day.getDate()}
                </div>
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={() => canEdit && handleEditEvent(event)}
                    className={`text-xs p-1 mb-1 rounded cursor-pointer hover:opacity-80 ${getEventTypeColor(event.type)}`}
                    title={event.description}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {events
            .filter(e => new Date(e.date) >= new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, 5)
            .map(event => (
              <div
                key={event.id}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:opacity-80 ${getEventTypeColor(event.type)}`}
                onClick={() => canEdit && handleEditEvent(event)}
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{event.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{new Date(event.date).toLocaleDateString()}</p>
                  {canEdit && (
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditEvent(event)
                        }}
                        className="text-xs text-primary-600 hover:text-primary-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteEvent(event.id)
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
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {isEditing ? 'Edit Event' : 'Add Event'}
            </h2>
            <CalendarEventForm
              event={selectedEvent}
              onSave={handleSaveEvent}
              onCancel={() => {
                setShowModal(false)
                setSelectedEvent(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

const CalendarEventForm: React.FC<{
  event: CalendarEvent | null
  onSave: (eventData: Omit<CalendarEvent, 'id'>) => void
  onCancel: () => void
}> = ({ event, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<CalendarEvent, 'id'>>({
    title: event?.title || '',
    date: event?.date || '',
    type: event?.type || 'event',
    description: event?.description || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: keyof Omit<CalendarEvent, 'id'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Event Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Date
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Event Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value as CalendarEvent['type'])}
          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          required
        >
          <option value="exam">Exam</option>
          <option value="holiday">Holiday</option>
          <option value="meeting">Meeting</option>
          <option value="event">Event</option>
        </select>
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
          {event ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  )
}

export default Calendar
