'use client';

import { useState } from 'react';
import { SERVICE_CATEGORIES, ServiceType } from '@/types';

interface ServiceSelectionProps {
  onServiceSelect: (service: ServiceType) => void;
  onCustomTask: () => void;
}

export default function ServiceSelection({ onServiceSelect, onCustomTask }: ServiceSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = selectedCategory
    ? SERVICE_CATEGORIES.filter(cat => cat.id === selectedCategory)
    : SERVICE_CATEGORIES;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            What service do you need?
          </h1>
          <p className="text-lg text-gray-600">
            Select a category or choose a specific service
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Services
          </button>
          {SERVICE_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        {/* Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCategories.map((category) => (
            <div key={category.id} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">{category.icon}</span>
                {category.name}
              </h2>
              <div className="space-y-3">
                {category.services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => onServiceSelect(service)}
                    className="w-full bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left border border-gray-200 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {service.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Custom Task Option */}
        <div className="text-center">
          <button
            onClick={onCustomTask}
            className="inline-flex items-center px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <span className="mr-2">🎯</span>
            Custom Task
          </button>
          <p className="mt-2 text-sm text-gray-600">
            Need something else? Describe your custom task here.
          </p>
        </div>
      </div>
    </div>
  );
}