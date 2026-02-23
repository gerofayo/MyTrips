import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="app-container" style={{ textAlign: 'center', padding: '50px' }}>
          <h2 className="section-title">Opps! Something went wrong.</h2>
          <p className="danger-zone-text">Try refreshing the page.</p>
          <button onClick={() => window.location.reload()} className="primary">
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}