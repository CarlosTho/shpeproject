// Mock Prisma for development bypass
const mockPrisma = {
  user: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => ({ 
      id: 'mock-user-123', 
      email: data.data?.email || 'joeyjoey', 
      name: data.data?.name || 'Joey Test User',
      passwordHash: data.data?.passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
    deleteMany: async () => ({ count: 0 }),
    update: async () => ({ id: 'mock-user', email: 'joeyjoey' }),
  },
  profile: {
    findUnique: async () => ({ 
      id: 'mock-profile-123',
      userId: 'mock-user-123',
      onboardingComplete: true,
      languages: [],
      interests: [],
      communityPrefs: [],
    }),
    upsert: async () => ({ 
      id: 'mock-profile-123',
      onboardingComplete: true 
    }),
    create: async () => ({ id: 'mock-profile', onboardingComplete: true }),
    update: async () => ({ id: 'mock-profile', onboardingComplete: true }),
  },
  account: { findMany: async () => [] },
  session: { findMany: async () => [] },
  pointEntry: { findMany: async () => [] },
  opportunity: { findMany: async () => [] },
  scholarship: { findMany: async () => [] },
  event: { findMany: async () => [] },
  company: { findMany: async () => [] },
  resource: { findMany: async () => [] },
  $disconnect: async () => {},
  $connect: async () => {},
  $transaction: async (fn: any) => fn(mockPrisma),
};

export default mockPrisma;
