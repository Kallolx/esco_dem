import React, { useState } from 'react';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
  Stack,
  Group,
  Box,
  Divider,
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { IconBrandGoogle } from '@tabler/icons-react';
import { supabase } from '../../lib/supabase';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      if (data.user) {
        // Update last login timestamp
        const { error: updateError } = await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);

        if (updateError) {
          console.error('Failed to update last login:', updateError);
        }

        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

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
        <Title ta="center" style={{ color: 'white', fontSize: '2.5rem' }}>
          Welcome back!
        </Title>
        <Text c="dimmed" size="lg" ta="center" mt={5}>
          Sign in to your account
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <Button
            fullWidth
            leftSection={<IconBrandGoogle size={20} />}
            variant="outline"
            color="gray"
            disabled
            styles={{
              root: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }
              }
            }}
          >
            Continue with Google (Coming Soon)
          </Button>

          <Divider 
            label="Or continue with email" 
            labelPosition="center"
            my="lg"
            styles={{
              label: {
                color: 'white',
                backgroundColor: 'transparent'
              },
              root: {
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          />

          <form onSubmit={handleLogin}>
            <Stack>
              <TextInput
                label="Email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                styles={{
                  input: {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                  },
                  label: {
                    color: 'white',
                  },
                }}
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                styles={{
                  input: {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                  },
                  label: {
                    color: 'white',
                  },
                }}
              />

              {error && (
                <Text c="red" size="sm">
                  {error}
                </Text>
              )}

              <Group justify="flex-end" mt="md">
                <Link to="/forgot-password" style={{ color: '#ff4b6e', textDecoration: 'none', fontSize: '14px' }}>
                  Forgot password?
                </Link>
              </Group>

              <Button 
                fullWidth 
                mt="xl" 
                loading={loading}
                type="submit"
                variant="gradient"
                gradient={{ from: '#ff4b6e', to: '#ff8f9c' }}
                size="lg"
              >
                Sign in
              </Button>
            </Stack>
          </form>

          <Divider 
            label="New to our platform?" 
            labelPosition="center" 
            mt="xl"
            styles={{
              label: {
                color: 'white',
                fontSize: '1rem',
                backgroundColor: 'transparent'
              },
              root: {
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          />

          <Button
            component={Link}
            to="/signup"
            fullWidth
            variant="outline"
            color="gray"
            mt="md"
            size="lg"
            styles={{
              root: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }
              }
            }}
          >
            Create a new account
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}; 