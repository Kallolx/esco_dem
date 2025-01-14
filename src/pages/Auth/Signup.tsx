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
  Checkbox,
  Box,
} from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Determine the redirect URL based on environment
      const redirectUrl = window.location.hostname === 'localhost' 
        ? `${window.location.origin}/auth/callback`
        : 'https://escort-five.vercel.app/auth/callback';

      // Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
          }
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create user record
        const { error: userError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              name,
              email,
              created_at: new Date().toISOString(),
              last_login: new Date().toISOString()
            },
          ]);

        if (userError) throw userError;

        // Redirect to verification page
        navigate('/verify-email', { 
          state: { 
            email,
            message: 'Please check your email to verify your account.' 
          }
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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
          Create an account
        </Title>
        <Text c="dimmed" size="lg" ta="center" mt={5}>
          Join our platform today
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          <form onSubmit={handleSignup}>
            <Stack>
              <TextInput
                label="Name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

              <Checkbox
                label="I agree to the terms and conditions"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.currentTarget.checked)}
                styles={{
                  label: { color: 'white' },
                }}
              />

              {error && (
                <Text c="red" size="sm">
                  {error}
                </Text>
              )}
            </Stack>

            <Button 
              fullWidth 
              mt="xl" 
              loading={loading}
              type="submit"
              variant="gradient"
              gradient={{ from: '#ff4b6e', to: '#ff8f9c' }}
              size="lg"
            >
              Create account
            </Button>

            <Text c="dimmed" size="sm" ta="center" mt="xl">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#ff4b6e', textDecoration: 'none' }}>
                Sign in
              </Link>
            </Text>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};