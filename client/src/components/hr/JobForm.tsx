"use client";

import axios from '@/utils/axios';
import { useState } from 'react';

export default function CreateJobForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    role: '',
    responsibilities: '',
    location: '',
    type: 'Full_time',
    experience: '',
    education: 'Bachelors_Degree',
    skills: [] as string[],
    threshold: 70
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const skillOptions = [
    'JavaScript_TypeScript',
    'ReactJS',
    'NodeJS',
    'Python',
    'Java',
    'SQL',
    'AWS',
    'Docker',
    'UI_UX',
    'GraphQL'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (skill: string) => {
    setFormData(prev => {
      if (prev.skills.includes(skill)) {
        return {
          ...prev,
          skills: prev.skills.filter(s => s !== skill)
        };
      } else {
        return {
          ...prev,
          skills: [...prev.skills, skill]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('/api/v1/job', formData);
      setSuccessMessage(response.data.message);
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        role: '',
        responsibilities: '',
        location: '',
        type: 'Full_time',
        experience: '',
        education: 'Bachelors_Degree',
        skills: [],
        threshold: 70
      });
    } catch (error) {
      setErrorMessage('Failed to create job. Please try again.');
      console.error('Error creating job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Create New Job Posting</h1>
      
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Job Description URL*</label>
                <input
                  type="url"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  placeholder="https://example.com/job-description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role*</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Responsibilities*</label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Job Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Location*</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Job Type*</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                >
                  <option value="Full_time">Full Time</option>
                  <option value="Part_time">Part Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Experience*</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                  placeholder="e.g., 2+ years"
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Requirements</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Education*</label>
                <select
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                >
                  <option value="Bachelors_Degree">Bachelor's Degree</option>
                  <option value="Masters_Degree">Master's Degree</option>
                  <option value="PhD">PhD</option>
                  <option value="Diploma">Diploma</option>
                  <option value="No_degree">No Degree Required</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Required Skills*</label>
                <div className="mt-2 space-y-2">
                  {skillOptions.map(skill => (
                    <div key={skill} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`skill-${skill}`}
                        checked={formData.skills.includes(skill)}
                        onChange={() => handleSkillChange(skill)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor={`skill-${skill}`} className="ml-2 text-sm text-gray-700">
                        {skill.replace('_', ' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Threshold Score*</label>
                <input
                  type="number"
                  name="threshold"
                  min="0"
                  max="100"
                  value={formData.threshold}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Job...' : 'Create Job Posting'}
          </button>
        </div>
      </form>
    </div>
  );
}