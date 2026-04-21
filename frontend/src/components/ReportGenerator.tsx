import React, { useState } from 'react';
import { ReportService, ReportOptions, ReportData } from '../services/reportService';

interface ReportGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ isOpen, onClose }) => {
  const [reportOptions, setReportOptions] = useState<ReportOptions>({
    type: 'student',
    format: 'pdf',
    dateRange: {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    },
    filters: {
      grade: undefined,
      section: undefined,
      status: 'all'
    }
  } as ReportOptions);

  const [generatedReport, setGeneratedReport] = useState<ReportData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      const report = ReportService.generateStudentReport(reportOptions);
      setGeneratedReport(report);
      
      // Download the report
      ReportService.downloadReport(report);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const reportTypes = ReportService.getReportTypes();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Generate Report</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Report Options */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Type
              </label>
              <select
                value={reportOptions.type}
                onChange={(e) => setReportOptions(prev => ({ ...prev, type: e.target.value as ReportOptions['type'] }))}
                className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {reportTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format
              </label>
              <select
                value={reportOptions.format}
                onChange={(e) => setReportOptions(prev => ({ ...prev, format: e.target.value as ReportOptions['format'] }))}
                className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={reportOptions.dateRange?.startDate || ''}
                    onChange={(e) => setReportOptions(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, startDate: e.target.value }
                    }))}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={reportOptions.dateRange?.endDate || ''}
                    onChange={(e) => setReportOptions(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, endDate: e.target.value }
                    }))}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filters</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Grade</label>
                  <select
                    value={reportOptions.filters?.grade || ''}
                    onChange={(e) => setReportOptions(prev => ({
                      ...prev,
                      filters: prev.filters ? { ...prev.filters, grade: e.target.value } : { grade: e.target.value }
                    }))}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Grades</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Section</label>
                  <input
                    type="text"
                    placeholder="e.g., A, B, C"
                    value={reportOptions.filters?.section || ''}
                    onChange={(e) => setReportOptions(prev => ({
                      ...prev,
                      filters: prev.filters ? { ...prev.filters, section: e.target.value } : { section: e.target.value }
                    }))}
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-4">
              <button
                onClick={() => setReportOptions({
                  type: 'student',
                  format: 'pdf',
                  dateRange: {
                    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    endDate: new Date().toISOString().split('T')[0]
                  },
                  filters: {
                    grade: undefined,
                    section: undefined,
                    status: 'all'
                  }
                } as ReportOptions)}
                className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 px-4 py-2 text-sm"
              >
                Reset to Default
              </button>
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-soft px-4 py-2 text-sm min-w-[120px]"
              >
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>

          {/* Generated Report Preview */}
          {generatedReport && (
            <div className="p-6 border-t border-gray-200">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{generatedReport.title}</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    Generated: {new Date(generatedReport.generatedAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Format: {generatedReport.format.toUpperCase()}
                  </p>
                  {generatedReport.metadata && (
                    <div className="text-sm text-gray-600">
                      <p>Records: {generatedReport.metadata.totalRecords}</p>
                      <p>Period: {generatedReport.metadata.dateRange}</p>
                      {generatedReport.metadata.filters && <p>Filters: {generatedReport.metadata.filters}</p>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
};

export default ReportGenerator;
