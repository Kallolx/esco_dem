import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Button, SimpleGrid, Paper, Text, Box, Title, Menu, Group, Center, Loader, Alert} from '@mantine/core';
import { 
  IconMap2, 
  IconChevronRight, 
  IconWorld, 
  IconMap,
  IconChevronDown,
  IconCheckbox
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { statesData, StateData } from '../data/statesData';
import { EscortCard } from '../components/EscortCard';
import { supabase } from '../lib/supabase';


// CSS for animations and global styles
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

  .switch-button {
    font-family: 'Poppins', sans-serif;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid #FFD700;
    color: #FFD700;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
  }

  .switch-button:hover {
    background: #FFD700;
    color: black;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
  }

  .state-button {
    font-family: 'Poppins', sans-serif;
    font-weight: 500;
  }

  .city-button {
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

// Extracted StateButton component
const StateButton = React.memo(({ 
  state, 
  isSelected, 
  onClick, 
  cities,
  onCityClick 
}: { 
  state: string; 
  isSelected: boolean; 
  onClick: () => void; 
  cities: string[];
  onCityClick: (city: string) => void;
}) => (
  <div style={{ position: 'relative' }}>
    <button
      className="state-button"
      onClick={onClick}
      style={{
        width: '100%',
        padding: '12px',
        backgroundColor: isSelected ? '#ff4b6e' : 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        marginBottom: isSelected ? '8px' : '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isSelected ? 'white' : '#ff4b6e',
          transition: 'all 0.2s ease'
        }} />
        <span style={{ textAlign: 'left' }}>{state}</span>
      </span>
      {cities.length > 0 && (
        <IconChevronRight
          size={16}
          style={{
            transform: isSelected ? 'rotate(90deg)' : 'none',
            transition: 'transform 0.2s ease'
          }}
        />
      )}
    </button>
    {isSelected && (
      <div style={{ 
        position: 'absolute', 
        top: '100%', 
        left: 0, 
        right: 0, 
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: '8px',
        padding: '8px',
        zIndex: 10,
        border: '1px solid rgba(255, 255, 255, 0.1)',
        animation: 'slideDown 0.2s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
      }}>
        {cities.map((city) => (
          <Button
            key={city}
            className="city-button"
            variant="subtle"
            leftSection={
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#ff4b6e'
              }} />
            }
            fullWidth
            onClick={() => onCityClick(city)}
            mb={4}
            styles={{
              root: {
                color: 'white',
                textAlign: 'left',
                '&:hover': {
                  backgroundColor: 'rgba(255, 75, 110, 0.2)'
                }
              },
              inner: {
                justifyContent: 'flex-start'
              }
            }}
          >
            {city}
          </Button>
        ))}
      </div>
    )}
  </div>
));

// Custom hook for mobile detection
const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};


