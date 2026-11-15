import { initialConfessions, initialRecruitmentPosts, campusEvents } from './data';
import { Confession, RecruitmentPost, Application, StudentProfile, CampusEvent } from './types';

// In-Memory store that persists per serverless instance lifecycle & can sync with MongoDB if configured
class StoreManager {
  private confessions: Confession[] = [...initialConfessions];
  private recruitments: RecruitmentPost[] = [...initialRecruitmentPosts];
  private events: CampusEvent[] = [...campusEvents];
  private applications: Application[] = [
    {
      id: 'app-sample-1',
      recruitmentId: 'dance-ikon-2026-volunteers',
      studentId: 'std-volunteer-01',
      studentName: 'Student Applicant',
      studentRoll: '23BCSE102',
      studentDept: 'Computer Science & Engineering',
      studentPhone: '+91 98765 43210',
      studentEmail: 'student@dbuu.ac.in',
      roleApplied: 'Sound, Lighting & Console Crew',
      experience: 'Managed audio console during school annual fest and fresher welcome.',
      whyJoin: 'Passionate about live acoustics, want to contribute to the university flagship event.',
      status: 'shortlisted',
      submittedAt: '2026-02-11T14:20:00Z'
    }
  ];

  private users: Map<string, StudentProfile> = new Map([
    [
      'demo@dbuu.ac.in',
      {
        id: 'user-demo-1',
        name: 'Student',
        email: 'demo@dbuu.ac.in',
        rollNumber: '23BCSE042',
        department: 'School of Engineering & Computing',
        year: '3rd Year',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Student',
        xp: 1450,
        level: 4,
        role: 'student',
        badges: ['Chess Tactician', 'Campus Scribe', 'Dance Ikon Aspirant'],
        gamesPlayed: 28,
        gamesWon: 19
      }
    ]
  ]);

  // EVENTS (Every student has access to add college events)
  public getEvents(): CampusEvent[] {
    return this.events;
  }

  public addEvent(evt: Omit<CampusEvent, 'id' | 'registrationOpen'>): CampusEvent {
    const newEvent: CampusEvent = {
      ...evt,
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      registrationOpen: true
    };
    this.events.unshift(newEvent);
    return newEvent;
  }

  // CONFESSIONS
  public getConfessions(): Confession[] {
    return this.confessions.filter(c => !c.isFlagged);
  }

  public addConfession(content: string, category: Confession['category'], customAlias?: string): Confession {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const alias = customAlias?.trim() ? customAlias.trim() : `Anonymous Student #${randomNum}`;

    const newConfession: Confession = {
      id: `conf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      content: content.trim(),
      category,
      authorAlias: alias,
      reactions: {
        love: 1,
        laugh: 0,
        shock: 0,
        support: 0,
        tea: 0
      },
      comments: [],
      createdAt: 'Just now'
    };

    this.confessions.unshift(newConfession);
    return newConfession;
  }

  public reactToConfession(id: string, type: 'love' | 'laugh' | 'shock' | 'support' | 'tea'): Confession | null {
    const confession = this.confessions.find(c => c.id === id);
    if (!confession) return null;
    if (typeof confession.reactions[type] === 'number') {
      confession.reactions[type] += 1;
    }
    return confession;
  }

  public addComment(confessionId: string, content: string, customAlias?: string) {
    const confession = this.confessions.find(c => c.id === confessionId);
    if (!confession) return null;

    const randomNum = Math.floor(10 + Math.random() * 90);
    const alias = customAlias?.trim() ? customAlias.trim() : `Anonymous Student #${randomNum}`;
    const comment = {
      id: `cmt-${Date.now()}`,
      authorAlias: alias,
      content: content.trim(),
      createdAt: 'Just now'
    };
    confession.comments.push(comment);
    return comment;
  }

  // RECRUITMENT
  public getRecruitments(): RecruitmentPost[] {
    return this.recruitments;
  }

  public getRecruitmentById(id: string): RecruitmentPost | undefined {
    return this.recruitments.find(r => r.id === id);
  }

  public addRecruitment(post: Omit<RecruitmentPost, 'id' | 'applicantsCount' | 'createdAt'>): RecruitmentPost {
    const newPost: RecruitmentPost = {
      ...post,
      id: `rec-${Date.now()}`,
      applicantsCount: 0,
      createdAt: new Date().toISOString()
    };
    this.recruitments.unshift(newPost);
    return newPost;
  }

  public submitApplication(app: Omit<Application, 'id' | 'status' | 'submittedAt'>): Application {
    const newApp: Application = {
      ...app,
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    this.applications.unshift(newApp);

    // Increment applicants counter
    const rec = this.recruitments.find(r => r.id === app.recruitmentId);
    if (rec) {
      rec.applicantsCount += 1;
    }

    return newApp;
  }

  public getApplicationsByRecruitment(recruitmentId: string): Application[] {
    return this.applications.filter(a => a.recruitmentId === recruitmentId);
  }

  public getAllApplications(): Application[] {
    return this.applications;
  }

  public updateApplicationStatus(id: string, status: Application['status']) {
    const app = this.applications.find(a => a.id === id);
    if (app) {
      app.status = status;
      return app;
    }
    return null;
  }

  // USERS
  public getUser(email: string): StudentProfile | undefined {
    return this.users.get(email.toLowerCase());
  }

  public upsertUser(user: StudentProfile): StudentProfile {
    this.users.set(user.email.toLowerCase(), user);
    return user;
  }
}

// Global singleton for Next.js hot reload safety
const globalForStore = globalThis as unknown as { dbuuStore: StoreManager };
export const store = globalForStore.dbuuStore || new StoreManager();
if (process.env.NODE_ENV !== 'production') globalForStore.dbuuStore = store;
