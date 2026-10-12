import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

describe('react-permission-kit in demo-app', () => {
  it('renders initial Admin state with all permissions granted', () => {
    render(<App />);

    // Initial user is Alice in heading
    expect(screen.getByRole('heading', { name: /Alice Administrator/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Super Admin/i).length).toBeGreaterThan(0);

    // Verify <Can /> rendered allowed buttons
    expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete User/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open Analytics Portal/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /System Console/i })).toBeInTheDocument();

    // Hook buttons are active/enabled
    const deleteBtn = screen.getByRole('button', { name: /Delete Record \(Active\)/i });
    expect(deleteBtn).not.toBeDisabled();
  });

  it('restricts delete permission when switching to Bob Manager', () => {
    vi.useFakeTimers();
    render(<App />);

    // Click Bob Manager button
    const bobBtn = screen.getByRole('button', { name: /Bob Manager/i });
    fireEvent.click(bobBtn);

    // Fast-forward simulated API latency
    act(() => {
      vi.runAllTimers();
    });

    expect(screen.getByRole('heading', { name: /Bob Manager/i })).toBeInTheDocument();

    // <Can permission="users.delete"> should now render fallback Access Denied
    expect(screen.getByText(/Access Denied:/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Delete User/i })).not.toBeInTheDocument();

    // Imperative hook button should now be disabled
    const deleteDisabledBtn = screen.getByRole('button', { name: /Delete \(Disabled\)/i });
    expect(deleteDisabledBtn).toBeDisabled();

    vi.useRealTimers();
  });

  it('renders fallback states for all protected elements when switching to Gary Guest', () => {
    vi.useFakeTimers();
    render(<App />);

    const guestBtn = screen.getByRole('button', { name: /Gary Guest/i });
    fireEvent.click(guestBtn);

    act(() => {
      vi.runAllTimers();
    });

    expect(screen.getByRole('heading', { name: /Gary Guest/i })).toBeInTheDocument();

    // All fallbacks should be present
    expect(screen.getByText(/User edit form is not accessible/i)).toBeInTheDocument();
    expect(screen.getByText(/Access Denied:/i)).toBeInTheDocument();
    expect(screen.getByText(/You need either reports export OR billing manage/i)).toBeInTheDocument();
    expect(screen.getByText(/Missing one or both required admin permissions/i)).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('instant reactivity when toggling live permissions', () => {
    render(<App />);

    // Check users.delete checkbox
    const deleteCheckbox = screen.getByRole('checkbox', { name: 'users.delete' });
    expect(deleteCheckbox).toBeChecked();

    // Uncheck users.delete
    fireEvent.click(deleteCheckbox);
    expect(deleteCheckbox).not.toBeChecked();

    // Verify <Can /> immediately reflects the change without page reload
    expect(screen.getByText(/Access Denied:/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Delete User/i })).not.toBeInTheDocument();

    // Check users.delete again
    fireEvent.click(deleteCheckbox);
    expect(deleteCheckbox).toBeChecked();

    // Verify <Can /> immediately grants access again
    expect(screen.getByRole('button', { name: /Delete User/i })).toBeInTheDocument();
  });

  it('executes action callback when user has permission', () => {
    render(<App />);

    const deleteBtn = screen.getByRole('button', { name: /Delete Record \(Active\)/i });
    fireEvent.click(deleteBtn);

    expect(screen.getByText(/User deletion procedure executed/i)).toBeInTheDocument();
  });
});
