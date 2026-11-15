import { NextResponse } from 'next/server';

interface StudyResource {
  id: string;
  title: string;
  dept: string;
  deptName: string;
  sem: string;
  type: string;
  size: string;
  downloads: number;
  rating: number;
  tags: string[];
  link?: string;
  uploadedBy?: string;
  uploadedAt: string;
}

const initialVault: StudyResource[] = [
  {
    id: 'res-1',
    title: 'Data Structures & Algorithms — End-Term Previous 5 Years PYQs',
    dept: 'engineering',
    deptName: 'School of Engineering & Computing',
    sem: 'Semester 3 / 4',
    type: 'PYQ Question Bank',
    size: '4.8 MB',
    downloads: 412,
    rating: 4.9,
    tags: ['B.Tech CSE', 'Algorithms', 'PYQ'],
    uploadedAt: '2026-02-01'
  },
  {
    id: 'res-2',
    title: 'Operating Systems & Linux Kernel Lab Manual 2026',
    dept: 'engineering',
    deptName: 'School of Engineering & Computing',
    sem: 'Semester 4',
    type: 'Lab Manual',
    size: '6.2 MB',
    downloads: 320,
    rating: 4.8,
    tags: ['OS', 'Linux', 'Lab'],
    uploadedAt: '2026-02-05'
  },
  {
    id: 'res-3',
    title: 'Corporate Financial Management & Business Analytics Notes',
    dept: 'management',
    deptName: 'School of Management & Commerce',
    sem: 'MBA / BBA Sem 2',
    type: 'Lecture Notes',
    size: '3.4 MB',
    downloads: 215,
    rating: 4.7,
    tags: ['Finance', 'MBA', 'Analytics'],
    uploadedAt: '2026-02-08'
  },
  {
    id: 'res-4',
    title: 'Pharmacology & Medicinal Chemistry Comprehensive Guide',
    dept: 'pharmacy',
    deptName: 'School of Pharmacy',
    sem: 'B.Pharm Sem 5',
    type: 'Study Guide',
    size: '8.1 MB',
    downloads: 188,
    rating: 4.9,
    tags: ['Pharmacy', 'Medicinal', 'B.Pharm'],
    uploadedAt: '2026-02-10'
  },
  {
    id: 'res-5',
    title: 'Architectural Drafting & CAD Principles Blueprint Pack',
    dept: 'architecture',
    deptName: 'School of Architecture & Design',
    sem: 'B.Arch Sem 3',
    type: 'Design Portfolio & Notes',
    size: '12.5 MB',
    downloads: 142,
    rating: 4.8,
    tags: ['Architecture', 'AutoCAD', 'Design'],
    uploadedAt: '2026-02-12'
  }
];

const globalForVault = globalThis as unknown as { dbuuVault: StudyResource[] };
const vaultStore = globalForVault.dbuuVault || [...initialVault];
if (process.env.NODE_ENV !== 'production') globalForVault.dbuuVault = vaultStore;

export async function GET() {
  return NextResponse.json({ success: true, count: vaultStore.length, data: vaultStore });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, dept, deptName, sem, type, size, link, tags } = body;

    if (!title || !dept || !type) {
      return NextResponse.json({ success: false, error: 'Title, Department, and Type are required' }, { status: 400 });
    }

    const newResource: StudyResource = {
      id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: title.trim(),
      dept,
      deptName: deptName || (dept === 'engineering' ? 'School of Engineering & Computing' : 'DBUU Department'),
      sem: sem || 'All Semesters',
      type: type || 'PYQ Question Bank',
      size: size || '3.5 MB',
      downloads: 1,
      rating: 5.0,
      tags: Array.isArray(tags) && tags.length ? tags : ['StudyMaterial', 'DBUU'],
      link: link || '#',
      uploadedAt: new Date().toISOString().split('T')[0]
    };

    vaultStore.unshift(newResource);
    return NextResponse.json({ success: true, data: newResource }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
