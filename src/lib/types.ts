export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  year: string;
  avatar: string;
  xp: number;
  level: number;
  role: 'student' | 'club_lead' | 'admin';
  badges: string[];
  gamesPlayed: number;
  gamesWon: number;
}

export interface RecruitmentPost {
  id: string;
  title: string;
  eventName: string;
  organizer: string;
  department: string;
  category: 'dance' | 'tech' | 'cultural' | 'sports' | 'media' | 'management';
  description: string;
  rolesNeeded: string[];
  requirements: string[];
  perks: string[];
  spots: number;
  deadline: string;
  eventDate: string;
  isUrgent?: boolean;
  applicantsCount: number;
  createdAt: string;
}

export interface Application {
  id: string;
  recruitmentId: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  studentDept: string;
  studentPhone: string;
  studentEmail: string;
  roleApplied: string;
  experience: string;
  whyJoin: string;
  portfolioUrl?: string;
  status: 'pending' | 'shortlisted' | 'accepted' | 'rejected';
  submittedAt: string;
}

export interface ConfessionComment {
  id: string;
  authorAlias: string;
  content: string;
  createdAt: string;
}

export interface Confession {
  id: string;
  content: string;
  category: 'crush' | 'campus-rant' | 'hostel' | 'exams' | 'confession' | 'appreciation';
  authorAlias: string; // e.g. "Anonymous Falcon #84"
  reactions: {
    love: number;
    laugh: number;
    shock: number;
    support: number;
    tea: number;
  };
  comments: ConfessionComment[];
  createdAt: string;
  isFlagged?: boolean;
}

export interface CampusEvent {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  image: string;
  description: string;
  registrationOpen: boolean;
  prizePool?: string;
  tags: string[];
}
