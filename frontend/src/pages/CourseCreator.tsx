import React, { useState } from 'react';
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  PlusIcon, 
  TrashIcon,
  BookOpenIcon 
} from '@heroicons/react/24/outline';
import { courseApi, CreateCourseRequest } from '@/services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface Chapter {
  id: string;
  title: string;
  description: string;
  estimatedDuration: number;
}

export const CourseCreator: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    subjectDomain: '',
    difficultyLevel: 'beginner'
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);

  const handleCourseDataChange = (field: string, value: string) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addChapter = () => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: '',
      description: '',
      estimatedDuration: 30
    };
    setChapters(prev => [...prev, newChapter]);
  };

  const updateChapter = (id: string, field: string, value: string | number) => {
    setChapters(prev => prev.map(chapter => 
      chapter.id === id ? { ...chapter, [field]: value } : chapter
    ));
  };

  const removeChapter = (id: string) => {
    setChapters(prev => prev.filter(chapter => chapter.id !== id));
  };

  const handleGenerateCourse = async () => {
    if (!courseData.title.trim()) {
      toast.error('Please enter a course title');
      return;
    }

    setIsLoading(true);
    
    try {
      // Step 1: Create the course
      const createCourseRequest: CreateCourseRequest = {
        title: courseData.title,
        description: courseData.description || undefined,
        subjectDomain: courseData.subjectDomain || undefined,
        difficultyLevel: courseData.difficultyLevel || undefined,
      };

      const courseResponse = await courseApi.createCourse(createCourseRequest);
      const courseId = courseResponse.data.data?.course.id;
      
      if (!courseId) {
        throw new Error('Failed to get course ID from response');
      }
      
      setCreatedCourseId(courseId);

      toast.success('Course created successfully!');

      // Step 2: Upload documents if any
      if (uploadedFiles.length > 0) {
        try {
          await courseApi.uploadDocuments(courseId, uploadedFiles);
          toast.success('Documents uploaded successfully!');
        } catch (uploadError) {
          console.error('Error uploading documents:', uploadError);
          toast.error('Failed to upload some documents, but course was created');
        }
      }

      // Step 3: Generate course content
      try {
        const generateResponse = await courseApi.generateCourse(courseId, {
          generateNarration: true,
          generateAssessments: true,
        });

        toast.success('Course generated successfully!');
        
        // Reset form or redirect to course view
        console.log('Generated course:', generateResponse.data.data);
        
        // Redirect to course library to see the new course
        setTimeout(() => {
          navigate('/courses');
        }, 2000);
        
      } catch (generateError) {
        console.error('Error generating course:', generateError);
        toast.error('Course created but generation failed. You can try generating it later.');
        
        // Still redirect to course library after a delay
        setTimeout(() => {
          navigate('/courses');
        }, 3000);
      }

    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title
            </label>
            <input
              type="text"
              value={courseData.title}
              onChange={(e) => handleCourseDataChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter course title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Domain
            </label>
            <select
              value={courseData.subjectDomain}
              onChange={(e) => handleCourseDataChange('subjectDomain', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a domain</option>
              <option value="programming">Programming</option>
              <option value="mathematics">Mathematics</option>
              <option value="science">Science</option>
              <option value="language">Language Arts</option>
              <option value="business">Business</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={courseData.difficultyLevel}
              onChange={(e) => handleCourseDataChange('difficultyLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Description
          </label>
          <textarea
            value={courseData.description}
            onChange={(e) => handleCourseDataChange('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe what students will learn in this course"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Course Materials</h2>
        
        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Upload course materials
              </span>
              <span className="mt-1 block text-sm text-gray-600">
                PDF, DOCX, PPTX, TXT files up to 10MB each
              </span>
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              multiple
              accept=".pdf,.docx,.pptx,.txt"
              onChange={handleFileUpload}
              className="sr-only"
            />
          </div>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Uploaded Files</h3>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <DocumentIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-1 text-gray-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Course Structure</h2>
        <button
          onClick={addChapter}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Chapter
        </button>
      </div>

      {chapters.length === 0 ? (
        <div className="text-center py-12">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No chapters yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first chapter.</p>
          <div className="mt-6">
            <button
              onClick={addChapter}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Chapter
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter, index) => (
            <div key={chapter.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Chapter {index + 1}</h3>
                <button
                  onClick={() => removeChapter(chapter.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    value={chapter.title}
                    onChange={(e) => updateChapter(chapter.id, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter chapter title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={chapter.estimatedDuration}
                    onChange={(e) => updateChapter(chapter.id, 'estimatedDuration', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chapter Description
                </label>
                <textarea
                  value={chapter.description}
                  onChange={(e) => updateChapter(chapter.id, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe what this chapter covers"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Course Creator</h1>
        <p className="text-gray-600">Create AI-powered courses from your materials</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNumber 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {stepNumber}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              step >= stepNumber ? 'text-blue-600' : 'text-gray-500'
            }`}>
              {stepNumber === 1 && 'Course Info'}
              {stepNumber === 2 && 'Upload Materials'}
              {stepNumber === 3 && 'Structure'}
            </span>
            {stepNumber < 3 && (
              <div className={`w-16 h-0.5 mx-4 ${
                step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {step < 3 ? (
          <button
            onClick={() => setStep(Math.min(3, step + 1))}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleGenerateCourse}
            disabled={isLoading}
            className={`px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Generating Course...' : 'Generate Course'}
          </button>
        )}
      </div>
    </div>
  );
};
