import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the current URL
    const url = window.location.href;
    console.log('Current URL:', url);

    const handleAuthCallback = async () => {
      try {
        // Get the current hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get('type');

        // If this is a signup confirmation
        if (type === 'signup') {
          // Get the access token and refresh token
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');

          if (!accessToken || !refreshToken) {
            throw new Error('No tokens found in URL');
          }

          // Set the session
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            throw error;
          }

          if (data.session) {
            // Update user's last login
            await supabase
              .from('users')
              .update({ last_login: new Date().toISOString() })
              .eq('id', data.session.user.id);

            // Redirect to home page
            window.location.href = '/';
            return;
          }
        }

        // For other types of callbacks or if something went wrong
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Error in auth callback:', error);
        // Redirect to login on error
        navigate('/login', {
          state: {
            error: 'Failed to verify email. Please try again or contact support.'
          },
          replace: true
        });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return null;
}; 