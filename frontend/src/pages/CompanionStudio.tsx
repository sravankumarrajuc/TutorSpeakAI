import React, { useState } from 'react';
import { 
  PlusIcon, 
  UserGroupIcon, 
  PencilIcon, 
  TrashIcon,
  PlayIcon 
} from '@heroicons/react/24/outline';

interface Companion {
  id: string;
  name: string;
  subjectDomain: string;
  description: string;
  avatar: string;
  isActive: boolean;
}

export const CompanionStudio: React.FC = () => {
  const [companions] = useState<Companion[]>([
    {
      id: '1',
      name: 'JavaScript Tutor',
      subjectDomain: 'Programming',
      description: 'Specializes in web development and modern JavaScript frameworks',
      avatar: 'JS',
      isActive: true
    },
    {
      id: '2',
      name: 'Python Assistant',
      subjectDomain: 'Data Science',
      description: 'Expert in Python programming, data analysis, and machine learning',
      avatar: 'PY',
      isActive: false
    }
  ]);

  const handleCreateCompanion = () => {
    // TODO: Implement companion creation
    console.log('Create new companion');
  };

  const handleEditCompanion = (id: string) => {
    // TODO: Implement companion editing
    console.log('Edit companion:', id);
  };

  const handleDeleteCompanion = (id: string) => {
    // TODO: Implement companion deletion
    console.log('Delete companion:', id);
  };

  const handleStartSession = (id: string) => {
    // TODO: Implement session start
    console.log('Start session with companion:', id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Companion Studio</h1>
          <p className="text-gray-600">Create and manage your personalized AI tutors</p>
        </div>
        <button
          onClick={handleCreateCompanion}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Companion
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Companions</p>
              <p className="text-2xl font-bold text-gray-900">{companions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <PlayIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">
                {companions.filter(c => c.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Subject Areas</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(companions.map(c => c.subjectDomain)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Companions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companions.map((companion) => (
          <div key={companion.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">{companion.avatar}</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{companion.name}</h3>
                    <p className="text-sm text-gray-600">{companion.subjectDomain}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditCompanion(companion.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCompanion(companion.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4">{companion.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${companion.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="ml-2 text-sm text-gray-600">
                    {companion.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <button
                  onClick={() => handleStartSession(companion.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlayIcon className="h-3 w-3 mr-1" />
                  Start Session
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Create New Card */}
        <div 
          onClick={handleCreateCompanion}
          className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 hover:border-gray-400 cursor-pointer transition-colors overflow-hidden"
        >
          <div className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <PlusIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Companion</h3>
            <p className="text-sm text-gray-600 text-center">
              Build a personalized AI tutor for your specific learning needs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
