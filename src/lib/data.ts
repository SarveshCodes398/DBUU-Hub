import { RecruitmentPost, Confession, CampusEvent } from './types';

export const initialRecruitmentPosts: RecruitmentPost[] = [
  {
    id: 'dance-ikon-2026-volunteers',
    title: 'DBUU Dance Ikon 2026 — Core Volunteer & Management Squad',
    eventName: 'DBUU Dance Ikon 2026',
    organizer: 'Department of Student Welfare & Cultural Council',
    department: 'School of Architecture, Design & Performing Arts',
    category: 'dance',
    description: 'Dev Bhoomi Uttarakhand University’s biggest stage is back! DBUU Dance Ikon 2026 is recruiting energetic student coordinators, hospitality heads, backstage managers, and live media crew. Be part of the executive machinery behind Uttarakhand’s most electrifying dance extravaganza.',
    rolesNeeded: [
      'Stage Operations & Green Room Manager',
      'VIP Guest & Celebrity Escort',
      'Sound, Lighting & Console Crew',
      'Audience Flow & Security Volunteer',
      'Official Media, Reel Creator & Photographer'
    ],
    requirements: [
      'Full-time enrolled student of DBUU (any department or year)',
      'High enthusiasm, crowd management capability & punctual teamwork',
      'Available for pre-event dry runs (Feb 22-26, 2026)',
      'Previous club or volunteering experience is a plus (not mandatory)'
    ],
    perks: [
      'Official DBUU Certificate of Leadership & Event Execution',
      'Approved Duty Leave (Attendance credit for all rehearsal days)',
      'Exclusive Dance Ikon 2026 Core Crew Hoodie & ID Pass',
      'Backstage All-Access VIP Pass',
      'Catering & Refreshments throughout the event'
    ],
    spots: 24,
    deadline: '2026-02-20',
    eventDate: '2026-02-28',
    isUrgent: true,
    applicantsCount: 42,
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'pinak-tech-fest-2026',
    title: 'PINAK 2026 — Techno-Cultural Mega Fest Hackathon Volunteers',
    eventName: 'Pinak Fest 2026',
    organizer: 'School of Engineering & Computing (SOEC)',
    department: 'Computer Science & Engineering',
    category: 'tech',
    description: 'Pinak 2026 brings over 5,000+ footfalls across North India. We are recruiting technical leads to handle the 36-hour National Hackathon, Robo-Wars arena, and LAN Gaming tournaments.',
    rolesNeeded: [
      'Network & LAN Arena In-charge',
      'Hackathon Mentor Liaison',
      'Registration & Hackathon Logistics',
      'Discord & Digital Stream Moderator'
    ],
    requirements: [
      'Basic knowledge of hardware/networking or web tech',
      'Ability to pull night shifts during the 36-hr hackathon',
      'Clear communication & troubleshooting mindset'
    ],
    perks: [
      'Verified Certificate from IEEE/CSI Student Chapter',
      'Full Duty Leave for 4 days',
      'Official Pinak Hacker Swag Pack & T-Shirt',
      'Networking with tech recruiters & sponsor startups'
    ],
    spots: 18,
    deadline: '2026-03-05',
    eventDate: '2026-03-18',
    isUrgent: false,
    applicantsCount: 68,
    createdAt: '2026-02-05T14:30:00Z',
  },
  {
    id: 'spardha-sports-meet-2026',
    title: 'SPARDHA 2026 — Annual Inter-Collegiate Sports Meet Referees & Team',
    eventName: 'Spardha 2026 Sports League',
    organizer: 'DBUU Sports Council',
    department: 'Physical Education & University Sports Board',
    category: 'sports',
    description: 'Looking for energetic referees, first-aid liaisons, scorekeepers, and field managers for Football, Cricket, Basketball, and Track & Field tournaments.',
    rolesNeeded: [
      'Official Match Scorekeeper & Timekeeper',
      'First-Aid & Medical Assistance Liaison',
      'Field Equipment & Ground Marshal',
      'Ceremony & Trophy Protocol Assistant'
    ],
    requirements: [
      'Understanding of rulebooks for football, cricket or basketball',
      'Physically active and disciplined presence'
    ],
    perks: [
      'University Sports Committee Letter of Recommendation',
      'Special Sports Kit & Cap',
      'Duty Leave Granted for tournament dates'
    ],
    spots: 15,
    deadline: '2026-03-10',
    eventDate: '2026-03-24',
    isUrgent: false,
    applicantsCount: 29,
    createdAt: '2026-02-08T09:15:00Z',
  },
  {
    id: 'tedx-dbuu-curation',
    title: 'TEDxDBUU 2026 — Speaker Curation & Design Associates',
    eventName: 'TEDxDBUU',
    organizer: 'TEDx Student Organizing Committee',
    department: 'School of Journalism & Mass Communication',
    category: 'media',
    description: 'Join the licensed TEDx university chapter to research speakers, assist stage design, manage red carpet interviews, and ensure brand compliance.',
    rolesNeeded: [
      'Speaker Hospitality & Green Room Lead',
      'Graphic & Motion Designer',
      'Social Media Scribe & Copywriter'
    ],
    requirements: [
      'Strong portfolio in design or writing',
      'Polished communication in English and Hindi'
    ],
    perks: [
      'Official TEDx Organizer Credential on LinkedIn',
      'Global TED Community Recognition',
      'Dinner with keynote speakers & industry leaders'
    ],
    spots: 8,
    deadline: '2026-03-15',
    eventDate: '2026-04-04',
    isUrgent: true,
    applicantsCount: 51,
    createdAt: '2026-02-10T12:00:00Z',
  }
];

