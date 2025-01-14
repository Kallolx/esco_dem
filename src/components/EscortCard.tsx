import { Card, Image, Text, Stack, Button, Group, Badge } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconMapPin } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface EscortCardProps {
  escort: {
    id: string;
    title: string;
    city: string;
    state: string;
    images: string[];
    user_id: string;
    description: string;
    incall_hourly: number | null;
    incall_twohour: number | null;
    incall_overnight: number | null;
    outcall_hourly: number | null;
    outcall_twohour: number | null;
    outcall_overnight: number | null;
  };
}

export const EscortCard = ({ escort }: EscortCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      if (!escort.images || escort.images.length === 0) return;

      try {
        const urls = await Promise.all(
          escort.images.map(async (imageName) => {
            if (imageName.startsWith('http')) return imageName;

            const storagePath = `${escort.user_id}/${imageName}`;
            const { data } = supabase.storage
              .from('escort_images')
              .getPublicUrl(storagePath);

            return data.publicUrl;
          })
        );

        setImageUrls(urls.filter(url => url));
      } catch (error) {
        console.error('Error fetching image URLs:', error);
      }
    };

    fetchImageUrls();
  }, [escort.images, escort.user_id]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (imageUrls.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % imageUrls.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (imageUrls.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
    }
  };

  return (
    <Card 
      component={Link}
      to={`/escort/${escort.id}`}
      shadow="sm" 
      padding={0} 
      radius="md"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit'
      }}
    >
      <div style={{ position: 'relative' }}>
        <Image
          src={imageUrls[currentImageIndex] || '/placeholder.jpg'}
          height={400}
          alt={escort.title}
          style={{ objectFit: 'cover' }}
        />
        {imageUrls.length > 1 && (
          <>
            <Button
              variant="subtle"
              size="sm"
              style={{
                position: 'absolute',
                left: 5,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                padding: '4px',
                minWidth: 'unset',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)'
                }
              }}
              onClick={prevImage}
            >
              <IconChevronLeft size={20} />
            </Button>
            <Button
              variant="subtle"
              size="sm"
              style={{
                position: 'absolute',
                right: 5,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                padding: '4px',
                minWidth: 'unset',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)'
                }
              }}
              onClick={nextImage}
            >
              <IconChevronRight size={20} />
            </Button>
          </>
        )}
      </div>

      <Stack p="md" gap="xs">
        <Text 
          size="lg" 
          fw={500}
          style={{
            wordBreak: 'break-word',
            lineHeight: 1.2
          }}
          lineClamp={2}
        >
          {escort.title}
        </Text>

        {/* Location */}
        {(escort.city || escort.state) && (
          <Group align="center" gap="xs">
            <IconMapPin size={16} style={{ color: '#ff4b6e' }} />
            <Text 
              size="sm" 
              c="dimmed"
              style={{
                wordBreak: 'break-word',
                lineHeight: 1.2
              }}
            >
              {escort.city && escort.state 
                ? `${escort.city}, ${escort.state}`
                : escort.city || escort.state}
            </Text>
          </Group>
        )}

        <Text 
          size="sm" 
          lineClamp={2}
          style={{ 
            fontStyle: 'italic',
            color: 'rgba(255, 255, 255, 0.7)',
            wordBreak: 'break-word',
            lineHeight: 1.4,
            maxHeight: '2.8em',
            overflow: 'hidden'
          }}
        >
          "{escort.description || 'No description available'}"
        </Text>

        {/* Rates Section */}
        <Stack gap={4}>
          {/* Incall Rates */}
          {(escort.incall_hourly || escort.incall_twohour || escort.incall_overnight) && (
            <>
              <Text size="sm" fw={500} c="dimmed">Incall:</Text>
              <Group gap={8}>
                {escort.incall_hourly && (
                  <Badge
                    variant="filled"
                    size="sm"
                    styles={{
                      root: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    1hr: £{escort.incall_hourly}
                  </Badge>
                )}
                {escort.incall_twohour && (
                  <Badge
                    variant="filled"
                    size="sm"
                    styles={{
                      root: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    2hrs: £{escort.incall_twohour}
                  </Badge>
                )}
                {escort.incall_overnight && (
                  <Badge
                    variant="filled"
                    size="sm"
                    styles={{
                      root: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Overnight: £{escort.incall_overnight}
                  </Badge>
                )}
              </Group>
            </>
          )}

          {/* Outcall Rates */}
          {(escort.outcall_hourly || escort.outcall_twohour || escort.outcall_overnight) && (
            <>
              <Text size="sm" fw={500} c="dimmed">Outcall:</Text>
              <Group gap={8}>
                {escort.outcall_hourly && (
                  <Badge
                    variant="filled"
                    size="sm"
                    styles={{
                      root: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    1hr: £{escort.outcall_hourly}
                  </Badge>
                )}
                {escort.outcall_twohour && (
                  <Badge
                    variant="filled"
                    size="sm"
                    styles={{
                      root: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    2hrs: £{escort.outcall_twohour}
                  </Badge>
                )}
                {escort.outcall_overnight && (
                  <Badge
                    variant="filled"
                    size="sm"
                    styles={{
                      root: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    Overnight: £{escort.outcall_overnight}
                  </Badge>
                )}
              </Group>
            </>
          )}
        </Stack>

        <Button
          variant="gradient"
          gradient={{ from: '#ff4b6e', to: '#ff8f9c' }}
          fullWidth
          mt="sm"
        >
          View Details
        </Button>
      </Stack>
    </Card>
  );
}; 