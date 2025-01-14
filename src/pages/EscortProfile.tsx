import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Image,
  Text,
  Badge,
  Group,
  Paper,
  Stack,
  SimpleGrid,
  Button,
  Title,
  Divider,
  Tooltip,
  ActionIcon,
  Center,
  Loader,
  Box,
  Overlay,
} from '@mantine/core';
import {
  IconHeart,
  IconCrown,
  IconCheckbox,

  IconRuler,
  IconPhone,
  IconMail,
  IconClock,

  IconUser,
  IconChevronLeft,
  IconChevronRight,

  IconShare,

  IconLock,
  IconCheck,
  IconCopy
} from '@tabler/icons-react';
import { supabase } from '../lib/supabase';
import { CopyButton } from '@mantine/core';

export const EscortProfile = () => {
  const { id } = useParams();
  const [escort, setEscort] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  // Auto-rotate images
  useEffect(() => {
    if (!imageUrls.length || !isAutoRotating) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [imageUrls, isAutoRotating]);

  // Stop auto-rotation when user interacts
  const handleImageInteraction = () => {
    setIsAutoRotating(false);
    // Restart auto-rotation after 10 seconds of no interaction
    setTimeout(() => setIsAutoRotating(true), 10000);
  };

  useEffect(() => {
    // Check auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    fetchEscortData();
  }, [id]);

  const fetchEscortData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: escortData, error: escortError } = await supabase
        .from('ads')
        .select('*')
        .eq('id', id)
        .single();

      if (escortError) throw escortError;
      if (!escortData) throw new Error('Escort not found');

      // Just use the image URLs directly
      if (Array.isArray(escortData.images)) {
        // Extract just the filename from the full path
        const urls = escortData.images.map((url: string) => {
          try {
            // Get just the filename from the URL
            const parts = url.split('/');
            const filename = parts[parts.length - 1];
            // Construct a direct public URL
            return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/escort_images/${escortData.user_id}/${filename}`;
          } catch (err) {
            console.error('Error processing image URL:', err);
            return null;
          }
        }).filter(Boolean);

        setImageUrls(urls);
      }

      setEscort(escortData);
    } catch (err: any) {
      console.error('Error fetching escort data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    handleImageInteraction();
    if (imageUrls.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const previousImage = () => {
    handleImageInteraction();
    if (imageUrls.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  // Contact section component
  const ContactSection = () => {
    if (!user) {
      return (
        <Paper shadow="md" p="lg" radius="md" bg="rgba(0, 0, 0, 0.3)" withBorder style={{ position: 'relative' }}>
          <Overlay blur={3} center>
            <Stack align="center" gap="sm">
              <IconLock size={30} color="white" />
              <Text c="white" size="lg" fw={600} ta="center">Please login to view contact details</Text>
              <Button
                component={Link}
                to="/login"
                variant="gradient"
                gradient={{ from: '#ff4b6e', to: '#eb0036' }}
                radius="xl"
                size="md"
              >
                Login to View
              </Button>
            </Stack>
          </Overlay>
          <Stack gap="md" style={{ filter: 'blur(4px)' }}>
            <Title order={4} c="white">Contact Information</Title>
            <Divider />
            <Group>
              <ActionIcon variant="light" color="pink" size="lg">
                <IconPhone size={20} />
              </ActionIcon>
              <Text c="white" size="lg">XXX-XXX-XXXX</Text>
            </Group>
          </Stack>
        </Paper>
      );
    }

    return (
      <Paper shadow="md" p="lg" radius="md" bg="rgba(0, 0, 0, 0.3)" withBorder>
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Title order={4} c="white">Contact Information</Title>
            <Badge 
              variant="gradient" 
              gradient={{ from: 'green', to: 'teal' }}
              size="lg"
            >
              Available Now
            </Badge>
          </Group>
          <Divider />
          <SimpleGrid cols={1} spacing="md">
            {escort.phone && (
              <Paper p="md" radius="md" bg="rgba(255, 75, 110, 0.1)" withBorder>
                <Group>
                  <ActionIcon 
                    variant="gradient"
                    gradient={{ from: '#ff4b6e', to: '#eb0036' }}
                    size="xl"
                    radius="xl"
                  >
                    <IconPhone size={24} />
                  </ActionIcon>
                  <Stack gap={0} style={{ flex: 1 }}>
                    <Text size="sm" c="dimmed">Phone Number</Text>
                    <Text size="lg" fw={500} c="white">{escort.phone}</Text>
                  </Stack>
                  <CopyButton value={escort.phone} timeout={2000}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? "Copied!" : "Copy"}>
                        <ActionIcon
                          variant="gradient"
                          gradient={{ from: copied ? 'teal' : '#ff4b6e', to: copied ? 'green' : '#eb0036' }}
                          size="lg"
                          radius="xl"
                          onClick={copy}
                        >
                          {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </Group>
              </Paper>
            )}
            {escort.email && (
              <Paper p="md" radius="md" bg="rgba(255, 75, 110, 0.1)" withBorder>
                <Group wrap="nowrap" align="center">
                  <ActionIcon 
                    variant="gradient"
                    gradient={{ from: '#ff4b6e', to: '#eb0036' }}
                    size="xl"
                    radius="xl"
                  >
                    <IconMail size={24} />
                  </ActionIcon>
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text size="sm" c="dimmed" truncate>Email</Text>
                    <Text size="lg" fw={500} c="white" truncate>
                      {escort.email}
                    </Text>
                  </Box>
                  <CopyButton value={escort.email} timeout={2000}>
                    {({ copied, copy }) => (
                      <Tooltip label={copied ? "Copied!" : "Copy"}>
                        <ActionIcon
                          variant="gradient"
                          gradient={{ from: copied ? 'teal' : '#ff4b6e', to: copied ? 'green' : '#eb0036' }}
                          size="lg"
                          radius="xl"
                          onClick={copy}
                        >
                          {copied ? <IconCheck size={18} /> : <IconCopy size={18} />}
                        </ActionIcon>
                      </Tooltip>
                    )}
                  </CopyButton>
                </Group>
              </Paper>
            )}
          </SimpleGrid>
        </Stack>
      </Paper>
    );
  };

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader color="#ff4b6e" size="xl" />
      </Center>
    );
  }

  if (error || !escort) {
    return (
      <Container size="md" style={{ paddingTop: '120px' }}>
        <Paper p="xl" bg="rgba(0, 0, 0, 0.3)">
          <Text c="red" ta="center">{error || 'Failed to load escort profile'}</Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Box style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: '#1A1B1E' }}>
      <Container size="xl">
        <Grid gutter="xl">
          {/* Left Column - Images and Contact */}
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack gap="lg">
              {/* Main Image */}
              <Paper 
                shadow="md" 
                radius="md" 
                style={{ position: 'relative', overflow: 'hidden' }}
                onMouseEnter={() => handleImageInteraction()}
                onClick={() => handleImageInteraction()}
              >
                <Box style={{ position: 'relative' }}>
                  <Image
                    src={imageUrls[currentImageIndex] || '/placeholder.jpg'}
                    height={500}
                    style={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      objectFit: 'contain'
                    }}
                    fit="contain"
                    radius="md"
                    alt={escort.title || 'Escort image'}
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.jpg';
                    }}
                  />
                  
                  {imageUrls.length > 1 && (
                    <>
                      <ActionIcon
                        variant="filled"
                        color="dark"
                        size="xl"
                        style={{
                          position: 'absolute',
                          left: 10,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          opacity: 0.7
                        }}
                        onClick={previousImage}
                      >
                        <IconChevronLeft size={24} />
                      </ActionIcon>
                      <ActionIcon
                        variant="filled"
                        color="dark"
                        size="xl"
                        style={{
                          position: 'absolute',
                          right: 10,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          opacity: 0.7
                        }}
                        onClick={nextImage}
                      >
                        <IconChevronRight size={24} />
                      </ActionIcon>
                    </>
                  )}
                </Box>

                <Group 
                  style={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10,
                    gap: '8px'
                  }}
                >
                  {escort.is_featured && (
                    <Tooltip label="VIP Model">
                      <Badge
                        leftSection={<IconCrown size={14} />}
                        size="lg"
                        style={{
                          backgroundColor: '#ff4b6e',
                          color: 'white'
                        }}
                      >
                        VIP
                      </Badge>
                    </Tooltip>
                  )}
                  <Tooltip label="Verified">
                    <Badge
                      leftSection={<IconCheckbox size={14} />}
                      size="lg"
                      variant="outline"
                      color="blue"
                    >
                      Verified
                    </Badge>
                  </Tooltip>
                </Group>
                
                <Group
                  style={{ 
                    position: 'absolute', 
                    bottom: 10, 
                    right: 10,
                    gap: '8px'
                  }}
                >
                  <ActionIcon variant="filled" color="dark" size="lg">
                    <IconShare size={18} />
                  </ActionIcon>
                  <ActionIcon
                    variant="filled"
                    color="red"
                    size="lg"
                    style={{ 
                      backgroundColor: 'rgba(255, 75, 110, 0.9)'
                    }}
                  >
                    <IconHeart size={18} />
                  </ActionIcon>
                </Group>
              </Paper>

              {/* Thumbnail Images */}
              {imageUrls.length > 1 && (
                <SimpleGrid cols={{ base: 4, sm: 4 }} spacing={{ base: 'xs', sm: 'sm' }}>
                  {imageUrls.map((imageUrl, index) => (
                    <Paper
                      key={`thumb-${imageUrl}`}
                      shadow="sm"
                      style={{
                        cursor: 'pointer',
                        border: currentImageIndex === index ? '2px solid #ff4b6e' : '1px solid transparent',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        height: 80,
                        position: 'relative',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Image
                        src={imageUrl}
                        height={80}
                        fit="cover"
                        style={{
                          width: '100%',
                          display: 'block'
                        }}
                        fallbackSrc="/placeholder.jpg"
                      />
                      {loading && (
                        <Center 
                          style={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          <Loader size="sm" color="#ff4b6e" />
                        </Center>
                      )}
                    </Paper>
                  ))}
                </SimpleGrid>
              )}

              {/* Contact Information */}
              <ContactSection />
            </Stack>
          </Grid.Col>

          {/* Right Column - Details */}
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack gap="lg">
              {/* Basic Info */}
              <Paper shadow="md" p="lg" radius="md" bg="rgba(0, 0, 0, 0.3)" withBorder>
                <Stack gap="md">
                  <Group justify="space-between" align="center" wrap="nowrap">
                    <Title order={2} c="white">{escort.title}</Title>
                    <Badge size="xl" variant="filled" style={{ backgroundColor: '#ff4b6e' }}>
                      Available
                    </Badge>
                  </Group>
                  <Text size="lg" c="dimmed" style={{ whiteSpace: 'pre-line' }}>
                    {escort.description}
                  </Text>
                </Stack>
              </Paper>

              {/* Stats */}
              <Paper shadow="md" p="lg" radius="md" bg="rgba(0, 0, 0, 0.3)" withBorder>
                <Stack gap="md">
                  <Title order={4} c="white">Physical Details</Title>
                  <Divider />
                  <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
                    {escort.height && (
                      <Group>
                        <ActionIcon variant="light" color="pink" size="lg">
                          <IconRuler size={20} />
                        </ActionIcon>
                        <Text c="white" size="lg">Height: {escort.height}</Text>
                      </Group>
                    )}
                    {escort.measurements && (
                      <Group>
                        <ActionIcon variant="light" color="pink" size="lg">
                          <IconUser size={20} />
                        </ActionIcon>
                        <Text c="white" size="lg">Measurements: {escort.measurements}</Text>
                      </Group>
                    )}
                    {escort.ethnicity && (
                      <Group>
                        <ActionIcon variant="light" color="pink" size="lg">
                          <IconUser size={20} />
                        </ActionIcon>
                        <Text c="white" size="lg">Ethnicity: {escort.ethnicity}</Text>
                      </Group>
                    )}
                    {escort.hair_color && (
                      <Group>
                        <ActionIcon variant="light" color="pink" size="lg">
                          <IconUser size={20} />
                        </ActionIcon>
                        <Text c="white" size="lg">Hair: {escort.hair_color}</Text>
                      </Group>
                    )}
                    {escort.eye_color && (
                      <Group>
                        <ActionIcon variant="light" color="pink" size="lg">
                          <IconUser size={20} />
                        </ActionIcon>
                        <Text c="white" size="lg">Eyes: {escort.eye_color}</Text>
                      </Group>
                    )}
                  </SimpleGrid>
                </Stack>
              </Paper>

              {/* Rates */}
              <Paper shadow="md" p="lg" radius="md" bg="rgba(0, 0, 0, 0.3)" withBorder>
                <Stack gap="md">
                  <Title order={4} c="white">Rates</Title>
                  <Divider />
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <Stack gap="md">
                      <Title order={5} c="white">Incall</Title>
                      {escort.incall_hourly && (
                        <Group>
                          <ActionIcon variant="light" color="pink" size="lg">
                            <IconClock size={20} />
                          </ActionIcon>
                          <Text c="white" size="lg">1 Hour: ${escort.incall_hourly}</Text>
                        </Group>
                      )}
                      {escort.incall_twohour && (
                        <Group>
                          <ActionIcon variant="light" color="pink" size="lg">
                            <IconClock size={20} />
                          </ActionIcon>
                          <Text c="white" size="lg">2 Hours: ${escort.incall_twohour}</Text>
                        </Group>
                      )}
                      {escort.incall_overnite && (
                        <Group>
                          <ActionIcon variant="light" color="pink" size="lg">
                            <IconClock size={20} />
                          </ActionIcon>
                          <Text c="white" size="lg">Overnight: ${escort.incall_overnite}</Text>
                        </Group>
                      )}
                    </Stack>
                    <Stack gap="md">
                      <Title order={5} c="white">Outcall</Title>
                      {escort.outcall_hourly && (
                        <Group>
                          <ActionIcon variant="light" color="pink" size="lg">
                            <IconClock size={20} />
                          </ActionIcon>
                          <Text c="white" size="lg">1 Hour: ${escort.outcall_hourly}</Text>
                        </Group>
                      )}
                      {escort.outcall_twohour && (
                        <Group>
                          <ActionIcon variant="light" color="pink" size="lg">
                            <IconClock size={20} />
                          </ActionIcon>
                          <Text c="white" size="lg">2 Hours: ${escort.outcall_twohour}</Text>
                        </Group>
                      )}
                      {escort.outcall_overnite && (
                        <Group>
                          <ActionIcon variant="light" color="pink" size="lg">
                            <IconClock size={20} />
                          </ActionIcon>
                          <Text c="white" size="lg">Overnight: ${escort.outcall_overnite}</Text>
                        </Group>
                      )}
                    </Stack>
                  </SimpleGrid>
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}; 