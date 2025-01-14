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
  CopyButton,
  Badge,
  Loader,
  Box,
  Alert,
  TextInput,
  Select,
  Image
} from '@mantine/core';
import { Center } from '@mantine/core';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { IconCheck, IconCopy, IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

// Import crypto icons
import btcIcon from 'cryptocurrency-icons/svg/color/btc.svg';
import ethIcon from 'cryptocurrency-icons/svg/color/eth.svg';
import usdtIcon from 'cryptocurrency-icons/svg/color/usdt.svg';
import bnbIcon from 'cryptocurrency-icons/svg/color/bnb.svg';
import solIcon from 'cryptocurrency-icons/svg/color/sol.svg';
import dogeIcon from 'cryptocurrency-icons/svg/color/doge.svg';

// Define supported cryptocurrencies and their wallet addresses
const CRYPTO_OPTIONS = {
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    icon: btcIcon
  },
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    icon: ethIcon
  },
  USDT: {
    name: 'Tether',
    symbol: 'USDT',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    icon: usdtIcon
  },
  BNB: {
    name: 'Binance Coin',
    symbol: 'BNB',
    address: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',
    icon: bnbIcon
  },
  DOGE: {
    name: 'Dogecoin',
    symbol: 'DOGE',
    address: 'DRSqEwcnJX3GZWH9Twtwk8D5ewqdJzi13k',
    icon: dogeIcon
  },
  SOL: {
    name: 'Solana',
    symbol: 'SOL',
    address: '8ZhvUv5UFfbsGnEp3rqXGjKuqnxVzKGYP9eZzgGXK1Gx',
    icon: solIcon
  }
} as const;

// Define package options with prices for each cryptocurrency
const UPGRADE_PACKAGES = [
  {
    days: 7,
    prices: {
      BTC: 0.0005,
      ETH: 0.01,
      USDT: 20,
      BNB: 0.05,
      DOGE: 150,
      SOL: 0.5
    },
    description: 'Extend your ad visibility for a week',
    features: ['7 days extension', 'Basic visibility']
  },
  {
    days: 15,
    prices: {
      BTC: 0.001,
      ETH: 0.02,
      USDT: 40,
      BNB: 0.1,
      DOGE: 300,
      SOL: 1
    },
    description: 'Get two weeks of premium visibility',
    features: ['15 days extension', 'Enhanced visibility', 'Priority listing']
  },
  {
    days: 30,
    prices: {
      BTC: 0.0018,
      ETH: 0.035,
      USDT: 70,
      BNB: 0.18,
      DOGE: 500,
      SOL: 1.8
    },
    description: 'Maximum exposure for a full month',
    features: ['30 days extension', 'Top visibility', 'Priority listing', 'Featured tag']
  }
];

