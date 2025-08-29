import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const user1 = await prisma.user.upsert({
    where: { email: 'demo@tutorspeakai.com' },
    update: {},
    create: {
      email: 'demo@tutorspeakai.com',
      passwordHash: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      subscriptionTier: 'pro',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'teacher@tutorspeakai.com' },
    update: {},
    create: {
      email: 'teacher@tutorspeakai.com',
      passwordHash: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      subscriptionTier: 'basic',
    },
  });

  console.log('✅ Created users:', { user1: user1.email, user2: user2.email });

  // Create sample companions
  const mathCompanion = await prisma.companion.create({
    data: {
      userId: user1.id,
      name: 'Professor Math',
      subjectDomain: 'mathematics',
      systemPrompt: 'You are Professor Math, a friendly and patient mathematics tutor. You excel at breaking down complex mathematical concepts into simple, understandable steps. You use real-world examples and encourage students to think critically about problem-solving approaches.',
      voiceId: 'alloy',
      speakingStyle: 'professional',
      isPublic: true,
    },
  });

  const scienceCompanion = await prisma.companion.create({
    data: {
      userId: user1.id,
      name: 'Dr. Science',
      subjectDomain: 'science',
      systemPrompt: 'You are Dr. Science, an enthusiastic science educator who loves to make learning fun and engaging. You use experiments, analogies, and interactive discussions to help students understand scientific principles. You encourage curiosity and critical thinking.',
      voiceId: 'nova',
      speakingStyle: 'enthusiastic',
      isPublic: true,
    },
  });

  const languageCompanion = await prisma.companion.create({
    data: {
      userId: user2.id,
      name: 'Ms. Language',
      subjectDomain: 'language',
      systemPrompt: 'You are Ms. Language, a supportive language arts teacher who helps students improve their reading, writing, and communication skills. You provide constructive feedback and encourage creative expression while maintaining proper grammar and structure.',
      voiceId: 'shimmer',
      speakingStyle: 'friendly',
      isPublic: false,
    },
  });

  console.log('✅ Created companions:', {
    math: mathCompanion.name,
    science: scienceCompanion.name,
    language: languageCompanion.name,
  });

  // Create sample courses
  const mathCourse = await prisma.course.create({
    data: {
      userId: user1.id,
      companionId: mathCompanion.id,
      title: 'Introduction to Algebra',
      description: 'Learn the fundamentals of algebra including variables, equations, and problem-solving techniques.',
      subjectDomain: 'mathematics',
      difficultyLevel: 'beginner',
      estimatedDuration: 120,
      status: 'published',
      isPublic: true,
    },
  });

  const scienceCourse = await prisma.course.create({
    data: {
      userId: user1.id,
      companionId: scienceCompanion.id,
      title: 'Basic Chemistry Concepts',
      description: 'Explore the building blocks of matter, chemical reactions, and the periodic table.',
      subjectDomain: 'science',
      difficultyLevel: 'intermediate',
      estimatedDuration: 180,
      status: 'published',
      isPublic: true,
    },
  });

  const writingCourse = await prisma.course.create({
    data: {
      userId: user2.id,
      companionId: languageCompanion.id,
      title: 'Creative Writing Workshop',
      description: 'Develop your creative writing skills through exercises, prompts, and peer feedback.',
      subjectDomain: 'language',
      difficultyLevel: 'intermediate',
      estimatedDuration: 150,
      status: 'draft',
      isPublic: false,
    },
  });

  console.log('✅ Created courses:', {
    math: mathCourse.title,
    science: scienceCourse.title,
    writing: writingCourse.title,
  });

  // Create sample chapters for math course
  const mathChapter1 = await prisma.chapter.create({
    data: {
      courseId: mathCourse.id,
      title: 'Understanding Variables',
      content: 'In algebra, a variable is a symbol (usually a letter) that represents an unknown number. Variables allow us to write general rules and solve problems where we don\'t know all the values initially. For example, in the equation x + 5 = 10, x is a variable that represents the unknown number we need to find.',
      orderIndex: 1,
      estimatedDuration: 30,
      narrationStatus: 'completed',
    },
  });

  const mathChapter2 = await prisma.chapter.create({
    data: {
      courseId: mathCourse.id,
      title: 'Solving Linear Equations',
      content: 'Linear equations are equations where the variable appears to the first power only. To solve them, we use inverse operations to isolate the variable. The goal is to get the variable by itself on one side of the equation. Remember: whatever you do to one side, you must do to the other side to keep the equation balanced.',
      orderIndex: 2,
      estimatedDuration: 45,
      narrationStatus: 'pending',
    },
  });

  // Create sample chapters for science course
  const scienceChapter1 = await prisma.chapter.create({
    data: {
      courseId: scienceCourse.id,
      title: 'Atoms and Elements',
      content: 'Atoms are the basic building blocks of all matter. Each atom consists of a nucleus containing protons and neutrons, surrounded by electrons in orbital shells. Elements are pure substances made up of only one type of atom, and they are organized in the periodic table based on their atomic number.',
      orderIndex: 1,
      estimatedDuration: 40,
      narrationStatus: 'completed',
    },
  });

  console.log('✅ Created chapters for courses');

  // Create sample assessments
  const mathAssessment = await prisma.assessment.create({
    data: {
      courseId: mathCourse.id,
      chapterId: mathChapter1.id,
      title: 'Variables Quiz',
      description: 'Test your understanding of variables and their role in algebra.',
      type: 'quiz',
      timeLimit: 15,
      passingScore: 70,
      isVoiceGuided: true,
    },
  });

  // Create sample questions
  await prisma.question.createMany({
    data: [
      {
        assessmentId: mathAssessment.id,
        questionText: 'What is a variable in algebra?',
        questionType: 'multiple_choice',
        options: [
          'A known number',
          'A symbol representing an unknown number',
          'A mathematical operation',
          'A type of equation'
        ],
        correctAnswer: 'A symbol representing an unknown number',
        explanation: 'A variable is a symbol (usually a letter) that represents an unknown number or value.',
        points: 2,
        orderIndex: 1,
      },
      {
        assessmentId: mathAssessment.id,
        questionText: 'In the equation y = 3x + 2, which letters are variables?',
        questionType: 'multiple_choice',
        options: [
          'Only x',
          'Only y',
          'Both x and y',
          'Neither x nor y'
        ],
        correctAnswer: 'Both x and y',
        explanation: 'Both x and y are variables in this equation, representing unknown values that can change.',
        points: 2,
        orderIndex: 2,
      },
      {
        assessmentId: mathAssessment.id,
        questionText: 'Variables can only be represented by the letter x.',
        questionType: 'true_false',
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: 'Variables can be represented by any letter or symbol, not just x. Common variables include x, y, z, a, b, c, and many others.',
        points: 1,
        orderIndex: 3,
      },
    ],
  });

  console.log('✅ Created assessments and questions');

  // Create user settings
  await prisma.userSettings.createMany({
    data: [
      {
        userId: user1.id,
        preferredVoice: 'alloy',
        autoSaveSessions: true,
        pushToTalk: false,
        noiseSuppression: true,
      },
      {
        userId: user2.id,
        preferredVoice: 'nova',
        autoSaveSessions: true,
        pushToTalk: true,
        noiseSuppression: true,
      },
    ],
  });

  // Create sample course progress
  await prisma.userCourseProgress.create({
    data: {
      userId: user1.id,
      courseId: mathCourse.id,
      currentChapterId: mathChapter1.id,
      completionPercentage: 25,
      lastAccessedAt: new Date(),
    },
  });

  console.log('✅ Created user settings and progress');

  // Create a sample session
  const sampleSession = await prisma.session.create({
    data: {
      userId: user1.id,
      companionId: mathCompanion.id,
      title: 'Algebra Help Session',
      status: 'completed',
      startedAt: new Date(Date.now() - 1800000), // 30 minutes ago
      endedAt: new Date(Date.now() - 600000), // 10 minutes ago
      totalDuration: 1200, // 20 minutes
      totalTurns: 8,
      totalTokens: 1500,
    },
  });

  // Create sample messages
  await prisma.message.createMany({
    data: [
      {
        sessionId: sampleSession.id,
        role: 'user',
        content: 'Hi Professor Math! Can you help me understand what variables are?',
        timestampStart: 0,
        timestampEnd: 3000,
        tokensUsed: 15,
        latencyMs: 150,
      },
      {
        sessionId: sampleSession.id,
        role: 'assistant',
        content: 'Hello! I\'d be happy to help you understand variables. A variable is like a container or placeholder for a number that we don\'t know yet. Think of it as a mystery box - we know there\'s a number inside, but we need to figure out what it is!',
        timestampStart: 3500,
        timestampEnd: 15000,
        tokensUsed: 45,
        latencyMs: 800,
      },
      {
        sessionId: sampleSession.id,
        role: 'user',
        content: 'That makes sense! Can you give me an example?',
        timestampStart: 16000,
        timestampEnd: 18500,
        tokensUsed: 12,
        latencyMs: 120,
      },
      {
        sessionId: sampleSession.id,
        role: 'assistant',
        content: 'Absolutely! Let\'s say you have 5 apples and your friend gives you some more apples. If we call the unknown number of apples your friend gave you "x", then the total number of apples you have is 5 + x. We use "x" because we don\'t know how many apples your friend gave you yet!',
        timestampStart: 19000,
        timestampEnd: 35000,
        tokensUsed: 55,
        latencyMs: 900,
      },
    ],
  });

  console.log('✅ Created sample session and messages');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log('- 2 users created');
  console.log('- 3 companions created');
  console.log('- 3 courses created');
  console.log('- 3 chapters created');
  console.log('- 1 assessment with 3 questions created');
  console.log('- 1 sample session with messages created');
  console.log('\n🔐 Login credentials:');
  console.log('Email: demo@tutorspeakai.com');
  console.log('Email: teacher@tutorspeakai.com');
  console.log('Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
