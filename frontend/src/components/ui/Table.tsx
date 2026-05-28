import React from 'react'
import { clsx } from 'clsx'
import { ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react'

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  striped?: boolean
  hover?: boolean
  compact?: boolean
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean
}

interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  variant?: 'default' | 'header' | 'numeric'
}

interface TableHeadProps extends React.HTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean
  sorted?: 'asc' | 'desc' | null
  onSort?: () => void
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      striped = false,
      hover = true,
      compact = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'min-w-full divide-y divide-gray-200 dark:divide-gray-700'
    
    const classes = clsx(
      baseClasses,
      striped && 'divide-y divide-gray-100 dark:divide-gray-700',
      compact && 'text-sm',
      className
    )

    return (
      <div className="overflow-x-auto">
        <table className={classes} ref={ref} {...props}>
          {children}
        </table>
      </div>
    )
  }
)

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  (
    {
      className,
      children,
      ...props
    },
    ref
  ) => {
    const classes = clsx(
      'bg-gray-50 dark:bg-gray-700',
      className
    )

    return (
      <thead className={classes} ref={ref} {...props}>
        {children}
      </thead>
    )
  }
)

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  (
    {
      className,
      children,
      ...props
    },
    ref
  ) => {
    const classes = clsx(
      'bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700',
      className
    )

    return (
      <tbody className={classes} ref={ref} {...props}>
        {children}
      </tbody>
    )
  }
)

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    {
      className,
      selected = false,
      children,
      ...props
    },
    ref
  ) => {
    const classes = clsx(
      'transition-colors duration-150',
      selected && 'bg-primary-50 dark:bg-primary-900/20',
      !selected && 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
      className
    )

    return (
      <tr className={classes} ref={ref} {...props}>
        {children}
      </tr>
    )
  }
)

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  (
    {
      className,
      variant = 'default',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'whitespace-nowrap text-sm'
    
    const variantClasses = {
      default: 'text-gray-900 dark:text-gray-100',
      header: 'text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
      numeric: 'text-gray-900 dark:text-gray-100 text-right'
    }

    const classes = clsx(
      baseClasses,
      variantClasses[variant],
      variant !== 'header' && 'px-6 py-4',
      variant === 'header' && 'px-6 py-3',
      className
    )

    return (
      <td className={classes} ref={ref} {...props}>
        {children}
      </td>
    )
  }
)

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      className,
      sortable = false,
      sorted = null,
      onSort,
      children,
      ...props
    },
    ref
  ) => {
    const classes = clsx(
      'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
      sortable && 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
      className
    )

    const SortIcon = () => {
      if (sorted === 'asc') return <ChevronUp className="h-4 w-4" />
      if (sorted === 'desc') return <ChevronDown className="h-4 w-4" />
      return null
    }

    return (
      <th className={classes} ref={ref} onClick={sortable ? onSort : undefined} {...props}>
        <div className="flex items-center space-x-1">
          <span>{children}</span>
          {sortable && (
            <div className="flex flex-col">
              <SortIcon />
            </div>
          )}
        </div>
      </th>
    )
  }
)

// Additional utility components
const TableActions = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center space-x-2">
    {children}
  </div>
)

const TableMoreActions = ({ children }: { children: React.ReactNode }) => (
  <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
    <MoreHorizontal className="h-4 w-4" />
  </button>
)

Table.displayName = 'Table'
TableHeader.displayName = 'TableHeader'
TableBody.displayName = 'TableBody'
TableRow.displayName = 'TableRow'
TableCell.displayName = 'TableCell'
TableHead.displayName = 'TableHead'

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableActions,
  TableMoreActions
}
export default Table
