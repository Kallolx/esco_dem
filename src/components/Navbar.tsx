import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, 
  Group, 
  Button, 
  Select, 
  Drawer, 
  Burger, 
  Box, 
  Text,
  Stack,
  UnstyledButton,
  Menu
} from '@mantine/core';
import { 
  IconPhone, 
  IconBrandTelegram, 
  IconBrandWhatsapp, 
  IconWorld, 
  IconChevronDown,
  IconLogin,
  IconLogout,
  IconPlus,
  IconList
} from '@tabler/icons-react';
import { supabase } from '../lib/supabase';

const NAV_ITEMS = [
  { label: 'HOME', path: '/' },
  { label: 'MODELS', path: '/models' },
  { label: 'MASSAGE', path: '/locations' },
  { label: 'LIVE ESCORTS', path: '/categories' },
  { label: 'CASTING', path: '/casting' },
  { label: 'Upgrade', path: '/upgrade' }
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handlePostAdClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
    } else {
      navigate('/post');
    }
  };

  return (
    <Box component="header" style={{ position: 'fixed', width: '100%', zIndex: 50 }}>
      {/* Top Bar */}
      <Box 
        display={{ base: 'none', sm: 'block' }}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Container size="xl" h={40}>
          <Group justify="space-between" h="100%">
            {/* Language Selector */}
            <Select
              value={language}
              onChange={(value) => setLanguage(value || 'en')}
              data={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Español' },
                { value: 'fr', label: 'Français' },
                { value: 'de', label: 'Deutsch' }
              ]}
              size="sm"
              leftSection={<IconWorld size={14} />}
              rightSection={<IconChevronDown size={12} />}
              styles={{
                input: {
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.9)',
                  height: '40px',
                  minHeight: '40px',
                  width: '120px'
                },
                dropdown: {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(8px)'
                }
              }}
            />

            {/* Contact Info */}
            <Group gap="xl">
              <Group gap="xs">
                <IconPhone size={14} color="#ff4b6e" />
                <Text c="white" opacity={0.9} size="sm">+44 20 1234 5678</Text>
              </Group>
              <Group gap="md">
                <IconBrandTelegram 
                  size={16} 
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    cursor: 'pointer',
                    transition: 'color 0.2s'
                  }}
                />
                <IconBrandWhatsapp 
                  size={16}
                  style={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    cursor: 'pointer',
                    transition: 'color 0.2s'
                  }}
                />
              </Group>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Main Navigation */}
      <Box
        component="nav"
        style={{
          width: '100%',
          transition: 'all 0.3s',
          backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.6)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
        }}
      >
        <Container size="xl" h={70}>
          <Group justify="space-between" h="100%">
            {/* Mobile Menu */}
            <Group display={{ base: 'flex', md: 'none' }}>
              <Burger
                opened={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(true)}
                color="white"
                size="sm"
              />
            </Group>

            {/* Logo */}
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Text size="xl" c="white" fw={500}>HAUTE LONDON</Text>
            </Link>

            {/* Desktop Navigation */}
            <Group gap="xl" display={{ base: 'none', md: 'flex' }}>
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.label}
                  variant="subtle"
                  component={Link}
                  to={item.path}
                  c={isActive(item.path) ? '#ff4b6e' : 'white'}
                  styles={{
                    root: {
                      fontSize: '1.125rem',
                      padding: '0.5rem',
                      '&:hover': {
                        color: '#ff4b6e',
                        backgroundColor: 'transparent'
                      }
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Group>

            {/* Desktop Post Ad and Login/Logout */}
            <Group gap="md" display={{ base: 'none', md: 'flex' }}>
              <Button
                variant="gradient"
                gradient={{ from: '#ff4b6e', to: '#ff8f9c' }}
                h={36}
                onClick={handlePostAdClick}
              >
                Post Ad
              </Button>
              {user ? (
                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Button
                      variant="subtle"
                      color="gray"
                      rightSection={<IconChevronDown size={14} />}
                      styles={{
                        root: {
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                          }
                        }
                      }}
                    >
                      Account
                    </Button>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>Account</Menu.Label>
                    <Menu.Item
                      component={Link}
                      to="/post"
                      leftSection={<IconPlus size={14} />}
                    >
                      Post Ad
                    </Menu.Item>
                    <Menu.Item
                      component={Link}
                      to="/my-ads"
                      leftSection={<IconList size={14} />}
                    >
                      My Ads
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={<IconLogout size={14} />}
                      onClick={handleLogout}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <Button
                  variant="subtle"
                  color="gray"
                  component={Link}
                  to="/login"
                  leftSection={<IconLogin size={18} />}
                  styles={{
                    root: {
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }
                  }}
                >
                  Login
                </Button>
              )}
            </Group>

            {/* Mobile Post Ad Button */}
            <Group display={{ base: 'flex', md: 'none' }}>
              <Button
                variant="gradient"
                gradient={{ from: '#ff4b6e', to: '#ff8f9c' }}
                size="sm"
                onClick={handlePostAdClick}
              >
                Post Ad
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* Mobile Menu Drawer */}
      <Drawer
        opened={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        size="100%"
        styles={{
          content: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(16px)'
          }
        }}
      >
        <Stack p="md" gap="lg">
          {NAV_ITEMS.map((item) => (
            <UnstyledButton
              key={item.label}
              component={Link}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: isActive(item.path) ? '#ff4b6e' : 'white',
                fontSize: '1.25rem',
                padding: '0.75rem',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {item.label}
            </UnstyledButton>
          ))}
          {user ? (
            <>
              <Text fw={500} c="dimmed" size="sm" pl="md">Account</Text>
              <UnstyledButton
                component={Link}
                to="/post"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  color: 'white',
                  fontSize: '1.25rem',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <IconPlus size={20} style={{ marginRight: 10 }} />
                Post Ad
              </UnstyledButton>
              <UnstyledButton
                component={Link}
                to="/my-ads"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  color: 'white',
                  fontSize: '1.25rem',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <IconList size={20} style={{ marginRight: 10 }} />
                My Ads
              </UnstyledButton>
              <UnstyledButton
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  color: '#ff4b6e',
                  fontSize: '1.25rem',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <IconLogout size={20} style={{ marginRight: 10 }} />
                Logout
              </UnstyledButton>
            </>
          ) : (
            <UnstyledButton
              component={Link}
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.75rem',
                color: 'white',
                fontSize: '1.25rem',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <IconLogin size={20} style={{ marginRight: 10 }} />
              Login
            </UnstyledButton>
          )}
        </Stack>
      </Drawer>
    </Box>
  );
};

export default Navbar; 