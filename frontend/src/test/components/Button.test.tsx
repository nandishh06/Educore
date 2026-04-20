import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@components/ui'

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('btn-primary')
    expect(button).toHaveClass('btn-md')
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>)
    let button = screen.getByRole('button', { name: /secondary/i })
    expect(button).toHaveClass('btn-secondary')

    rerender(<Button variant="success">Success</Button>)
    button = screen.getByRole('button', { name: /success/i })
    expect(button).toHaveClass('btn-success')

    rerender(<Button variant="danger">Danger</Button>)
    button = screen.getByRole('button', { name: /danger/i })
    expect(button).toHaveClass('btn-danger')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    let button = screen.getByRole('button', { name: /small/i })
    expect(button).toHaveClass('btn-sm')

    rerender(<Button size="lg">Large</Button>)
    button = screen.getByRole('button', { name: /large/i })
    expect(button).toHaveClass('btn-lg')
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('can be disabled', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    
    const button = screen.getByRole('button', { name: /disabled/i })
    expect(button).toBeDisabled()
    expect(button).toHaveClass('btn-disabled')
    
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('shows loading state', () => {
    const handleClick = vi.fn()
    render(<Button loading onClick={handleClick}>Loading</Button>)
    
    const button = screen.getByRole('button', { name: /loading/i })
    expect(button).toBeDisabled()
    expect(button).toHaveClass('btn-loading')
    
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders as full width', () => {
    render(<Button fullWidth>Full Width</Button>)
    
    const button = screen.getByRole('button', { name: /full width/i })
    expect(button).toHaveClass('btn-full-width')
  })

  it('renders with custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    
    const button = screen.getByRole('button', { name: /custom/i })
    expect(button).toHaveClass('custom-class')
  })

  it('renders with left icon', () => {
    render(<Button leftIcon={<span data-testid="left-icon">+</span>}>With Icon</Button>)
    
    const button = screen.getByRole('button', { name: /with icon/i })
    const icon = screen.getByTestId('left-icon')
    
    expect(button).toBeInTheDocument()
    expect(icon).toBeInTheDocument()
    expect(button).toContainElement(icon)
  })

  it('renders with right icon', () => {
    render(<Button rightIcon={<span data-testid="right-icon">+</span>}>With Icon</Button>)
    
    const button = screen.getByRole('button', { name: /with icon/i })
    const icon = screen.getByTestId('right-icon')
    
    expect(button).toBeInTheDocument()
    expect(icon).toBeInTheDocument()
    expect(button).toContainElement(icon)
  })

  it('renders as different HTML element types', () => {
    render(<Button as="a" href="/test">Link Button</Button>)
    
    const link = screen.getByRole('link', { name: /link button/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Button ref={ref}>Ref Button</Button>)
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('applies proper ARIA attributes', () => {
    render(
      <Button 
        aria-label="Custom label"
        aria-describedby="description"
        disabled
      >
        Button
      </Button>
    )
    
    const button = screen.getByRole('button', { name: /custom label/i })
    expect(button).toHaveAttribute('aria-label', 'Custom label')
    expect(button).toHaveAttribute('aria-describedby', 'description')
  })
})
