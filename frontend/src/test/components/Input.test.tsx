import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@components/ui'

describe('Input Component', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />)
    
    const input = screen.getByPlaceholderText(/enter text/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('input')
    expect(input).toHaveClass('input-md')
  })

  it('renders with label', () => {
    render(<Input label="Email address" />)
    
    const label = screen.getByText(/email address/i)
    const input = screen.getByRole('textbox')
    
    expect(label).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(label).toHaveAttribute('for', expect.any(String))
  })

  it('renders with different variants', () => {
    const { rerender } = render(<Input variant="filled" />)
    let input = screen.getByRole('textbox')
    expect(input).toHaveClass('input-filled')

    rerender(<Input variant="outlined" />)
    input = screen.getByRole('textbox')
    expect(input).toHaveClass('input-outlined')
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<Input size="sm" />)
    let input = screen.getByRole('textbox')
    expect(input).toHaveClass('input-sm')

    rerender(<Input size="lg" />)
    input = screen.getByRole('textbox')
    expect(input).toHaveClass('input-lg')
  })

  it('handles input changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    await user.type(input, 'Hello World')
    
    expect(handleChange).toHaveBeenCalledTimes(11) // Each character triggers a change
    expect(input).toHaveValue('Hello World')
  })

  it('shows error state', () => {
    render(<Input error="This field is required" />)
    
    const input = screen.getByRole('textbox')
    const errorMessage = screen.getByText(/this field is required/i)
    
    expect(input).toHaveClass('input-error')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(errorMessage).toBeInTheDocument()
  })

  it('shows helper text', () => {
    render(<Input helperText="Enter your email address" />)
    
    const helperText = screen.getByText(/enter your email address/i)
    expect(helperText).toBeInTheDocument()
    expect(helperText).toHaveClass('input-helper-text')
  })

  it('can be disabled', () => {
    render(<Input disabled />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('input-disabled')
  })

  it('renders as full width', () => {
    render(<Input fullWidth />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('input-full-width')
  })

  it('renders with left icon', () => {
    render(<Input leftIcon={<span data-testid="left-icon">@</span>} />)
    
    const icon = screen.getByTestId('left-icon')
    const input = screen.getByRole('textbox')
    
    expect(icon).toBeInTheDocument()
    expect(input).toBeInTheDocument()
  })

  it('renders with right icon', () => {
    render(<Input rightIcon={<span data-testid="right-icon">+</span>} />)
    
    const icon = screen.getByTestId('right-icon')
    const input = screen.getByRole('textbox')
    
    expect(icon).toBeInTheDocument()
    expect(input).toBeInTheDocument()
  })

  it('handles password toggle', async () => {
    const user = userEvent.setup()
    render(<Input type="password" showPasswordToggle />)
    
    const input = screen.getByPlaceholderText(/password/i)
    const toggleButton = screen.getByRole('button', { name: /show password/i })
    
    expect(input).toHaveAttribute('type', 'password')
    
    await user.click(toggleButton)
    
    expect(input).toHaveAttribute('type', 'text')
    expect(toggleButton).toHaveAttribute('aria-label', /hide password/i)
    
    await user.click(toggleButton)
    
    expect(input).toHaveAttribute('type', 'password')
    expect(toggleButton).toHaveAttribute('aria-label', /show password/i)
  })

  it('handles focus and blur events', async () => {
    const user = userEvent.setup()
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />)
    
    const input = screen.getByRole('textbox')
    
    await user.click(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    await user.tab() // Blur the input
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })

  it('renders with custom className', () => {
    render(<Input className="custom-input" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Input ref={ref} />)
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('applies proper ARIA attributes', () => {
    render(
      <Input
        aria-label="Custom input"
        aria-describedby="description"
        required
      />
    )
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('aria-label', 'Custom input')
    expect(input).toHaveAttribute('aria-describedby', 'description')
    expect(input).toBeRequired()
  })

  it('handles different input types', () => {
    const { rerender } = render(<Input type="email" />)
    let input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')

    rerender(<Input type="number" />)
    input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('type', 'number')

    rerender(<Input type="tel" />)
    input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'tel')
  })

  it('shows loading state', () => {
    render(<Input loading />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('input-loading')
    expect(input).toBeDisabled()
  })

  it('handles input validation', async () => {
    const user = userEvent.setup()
    render(<Input type="email" />)
    
    const input = screen.getByRole('textbox')
    
    await user.type(input, 'invalid-email')
    
    // Note: HTML5 validation is handled by the browser
    // This test ensures the component can work with HTML5 validation
    expect(input).toHaveAttribute('type', 'email')
  })
})
