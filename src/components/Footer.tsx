import { Container, Group, Stack, Text, Title, SimpleGrid, Divider, Box } from '@mantine/core';
import { Link } from 'react-router-dom';
import {
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandTelegram,
} from '@tabler/icons-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer"
      style={{ 
        background: '#000',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '60px 0 20px 0',
        marginTop: 60
      }}
    >
      <Container size="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing={50}>
          {/* About Section */}
          <Stack>
            <Title order={4} c="white">About Us</Title>
            <Text size="sm" c="dimmed" style={{ marginTop: '20px' }}>
              Haute London provides a premium platform for independent escorts and clients to connect safely and securely.
            </Text>
          </Stack>

          {/* Quick Links */}
          <Stack>
            <Title order={4} c="white">Quick Links</Title>
            <Stack gap={20} style={{ marginTop: '20px' }}>
              <Text 
                component={Link} 
                to="/post-ad" 
                c="dimmed"
                size="sm"
                style={{ 
                  textDecoration: 'none',
                  '&:hover': { color: '#fff' }
                }}
              >
                Post an Ad
              </Text>
              <Text 
                component={Link} 
                to="/faq" 
                c="dimmed"
                size="sm"
                style={{ 
                  textDecoration: 'none',
                  '&:hover': { color: '#fff' }
                }}
              >
                FAQ
              </Text>
              <Text 
                component={Link} 
                to="/contact" 
                c="dimmed"
                size="sm"
                style={{ 
                  textDecoration: 'none',
                  '&:hover': { color: '#fff' }
                }}
              >
                Contact Us
              </Text>
            </Stack>
          </Stack>

          {/* Legal Links */}
          <Stack>
            <Title order={4} c="white">Legal</Title>
            <Stack gap={20} style={{ marginTop: '20px' }}>
              <Text 
                component={Link} 
                to="/terms" 
                c="dimmed"
                size="sm"
                style={{ 
                  textDecoration: 'none',
                  '&:hover': { color: '#fff' }
                }}
              >
                Terms of Service
              </Text>
              <Text 
                component={Link} 
                to="/privacy" 
                c="dimmed"
                size="sm"
                style={{ 
                  textDecoration: 'none',
                  '&:hover': { color: '#fff' }
                }}
              >
                Privacy Policy
              </Text>
              <Text 
                component={Link} 
                to="/guidelines" 
                c="dimmed"
                size="sm"
                style={{ 
                  textDecoration: 'none',
                  '&:hover': { color: '#fff' }
                }}
              >
                Content Guidelines
              </Text>
            </Stack>
          </Stack>

          {/* Connect With Us */}
          <Stack>
            <Title order={4} c="white">Connect With Us</Title>
            <Stack gap={20} style={{ marginTop: '20px' }}>
              <Group gap={20}>
                <Link to="https://twitter.com" style={{ color: '#868e96', textDecoration: 'none' }}>
                  <IconBrandTwitter size={24} />
                </Link>
                <Link to="https://instagram.com" style={{ color: '#868e96', textDecoration: 'none' }}>
                  <IconBrandInstagram size={24} />
                </Link>
                <Link to="https://telegram.org" style={{ color: '#868e96', textDecoration: 'none' }}>
                  <IconBrandTelegram size={24} />
                </Link>
              </Group>
              <Text c="dimmed" size="sm">support@hautelondon.uk</Text>
              <Text c="dimmed" size="sm">+44 20 1234 5678</Text>
            </Stack>
          </Stack>
        </SimpleGrid>

        <Divider my={40} opacity={0.1} />

        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">
            © {currentYear} Haute London. All rights reserved.
          </Text>
          <Text size="sm" c="dimmed">
            Made with ❤️ in London
          </Text>
        </Group>
      </Container>
    </Box>
  );
}; 