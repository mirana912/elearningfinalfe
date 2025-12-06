import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: any) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-2xl bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-2">Đã có lỗi xảy ra</h2>
            <pre className="text-sm text-red-600">
              {this.state.error?.message}
            </pre>
            <p className="mt-4 text-sm text-gray-600">
              Mở console để xem stack trace chi tiết.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
