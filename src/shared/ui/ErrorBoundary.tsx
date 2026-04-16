"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[var(--radius-brand-card)] flex flex-col items-center justify-center text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500" />
          <div>
            <h2 className="text-lg font-bold text-red-500">Wystąpił błąd komponentu</h2>
            <p className="text-sm text-red-400/80 mt-1">{this.state.error?.message || 'Nieznany błąd'}</p>
          </div>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-[var(--radius-brand-button)] text-sm font-bold hover:bg-red-600 transition-colors"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Spróbuj ponownie
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
