import React, { useState } from 'react';
import { Container, Select, SimpleGrid, Text } from '@mantine/core';
import { 
  FaUserFriends, 
  FaRegGem, 
  FaPhoneAlt,
  FaRegClock, 
  FaMapMarkedAlt, 
  FaRegSmile
} from 'react-icons/fa';
import ServiceCard from '../components/ServiceCard';


// Enhanced location data with states and cities
const locationData = [
  // New York State
  { 
    value: 'manhattan', 
    label: 'Manhattan', 
    region: 'New York State',
    icon: '🗽'
  },
  { 
    value: 'brooklyn', 
    label: 'Brooklyn', 
    region: 'New York State',
    icon: '🌉'
  },
  { 
    value: 'queens', 
    label: 'Queens', 
    region: 'New York State',
    icon: '🏙️'
  },
  { 
    value: 'buffalo', 
    label: 'Buffalo', 
    region: 'New York State',
    icon: '🏢'
  },
  { 
    value: 'albany', 
    label: 'Albany', 
    region: 'New York State',
    icon: '🏛️'
  },
  
  // California
  { 
    value: 'los-angeles', 
    label: 'Los Angeles', 
    region: 'California',
    icon: '🌆'
  },
  { 
    value: 'san-francisco', 
    label: 'San Francisco', 
    region: 'California',
    icon: '🌁'
  },
  { 
    value: 'san-diego', 
    label: 'San Diego', 
    region: 'California',
    icon: '🏖️'
  },
  { 
    value: 'sacramento', 
    label: 'Sacramento', 
    region: 'California',
    icon: '🏛️'
  },
  { 
    value: 'san-jose', 
    label: 'San Jose', 
    region: 'California',
    icon: '💻'
  },
  
  // Florida
  { 
    value: 'miami', 
    label: 'Miami', 
    region: 'Florida',
    icon: '🌴'
  },
  { 
    value: 'orlando', 
    label: 'Orlando', 
    region: 'Florida',
    icon: '🎡'
  },
  { 
    value: 'tampa', 
    label: 'Tampa', 
    region: 'Florida',
    icon: '⛵'
  },
  { 
    value: 'jacksonville', 
    label: 'Jacksonville', 
    region: 'Florida',
    icon: '🌊'
  },
  { 
    value: 'tallahassee', 
    label: 'Tallahassee', 
    region: 'Florida',
    icon: '🏛️'
  },
  
  // Texas
  { 
    value: 'houston', 
    label: 'Houston', 
    region: 'Texas',
    icon: '🛢️'
  },
  { 
    value: 'dallas', 
    label: 'Dallas', 
    region: 'Texas',
    icon: '🌆'
  },
  { 
    value: 'austin', 
    label: 'Austin', 
    region: 'Texas',
    icon: '🎸'
  },
  { 
    value: 'san-antonio', 
    label: 'San Antonio', 
    region: 'Texas',
    icon: '🏰'
  },
  { 
    value: 'el-paso', 
    label: 'El Paso', 
    region: 'Texas',
    icon: '🌵'
  },

  // Illinois
  { 
    value: 'chicago', 
    label: 'Chicago', 
    region: 'Illinois',
    icon: '🌆'
  },
  { 
    value: 'springfield', 
    label: 'Springfield', 
    region: 'Illinois',
    icon: '🏛️'
  },
  { 
    value: 'aurora', 
    label: 'Aurora', 
    region: 'Illinois',
    icon: '🌅'
  },
  { 
    value: 'naperville', 
    label: 'Naperville', 
    region: 'Illinois',
    icon: '🏘️'
  },

  // Nevada
  { 
    value: 'las-vegas', 
    label: 'Las Vegas', 
    region: 'Nevada',
    icon: '🎰'
  },
  { 
    value: 'reno', 
    label: 'Reno', 
    region: 'Nevada',
    icon: '🎲'
  },
  { 
    value: 'henderson', 
    label: 'Henderson', 
    region: 'Nevada',
    icon: '🏜️'
  },
  { 
    value: 'carson-city', 
    label: 'Carson City', 
    region: 'Nevada',
    icon: '🏛️'
  }
];

// Group locations by region with enhanced display
const groupedLocations = locationData.reduce((acc: any[], location) => {
  const group = acc.find(g => g.group === location.region);
  
  if (group) {
    group.items.push({
      value: location.value,
      label: `${location.icon}  ${location.label}`
    });
  } else {
    acc.push({
      group: location.region,
      items: [{
        value: location.value,
        label: `${location.icon}  ${location.label}`
      }]
    });
  }
  return acc;
}, []);


// Mock data for services
const availableServiceData = [
  { 
    value: 'escort', 
    label: 'Escort Services',
    icon: '👩‍❤️‍👨'
  },
  { 
    value: 'massage', 
    label: 'Body Massage',
    icon: '💆‍♀️'
  },
  { 
    value: 'spa', 
    label: 'Spa Treatment',
    icon: '🌺'
  }
];

