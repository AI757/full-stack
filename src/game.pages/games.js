export const games = [
  {
    slug: 'lanyards-attack',
    title: 'Lanyards Attack',
    eyebrow: 'A sci-fi survival game',
    tagline: 'Your badge got you in. Getting out is the hard part.',
    description:
      'A four-player survival adventure set inside a convention center that should not exist. Improvise tools, decode the venue, and stay together when the lights go out.',
    genre: 'Co-op survival',
    players: '1-4 players',
    platform: 'PC',
    status: 'In development',
    release: 'Coming soon',
    theme: 'cyan',
    features: [
      [
        '01',
        'The venue changes',
        'Every run reshuffles rooms, hazards, and exits so memorizing the map is never enough.',
      ],
      [
        '02',
        'Build strange tools',
        'Combine ordinary convention gear into scanners, decoys, and questionably safe defenses.',
      ],
      [
        '03',
        'Survive together',
        'Share scarce power, specialize your loadout, and pull your team back from the brink.',
      ],
    ],
    updates: [
      [
        'JUL 28',
        'Making every hallway tell a story',
        'How lighting, signage, and abandoned booths guide players without a minimap.',
      ],
      [
        'JUN 12',
        'The first creature pass',
        'Why the things in the dark never run in straight lines.',
      ],
    ],
  },
  {
    slug: 'signal-lost',
    title: 'Signal Lost',
    eyebrow: 'A narrative exploration game',
    tagline: 'Every frequency remembers something.',
    description:
      'Cross a flooded desert with a hand-built receiver, collecting the final broadcasts of a vanished town and deciding which stories deserve to be heard again.',
    genre: 'Narrative adventure',
    players: 'Single player',
    platform: 'PC / Mac',
    status: 'Available now',
    release: 'Released 2025',
    theme: 'violet',
    features: [
      [
        '01',
        'Tune the unknown',
        'Sweep across a reactive radio spectrum and isolate voices hidden beneath the static.',
      ],
      [
        '02',
        'Follow every signal',
        'Each broadcast opens a path and changes what you understand about the landscape.',
      ],
      [
        '03',
        'Choose the archive',
        'Build a final record from the stories you save - and accept the ones you leave behind.',
      ],
    ],
    updates: [
      [
        'MAY 03',
        'Signal Lost is out now',
        'Our quietest game has finally found its way into the world. Thank you for listening.',
      ],
      [
        'APR 19',
        'Recording the desert',
        "Inside the field sessions that shaped the game's wind, wires, and radio noise.",
      ],
    ],
  },
  {
    slug: 'ashfall-protocol',
    title: 'Ashfall Protocol',
    eyebrow: 'A tactical strategy game',
    tagline: 'Hold the line while the sky comes down.',
    description:
      'Command a volunteer rescue crew across a living wildfire map. Read the wind, protect evacuation routes, and make impossible calls before the next front arrives.',
    genre: 'Tactical strategy',
    players: 'Single player',
    platform: 'PC',
    status: 'Available now',
    release: 'Released 2024',
    theme: 'ember',
    features: [
      [
        '01',
        'Read the fire',
        'Wind, terrain, and fuel drive a simulation that turns every map into a moving puzzle.',
      ],
      [
        '02',
        'Lead real people',
        'Your crew carries stress, trust, and hard-earned skills from one operation to the next.',
      ],
      [
        '03',
        'No perfect outcomes',
        'Every order spends time you do not have. Save what you can and live with what you choose.',
      ],
    ],
    updates: [
      [
        'MAR 08',
        'Free scenario: North Ridge',
        'A new late-game operation introduces shifting winds and multiple evacuation zones.',
      ],
      [
        'FEB 14',
        'Balancing pressure, not punishment',
        'How we adjusted the fire model while keeping every decision sharp and readable.',
      ],
    ],
  },
]

export function getGame(slug) {
  return games.find((game) => game.slug === slug)
}
