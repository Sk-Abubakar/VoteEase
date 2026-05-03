import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Assistant from '../components/Assistant';
import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider } from '../contexts/SettingsContext';
import * as aiService from '../services/aiService';

// Mock the AI service
vi.mock('../services/aiService', () => ({
  askVoteEaseAssistant: vi.fn(),
}));

describe('Assistant Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and shows the welcome screen', () => {
    render(
      <BrowserRouter>
        <SettingsProvider>
          <Assistant />
        </SettingsProvider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/VoteEase Assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/Verified Protocol Insight/i)).toBeInTheDocument();
  });

  it('sends a message and displays the response', async () => {
    const mockResponse = "This is a neutral AI response.";
    vi.mocked(aiService.askVoteEaseAssistant).mockResolvedValue(mockResponse);

    render(
      <BrowserRouter>
        <SettingsProvider>
          <Assistant />
        </SettingsProvider>
      </BrowserRouter>
    );

    const input = screen.getByPlaceholderText(/Ask about candidates, platforms, or ballot transparency/i);
    const sendButton = screen.getByLabelText(/Send Message/i);

    fireEvent.change(input, { target: { value: 'How does voting work?' } });
    fireEvent.click(sendButton);

    expect(aiService.askVoteEaseAssistant).toHaveBeenCalledWith('How does voting work?');

    await waitFor(() => {
      expect(screen.getByText(mockResponse)).toBeInTheDocument();
    });
  });
});