export const initialConfessions: Confession[] = [
  {
    id: 'conf-1',
    content: 'To the CSE 3rd year girl in Section B who always wears the dark olive hoodie and sits by the window in Lab 4: your laugh literally brightens up our 8 AM compiler design classes. I am way too shy to say hi in person, so here it is.',
    category: 'crush',
    authorAlias: 'Ghost In The Machine #104',
    reactions: {
      love: 84,
      laugh: 12,
      shock: 5,
      support: 47,
      tea: 19
    },
    comments: [
      {
        id: 'c1-1',
        authorAlias: 'Campus Whispers #31',
        content: 'Bro just go ask her if she completed the lab assignment! Best ice breaker ever.',
        createdAt: '2 hours ago'
      },
      {
        id: 'c1-2',
        authorAlias: 'Mystic Raven #88',
        content: 'She is in section B and reads mystery novels during breaks! You got this bro 🚀',
        createdAt: '1 hour ago'
      }
    ],
    createdAt: '3 hours ago'
  },
  {
    id: 'conf-2',
    content: 'Unpopular opinion: The Maggi and cold coffee at the DBUU backside canteen near the pharmacy block hits 10x harder than any fancy cafe in Rajpur road. Special salute to Uncle who always gives extra cheese without charging extra.',
    category: 'appreciation',
    authorAlias: 'Midnight Foodie #22',
    reactions: {
      love: 142,
      laugh: 3,
      shock: 1,
      support: 68,
      tea: 8
    },
    comments: [
      {
        id: 'c2-1',
        authorAlias: 'Canteen Chronicler #09',
        content: 'FACTS! Try his peri-peri paneer roll too, absolute peak food.',
        createdAt: '45 mins ago'
      }
    ],
    createdAt: '5 hours ago'
  },
  {
    id: 'conf-3',
    content: 'Shoutout to our hostel warden who caught 6 of us ordering Biryani at 1:30 AM over the gate, looked at us disappointed, said "Eat quietly and don\'t make noise", and walked away without writing a fine. You are a real legend Sir!',
    category: 'hostel',
    authorAlias: 'Hostel Nightwalker #77',
    reactions: {
      love: 210,
      laugh: 95,
      shock: 18,
      support: 88,
      tea: 42
    },
    comments: [
      {
        id: 'c3-1',
        authorAlias: 'Wing 3 Room 402',
        content: 'Block A warden is truly the goat 🐐',
        createdAt: '1 hour ago'
      }
    ],
    createdAt: '8 hours ago'
  },
  {
    id: 'conf-4',
    content: 'The DBUU Dance Ikon auditions are happening next week and the talent on campus is insane this year. Please tell me the choreography team is ready for the hip-hop crew coming from Dehradun colleges too!',
    category: 'campus-rant',
    authorAlias: 'Beatbox Scribe #19',
    reactions: {
      love: 67,
      laugh: 8,
      shock: 23,
      support: 54,
      tea: 31
    },
    comments: [],
    createdAt: '12 hours ago'
  },
  {
    id: 'conf-5',
    content: 'Whoever played Interstellar theme on the acoustic piano in the auditorium lobby during yesterday\'s rain while everyone was waiting under the shade: that was pure cinematic magic. Thank you.',
    category: 'appreciation',
    authorAlias: 'Himalayan Wanderer #56',
    reactions: {
      love: 189,
      laugh: 2,
      shock: 6,
      support: 72,
      tea: 14
    },
    comments: [
      {
        id: 'c5-1',
        authorAlias: 'Audio Geek #12',
        content: 'That was Rohan from Mechanical 2nd year! Dude is insanely gifted.',
        createdAt: '3 hours ago'
      }
    ],
    createdAt: '1 day ago'
  }
];

export const campusEvents: CampusEvent[] = [
  {
    id: 'dance-ikon-2026',
    title: 'DBUU Dance Ikon 2026',
    subtitle: 'Uttarakhand\'s Most Prestigious Collegiate Dance Showdown',
    category: 'Cultural & Performing Arts',
    date: 'February 28, 2026',
    time: '4:00 PM - 10:00 PM IST',
    venue: 'Main University Amphitheatre & Convention Grounds',
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=1200&q=80',
    description: 'Featuring solo, duet, and mega-crew street, classical fusion and western dance battles with celebrity judges from Bollywood and television dance reality shows.',
    registrationOpen: true,
    prizePool: '₹1,50,000 + Trophy',
    tags: ['Dance', 'Battle', 'Mega Event', 'Celebrity Night']
  },
  {
    id: 'pinak-2026',
    title: 'PINAK Techno-Cultural Fest 2026',
    subtitle: '3 Days of Code, Cybernetics, Rhythm & Starlight',
    category: 'Annual Flagship Festival',
    date: 'March 18 - 20, 2026',
    time: 'All Day Event',
    venue: 'DBUU Campus Grounds & Indoor Arena',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    description: 'North India’s premier fest combining 30+ technical hackathons, drone racing, gaming championships, fashion shows, and a massive Star EDM Night.',
    registrationOpen: true,
    prizePool: '₹5,00,000 Pool',
    tags: ['Fest', 'Hackathon', 'EDM Night', 'Robotics']
  },
  {
    id: 'spardha-2026',
    title: 'SPARDHA 2026 Olympic League',
    subtitle: 'Inter-Collegiate Sports Tournament',
    category: 'Athletics & Sports',
    date: 'March 24 - 27, 2026',
    time: '8:00 AM - 6:00 PM IST',
    venue: 'DBUU Sports Complex & Cricket Ground',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    description: 'Championship tournaments across Cricket, Football, Basketball, Volleyball, Badminton, Table Tennis, and Chess.',
    registrationOpen: true,
    prizePool: 'Trophies & Medals',
    tags: ['Sports', 'Cricket', 'Athletics', 'Championship']
  }
];
