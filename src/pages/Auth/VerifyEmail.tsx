import { Container, Title, Text, Button, Paper, Stack, Box } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconMail } from '@tabler/icons-react';

export const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const message = location.state?.message;

  if (!email) {
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
            <IconMail size={50} style={{ color: '#ff4b6e' }} />
            
            <Title order={2} ta="center" style={{ color: 'white' }}>
              Check your email
            </Title>
            
            <Text c="dimmed" size="sm" ta="center">
              We've sent a verification link to <br />
              <Text span fw={500} c="white">
                {email}
              </Text>
            </Text>

            <Text c="dimmed" size="sm" ta="center">
              {message || 'Click the link in the email to verify your account.'}
            </Text>

            <Button
              variant="subtle"
              color="gray"
              onClick={() => navigate('/login')}
              mt="md"
            >
              Back to login
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}; 