// Group services with icons
const getServicesWithIcons = () => {
  return availableServiceData.map(service => ({
    value: service.value,
    label: `${service.icon}  ${service.label}`
  }));
};

const serviceDetails = {
  escort: [
    {
      name: "Sophie Rose",
      age: 23,
      address: "Mayfair, Central London",
      bio: "Elegant and sophisticated companion for the discerning gentleman",
      phone: "+44 20 1234 5678",
      email: "sophie.rose@hautelondon.com",
      rates: [
        { duration: "30 min", price: 150 },
        { duration: "1 hour", price: 250 },
        { duration: "2 hours", price: 450 },
        { duration: "Overnight", price: 1200 }
      ],
      description: "Offering a genuine girlfriend experience with class and sophistication. Available for dinner dates, social events, and private encounters.",
      location: "Central London",
      status: "VIP" as const,
      images: [
        "https://bpaws.b-cdn.net/920a6190133079464bf7686d9cb88f2e.jpg",
        "https://bpaws.b-cdn.net/3df27d6abd7b3227278fc651683297c0.jpg",
        "https://bpaws.b-cdn.net/45968f4913fb31178ac3496687f21bb5.jpg",
        "https://bpaws.b-cdn.net/cac5286105e6ca99b1a0a076fddf7e54.jpg"
      ]
    },
    {
      name: "Isabella Moon",
      age: 25,
      address: "Knightsbridge, London",
      bio: "Charming and adventurous companion for memorable experiences",
      phone: "+44 20 9876 5432",
      email: "isabella.moon@hautelondon.com",
      rates: [
        { duration: "1 hour", price: 300 },
        { duration: "2 hours", price: 500 },
        { duration: "4 hours", price: 900 },
        { duration: "Overnight", price: 1500 }
      ],
      description: "Elite companion offering unforgettable moments. Perfect for high-class events, private dinners, and exclusive experiences.",
      location: "Central London",
      status: "Premium" as const,
      images: [
        "https://bpaws.b-cdn.net/65155158afc937538f9bb6795677005c.png",
        "https://bpaws.b-cdn.net/8ca45afd122fa3d37af3896c789c0b3e.png",
        "https://bpaws.b-cdn.net/47b5d4bf1257f37f227ebfce7c9deafd.png",
        "https://bpaws.b-cdn.net/35b64479af6c1b590ae5cf80a44e2b25.png"
      ]
    }
  ],
  massage: [
    {
      name: "Emma Grace",
      age: 28,
      address: "Chelsea, London",
      bio: "Professional massage therapist with healing hands",
      phone: "+44 20 5555 1234",
      email: "emma.grace@hautelondon.com",
      rates: [
        { duration: "30 min", price: 80 },
        { duration: "1 hour", price: 120 },
        { duration: "90 min", price: 170 },
        { duration: "2 hours", price: 200 }
      ],
      description: "Certified massage therapist specializing in Swedish, deep tissue, and aromatherapy massage techniques.",
      location: "West London",
      status: "Elite" as const,
      images: [
        "https://bpaws.b-cdn.net/8a5534f9a3ab70d4e9ddc1f25570757f.jpg",
        "https://bpaws.b-cdn.net/392dc9a7285d7db0660a19b7637c3b89.jpg",
        "https://bpaws.b-cdn.net/096c81fb8ef8e7e2c48b5479a8440724.jpg",
        "https://bpaws.b-cdn.net/79764048ed6f6ed7eb785786b2d8a21b.jpg"
      ]
    }
  ],
  spa: [
    {
      name: "Victoria Wellness",
      age: 26,
      address: "Kensington, London",
      bio: "Luxury spa treatment specialist",
      phone: "+44 20 7777 8888",
      email: "victoria@hautelondon.com",
      rates: [
        { duration: "1 hour", price: 150 },
        { duration: "2 hours", price: 280 },
        { duration: "3 hours", price: 400 },
        { duration: "Full Day", price: 800 }
      ],
      description: "Comprehensive spa treatments including aromatherapy, hot stone massage, and luxury facials.",
      location: "South London",
      status: "Standard" as const,
      images: [
        "https://bpaws.b-cdn.net/a62f7ca7e1238d1882a59ca625bc1a61.jpg",
        "https://bpaws.b-cdn.net/ee86391fc532dfb020aaed68b03a81b1.jpg",
        "https://bpaws.b-cdn.net/eef198e89946ccb4632d9c5c8cc829e9.jpg",
        "https://bpaws.b-cdn.net/f04fedec01f0ea1ad145d8e19b50eaec.jpg"
      ]
    }
  ]
};


