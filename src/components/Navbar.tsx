import React, { useState, useEffect } from 'react';
import { Container, Group, Button, Select, Drawer, Burger } from '@mantine/core';
import { FaPhone, FaTelegram, FaWhatsapp, FaSearch, FaRegHeart, FaChevronDown, FaGlobe } from 'react-icons/fa';

const Navbar: React.FC = () => {
  const [language, setLanguage] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed w-full z-50">
      {/* Top Bar */}
      <div className="hidden sm:block bg-black/40 backdrop-blur-md border-b border-white/10">
        <Container size="xl" className="h-[40px]">
          <Group justify="space-between" className="h-full">
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
              leftSection={<FaGlobe size={14} />}
              rightSection={<FaChevronDown size={12} />}
              classNames={{
                input: 'bg-transparent border-0 text-white/90 font-forum text-sm pl-8 h-[40px] min-h-[40px] w-[120px]',
                dropdown: 'bg-black/90 border border-white/10 backdrop-blur-md mt-1',
                option: 'text-white/90 font-forum hover:bg-[#ff4b6e]/10',
              }}
            />

            {/* Contact Info */}
            <Group gap="xl">
              <Group gap="xs">
                <FaPhone size={14} className="text-[#ff4b6e]" />
                <span className="text-white/90 font-forum text-sm">+44 20 1234 5678</span>
              </Group>
              <Group gap="md">
                <FaTelegram size={16} className="text-white/90 hover:text-[#ff4b6e] cursor-pointer transition-colors" />
                <FaWhatsapp size={16} className="text-white/90 hover:text-[#ff4b6e] cursor-pointer transition-colors" />
              </Group>
            </Group>
          </Group>
        </Container>
      </div>

      {/* Main Navigation */}
      <nav className={`w-full transition-all duration-300 ${
        isScrolled ? 'bg-black/60 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
      }`}>
        <Container size="xl" className="h-[70px]">
          <Group justify="space-between" className="h-full">
            {/* Mobile Menu */}
            <Group className="md:hidden">
              <Burger
                opened={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(true)}
                color="white"
                size="sm"
              />
            </Group>

            {/* Logo */}
            <div className="font-forum text-2xl text-white">HAUTE LONDON</div>

            {/* Desktop Navigation */}
            <Group gap="xl" className="hidden md:flex">
              <Button variant="subtle" className="text-white hover:text-[#ff4b6e] font-forum text-lg px-2">
                HOME
              </Button>
              <Button variant="subtle" className="text-white hover:text-[#ff4b6e] font-forum text-lg px-2">
                ALL MODELS
              </Button>
              <Button variant="subtle" className="text-white hover:text-[#ff4b6e] font-forum text-lg px-2">
                LOCATIONS
              </Button>
              <Button variant="subtle" className="text-white hover:text-[#ff4b6e] font-forum text-lg px-2">
                CATEGORIES
              </Button>
              <Button variant="subtle" className="text-white hover:text-[#ff4b6e] font-forum text-lg px-2">
                CASTING
              </Button>
              <Button variant="subtle" className="text-white hover:text-[#ff4b6e] font-forum text-lg px-2">
                SERVICES
              </Button>
            </Group>

            {/* Search and Favorites */}
            <Group gap="md">
              <Button
                variant="gradient"
                gradient={{ from: '#ff4b6e', to: '#ff8f9c' }}
                className="font-forum text-sm h-[36px] hidden sm:block"
              >
                Post
              </Button>
              <FaSearch size={18} className="text-white/90 hover:text-[#ff4b6e] cursor-pointer transition-colors" />
              <FaRegHeart size={18} className="text-white/90 hover:text-[#ff4b6e] cursor-pointer transition-colors" />
            </Group>
          </Group>
        </Container>
      </nav>

      {/* Mobile Menu Drawer */}
      <Drawer
        opened={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        size="100%"
        classNames={{
          content: 'bg-black/95 backdrop-blur-xl',
        }}
      >
        <div className="p-4 space-y-4">
          <Button fullWidth variant="subtle" className="text-white hover:text-[#ff4b6e] font-forum text-xl">
            HOME
          </Button>
          <Button fullWidth variant="subtle" className="text-white hover:text-[#ff4b6e] font-forum text-xl">
            ALL MODELS
          </Button>
          <Button fullWidth variant="subtle" className="text-white hover:text-[#ff4b6e] font-forum text-xl">
            LOCATIONS
          </Button>
          <Button fullWidth variant="subtle" className="text-white hover:text-[#ff4b6e] font-forum text-xl">
            CATEGORIES
          </Button>
          <Button fullWidth variant="subtle" className="text-white hover:text-[#ff4b6e] font-forum text-xl">
            CASTING
          </Button>
          <Button fullWidth variant="subtle" className="text-white hover:text-[#ff4b6e] font-forum text-xl">
            SERVICES
          </Button>
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar; 