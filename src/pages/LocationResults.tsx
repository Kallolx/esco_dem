import { useParams } from 'react-router-dom';
import { Container, Title, Text, Stack, Grid, Loader, Center, Box } from '@mantine/core';
import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';
import { EscortCard } from '../components/EscortCard';

export const LocationResults = () => {
  const { state, city } = useParams();
  const [escorts, setEscorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEscortsByLocation();
  }, [state, city]);

  const fetchEscortsByLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Format state and city for comparison
      const formattedState = state?.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      const formattedCity = city?.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');

      // Build query
      let query = supabase
        .from('ads')
        .select('*')
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())
        .eq('state', formattedState);

      if (formattedCity) {
        query = query.eq('city', formattedCity);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Format the data to match the EscortCard interface
      const formattedData = data?.map(escort => {
        console.log('Raw escort data:', {
          city: escort.city,
          state: escort.state,
          created_by: escort.created_by
        });
        
        return {
          id: escort.id,
          title: escort.title || 'Anonymous',
          city: escort.city,
          state: escort.state,
          images: escort.images || [],
          user_id: escort.created_by,
          description: escort.description || '',
          incall_hourly: escort.incall_hourly,
          incall_twohour: escort.incall_twohour,
          incall_overnight: escort.incall_overnight,
          outcall_hourly: escort.outcall_hourly,
          outcall_twohour: escort.outcall_twohour,
          outcall_overnight: escort.outcall_overnight
        };
      }) || [];

      setEscorts(formattedData);
    } catch (error) {
      console.error('Error fetching escorts:', error);
      setError('Failed to load escorts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const locationTitle = city 
    ? `Escorts in ${city}, ${state}` 
    : `Escorts in ${state}`;

  return (
    <Box pt={{ base: 80, sm: 120 }}>
      <Container size="xl">
        <Stack gap="xl">
          <Title order={2} style={{ color: 'white' }}>
            {locationTitle.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </Title>

          {loading ? (
            <Center>
              <Loader color="#ff4b6e" size="xl" />
            </Center>
          ) : error ? (
            <Text c="red">{error}</Text>
          ) : escorts.length === 0 ? (
            <Text c="dimmed">No escorts found in this location.</Text>
          ) : (
            <Grid>
              {escorts.map((escort) => (
                <Grid.Col key={escort.id} span={{ base: 12, sm: 6, md: 4 }}>
                  <EscortCard escort={escort} />
                </Grid.Col>
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </Box>
  );
}; 