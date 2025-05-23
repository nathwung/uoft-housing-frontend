const listings = [
  {
    id: 1,
    title: 'Bright 1BR near St. George',
    type: 'Sublet',
    description: 'Furnished sublet available for summer. Includes utilities and Wi-Fi.',
    location: 'Harbord & Spadina',
    price: 950,
    negotiable: true,
    startDate: '2025-05-01',
    endDate: '2025-08-31',
    bedrooms: 1,
    bathrooms: 1,
    furnished: true,
    amenities: ['Wi-Fi', 'Laundry', 'Balcony'],
    images: [
      'https://images.pexels.com/photos/259950/pexels-photo-259950.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    poster: {
      name: "Alex Chen",
      email: "alex.chen@mail.utoronto.ca",
      major: "Computer Science",
      gradYear: 2026
    }
  },
  {
    id: 2,
    title: 'Shared Room in Annex',
    type: 'Roommates',
    description: 'Looking for a female roommate. Shared kitchen and bathroom.',
    location: 'Bloor & Bathurst',
    price: 675,
    negotiable: false,
    bedrooms: 2,
    bathrooms: 1,
    furnished: true,
    roommatePreference: 'Female only',
    amenities: ['Wi-Fi', 'Heating'],
    images: [
      'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    poster: {
      name: "Priya Sharma",
      email: "priya.sharma@mail.utoronto.ca",
      major: "Life Sciences",
      gradYear: 2025
    }
  },
  {
    id: 3,
    title: 'Desk & Chair Set',
    type: 'Furniture Market',
    description: 'Minimalist wooden desk and ergonomic chair. Pick-up only.',
    location: 'UofT Residence',
    price: 80,
    negotiable: true,
    bedrooms: null,
    bathrooms: null,
    furnished: false,
    amenities: [],
    images: [
      'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],    
    poster: {
      name: "Jordan Park",
      email: "jordan.park@mail.utoronto.ca",
      major: "Engineering Science",
      gradYear: 2027
    }
  },
  {
    id: 4,
    title: 'Year-Round 2BR Basement Apartment',
    type: 'Long-Term Housing',
    description: 'Spacious and private basement with separate entrance. Utilities included.',
    location: 'Dupont & Ossington',
    price: 1600,
    negotiable: false,
    bedrooms: 2,
    bathrooms: 1,
    furnished: true,
    amenities: ['Wi-Fi', 'Washer/Dryer', 'Private Entrance'],
    images: [
      'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    poster: {
      name: "Emily Wong",
      email: "emily.wong@mail.utoronto.ca",
      major: "Architecture",
      gradYear: 2024
    }
  }
];

export default listings;
