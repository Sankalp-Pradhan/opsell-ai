import React, {
  Component,
  ErrorInfo,
  ReactNode,
} from 'react';

/* -------------------------------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------------------------------- */

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/* -------------------------------------------------------------------------- */
/* COMPONENT */
/* -------------------------------------------------------------------------- */

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(
    props: ErrorBoundaryProps
  ) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(
    error: Error
  ): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(
    error: Error,
    errorInfo: ErrorInfo
  ): void {
    console.error(
      'ErrorBoundary caught an error:',
      error,
      errorInfo
    );
  }

  handleReset = (): void => {
    try {
      localStorage.clear();
    } catch (err) {
      console.error(
        'Failed to clear localStorage:',
        err
      );
    }

    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'center',
            background:
              'var(--bg-base)',
            padding: 24,
          }}
        >
          <div
            style={{
              textAlign: 'center',
              padding: '40px',
              background:
                'var(--bg-surface-2)',
              border:
                '1px solid var(--accent-danger)',
              borderRadius: '16px',
              maxWidth: 520,
              width: '100%',
              boxShadow:
                '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            <h1
              style={{
                color:
                  'var(--accent-danger)',
                fontFamily: 'Sora',
                fontSize: 28,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Oops, something went
              wrong.
            </h1>

            <p
              style={{
                color:
                  'var(--text-secondary)',
                fontFamily:
                  'DM Sans',
                fontSize: 15,
                lineHeight: 1.6,
                marginBottom: 24,
              }}
            >
              We encountered an
              unexpected error while
              calculating your
              numbers.
            </p>

            {this.state.error && (
              <pre
                style={{
                  textAlign: 'left',
                  background:
                    'rgba(255,255,255,0.03)',
                  border:
                    '1px solid rgba(255,255,255,0.08)',
                  padding: 12,
                  borderRadius: 10,
                  overflowX: 'auto',
                  marginBottom: 24,
                  color:
                    'var(--text-muted)',
                  fontSize: 12,
                  fontFamily:
                    'DM Mono, monospace',
                }}
              >
                {
                  this.state.error
                    .message
                }
              </pre>
            )}

            <button
              onClick={
                this.handleReset
              }
              style={{
                padding:
                  '10px 24px',
                background:
                  'var(--accent-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontFamily:
                  'DM Sans',
                fontWeight: 600,
                cursor: 'pointer',
                transition:
                  'opacity 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity =
                  '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity =
                  '1';
              }}
            >
              Reset Session &
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}