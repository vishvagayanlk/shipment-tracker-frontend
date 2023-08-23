import { Component, ErrorInfo, ReactNode } from "react";
import Banner from "./Banner";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ hasError: true });
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Banner
          type={"ERROR"}
          message={"Something went wrong. Please try again later."}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
