import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
  Text,
  FileInput,
  SimpleGrid,
  Image,
  Select,
  Stepper,
  Alert,
  ActionIcon
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { IconUpload, IconAlertCircle, IconCheck, IconX } from '@tabler/icons-react';
import { supabase } from '../lib/supabase';
import { statesData } from '../data/statesData';
import { notifications } from '@mantine/notifications';

const INITIAL_AD_DAYS = 3; // Initial visibility period for new ads

export const PostAd = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>('');
  const [user, setUser] = useState<any>(null);
  const [localImages, setLocalImages] = useState<{ file: File; preview: string }[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    age: '',
    state: '',
    city: '',
    phone: '',
    email: '',
    images: [] as string[],
    rates: {
      incall: {
        hourly: '',
        twohour: '',
        overnight: ''
      },
      outcall: {
        hourly: '',
        twohour: '',
        overnight: ''
      }
    },
    stats: {
      height: '',
      measurements: '',
      ethnicity: '',
      hairColor: '',
      eyeColor: ''
    }
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      setUser(user);
    } catch (error) {
      console.error('Error checking auth:', error);
      navigate('/login');
    }
  };

  const handleImageChange = (files: File[] | null) => {
    if (!files) return;
    
    // Create preview URLs for new files
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setLocalImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setLocalImages(prev => {
      const newImages = [...prev];
      // Revoke the URL to prevent memory leaks
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleImageUpload = async (files: File[] | null = null) => {
    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const uploadedUrls: string[] = [];
      const imagesToUpload = files || localImages.map(img => img.file);
      
      for (const file of imagesToUpload) {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Maximum size is 10MB`);
        }

        // Generate a unique filename with timestamp and random string
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const fileExt = file.name.split('.').pop();
        const fileName = `${timestamp}_${randomString}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // Upload with retries
        let uploadAttempts = 0;
        const maxAttempts = 3;
        let uploadError = null;

        while (uploadAttempts < maxAttempts) {
          const { error: uploadErr } = await supabase.storage
            .from('escort_images')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true // Changed to true to handle re-uploads
            });

          if (!uploadErr) {
            // Get the public URL
            const { data: { publicUrl } } = supabase.storage
              .from('escort_images')
              .getPublicUrl(filePath);

            uploadedUrls.push(publicUrl);
            break;
          }

          uploadError = uploadErr;
          uploadAttempts++;
          
          if (uploadAttempts < maxAttempts) {
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, uploadAttempts)));
          }
        }

        if (uploadAttempts === maxAttempts) {
          console.error('Upload error after retries:', uploadError);
          throw new Error(`Failed to upload ${file.name} after multiple attempts. Please try again.`);
        }
      }

      if (uploadedUrls.length === 0) {
        throw new Error('No images were successfully uploaded');
      }

      return uploadedUrls;
    } catch (error: any) {
      console.error('Error in handleImageUpload:', error);
      setError(error.message || 'Failed to upload images. Please try again.');
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Upload images first
      const uploadedUrls = await handleImageUpload();
      if (!uploadedUrls || uploadedUrls.length < 3) {
        throw new Error('Failed to upload minimum required images');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const adData = {
        user_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: 'active',
        is_featured: false,
        expires_at: new Date(Date.now() + INITIAL_AD_DAYS * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        age: formData.age ? parseInt(formData.age) : null,
        incall_hourly: formData.rates.incall.hourly ? parseInt(formData.rates.incall.hourly) : null,
        incall_twohour: formData.rates.incall.twohour ? parseInt(formData.rates.incall.twohour) : null,
        incall_overnight: formData.rates.incall.overnight ? parseInt(formData.rates.incall.overnight) : null,
        outcall_hourly: formData.rates.outcall.hourly ? parseInt(formData.rates.outcall.hourly) : null,
        outcall_twohour: formData.rates.outcall.twohour ? parseInt(formData.rates.outcall.twohour) : null,
        outcall_overnight: formData.rates.outcall.overnight ? parseInt(formData.rates.outcall.overnight) : null,
        height: formData.stats.height || null,
        measurements: formData.stats.measurements || null,
        ethnicity: formData.stats.ethnicity || null,
        hair_color: formData.stats.hairColor || null,
        eye_color: formData.stats.eyeColor || null,
        phone: formData.phone || null,
        email: formData.email || null,
        state: formData.state.trim(),
        city: formData.city.trim(),
        images: uploadedUrls
      };

      console.log('Sending data to Supabase:', JSON.stringify(adData, null, 2));

      const { error: insertError } = await supabase
        .from('ads')
        .insert([adData])
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      notifications.show({
        title: 'Success',
        message: 'Your ad has been submitted for review',
        color: 'green'
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        age: '',
        state: '',
        city: '',
        phone: '',
        email: '',
        images: [],
        rates: {
          incall: { hourly: '', twohour: '', overnight: '' },
          outcall: { hourly: '', twohour: '', overnight: '' }
        },
        stats: {
          height: '',
          measurements: '',
          ethnicity: '',
          hairColor: '',
          eyeColor: ''
        }
      });
      setLocalImages([]);
      navigate('/');
    } catch (error: any) {
      console.error('Error submitting ad:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add validation function
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Basic Info
        return Boolean(
          formData.title.trim() && 
          formData.description.trim() && 
          formData.state && 
          formData.city
        );
      
      case 1: // Contact Info
        return Boolean(
          formData.phone.trim() &&
          formData.email.trim() &&
          formData.email.includes('@') // Basic email validation
        );
      
      case 2: // Photos
        return localImages.length >= 3;
      
      case 3: // Rates
        return Boolean(
          // At least one rate must be set for each type
          (formData.rates.incall.hourly || 
           formData.rates.incall.twohour || 
           formData.rates.incall.overnight) &&
          (formData.rates.outcall.hourly || 
           formData.rates.outcall.twohour || 
           formData.rates.outcall.overnight)
        );
      
      case 4: // Stats
        return Boolean(
          formData.stats.height &&
          formData.stats.measurements &&
          formData.stats.ethnicity &&
          formData.stats.hairColor &&
          formData.stats.eyeColor
        );
      
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(active)) {
      setActive((current) => current + 1);
      setError(null);
    } else {
      // Show error message based on current step
      const errorMessages = {
        0: 'Please fill in all basic information fields',
        1: 'Please provide valid contact information',
        2: 'Please upload at least 3 images',
        3: 'Please set at least one rate for both incall and outcall',
        4: 'Please fill in all physical details'
      };
      setError(errorMessages[active as keyof typeof errorMessages]);
    }
  };

  const prevStep = () => setActive((current) => current - 1);

  // Get cities based on selected state
  const cities = formData.state ? 
    statesData.find(s => s.name === formData.state)?.cities || [] 
    : [];

  return (
    <Container 
      size="xl" 
      px={{ base: 20, sm: 20, md: 80 }}
      pt={120}
    >
      <Paper p="md" radius="md" bg="rgba(0, 0, 0, 0.3)">
        <Stepper
          active={active}
          onStepClick={setActive}
          size="sm"
          orientation={window.innerWidth < 768 ? 'vertical' : 'horizontal'}
          allowNextStepsSelect={false}
          styles={{
            root: { 
              backgroundColor: 'transparent',
              gap: '1rem'
            },
            separator: { 
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              '@media (maxWidth: 768px)': {
                display: 'none'
              }
            },
            stepBody: {
              '@media (maxWidth: 768px)': {
                margin: '5px 0'
              }
            },
            stepLabel: { 
              color: 'white', 
              fontSize: '1rem', 
              fontWeight: 500,
              '@media (maxWidth: 768px)': {
                fontSize: '0.9rem'
              }
            },
            stepDescription: { 
              color: 'rgba(255, 255, 255, 0.5)', 
              fontSize: '0.875rem',
              '@media (maxWidth: 768px)': {
                fontSize: '0.8rem'
              }
            },
            steps: {
              '@media (maxWidth: 768px)': {
                flexDirection: 'column',
                gap: '0.5rem'
              }
            },
            step: {
              '@media (maxWidth: 768px)': {
                flexDirection: 'row',
                gap: '1rem'
              }
            },
            stepIcon: {
              border: '2px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: 'transparent',
              color: 'rgba(255, 255, 255, 0.5)',
              '&[dataCompleted]': {
                backgroundColor: '#ff4b6e',
                borderColor: '#ff4b6e',
                color: 'white'
              },
              '&[dataProgress]': {
                backgroundColor: '#ff4b6e',
                borderColor: '#ff4b6e',
                color: 'white'
              }
            },
            content: {
              '@media (maxWidth: 768px)': {
                padding: '1rem 0'
              }
            }
          }}
        >
          <Stepper.Step
            label="Basic Info"
            description="Title and description"
          >
            <Stack gap="md">
              <TextInput
                label="Title"
                placeholder="Enter a catchy title for your ad"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                styles={{
                  input: {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  },
                  label: { color: 'white' }
                }}
              />
              <Textarea
                label="Description"
                placeholder="Describe yourself and your services"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                minRows={4}
                required
                styles={{
                  input: {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white'
                  },
                  label: { color: 'white' }
                }}
              />
              <Group grow>
                <Select
                  label="State"
                  placeholder="Select state"
                  data={statesData.map(state => state.name)}
                  value={formData.state}
                  onChange={(value) => setFormData({ 
                    ...formData, 
                    state: value || '', 
                    city: '' // Reset city when state changes
                  })}
                  required
                  searchable
                  styles={{
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    },
                    label: { color: 'white' },
                    option: {
                      '&[dataSelected]': {
                        backgroundColor: '#ff4b6e',
                        color: 'white',
                      },
                    },
                  }}
                />
                <Select
                  label="City"
                  placeholder="Select city"
                  data={cities}
                  value={formData.city}
                  onChange={(value) => setFormData({ ...formData, city: value || '' })}
                  required
                  disabled={!formData.state}
                  searchable
                  styles={{
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    },
                    label: { color: 'white' },
                    option: {
                      '&[dataSelected]': {
                        backgroundColor: '#ff4b6e',
                        color: 'white',
                      },
                    },
                  }}
                />
              </Group>
              {error && (
                <Alert color="red" icon={<IconAlertCircle size={16} />}>
                  {error}
                </Alert>
              )}
            </Stack>
          </Stepper.Step>

          <Stepper.Step
            label="Contact Info"
            description="Phone and email"
          >
            <Stack gap="lg" mt="xl">
              <TextInput
                label="Phone Number"
                placeholder="+1234567890"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                styles={{
                  input: {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                  },
                  label: { color: 'white' },
                }}
              />

              <TextInput
                label="Email"
                placeholder="your@email.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                styles={{
                  input: {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                  },
                  label: { color: 'white' },
                }}
              />
              {error && (
                <Alert color="red" icon={<IconAlertCircle size={16} />}>
                  {error}
                </Alert>
              )}
            </Stack>
          </Stepper.Step>

          <Stepper.Step
            label="Photos"
            description="Upload your photos"
          >
            <Stack gap="lg" mt="xl">
              <FileInput
                label="Upload Photos"
                description="Upload at least 3 photos (max 10)"
                accept="image/png,image/jpeg,image/webp"
                multiple
                leftSection={<IconUpload size={14} />}
                onChange={handleImageChange}
                styles={{
                  input: {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                  },
                  label: { color: 'white' },
                  description: { color: 'rgba(255, 255, 255, 0.5)' },
                }}
              />
              
              {localImages.length > 0 && (
                <>
                  <Text size="sm" style={{ color: 'white' }}>
                    {localImages.length} image{localImages.length !== 1 ? 's' : ''} selected
                    {localImages.length < 3 && (
                      <Text span c="red" ml={5}>
                        (Minimum 3 images required)
                      </Text>
                    )}
                  </Text>
                  <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm">
                    {localImages.map((img, index) => (
                      <Paper
                        key={index}
                        pos="relative"
                        p={0}
                        style={{ overflow: 'hidden' }}
                      >
                        <Image
                          src={img.preview}
                          alt={`Preview ${index + 1}`}
                          radius="md"
                          h={150}
                          fit="cover"
                        />
                        <ActionIcon
                          variant="filled"
                          color="red"
                          size="sm"
                          style={{
                            position: 'absolute',
                            top: 5,
                            right: 5,
                            zIndex: 2
                          }}
                          onClick={() => removeImage(index)}
                        >
                          <IconX size={14} />
                        </ActionIcon>
                      </Paper>
                    ))}
                  </SimpleGrid>
                </>
              )}
              {error && (
                <Alert color="red" icon={<IconAlertCircle size={16} />}>
                  {error}
                </Alert>
              )}
            </Stack>
          </Stepper.Step>

          <Stepper.Step
            label="Rates"
            description="Set your rates"
          >
            <Stack gap="lg" mt="xl">
              <Text fw={500} size="sm" style={{ color: 'white' }}>Incall Rates</Text>
              <SimpleGrid cols={3}>
                <TextInput
                  label="1 Hour"
                  placeholder="$"
                  value={formData.rates.incall.hourly}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setFormData({
                      ...formData,
                      rates: {
                        ...formData.rates,
                        incall: { ...formData.rates.incall, hourly: value }
                      }
                    });
                  }}
                  styles={{
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    },
                    label: { color: 'white' },
                  }}
                />
                <TextInput
                  label="2 Hours"
                  placeholder="$"
                  value={formData.rates.incall.twohour}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setFormData({
                      ...formData,
                      rates: {
                        ...formData.rates,
                        incall: { ...formData.rates.incall, twohour: value }
                      }
                    });
                  }}
                  styles={{
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    },
                    label: { color: 'white' },
                  }}
                />
                <TextInput
                  label="Overnight"
                  placeholder="$"
                  value={formData.rates.incall.overnight}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setFormData({
                      ...formData,
                      rates: {
                        ...formData.rates,
                        incall: { ...formData.rates.incall, overnight: value }
                      }
                    });
                  }}
                  styles={{
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    },
                    label: { color: 'white' },
                  }}
                />
              </SimpleGrid>

              <Text fw={500} size="sm" style={{ color: 'white' }}>Outcall Rates</Text>
              <SimpleGrid cols={3}>
                <TextInput
                  label="1 Hour"
                  placeholder="$"
                  value={formData.rates.outcall.hourly}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setFormData({
                      ...formData,
                      rates: {
                        ...formData.rates,
                        outcall: { ...formData.rates.outcall, hourly: value }
                      }
                    });
                  }}
                  styles={{
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    },
                    label: { color: 'white' },
                  }}
                />
                <TextInput
                  label="2 Hours"
                  placeholder="$"
                  value={formData.rates.outcall.twohour}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setFormData({
                      ...formData,
                      rates: {
                        ...formData.rates,
                        outcall: { ...formData.rates.outcall, twohour: value }
                      }
                    });
                  }}
                  styles={{
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    },
                    label: { color: 'white' },
                  }}
                />
                <TextInput
                  label="Overnight"
                  placeholder="$"
                  value={formData.rates.outcall.overnight}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setFormData({
                      ...formData,
                      rates: {
                        ...formData.rates,
                        outcall: { ...formData.rates.outcall, overnight: value }
                      }
                    });
                  }}
                  styles={{
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    },
                    label: { color: 'white' },
                  }}
                />
              </SimpleGrid>
              {error && (
                <Alert color="red" icon={<IconAlertCircle size={16} />}>
                  {error}
                </Alert>
              )}
            </Stack>
          </Stepper.Step>

          <Stepper.Step
            label="Stats"
            description="Physical details"
          >
            <Stack gap="lg" mt="xl">
              <SimpleGrid cols={2}>
                <TextInput
                  label="Height"
                  placeholder="e.g., 5'6"
                  value={formData.stats.height}
                  onChange={(e) => setFormData({
                    ...formData,
                    stats: { ...formData.stats, height: e.target.value }
                  })}
                  styles={{
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    },
                    label: { color: 'white' },
                  }}
                />
                <TextInput
                  label="Measurements"
                  placeholder="e.g., 34-24-36"
                  value={formData.stats.measurements}
                  onChange={(e) => setFormData({
                    ...formData,
                    stats: { ...formData.stats, measurements: e.target.value }
                  })}
                  styles={{
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    },
                    label: { color: 'white' },
                  }}
                />
              </SimpleGrid>

              <SimpleGrid cols={3}>
                <Select
                  label="Ethnicity"
                  placeholder="Select"
                  data={[
                    'Asian', 'Black', 'Caucasian', 'Hispanic', 
                    'Indian', 'Middle Eastern', 'Mixed'
                  ]}
                  value={formData.stats.ethnicity}
                  onChange={(value) => setFormData({
                    ...formData,
                    stats: { ...formData.stats, ethnicity: value || '' }
                  })}
                  styles={{
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    },
                    label: { color: 'white' },
                    dropdown: {
                      backgroundColor: '#1A1B1E',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    option: {
                      '&[dataSelected]': {
                        backgroundColor: '#ff4b6e',
                        color: 'white',
                      },
                      '&[dataHovered]': {
                        backgroundColor: 'rgba(255, 75, 110, 0.1)',
                      }
                    }
                  }}
                />
                <Select
                  label="Hair Color"
                  placeholder="Select"
                  data={[
                    'Black', 'Blonde', 'Brown', 'Red', 
                    'Other'
                  ]}
                  value={formData.stats.hairColor}
                  onChange={(value) => setFormData({
                    ...formData,
                    stats: { ...formData.stats, hairColor: value || '' }
                  })}
                  styles={{
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    },
                    label: { color: 'white' },
                    dropdown: {
                      backgroundColor: '#1A1B1E',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    option: {
                      '&[dataSelected]': {
                        backgroundColor: '#ff4b6e',
                        color: 'white',
                      },
                      '&[dataHovered]': {
                        backgroundColor: 'rgba(255, 75, 110, 0.1)',
                      }
                    }
                  }}
                />
                <Select
                  label="Eye Color"
                  placeholder="Select"
                  data={[
                    'Blue', 'Brown', 'Green', 'Hazel', 
                    'Other'
                  ]}
                  value={formData.stats.eyeColor}
                  onChange={(value) => setFormData({
                    ...formData,
                    stats: { ...formData.stats, eyeColor: value || '' }
                  })}
                  styles={{
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    },
                    label: { color: 'white' },
                    dropdown: {
                      backgroundColor: '#1A1B1E',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    option: {
                      '&[dataSelected]': {
                        backgroundColor: '#ff4b6e',
                        color: 'white',
                      },
                      '&[dataHovered]': {
                        backgroundColor: 'rgba(255, 75, 110, 0.1)',
                      }
                    }
                  }}
                />
              </SimpleGrid>
              {error && (
                <Alert color="red" icon={<IconAlertCircle size={16} />}>
                  {error}
                </Alert>
              )}
            </Stack>
          </Stepper.Step>

          <Stepper.Completed>
            <Stack gap="lg" mt="xl">
              <Alert color="green" icon={<IconCheck size={16} />}>
                All set! Review your information and submit your ad.
              </Alert>

              {error && (
                <Alert color="red" icon={<IconAlertCircle size={16} />}>
                  {error}
                </Alert>
              )}
            </Stack>
          </Stepper.Completed>
        </Stepper>

        <Group justify="flex-end" mt="xl" gap="md">
          {active !== 0 && (
            <Button 
              variant="default" 
              onClick={prevStep}
              disabled={loading}
              fullWidth={window.innerWidth < 768}
              styles={{
                root: {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)'
                  }
                }
              }}
            >
              Back
            </Button>
          )}
          {active !== 5 ? (
            <Button 
              onClick={nextStep}
              variant="filled"
              fullWidth={window.innerWidth < 768}
              styles={{
                root: {
                  backgroundColor: '#ff4b6e',
                  '&:hover': {
                    backgroundColor: '#ff3d64'
                  }
                }
              }}
              disabled={loading}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              variant="filled"
              fullWidth={window.innerWidth < 768}
              styles={{
                root: {
                  backgroundColor: '#ff4b6e',
                  '&:hover': {
                    backgroundColor: '#ff3d64'
                  }
                }
              }}
              loading={loading}
            >
              Submit Ad
            </Button>
          )}
        </Group>
      </Paper>
    </Container>
  );
}; 