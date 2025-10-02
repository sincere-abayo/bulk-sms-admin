import React from 'react';

const Messages: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Message Monitoring</h1>
          <p className="text-gray-600">Monitor SMS delivery and performance</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Message Analytics</h3>
          <p className="text-gray-600">Message monitoring interface coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default Messages;