const Home: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const serviceCards = selectedService ? serviceDetails[selectedService as keyof typeof serviceDetails] : [];

  // Get the region name for display
  const getLocationDisplay = (value: string | null) => {
    if (!value) return '';
    const location = locationData.find(loc => loc.value === value);
    return location ? `${location.label}, ${location.region}` : '';
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image with enhanced gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: 'url(/images/hero/hero.jpg)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70" />
      </div>

      {/* Content */}
      <Container size="xl" className="relative z-10 px-4 pt-[120px] md:pt-[180px] pb-12 md:pb-20">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-forum text-white mb-4 md:mb-8 tracking-wide">
            Find Your Desire
          </h1>
          <div className="flex items-center justify-center gap-8 md:gap-12 max-w-2xl mx-auto px-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform">
                <FaUserFriends className="text-[#ff4b6e] text-lg" />
              </div>
              <span className="text-white/70 text-sm font-forum">Verified</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform">
                <FaRegGem className="text-[#ff4b6e] text-lg" />
              </div>
              <span className="text-white/70 text-sm font-forum">Premium</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-black/30 flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform">
                <FaPhoneAlt className="text-[#ff4b6e] text-lg" />
              </div>
              <span className="text-white/70 text-sm font-forum">24/7 Support</span>
            </div>
          </div>
        </div>

        {/* Selectors */}
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 px-4">
          {/* Location Selector */}
          <div className="relative group transform hover:scale-[1.02] transition-all duration-300">
            <Select
              placeholder="Where would you like to meet?"
              data={groupedLocations}
              value={selectedLocation}
              onChange={setSelectedLocation}
              searchable
              maxDropdownHeight={400}
              leftSection={<FaMapMarkedAlt className="text-[#ff4b6e] group-hover:scale-110 transition-transform" size={24} />}
              size="lg"
              classNames={{
                input: 'bg-black/40 border-2 border-white/20 text-white font-forum text-lg md:text-xl pl-12 md:pl-14 pr-4 md:pr-6 h-[60px] md:h-[70px] hover:border-[#ff4b6e]/50 transition-all duration-300 rounded-xl shadow-lg backdrop-blur-lg',
                dropdown: 'bg-black/90 border border-white/10 backdrop-blur-md rounded-xl mt-2',
                option: 'text-white font-forum hover:bg-[#ff4b6e]/10 transition-colors py-3 text-base md:text-lg',
                groupLabel: 'text-[#ff4b6e] font-forum text-lg md:text-xl px-4 py-3 border-b border-white/10'
              }}
            />
            
            {/* Decorative elements */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-[#ff4b6e]/20 via-[#ff4b6e]/10 to-[#ff4b6e]/20 rounded-xl -z-10 group-hover:blur-xl transition-all duration-300" />
            <div className="absolute -inset-[1px] bg-gradient-to-r from-[#ff4b6e]/10 via-[#ff4b6e]/5 to-[#ff4b6e]/10 rounded-xl blur-xl -z-20 group-hover:blur-2xl transition-all duration-300" />
          </div>

          {/* Selected Location Display */}
          {selectedLocation && (
            <div className="flex items-center justify-center gap-2 md:gap-3 text-white/90 font-forum text-lg md:text-xl py-3 md:py-4 px-4 backdrop-blur-sm bg-black/20 rounded-xl border border-white/10">
              <FaRegSmile className="text-[#ff4b6e]" size={20} />
              <Text className="tracking-wide">Selected Area: {getLocationDisplay(selectedLocation)}</Text>
            </div>
          )}

          {/* Service Selector */}
          {selectedLocation && (
            <div className="relative group transform hover:scale-[1.02] transition-all duration-300">
              <Select
                placeholder="What experience are you looking for?"
                data={getServicesWithIcons()}
                value={selectedService}
                onChange={setSelectedService}
                size="lg"
                leftSection={<FaRegClock className="text-[#ff4b6e] group-hover:scale-110 transition-transform" size={24} />}
                classNames={{
                  input: 'bg-black/40 border-2 border-white/20 text-white font-forum text-lg md:text-xl pl-12 md:pl-14 pr-4 md:pr-6 h-[60px] md:h-[70px] hover:border-[#ff4b6e]/50 transition-all duration-300 rounded-xl shadow-lg backdrop-blur-lg',
                  dropdown: 'bg-black/90 border border-white/10 backdrop-blur-md rounded-xl mt-2',
                  option: 'text-white font-forum hover:bg-[#ff4b6e]/10 transition-colors py-3 text-base md:text-lg',
                  label: 'text-white/90 font-forum'
                }}
              />
              <div className="absolute -inset-[2px] bg-gradient-to-r from-[#ff4b6e]/20 via-[#ff4b6e]/10 to-[#ff4b6e]/20 rounded-xl -z-10 group-hover:blur-xl transition-all duration-300" />
              <div className="absolute -inset-[1px] bg-gradient-to-r from-[#ff4b6e]/10 via-[#ff4b6e]/5 to-[#ff4b6e]/10 rounded-xl blur-xl -z-20 group-hover:blur-2xl transition-all duration-300" />
            </div>
          )}
        </div>

        {/* Service Cards */}
        {selectedService && (
          <SimpleGrid 
            cols={{ base: 1, md: 2 }} 
            spacing={{ base: "md", md: "xl" }} 
            className="mt-8 md:mt-12 px-2 md:px-4"
          >
            {serviceCards.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </SimpleGrid>
        )}
      </Container>
    </div>
  );
};

export default Home; 