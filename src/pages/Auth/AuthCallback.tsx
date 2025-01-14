import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current URL hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get('type');
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (!accessToken || !refreshToken) {
          console.error('No tokens found in URL');
          navigate('/login', {
            state: { error: 'Authentication failed. Please try again.' },
            replace: true
          });
          return;
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

          // Redirect based on the callback type
          if (type === 'signup') {
            navigate('/', { replace: true });
          } else {
            // For other types, redirect to the previous page or home
            const returnTo = sessionStorage.getItem('returnTo') || '/';
            sessionStorage.removeItem('returnTo');
            navigate(returnTo, { replace: true });
          }
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/login', {
          state: {
            error: 'Authentication failed. Please try again or contact support.'
          },
          replace: true
        });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return null;
}; 