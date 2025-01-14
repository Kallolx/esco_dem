import React from 'react';
import { Container, Title, Text, Button, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorFallback = ({ error }: { error?: Error }) => {
  const navigate = useNavigate();

  return (
    <Container size="md" pt={100}>
      <Stack gap="xl" align="center" style={{ textAlign: 'center' }}>
        <Title order={1}>Oops! Something went wrong</Title>
        <Text size="lg" c="dimmed" ta="center">
          {error?.message || 'An unexpected error occurred'}
        </Text>
        <Button 
          onClick={() => navigate('/', { replace: true })}
          variant="filled"
          color="blue"
          size="md"
        >
          Return to Home
        </Button>
      </Stack>
    </Container>
  );
}; 