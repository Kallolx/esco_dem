-- Insert test profiles
INSERT INTO profiles (
  email,
  phone,
  name,
  age,
  title,
  description,
  location,
  is_verified,
  is_vip,
  rating,
  gallery,
  stats,
  services,
  rates,
  availability,
  contact,
  terms_accepted,
  status
) VALUES
(
  'isabella@example.com',
  '+1234567890',
  'Isabella',
  23,
  'Luxury Companion | VIP Experience',
  'Hello gentlemen! I''m Isabella, your perfect companion for an unforgettable experience. I offer a genuine GFE with a touch of class and adventure.',
  'Los Angeles, California',
  true,
  true,
  4.9,
  '{
    "main": [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
      "https://images.unsplash.com/photo-1526080676457-4544bf0ebba9",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
    ],
    "private": []
  }',
  '{
    "height": "5''7\"",
    "measurements": "34C-24-36",
    "dress_size": "4",
    "eye_color": "Brown",
    "hair_color": "Brunette",
    "ethnicity": "Latin",
    "nationality": "Brazilian",
    "languages": ["English", "Portuguese", "Spanish"]
  }',
  '{
    "standard": [
      "GFE",
      "Dinner Dates",
      "Overnight",
      "Travel Companion",
      "Massage"
    ],
    "extra": [
      "Role Play",
      "Lingerie",
      "Couples"
    ]
  }',
  '{
    "incall": {
      "hourly": 400,
      "twohour": 700,
      "overnight": 2000
    },
    "outcall": {
      "hourly": 500,
      "twohour": 800,
      "overnight": 2500
    }
  }',
  '{
    "days": ["Mon", "Tue", "Wed", "Thu", "Fri"],
    "hours": {
      "start": "09:00",
      "end": "22:00"
    },
    "notice": "1 hour advance notice required"
  }',
  '{
    "phone": "+1234567890",
    "email": "isabella@example.com",
    "whatsapp": "+1234567890"
  }',
  true,
  'active'
),
(
  'sophie@example.com',
  '+1987654321',
  'Sophie',
  25,
  'Elite Model | High-Class Experience',
  'Greetings! I''m Sophie, your sophisticated and elegant companion. Let me take you on a journey of pure pleasure and relaxation.',
  'New York City, New York',
  true,
  true,
  4.8,
  '{
    "main": [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04",
      "https://images.unsplash.com/photo-1604004555489-723a93d6ce74",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
    ],
    "private": []
  }',
  '{
    "height": "5''9\"",
    "measurements": "36D-26-36",
    "dress_size": "6",
    "eye_color": "Blue",
    "hair_color": "Blonde",
    "ethnicity": "Caucasian",
    "nationality": "French",
    "languages": ["English", "French"]
  }',
  '{
    "standard": [
      "GFE",
      "Fine Dining",
      "Social Events",
      "Weekend Getaways",
      "Massage"
    ],
    "extra": [
      "Fetish Friendly",
      "BDSM",
      "Fantasy"
    ]
  }',
  '{
    "incall": {
      "hourly": 500,
      "twohour": 900,
      "overnight": 2500
    },
    "outcall": {
      "hourly": 600,
      "twohour": 1000,
      "overnight": 3000
    }
  }',
  '{
    "days": ["Mon", "Wed", "Thu", "Fri", "Sat"],
    "hours": {
      "start": "12:00",
      "end": "00:00"
    },
    "notice": "2 hours advance notice required"
  }',
  '{
    "phone": "+1987654321",
    "email": "sophie@example.com",
    "whatsapp": null
  }',
  true,
  'active'
); 