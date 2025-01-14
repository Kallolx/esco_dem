import { useEffect, useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Stack, 
  Grid, 
  Paper, 
  Button, 
  Group,
  Badge,
  Loader,
  Box,
  Center,
  Divider
} from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { IconArrowUp, IconCalendar, IconCoin, IconHistory } from '@tabler/icons-react';

const INITIAL_AD_DAYS = 3; // Initial visibility period for new ads

export const MyAds = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ads, setAds] = useState<any[]>([]);

  useEffect(() => {
    fetchUserAds();
  }, []);

  const fetchUserAds = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      // Fetch ads with all payment information
      const { data: userAds, error: adsError } = await supabase
        .from('ads')
        .select(`
          *,
          ad_payments (
            id,
            status,
            days_extended,
            created_at,
            crypto_amount,
            crypto_currency,
            transaction_id
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (adsError) throw adsError;
      
      // Sort payments by created_at for each ad and calculate total days
      const adsWithSortedPayments = userAds?.map(ad => {
        const sortedPayments = ad.ad_payments?.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ) || [];

        // Calculate total extended days from completed payments
        const totalExtendedDays = sortedPayments
          .filter((payment: any) => payment.status === 'completed')
          .reduce((total: number, payment: any) => total + payment.days_extended, 0);

        // Calculate new expiry date based on initial days + extended days
        const totalDays = INITIAL_AD_DAYS + totalExtendedDays;
        const newExpiryDate = new Date(ad.created_at);
        newExpiryDate.setDate(newExpiryDate.getDate() + totalDays);

        return {
          ...ad,
          ad_payments: sortedPayments,
          total_days: totalDays,
          expires_at: newExpiryDate.toISOString()
        };
      }) || [];

      setAds(adsWithSortedPayments);
    } catch (err) {
      console.error('Error fetching ads:', err);
      setError('Failed to load your ads');
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Box pt={{ base: 80, sm: 120 }}>
        <Container size="lg">
          <Center h={400}>
            <Loader size="lg" />
          </Center>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box pt={{ base: 80, sm: 120 }}>
        <Container size="lg">
          <Text c="red" ta="center">{error}</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box pt={{ base: 80, sm: 120 }}>
      <Container size="lg">
        <Stack gap="xl">
          <Title order={2}>My Ads</Title>

          {ads.length === 0 ? (
            <Paper p="xl" radius="md" withBorder>
              <Stack align="center" gap="md">
                <Text size="lg" c="dimmed">You haven't posted any ads yet.</Text>
                <Button 
                  variant="filled" 
                  color="pink"
                  onClick={() => navigate('/post')}
                >
                  Post Your First Ad
                </Button>
              </Stack>
            </Paper>
          ) : (
            <Grid>
              {ads.map((ad) => {
                const daysRemaining = getDaysRemaining(ad.expires_at);
                const isExpired = daysRemaining <= 0;
                const hasPayments = Array.isArray(ad.ad_payments) && ad.ad_payments.length > 0;

                return (
                  <Grid.Col key={ad.id} span={{ base: 12, sm: 6 }}>
                    <Paper p="lg" radius="md" withBorder>
                      <Stack gap="md">
                        <Group justify="space-between" align="flex-start">
                          <Stack gap={4}>
                            <Text size="lg" fw={500}>{ad.title}</Text>
                            <Group gap={8}>
                              <IconCalendar size={16} style={{ color: '#ff4b6e' }} />
                              <Text size="sm" c="dimmed">
                                {isExpired ? (
                                  'Expired'
                                ) : (
                                  `${daysRemaining} days remaining`
                                )}
                              </Text>
                            </Group>
                          </Stack>
                          <Badge 
                            color={isExpired ? 'red' : daysRemaining <= 3 ? 'yellow' : 'green'}
                          >
                            {ad.status}
                          </Badge>
                        </Group>

                        <Text size="sm" lineClamp={2}>
                          {ad.description}
                        </Text>

                        {hasPayments && (
                          <>
                            <Divider />
                            <Stack gap="md">
                              <Group gap={8}>
                                <IconHistory size={16} style={{ color: '#ff4b6e' }} />
                                <Text size="sm" fw={500}>Payment History</Text>
                              </Group>
                              
                              {ad.ad_payments.map((payment: any, index: number) => (
                                <Paper 
                                  key={index} 
                                  withBorder 
                                  p="xs"
                                  style={{ 
                                    backgroundColor: 'rgba(255, 75, 110, 0.05)',
                                    borderColor: 'rgba(255, 75, 110, 0.2)'
                                  }}
                                >
                                  <Stack gap="xs">
                                    <Group justify="space-between">
                                      <Group gap={8}>
                                        <IconCoin size={16} style={{ color: '#ff4b6e' }} />
                                        <Text size="sm" fw={500}>
                                          {payment.days_extended} Days Extension
                                        </Text>
                                      </Group>
                                      <Badge 
                                        color={payment.status === 'completed' ? 'green' : 'yellow'}
                                        size="sm"
                                      >
                                        {payment.status}
                                      </Badge>
                                    </Group>
                                    {payment.status === 'pending' ? (
                                      <Text size="sm" c="dimmed">
                                        Awaiting payment of {payment.crypto_amount} {payment.crypto_currency}
                                        <br />
                                        <Text size="xs" c="dimmed">Requested on {formatDate(payment.created_at)}</Text>
                                      </Text>
                                    ) : (
                                      <Text size="sm" c="dimmed">
                                        Paid {payment.crypto_amount} {payment.crypto_currency}
                                        <br />
                                        <Text size="xs" c="dimmed">Completed on {formatDate(payment.created_at)}</Text>
                                      </Text>
                                    )}
                                  </Stack>
                                </Paper>
                              ))}
                            </Stack>
                          </>
                        )}

                        <Group>
                          <Button
                            variant="light"
                            color="pink"
                            leftSection={<IconArrowUp size={16} />}
                            onClick={() => navigate(`/ad/upgrade/${ad.id}`)}
                          >
                            Upgrade
                          </Button>
                        </Group>
                      </Stack>
                    </Paper>
                  </Grid.Col>
                );
              })}
            </Grid>
          )}
        </Stack>
      </Container>
    </Box>
  );
} 