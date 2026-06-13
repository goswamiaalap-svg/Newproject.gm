'use client'

import React from 'react'
import { mockRecentActivity } from '@/lib/mock-data'
import { BookOpen, CheckCircle, Code, Users, Award, Calendar } from 'lucide-react'

export default function ActivityFeed() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'dsa':
        return <Code className="w-4 h-4 text-teal" />
      case 'resume':
        return <CheckCircle className="w-4 h-4 text-indigo" />
      case 'interview':
        return <BookOpen className="w-4 h-4 text-gold" />
      case 'project':
        return <Award className="w-4 h-4 text-teal" />
      case 'team':
        return <Users className="w-4 h-4 text-indigo" />
      default:
        return <Calendar className="w-4 h-4 text-text-muted" />
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'dsa':
        return 'bg-teal/5 border-teal/10'
      case 'resume':
        return 'bg-indigo/5 border-indigo/10'
      case 'interview':
        return 'bg-gold/5 border-gold/10'
      case 'project':
        return 'bg-teal/5 border-teal/10'
      case 'team':
        return 'bg-indigo/5 border-indigo/10'
      default:
        return 'bg-bg-subtle border-border-default'
    }
  }

  return (
    <div className="bg-white border border-border-default rounded-card p-6 shadow-card">
      <h3 className="font-display text-lg font-bold text-text-primary mb-4">
        Recent Activity
      </h3>

      <div className="relative border-l border-border-subtle pl-6 space-y-6">
        {mockRecentActivity.map((activity, idx) => (
          <div key={activity.id} className="relative group">
            {/* Timeline Dot Icon */}
            <div
              className={`absolute -left-[38px] top-0 p-1.5 rounded-full border bg-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${getBadgeColor(
                activity.type
              )}`}
            >
              {getIcon(activity.type)}
            </div>

            {/* Content */}
            <div>
              <p className="text-xs font-semibold text-text-primary group-hover:text-teal transition-colors">
                {activity.action}
              </p>
              <p className="text-[10px] text-text-muted mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
