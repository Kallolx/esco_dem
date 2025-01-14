import { Container, Title, Text, Button, Paper, Stack, Box } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconMail } from '@tabler/icons-react';
import { supabase } from '../../lib/supabase';
import { useState } from 'react';

export const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendError, setResendError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);
  
  const email = location.state?.email;
  const message = location.state?.message;
  const error = location.state?.error;
  const showResendButton = location.state?.showResendButton;

  const handleResendVerification = async () => {
    if (!email) {
      setResendError('Email address not found');
      return;
    }

    try {
      setLoading(true);
      setResendError('');
      setResendSuccess(false);

      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (resendError) throw resendError;

      setResendSuccess(true);
    } catch (err: any) {
      setResendError(err.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  if (!email && !error) {
    navigate('/signup');
    return null;
  }

  return (
    <Box 
      style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Container size={420}>
        <Paper withBorder shadow="md" p={30} radius="md" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <Stack align="center" gap="lg">
            <IconMail size={50} style={{ color: error ? '#ff4b6e' : '#ff4b6e' }} />
            
            <Title order={2} ta="center" style={{ color: 'white' }}>
              {error ? 'Verification Failed' : 'Check your email'}
            </Title>
            
            {error ? (
              <Text c="dimmed" size="sm" ta="center">
                {error}
              </Text>
            ) : (
              <>
                <Text c="dimmed" size="sm" ta="center">
                  We've sent a verification link to <br />
                  <Text span fw={500} c="white">
                    {email}
                  </Text>
                </Text>

                <Text c="dimmed" size="sm" ta="center">
                  {message || 'Click the link in the email to verify your account.'}
                </Text>
              </>
            )}

            {resendError && (
              <Text c="red" size="sm" ta="center">
                {resendError}
              </Text>
            )}

            {resendSuccess && (
              <Text c="teal" size="sm" ta="center">
                A new verification email has been sent!
              </Text>
            )}

            <Stack gap="sm">
              {(showResendButton || error) && (
                <Button
                  variant="gradient"
                  gradient={{ from: '#ff4b6e', to: '#ff8f9c' }}
                  onClick={handleResendVerification}
                  loading={loading}
                >
                  Resend Verification Email
                </Button>
              )}

              <Button
                variant="subtle"
                color="gray"
                onClick={() => navigate('/login')}
              >
                Back to login
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}; 