export type Monument = {
  id: string;
  name: string;
  state: string;
  location: string;
  latitude: number;
  longitude: number;
  description: string;
  yearBuilt?: number;
};

export const MONUMENTS: Monument[] = [
  {
    id: "taj-mahal",
    name: "Taj Mahal",
    state: "Uttar Pradesh",
    location: "Agra",
    latitude: 27.1751,
    longitude: 78.0421,
    description:
      "A white marble mausoleum built by Emperor Shah Jahan for his wife Mumtaz Mahal.",
    yearBuilt: 1653,
  },
  {
    id: "hawa-mahal",
    name: "Hawa Mahal (Palace of Winds)",
    state: "Rajasthan",
    location: "Jaipur",
    latitude: 26.9244,
    longitude: 75.8267,
    description:
      "A pink sandstone structure famous for its 953 small windows designed to allow royal women to observe street life.",
    yearBuilt: 1799,
  },
  {
    id: "red-fort",
    name: "Red Fort",
    state: "Delhi",
    location: "Delhi",
    latitude: 28.6562,
    longitude: 77.241,
    description:
      "The historic fortress and palace complex that served as the main residence of Mughal emperors.",
    yearBuilt: 1648,
  },
  {
    id: "gateway-of-india",
    name: "Gateway of India",
    state: "Maharashtra",
    location: "Mumbai",
    latitude: 18.9676,
    longitude: 72.8194,
    description:
      "An iconic arch monument that serves as a symbol of Mumbai and a memorial to Indian soldiers.",
    yearBuilt: 1924,
  },
  {
    id: "mysore-palace",
    name: "Mysore Palace",
    state: "Karnataka",
    location: "Mysore",
    latitude: 12.2958,
    longitude: 76.6394,
    description:
      "One of India's most ornate palaces, known for its Indo-Saracenic architecture and intricate decorations.",
    yearBuilt: 1897,
  },
  {
    id: "khajuraho-temples",
    name: "Khajuraho Temples",
    state: "Madhya Pradesh",
    location: "Khajuraho",
    latitude: 24.8318,
    longitude: 79.92,
    description:
      "A group of Hindu and Jain temples famous for their intricate stone carvings and architectural brilliance.",
    yearBuilt: 1000,
  },
  {
    id: "ajanta-caves",
    name: "Ajanta Caves",
    state: "Maharashtra",
    location: "Ajanta",
    latitude: 20.5519,
    longitude: 75.7033,
    description:
      "Ancient Buddhist rock-cut caves with exquisite paintings and sculptures from the 2nd century BCE to 5th century CE.",
    yearBuilt: -100,
  },
  {
    id: "statue-of-unity",
    name: "Statue of Unity",
    state: "Gujarat",
    location: "Narmada Valley",
    latitude: 21.8175,
    longitude: 73.7997,
    description:
      "The world's tallest statue at 182 meters, honoring Sardar Vallabhbhai Patel.",
    yearBuilt: 2018,
  },
  {
    id: "golden-temple",
    name: "Golden Temple",
    state: "Punjab",
    location: "Amritsar",
    latitude: 31.6155,
    longitude: 74.8765,
    description:
      "The holiest shrine of Sikhism, a stunning gold-covered gurudwara symbolizing equality and community.",
    yearBuilt: 1604,
  },
  {
    id: "bodhgaya",
    name: "Mahabodhi Temple",
    state: "Bihar",
    location: "Bodh Gaya",
    latitude: 24.6928,
    longitude: 84.9918,
    description:
      "An ancient temple where Buddha attained enlightenment under the Bodhi tree.",
    yearBuilt: 500,
  },
];

export function getMapsLink(monument: Monument): string {
  return `https://www.google.com/maps/search/${encodeURIComponent(
    monument.name + " " + monument.location
  )}/@${monument.latitude},${monument.longitude},15z`;
}

export function getDirectionsLink(monument: Monument): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${monument.latitude},${monument.longitude}&destination_place_id=${monument.name}`;
}
