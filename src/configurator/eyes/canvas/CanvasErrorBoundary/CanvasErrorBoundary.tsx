"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

export interface CanvasErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface CanvasErrorBoundaryState {
  error: Error | null;
}

export class CanvasErrorBoundary extends Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  state: CanvasErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): CanvasErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Configurator canvas crashed", error, info.componentStack);
  }

  private retry = () => this.setState({ error: null });

  render(): ReactNode {
    if (!this.state.error) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-zinc-100 text-sm text-zinc-500">
        <p>The 3D viewport failed to load.</p>
        <button
          type="button"
          onClick={this.retry}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-zinc-900 hover:bg-zinc-200"
        >
          Try again
        </button>
      </div>
    );
  }
}
