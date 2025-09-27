"use client";

import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon: string;
  color: string;
}

interface TabsProps {
  tabs: Tab[];
  children: React.ReactNode[];
  defaultTab?: string;
}

export default function Tabs({ tabs, children, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-600 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 font-medium transition-colors
              ${activeTab === tab.id 
                ? `text-${tab.color}-400 border-b-2 border-${tab.color}-400 bg-gray-800` 
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
              }
            `}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[120px]">
        {children[activeTabIndex]}
      </div>
    </div>
  );
}
