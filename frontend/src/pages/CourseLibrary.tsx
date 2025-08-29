import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  BookOpenIcon, 
  ClockIcon,
  UserIcon,
  PlayIcon,
  PlusIcon 
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  subjectDomain: string;
  difficultyLevel: string;
  estimatedDuration: number;
  progress: number;
  instructor: string;
  thumbnail: string;
  isEnrolled: boolean;
}

export const CourseLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'Introduction to React',
      description: 'Learn the fundamentals of React including components, state, and props',
      subjectDomain: 'Programming',
      difficultyLevel: 'Beginner',
      estimatedDuration: 480,
      progress: 75,
      instructor: 'JavaScript Tutor',
      thumbnail: 'React',
      isEnrolled: true
    },
    {
      id: '2',
      title: 'Advanced JavaScript Concepts',
      description: 'Deep dive into closures, prototypes, async programming, and more',
      subjectDomain: 'Programming',
      difficultyLevel: 'Advanced',
      estimatedDuration: 720,
      progress: 45,
      instructor: 'JavaScript Tutor',
      thumbnail: 'JS',
      isEnrolled: true
    },
    {
      id: '3',
      title: 'Python for Data Science',
      description: 'Learn Python programming with focus on data analysis and visualization',
      subjectDomain: 'Data Science',
      difficultyLevel: 'Intermediate',
      estimatedDuration: 600,
      progress: 0,
      instructor: 'Python Assistant',
      thumbnail: 'PY',
      isEnrolled: false
    },
    {
      id: '4',
      title: 'Machine Learning Fundamentals',
      description: 'Introduction to machine learning algorithms and applications',
      subjectDomain: 'Data Science',
      difficultyLevel: 'Intermediate',
      estimatedDuration: 900,
      progress: 0,
      instructor: 'Python Assistant',
      thumbnail: 'ML',
      isEnrolled: false
    }
  ]);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = !selectedDomain || course.subjectDomain === selectedDomain;
    const matchesDifficulty = !selectedDifficulty || course.difficultyLevel === selectedDifficulty;
    
    return matchesSearch && matchesDomain && matchesDifficulty;
  });

  const enrolledCourses = courses.filter(course => course.isEnrolled);
  const availableCourses = courses.filter(course => !course.isEnrolled);

  const handleEnrollCourse = (courseId: string) => {
    // TODO: Implement course enrollment
    console.log('Enroll in course:', courseId);
  };

  const handleContinueCourse = (courseId: string) => {
    // TODO: Implement course continuation
    console.log('Continue course:', courseId);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const CourseCard: React.FC<{ course: Course }> = ({ course }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">{course.thumbnail}</span>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
              <p className="text-sm text-gray-600 flex items-center">
                <UserIcon className="h-4 w-4 mr-1" />
                {course.instructor}
              </p>
            </div>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(course.difficultyLevel)}`}>
            {course.difficultyLevel}
          </span>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <BookOpenIcon className="h-4 w-4 mr-1" />
            <span>{course.subjectDomain}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{formatDuration(course.estimatedDuration)}</span>
          </div>
        </div>

        {course.isEnrolled && course.progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all" 
                style={{ width: `${course.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          {course.isEnrolled ? (
            <button
              onClick={() => handleContinueCourse(course.id)}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              {course.progress > 0 ? 'Continue' : 'Start Course'}
            </button>
          ) : (
            <button
              onClick={() => handleEnrollCourse(course.id)}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Enroll
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Library</h1>
          <p className="text-gray-600">Discover and manage your learning journey</p>
        </div>
        <Link
          to="/courses/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Course
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Domains</option>
              <option value="Programming">Programming</option>
              <option value="Data Science">Data Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
            </select>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* My Courses Section */}
      {enrolledCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

      {/* Available Courses Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {enrolledCourses.length > 0 ? 'Available Courses' : 'All Courses'}
        </h2>
        
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or create a new course.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(enrolledCourses.length > 0 ? availableCourses : filteredCourses).map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
