import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error parameters in the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        const errorCode = hashParams.get('error_code');

        if (error) {
          // Handle expired link case
          if (errorCode === 'otp_expired') {
            navigate('/verify-email', {
              state: {
                error: 'Your verification link has expired. Please request a new one.',
                showResendButton: true
              }
            });
            return;
          }

          // Handle other errors
          throw new Error(errorDescription || 'Authentication failed');
        }

        // Handle successful verification
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (!accessToken || !refreshToken) {
          throw new Error('No authentication tokens found');
        }

        // Set the session
        const { data: { session }, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (sessionError) {
          throw sessionError;
        }

        if (session?.user) {
          // Update last login timestamp
          const { error: updateError } = await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', session.user.id);

          if (updateError) {
            console.error('Failed to update last login:', updateError);
          }

          // Redirect to home on success
          navigate('/');
        } else {
          throw new Error('No user session found');
        }
      } catch (error) {
        console.error('Error during auth callback:', error);
        navigate('/login', {
          state: {
            error: error instanceof Error ? error.message : 'Authentication failed'
          }
        });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return null;
}; 