import React, { useState, useEffect } from 'react';
import { Container, Title, Grid, Card, Image, Text, Badge, Group, Button, Loader } from '@mantine/core';
import { useParams, useNavigate } from 'react-router-dom';

interface Model {
  id: number;
  name: string;
  description: string;
  image: string;
  location: string;
  isVip: boolean;
  viewProfileUrl: string;
}

const LocationModels: React.FC = () => {
  const { state, city } = useParams();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!state || !city) {
      navigate('/');
      return;
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [state, city, navigate]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        setLoading(true);
        const formattedLocation = `${state}-${city}`.toLowerCase();
        const response = await fetch(`http://localhost:5000/api/models/${formattedLocation}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch models');
        }
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch models');
        }
        
        setModels(data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching models:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch models');
        setModels([]);
      } finally {
        setLoading(false);
      }
    };

    if (state && city) {
      fetchModels();
    }
  }, [state, city]);

  const formattedState = state?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  const formattedCity = city?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  if (!state || !city) return null;

  if (loading) {
    return (
      <div style={{ 
        paddingTop: isMobile ? '80px' : '120px',
        minHeight: '100vh',
        backgroundColor: '#1A1B1E',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Loader color="pink" size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        paddingTop: isMobile ? '80px' : '120px',
        minHeight: '100vh',
        backgroundColor: '#1A1B1E',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text c="red" size="xl">{error}</Text>
      </div>
    );
  }

  return (
    <div style={{ 
      paddingTop: isMobile ? '80px' : '120px',
      minHeight: '100vh',
      backgroundColor: '#1A1B1E'
    }}>
      <Container size="xl" py={isMobile ? 'xs' : 'xl'}>
        <Title order={2} mb={isMobile ? 'md' : 'xl'} c="white" size={isMobile ? 'h3' : 'h2'}>
          Models in {formattedCity}, {formattedState}
        </Title>
        
        <Grid gutter={isMobile ? 'xs' : 'md'}>
          {models.map((model) => (
            <Grid.Col key={model.id} span={{ base: 6, sm: 4, md: 3 }}>
              <Card
                padding={isMobile ? 'sm' : 'lg'}
                radius="md"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Card.Section>
                  <div style={{ position: 'relative' }}>
                    <Image
                      src={model.image}
                      height={isMobile ? 200 : 280}
                      alt={model.name}
                    />
                    {model.isVip && (
                      <Badge
                        color="pink"
                        variant="filled"
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          backgroundColor: '#ff4b6e'
                        }}
                      >
                        VIP
                      </Badge>
                    )}
                  </div>
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500} c="white" size={isMobile ? 'sm' : 'md'}>{model.name}</Text>
                </Group>

                <Text size={isMobile ? 'xs' : 'sm'} c="dimmed" mb="md" lineClamp={2}>
                  {model.description}
                </Text>

                <Text size={isMobile ? 'xs' : 'sm'} c="dimmed" mb="md">
                  {model.location}
                </Text>

                <Button
                  fullWidth
                  variant="gradient"
                  gradient={{ from: '#ff4b6e', to: '#ff8f9c' }}
                  size={isMobile ? 'sm' : 'md'}
                  mt="auto"
                  component="a"
                  href={model.viewProfileUrl}
                  target="_blank"
                >
                  View Profile
                </Button>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default LocationModels; 