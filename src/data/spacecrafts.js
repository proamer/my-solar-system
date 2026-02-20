export const spacecraftsData = [
  {
    id: 'iss',
    name: 'International Space Station',
    description: 'A modular space station in low Earth orbit. It is a multinational collaborative project.',
    type: 'Spacecraft',
    radius: 0.05,
    distance: 12.5, // Slightly further than Earth (12)
    speed: 0.015,   // Faster than Earth to orbit it loosely
    rotationSpeed: 0.2,
    color: '#ffffff'
  },
  {
    id: 'jwst',
    name: 'James Webb Space Telescope',
    description: 'A space telescope designed to conduct infrared astronomy. Its high-resolution and high-sensitivity instruments allow it to view objects too old, distant, or faint for the Hubble Space Telescope.',
    type: 'Spacecraft',
    radius: 0.05,
    distance: 13.5, // L2 point loosely approximated
    speed: 0.01,    // Same orbit speed as Earth
    rotationSpeed: 0.05,
    color: '#ffd700'
  },
  {
    id: 'voyager',
    name: 'Voyager 1',
    description: 'A space probe launched by NASA on September 5, 1977. It is the most distant human-made object from Earth.',
    type: 'Spacecraft',
    radius: 0.05,
    distance: 85, // Far out
    speed: 0.00001, // Very slow angular speed due to distance
    rotationSpeed: 0.01,
    color: '#888888'
  }
];
