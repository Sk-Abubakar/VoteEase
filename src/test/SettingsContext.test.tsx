import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { SettingsProvider, useSettings } from '../contexts/SettingsContext';
import React from 'react';

const TestComponent = () => {
  const { language, setLanguage, theme, toggleTheme, t } = useSettings();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => setLanguage('es')} data-testid="btn-es">Switch to ES</button>
      <button onClick={toggleTheme} data-testid="btn-theme">Toggle Theme</button>
      <span data-testid="trans">{t('hero_title')}</span>
    </div>
  );
};

describe('SettingsContext', () => {
  it('provides default settings', () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    expect(screen.getByTestId('lang')).toHaveTextContent('en');
    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });

  it('updates language', () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    const btn = screen.getByTestId('btn-es');
    act(() => {
      btn.click();
    });

    expect(screen.getByTestId('lang')).toHaveTextContent('es');
  });

  it('toggles theme', () => {
    render(
      <SettingsProvider>
        <TestComponent />
      </SettingsProvider>
    );

    const btn = screen.getByTestId('btn-theme');
    act(() => {
      btn.click();
    });

    expect(screen.getByTestId('theme')).toHaveTextContent('light');
  });
});