export const AdUpgrade = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<typeof UPGRADE_PACKAGES[0] | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState<keyof typeof CRYPTO_OPTIONS>('BTC');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'confirming' | null>(null);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => {
    fetchAdDetails();
  }, [id]);

  const fetchAdDetails = async () => {
    try {
      setLoading(true);
      const { error: adError } = await supabase
        .from('ads')
        .select('*')
        .eq('id', id)
        .single();

      if (adError) throw adError;
    } catch (err) {
      console.error('Error fetching ad details:', err);
      setError('Failed to load ad details');
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async (pkg: typeof UPGRADE_PACKAGES[0]) => {
    setSelectedPackage(pkg);
    setPaymentStatus('pending');
  };

  const confirmPayment = async () => {
    if (!transactionId.trim()) {
      setError('Please enter the transaction ID');
      return;
    }

    try {
      setLoading(true);
      setPaymentStatus('confirming');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('You must be logged in to upgrade an ad');

      if (!selectedPackage) throw new Error('No package selected');

      const cryptoInfo = CRYPTO_OPTIONS[selectedCrypto];
      
      const { error: paymentError } = await supabase
        .from('ad_payments')
        .insert({
          ad_id: id,
          user_id: user.id,
          amount: selectedPackage.prices[selectedCrypto],
          currency: 'USD',
          crypto_amount: selectedPackage.prices[selectedCrypto],
          crypto_currency: selectedCrypto,
          crypto_address: cryptoInfo.address,
          status: 'pending',
          days_extended: selectedPackage.days,
          transaction_id: transactionId.trim()
        });

      if (paymentError) throw new Error('Failed to create payment record');

      notifications.show({
        title: 'Success',
        message: 'Payment confirmation submitted. Your ad will be upgraded after verification.',
        color: 'green'
      });

      setTransactionId('');
      setPaymentStatus(null);
      setSelectedPackage(null);

    } catch (err: any) {
      console.error('Error confirming payment:', err);
      setError(err.message || 'Failed to confirm payment');
    } finally {
      setLoading(false);
      setPaymentStatus(null);
    }
  };

  if (loading) {
    return (
      <Box pt={{ base: 80, sm: 120 }}>
        <Container size="lg">
          <Center style={{ height: 400, width: '100%' }}>
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
    <Box pt={{ base: 80, sm: 120 }} pb={40} style={{ background: '#000' }}>
      <Container size="lg">
        <Stack gap="xl">
          <Title order={2} ta="center" c="#ff4d7d">Upgrade Your Ad</Title>
          
          {paymentStatus === 'pending' && selectedPackage && (
            <Paper shadow="sm" p="xl" radius="md" withBorder style={{ background: '#111', borderColor: '#ff4d7d' }}>
              <Stack gap="xl">
                <Alert 
                  icon={<IconAlertCircle size={20} />}
                  title="Payment Instructions"
                  color="pink"
                  variant="filled"
                >
                  1. Send exactly {selectedPackage.prices[selectedCrypto]} {selectedCrypto} to the address below
                  2. Copy your transaction ID after sending
                  3. Enter the transaction ID and click confirm
                </Alert>

                <Paper p="lg" radius="md" withBorder style={{ background: '#1a1a1a', borderColor: '#333' }}>
                  <Stack gap="md">
                    <Group gap="xs">
                      <Image 
                        src={CRYPTO_OPTIONS[selectedCrypto].icon}
                        width={28} 
                        height={28}
                        style={{ borderRadius: '50%' }}
                      />
                      <Text fw={500} c="#fff">{CRYPTO_OPTIONS[selectedCrypto].name} Address:</Text>
                    </Group>
                    
                    <Group justify="space-between" gap="sm" wrap="nowrap">
                      <Text ff="monospace" fz="sm" c="#fff" style={{ wordBreak: 'break-all' }}>
                        {CRYPTO_OPTIONS[selectedCrypto].address}
                      </Text>
                      <CopyButton value={CRYPTO_OPTIONS[selectedCrypto].address}>
                        {({ copied, copy }) => (
                          <Button 
                            variant="filled" 
                            color="pink"
                            size="sm"
                            onClick={copy}
                            leftSection={copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                          >
                            {copied ? 'Copied!' : 'Copy'}
                          </Button>
                        )}
                      </CopyButton>
                    </Group>
                  </Stack>
                </Paper>

                <TextInput
                  label="Transaction ID"
                  description="Enter the transaction ID after sending payment"
                  placeholder="Enter transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  styles={{
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                    },
                    label: { color: 'white' },
                    description: { color: 'rgba(255, 255, 255, 0.5)' }
                  }}
                />

                <Group>
                  <Button
                    variant="light"
                    color="gray"
                    onClick={() => {
                      setPaymentStatus(null);
                      setSelectedPackage(null);
                      setTransactionId('');
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="filled"
                    color="pink"
                    onClick={confirmPayment}
                    loading={loading}
                    disabled={paymentStatus !== 'pending'}
                  >
                    Confirm Payment
                  </Button>
                </Group>

                {error && (
                  <Alert color="red" icon={<IconAlertCircle size={16} />}>
                    {error}
                  </Alert>
                )}
              </Stack>
            </Paper>
          )}
          
          <Grid gutter="lg">
            {UPGRADE_PACKAGES.map((pkg) => (
              <Grid.Col key={pkg.days} span={{ base: 12, sm: 6, md: 4 }}>
                <Paper
                  p="xl"
                  radius="md"
                  withBorder
                  style={{
                    background: selectedPackage?.days === pkg.days ? '#1a1a1a' : '#111',
                    borderColor: selectedPackage?.days === pkg.days ? '#ff4d7d' : '#333',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Stack gap="md">
                    <Badge 
                      size="lg" 
                      variant="filled" 
                      color="pink"
                      fullWidth
                    >
                      {pkg.days} Days
                    </Badge>

                    <Select
                      label="Select Payment Method"
                      value={selectedCrypto}
                      onChange={(value) => setSelectedCrypto(value as keyof typeof CRYPTO_OPTIONS)}
                      data={Object.entries(CRYPTO_OPTIONS).map(([key, crypto]) => ({
                        value: key,
                        label: crypto.name,
                        leftSection: <Image src={crypto.icon} width={20} height={20} />
                      }))}
                      styles={{
                        input: {
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderColor: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                        },
                        label: { color: 'white' },
                        dropdown: {
                          backgroundColor: '#1A1B1E',
                        },
                        option: {
                          backgroundColor: 'transparent',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: '#ff4b6e50'
                          },
                          '&[ariaSelected="true"]': {
                            backgroundColor: '#ff4b6e',
                            color: 'white'
                          }
                        }
                      }}
                    />
                    
                    <Group justify="center" gap="xs">
                      <Image src={CRYPTO_OPTIONS[selectedCrypto].icon} width={24} height={24} />
                      <Text size="xl" fw={700} c="#ff4d7d">
                        {pkg.prices[selectedCrypto]} {selectedCrypto}
                      </Text>
                    </Group>
                    
                    <Text size="sm" c="#999" ta="center">
                      {pkg.description}
                    </Text>

                    <Stack gap={8}>
                      {pkg.features.map((feature, idx) => (
                        <Group key={idx} gap="xs">
                          <IconCheck size={16} style={{ color: '#ff4d7d' }} />
                          <Text size="sm" c="#fff">{feature}</Text>
                        </Group>
                      ))}
                    </Stack>

                    <Button
                      variant={selectedPackage?.days === pkg.days ? "filled" : "outline"}
                      color="pink"
                      fullWidth
                      onClick={() => initiatePayment(pkg)}
                      disabled={paymentStatus === 'pending' || paymentStatus === 'confirming'}
                    >
                      {selectedPackage?.days === pkg.days ? 'Selected' : 'Select Package'}
                    </Button>
                  </Stack>
                </Paper>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}; 