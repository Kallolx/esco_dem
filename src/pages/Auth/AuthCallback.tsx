import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Parse the URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Check for error first
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');
        const errorCode = hashParams.get('error_code');

        if (error) {
          if (errorCode === 'otp_expired') {
            navigate('/verify-email', {
              state: {
                error: 'Your verification link has expired. Please request a new one.',
                showResendButton: true
              }
            });
            return;
          }
          throw new Error(errorDescription || 'Authentication failed');
        }

        // Get all the tokens and parameters
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const expiresIn = hashParams.get('expires_in');
        const expiresAt = hashParams.get('expires_at');
        const tokenType = hashParams.get('token_type');
        const type = hashParams.get('type');

        console.log('Auth callback parameters:', {
          accessToken: accessToken?.substring(0, 10) + '...',
          refreshToken: refreshToken?.substring(0, 10) + '...',
          expiresIn,
          expiresAt,
          tokenType,
          type
        });

        if (!accessToken || !refreshToken) {
          throw new Error('No authentication tokens found');
        }

        // Set the session with all parameters
        const { data: { session }, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (sessionError) {
          console.error('Session error:', sessionError);
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
          navigate('/', { replace: true });
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