"use client";

import React, {
  Component,
  ErrorInfo,
  ReactNode,
} from "react";

import {
  IconAlert,
  IconRefresh,
  IconInfo
} from "./Icon";

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
      "ErrorBoundary caught an error:",
      error,
      errorInfo
    );
  }

  handleReset = (): void => {
    try {
      localStorage.clear();
    } catch (err) {
      console.error(
        "Failed to clear localStorage:",
        err
      );
    }

    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          className="
            flex min-h-screen
            items-center justify-center
            bg-n-50
            px-6 py-12
          "
        >
          <div
            className="
              relative
              w-full max-w-2xl
              overflow-hidden
              rounded-3xl
              border border-error/20
              bg-white
              p-8
              shadow-elev-3
            "
          >
            {/* Glow */}
            <div
              className="
                pointer-events-none
                absolute inset-x-0 top-0
                h-1
                bg-gradient-to-r
                from-error
                via-warning
                to-brand
              "
            />

            {/* Header */}
            <div className="flex flex-col items-center text-center">
              <div
                className="
                  mb-5
                  flex h-16 w-16
                  items-center justify-center
                  rounded-2xl
                  bg-error-light
                  text-error
                "
              >
                <IconAlert size={30} />
              </div>

              <h1
                className="
                  font-display
                  text-ds-display
                  text-n-900
                "
              >
                Something went wrong
              </h1>

              <p
                className="
                  mt-4
                  max-w-lg
                  text-ds-body
                  leading-relaxed
                  text-n-500
                "
              >
                Opsell encountered an unexpected
                error while processing your
                profitability calculations or
                analytics dashboard.
              </p>
            </div>

            {/* Error Box */}
            {this.state.error && (
              <div
                className="
                  mt-8
                  overflow-hidden
                  rounded-2xl
                  border border-n-border
                  bg-n-900
                  shadow-elev-1
                "
              >
                <div
                  className="
                    flex items-center gap-2
                    border-b border-white/10
                    px-4 py-3
                  "
                >
                  <IconInfo
                    size={14}
                    className="text-warning"
                  />

                  <span
                    className="
                      text-ds-caption
                      font-semibold
                      uppercase tracking-wide
                      text-n-300
                    "
                  >
                    Runtime Error
                  </span>
                </div>

                <pre
                  className="
                    overflow-x-auto
                    p-4
                    font-mono
                    text-[12px]
                    leading-relaxed
                    text-n-200
                  "
                >
                  {this.state.error.message}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div
              className="
                mt-8
                flex flex-col gap-3
                sm:flex-row
                sm:justify-center
              "
            >
              <button
                onClick={this.handleReset}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-2xl
                  bg-brand
                  px-6 py-3
                  text-ds-body-sm
                  font-semibold
                  text-white
                  shadow-elev-2
                  transition-all
                  hover:bg-brand-dark
                  hover:shadow-elev-3
                "
              >
                <IconRefresh size={16} />
                Reset Session & Reload
              </button>

              <button
                onClick={() =>
                  window.location.reload()
                }
                className="
                  inline-flex items-center justify-center
                  rounded-2xl
                  border border-n-border
                  bg-white
                  px-6 py-3
                  text-ds-body-sm
                  font-semibold
                  text-n-700
                  transition-all
                  hover:border-brand/30
                  hover:bg-brand-light/30
                  hover:text-brand
                "
              >
                Reload Page
              </button>
            </div>

            {/* Footer */}
            <div
              className="
                mt-8
                border-t border-n-100
                pt-5
                text-center
              "
            >
              <p
                className="
                  text-ds-caption
                  leading-relaxed
                  text-n-400
                "
              >
                If this issue keeps happening,
                verify your product inputs,
                platform settings, and browser
                storage permissions.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}