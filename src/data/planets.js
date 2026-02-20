export const planetsData = [
  {
    id: 'mercury',
    name: 'Mercury',
    radius: 0.38,
    distance: 5,
    speed: 0.04,
    rotationSpeed: 0.01,
    color: '#a8a8a8',
    texture: '/textures/mercury.jpg',
    description: 'The smallest planet in our solar system and nearest to the Sun, Mercury is only slightly larger than Earth\'s Moon.',
    moons: 0,
    type: 'Terrestrial'
  },
  {
    id: 'venus',
    name: 'Venus',
    radius: 0.95,
    distance: 8,
    speed: 0.015,
    rotationSpeed: 0.005,
    color: '#e0c296',
    texture: '/textures/venus.jpg',
    description: 'Spinning in the opposite direction to most planets, Venus is the hottest planet in our solar system.',
    moons: 0,
    type: 'Terrestrial'
  },
  {
    id: 'earth',
    name: 'Earth',
    radius: 1,
    distance: 12,
    speed: 0.01,
    rotationSpeed: 0.02,
    color: '#2b82c9',
    texture: '/textures/earth.jpg',
    description: 'Our home planet is the only place we know of so far that\'s inhabited by living things.',
    moons: 1,
    type: 'Terrestrial',
    satellites: [
      {
        id: 'moon',
        name: 'Moon',
        radius: 0.27,
        distance: 2.5,
        speed: 0.1,
        rotationSpeed: 0.05,
        color: '#aaaaaa',
        texture: '/textures/moon.jpg',
        type: 'Satellite',
        discoverer: 'Known since antiquity',
        discoveryDate: 'Prehistoric',
        description: 'Earth\'s only proper natural satellite. It is one of the largest natural satellites in the Solar System, and the largest among planetary satellites relative to the size of the planet that it orbits.'
      }
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    radius: 0.53,
    distance: 16,
    speed: 0.008,
    rotationSpeed: 0.02,
    color: '#c1440e',
    texture: '/textures/mars.jpg',
    description: 'Mars is a dusty, cold, desert world with a very thin atmosphere. There is strong evidence Mars was – billions of years ago – wetter and warmer, with a thicker atmosphere.',
    moons: 2,
    type: 'Terrestrial',
    satellites: [
      { id: 'phobos', name: 'Phobos', radius: 0.1, distance: 1.5, speed: 0.3, rotationSpeed: 0.1, color: '#888888', texture: '/textures/moon.jpg', type: 'Satellite', discoverer: 'Asaph Hall', discoveryDate: '1877', description: 'The larger and closer of the two natural satellites of Mars. It is a small, irregularly shaped object with a heavily cratered surface.' },
      { id: 'deimos', name: 'Deimos', radius: 0.08, distance: 2.0, speed: 0.2, rotationSpeed: 0.08, color: '#aaaaaa', texture: '/textures/moon.jpg', type: 'Satellite', discoverer: 'Asaph Hall', discoveryDate: '1877', description: 'The smaller and outermost of the two natural satellites of Mars. It takes 30.3 hours to orbit Mars.' }
    ]
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    radius: 2.5,
    distance: 24,
    speed: 0.002,
    rotationSpeed: 0.04,
    color: '#d39c7e',
    texture: '/textures/jupiter.jpg',
    description: 'Jupiter is more than twice as massive than the other planets of our solar system combined. The giant planet\'s Great Red spot is a centuries-old storm bigger than Earth.',
    moons: 79,
    type: 'Gas Giant',
    satellites: [
      { id: 'io', name: 'Io', radius: 0.2, distance: 3.5, speed: 0.8, rotationSpeed: 0.1, color: '#e6da73', texture: '/textures/moon.jpg', type: 'Satellite', discoverer: 'Galileo Galilei', discoveryDate: '1610', description: 'The innermost and third-largest of the four Galilean moons of the planet Jupiter. It is the most geologically active object in the Solar System.' },
      { id: 'europa', name: 'Europa', radius: 0.18, distance: 4.5, speed: 0.4, rotationSpeed: 0.1, color: '#8cabbf', texture: '/textures/moon.jpg', type: 'Satellite', discoverer: 'Galileo Galilei', discoveryDate: '1610', description: 'The smallest of the four Galilean moons orbiting Jupiter, and the sixth-closest to the planet. It is primarily made of silicate rock and has a water-ice crust.' },
      { id: 'ganymede', name: 'Ganymede', radius: 0.3, distance: 6.0, speed: 0.2, rotationSpeed: 0.1, color: '#7d7065', texture: '/textures/moon.jpg', type: 'Satellite', discoverer: 'Galileo Galilei', discoveryDate: '1610', description: 'The largest and most massive of the Solar System\'s moons. The ninth-largest object in the Solar System, it is the largest without a substantial atmosphere.' },
      { id: 'callisto', name: 'Callisto', radius: 0.28, distance: 8.0, speed: 0.1, rotationSpeed: 0.1, color: '#5e5a56', texture: '/textures/moon.jpg', type: 'Satellite', discoverer: 'Galileo Galilei', discoveryDate: '1610', description: 'The second-largest moon of Jupiter, after Ganymede. It is the third-largest moon in the Solar System after Ganymede and Saturn\'s largest moon Titan.' }
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    radius: 2.1,
    distance: 34,
    speed: 0.0009,
    rotationSpeed: 0.038,
    color: '#c5ab6e',
    texture: '/textures/saturn.jpg',
    hasRings: true,
    ringColor: '#a89461',
    ringTexture: '/textures/saturn_ring.png',
    ringInnerRadius: 2.8,
    ringOuterRadius: 4.2,
    description: 'Adorned with a dazzling, complex system of icy rings, Saturn is unique in our solar system.',
    moons: 82,
    type: 'Gas Giant',
    satellites: [
      { id: 'titan', name: 'Titan', radius: 0.35, distance: 6.0, speed: 0.1, rotationSpeed: 0.05, color: '#d6a347', texture: '/textures/moon.jpg', type: 'Satellite', discoverer: 'Christiaan Huygens', discoveryDate: '1655', description: 'The largest moon of Saturn and the second-largest natural satellite in the Solar System. It is the only moon known to have a dense atmosphere.' },
      { id: 'enceladus', name: 'Enceladus', radius: 0.15, distance: 4.8, speed: 0.3, rotationSpeed: 0.1, color: '#eeeeee', texture: '/textures/moon.jpg', type: 'Satellite', discoverer: 'William Herschel', discoveryDate: '1789', description: 'The sixth-largest moon of Saturn. It is mostly covered by fresh, clean ice, making it one of the most reflective bodies of the Solar System.' }
    ]
  },
  {
    id: 'uranus',
    name: 'Uranus',
    radius: 1.5,
    distance: 44,
    speed: 0.0004,
    rotationSpeed: 0.03,
    color: '#4b70dd',
    texture: '/textures/uranus.jpg',
    description: 'Uranus—seventh planet from the Sun—rotates at a nearly 90-degree angle from the plane of its orbit.',
    moons: 27,
    type: 'Ice Giant',
    satellites: [
      { id: 'titania', name: 'Titania', radius: 0.2, distance: 3.0, speed: 0.2, rotationSpeed: 0.1, color: '#a5bdae', texture: '/textures/moon.jpg', type: 'Satellite', discoverer: 'William Herschel', discoveryDate: '1787', description: 'The largest of the moons of Uranus and the eighth largest moon in the Solar System. It consists of approximately equal amounts of ice and rock.' }
    ]
  },
  {
    id: 'neptune',
    name: 'Neptune',
    radius: 1.4,
    distance: 52,
    speed: 0.0001,
    rotationSpeed: 0.032,
    color: '#274687',
    texture: '/textures/neptune.jpg',
    description: 'Neptune—the eighth and most distant major planet orbiting our Sun—is dark, cold and whipped by supersonic winds.',
    moons: 14,
    type: 'Ice Giant',
    satellites: [
      { id: 'triton', name: 'Triton', radius: 0.2, distance: 3.0, speed: -0.2, rotationSpeed: 0.1, color: '#a3bccc', texture: '/textures/moon.jpg', type: 'Satellite', discoverer: 'William Lassell', discoveryDate: '1846', description: 'The largest natural satellite of the planet Neptune, and the first Neptunian moon to be discovered. It is the only large moon in the Solar System with a retrograde orbit.' }
    ]
  },
  {
    id: 'ceres',
    name: 'Ceres',
    radius: 0.15,
    distance: 19,
    speed: 0.005,
    rotationSpeed: 0.1,
    color: '#999999',
    texture: '/textures/moon.jpg',
    description: 'Ceres is the largest object in the asteroid belt between Mars and Jupiter and the only dwarf planet located in the inner solar system.',
    moons: 0,
    type: 'Dwarf Planet'
  },
  {
    id: 'pluto',
    name: 'Pluto',
    radius: 0.18,
    distance: 60,
    speed: 0.00008,
    rotationSpeed: 0.015,
    color: '#ddc4a9',
    texture: '/textures/moon.jpg', // Using generic moon texture
    description: 'Pluto is a dwarf planet in the Kuiper belt, a ring of bodies beyond the orbit of Neptune. It was the first Kuiper belt object to be discovered.',
    moons: 5,
    type: 'Dwarf Planet',
    satellites: [
      { id: 'charon', name: 'Charon', radius: 0.09, distance: 1.5, speed: 0.2, rotationSpeed: 0.2, color: '#cccccc', texture: '/textures/moon.jpg', type: 'Satellite', discoverer: 'James Christy', discoveryDate: '1978', description: 'The largest of the five known natural satellites of the dwarf planet Pluto.' }
    ]
  },
  {
    id: 'eris',
    name: 'Eris',
    radius: 0.17,
    distance: 72,
    speed: 0.00005,
    rotationSpeed: 0.01,
    color: '#e0e0e0',
    texture: '/textures/moon.jpg',
    description: 'Eris is the most massive and second-largest known dwarf planet in the Solar System. It is a trans-Neptunian object in the scattered disc.',
    moons: 1,
    type: 'Dwarf Planet'
  }
];