export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'directory' | 'map'>('directory');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [_selectedCity, setSelectedCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifiedEscorts, setVerifiedEscorts] = useState<any[]>([]);
  const isMobile = useMobileDetection();
  const [_cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    fetchActiveAds();
  }, []);

  const fetchActiveAds = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Format the data to match the EscortCard interface
      const formattedData = data?.map(escort => ({
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
      })) || [];

      setVerifiedEscorts(formattedData);
    } catch (error) {
      console.error('Error fetching ads:', error);
      setError('Failed to load ads. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered states
  const filteredStates = useMemo(() => {
    return statesData;
  }, []);

  // Memoized handlers
  const handleStateClick = useCallback((stateName: string) => {
    setSelectedState(prevState => prevState === stateName ? null : stateName);
    setSelectedCity(null);
  }, []);

  const handleCityClick = useCallback((city: string) => {
    if (selectedState) {
      setSelectedCity(city);
      const formattedState = selectedState.toLowerCase().replace(/\s+/g, '-');
      const formattedCity = city.toLowerCase().replace(/\s+/g, '-');
      navigate(`/location/${formattedState}/${formattedCity}`, { replace: true });
    }
  }, [selectedState, navigate]);

  const toggleView = useCallback(() => {
    setViewMode(current => current === 'directory' ? 'map' : 'directory');
  }, []);

  const renderEscortCard = (escort: any) => {
    console.log('Rendering escort card:', {
      id: escort.id,
      title: escort.title,
      images: escort.images,
      city: escort.city,
      state: escort.state,
      rates: {
        incall_hourly: escort.incall_hourly,
        incall_twohour: escort.incall_twohour,
        incall_overnight: escort.incall_overnight,
        outcall_hourly: escort.outcall_hourly,
        outcall_twohour: escort.outcall_twohour,
        outcall_overnight: escort.outcall_overnight
      }
    });
    
    return (
      <div key={escort.id} style={{ width: '100%', maxWidth: 350 }}>
        <EscortCard
          escort={{
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
          }}
        />
      </div>
    );
  };

  // Update cities when state changes
  useEffect(() => {
    if (selectedState) {
      const stateData = statesData.find(state => state.name === selectedState);
      setCities(stateData?.cities || []);
    } else {
      setCities([]);
    }
  }, [selectedState]);


  return (
    <Box 
      pt={{ base: 80, sm: 120 }}
      style={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('/images/hero.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <Container size="xl">
        <Box>
          <Group justify="space-between" align="center" mb="md">
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button
                  variant="filled"
                  style={{
                    backgroundColor: '#ff4b6e',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 500
                  }}
                  rightSection={<IconChevronDown size={16} />}
                  leftSection={<IconWorld size={18} />}
                >
                  United States
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  disabled
                  rightSection={
                    <Text size="xs" c="dimmed" style={{ backgroundColor: '#ff4b6e20', padding: '2px 6px', borderRadius: '4px' }}>Soon</Text>
                  }
                >
                  Canada
                </Menu.Item>
                <Menu.Item
                  disabled
                  rightSection={
                    <Text size="xs" c="dimmed" style={{ backgroundColor: '#ff4b6e20', padding: '2px 6px', borderRadius: '4px' }}>Soon</Text>
                  }
                >
                  Europe
                </Menu.Item>
                <Menu.Item
                  disabled
                  rightSection={
                    <Text size="xs" c="dimmed" style={{ backgroundColor: '#ff4b6e20', padding: '2px 6px', borderRadius: '4px' }}>Soon</Text>
                  }
                >
                  France
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <button
              className="switch-button"
              onClick={toggleView}
              style={{
                backgroundColor: viewMode === 'directory' ? 'rgba(255, 75, 110, 0.1)' : 'rgba(0, 0, 0, 0.3)',
                borderColor: '#ff4b6e',
                color: '#ff4b6e',
                padding: '8px 16px'
              }}
            >
              {viewMode === 'directory' ? (
                <>
                  <IconMap2 size={18} />
                  MAP VIEW
                </>
              ) : (
                <>
                  <IconWorld size={18} />
                  DIRECTORY
                </>
              )}
            </button>
          </Group>

          {viewMode === 'directory' ? (
            <>
              <SimpleGrid cols={isMobile ? 2 : { base: 2, sm: 3, md: 4, lg: 6 }} spacing={12}>
                {filteredStates.map((state: StateData) => (
                  <StateButton
                    key={state.name}
                    state={state.name}
                    isSelected={selectedState === state.name}
                    onClick={() => handleStateClick(state.name)}
                    cities={state.cities}
                    onCityClick={handleCityClick}
                  />
                ))}
              </SimpleGrid>

              <Box mt={40}>
                <Group justify="space-between" mb="lg">
                  <Title 
                    order={3} 
                    style={{ 
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <IconCheckbox size={24} style={{ color: '#ff4b6e' }} />
                    Verified Escorts
                  </Title>
                  <Button
                    variant="subtle"
                    color="gray"
                    rightSection={<IconChevronRight size={16} />}
                  >
                    View All
                  </Button>
                </Group>
                {loading ? (
                  <Center>
                    <Loader color="#ff4b6e" size="xl" />
                  </Center>
                ) : error ? (
                  <Alert color="red" title="Error">
                    {error}
                  </Alert>
                ) : verifiedEscorts.length === 0 ? (
                  <Text c="dimmed">No active ads found</Text>
                ) : (
                  <SimpleGrid
                    cols={{ base: 1, sm: 2, md: 3 }}
                    spacing="lg"
                    verticalSpacing="xl"
                  >
                    {verifiedEscorts.map(renderEscortCard)}
                  </SimpleGrid>
                )}
              </Box>
            </>
          ) : (
            <Paper 
              style={{ 
                textAlign: 'center', 
                padding: '20px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              <IconMap size={32} style={{ color: '#ff4b6e', marginBottom: '8px' }} />
              <Text size="lg" c="dimmed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Interactive Map Coming Soon! 🗺️
              </Text>
              <Text size="sm" c="dimmed" mt="xs" style={{ fontFamily: 'Poppins, sans-serif' }}>
                We're working on an interactive map to make location selection even easier. ✨
              </Text>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 
