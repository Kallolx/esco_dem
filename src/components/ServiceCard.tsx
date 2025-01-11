import React, { useState } from 'react';
import { Card, Group, Text, Badge, Stack, Button, UnstyledButton } from '@mantine/core';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Rate {
  duration: string;
  price: number;
}

interface ServiceCardProps {
  name: string;
  age: number;
  address: string;
  bio: string;
  phone: string;
  email: string;
  rates: Rate[];
  description: string;
  location: string;
  status: 'VIP' | 'Premium' | 'Elite' | 'Standard';
  images: string[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  name,
  age,
  address,
  bio,
  phone,
  email,
  rates,
  description,
  location,
  status,
  images,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VIP':
        return 'gradient';
      case 'Premium':
        return 'gold';
      case 'Elite':
        return 'violet';
      default:
        return 'gray';
    }
  };

  return (
    <Card 
      className="bg-black/40 backdrop-blur-md border border-white/10 hover:border-[#ff4b6e]/50 transition-all duration-300"
      padding="lg"
    >
      <Card.Section>
        <div className="relative">
          <div className="relative group">
            <img
              src={images[currentImageIndex]}
              alt={`${name} - ${currentImageIndex + 1}`}
              className="w-full h-[400px] md:h-[500px] object-cover object-top"
            />
            {images.length > 1 && (
              <>
                <UnstyledButton
                  onClick={previousImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaChevronLeft size={20} />
                </UnstyledButton>
                <UnstyledButton
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaChevronRight size={20} />
                </UnstyledButton>
              </>
            )}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-[#ff4b6e] w-4' : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <Badge
            variant={getStatusColor(status)}
            className="absolute top-4 right-4 font-forum"
            gradient={{ from: '#ff4b6e', to: '#ff8f9c' }}
          >
            {status}
          </Badge>
        </div>
      </Card.Section>

      <Stack gap="xs" my="md">
        <Group justify="space-between" align="center">
          <Text className="font-forum text-2xl text-white">{name}</Text>
          <Text className="text-white/80 font-forum">{age} years</Text>
        </Group>

        <Group gap="xs" className="text-white/80">
          <FaMapMarkerAlt className="text-[#ff4b6e]" />
          <Text size="sm" className="font-forum">{location}</Text>
        </Group>

        <Text className="text-white/70 font-forum text-sm">{address}</Text>

        <Text className="text-white/90 font-forum italic border-l-2 border-[#ff4b6e] pl-3 my-2">
          "{bio}"
        </Text>

        <div className="space-y-2 my-4">
          <Text className="text-white font-forum text-lg">Services & Rates:</Text>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {rates.map((rate, index) => (
              <Group key={index} className="bg-white/5 p-2 rounded">
                <FaClock className="text-[#ff4b6e]" />
                <Text className="text-white/90 font-forum">{rate.duration}</Text>
                <Text className="text-[#ff4b6e] font-forum ml-auto">${rate.price}</Text>
              </Group>
            ))}
          </div>
        </div>

        <Text className="text-white/80 font-forum text-sm line-clamp-3 hover:line-clamp-none cursor-pointer transition-all">
          {description}
        </Text>

        <div className="space-y-2 mt-4">
          <Group gap="xs" className="flex-col sm:flex-row">
            <Group gap="xs" className="w-full sm:w-auto">
              <FaPhone className="text-[#ff4b6e]" />
              <Text className="text-white/90 font-forum">{phone}</Text>
            </Group>
            <Group gap="xs" className="w-full sm:w-auto">
              <FaEnvelope className="text-[#ff4b6e]" />
              <Text className="text-white/90 font-forum">{email}</Text>
            </Group>
          </Group>
        </div>

        <Button
          variant="gradient"
          gradient={{ from: '#ff4b6e', to: '#ff8f9c' }}
          className="font-forum mt-4 h-[50px] text-base"
          fullWidth
        >
          Contact Now
        </Button>
      </Stack>
    </Card>
  );
};

// Example usage with dummy data
export const DummyServiceCard: React.FC = () => {
  const dummyData = {
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
      "https://example.com/model-image1.jpg",
      "https://example.com/model-image2.jpg",
      "https://example.com/model-image3.jpg"
    ]
  };

  return <ServiceCard {...dummyData} />;
};

export default ServiceCard; 