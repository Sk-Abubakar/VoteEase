/// <reference types="@testing-library/jest-dom" />
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LandingPage from '../components/LandingPage';
import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider } from '../contexts/SettingsContext';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('LandingPage', () => {
  it('renders the hero title', () => {
    const onOpenLogin = vi.fn();
    const onOpenProtocol = vi.fn();
    
    render(
      <BrowserRouter>
        <SettingsProvider>
          <LandingPage onOpenLogin={onOpenLogin} onOpenProtocol={onOpenProtocol} />
        </SettingsProvider>
      </BrowserRouter>
    );
    
    // Check if the protocol version is visible
    expect(screen.getByText(/Global Protocol/i)).toBeInTheDocument();
  });

  it('calls onOpenLogin when begin journey is clicked', async () => {
    const onOpenLogin = vi.fn();
    const onOpenProtocol = vi.fn();
    
    render(
      <BrowserRouter>
        <SettingsProvider>
          <LandingPage onOpenLogin={onOpenLogin} onOpenProtocol={onOpenProtocol} />
        </SettingsProvider>
      </BrowserRouter>
    );
    
    const startButton = screen.getByRole('button', { name: /Secure Voter Registration/i });
    startButton.click();
    
    expect(onOpenLogin).toHaveBeenCalled();
  });
});
