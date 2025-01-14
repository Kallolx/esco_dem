import React from 'react';
import { Modal, Image, SimpleGrid, Center } from '@mantine/core';

interface GalleryModalProps {
  opened: boolean;
  onClose: () => void;
  images: string[];
  activeImage: number;
  setActiveImage: (index: number) => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  opened,
  onClose,
  images,
  activeImage,
  setActiveImage,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="90%"
      centered
      styles={{
        content: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
        },
        header: {
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
        }
      }}
    >
      <Center>
        <Image
          src={images[activeImage]}
          fit="contain"
          height="80vh"
        />
      </Center>
      <SimpleGrid cols={8} mt="md">
        {images.map((img, index) => (
          <Image
            key={index}
            src={img}
            height={80}
            fit="cover"
            onClick={() => setActiveImage(index)}
            style={{ 
              cursor: 'pointer',
              borderRadius: '4px',
              border: activeImage === index ? '2px solid #ff4b6e' : 'none',
              opacity: activeImage === index ? 1 : 0.6,
              transition: 'opacity 0.2s ease'
            }}
          />
        ))}
      </SimpleGrid>
    </Modal>
  );
};

export default GalleryModal; 