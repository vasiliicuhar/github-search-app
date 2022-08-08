import { Alert } from "@mantine/core";
import { Component, PropsWithChildren } from "react";

type Props = PropsWithChildren<{}>;
type State = {
  hasError?: boolean;
};

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert title="Failure" color="red">
          Something went wrong
        </Alert>
      );
    }

    return this.props.children;
  }
}
