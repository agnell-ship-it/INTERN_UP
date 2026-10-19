'use client';

import React, { useState } from 'react';
import { Profile } from '@/types';
import { User, School, BookOpen, Edit2, Calendar } from 'lucide-react';
import { StudentProfileModal } from './StudentProfileModal';

interface DashboardProfileSectionProps {
  profile: Profile;
}

export const DashboardProfileSection: React.FC<DashboardProfileSectionProps> = ({ profile }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs">
            {profile.full_name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{profile.full_name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                Student
              </span>
            </div>
            <p className="text-xs text-slate-500">{profile.email}</p>

            {(profile.college || profile.degree) && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                {profile.college && (
                  <span className="flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile.college}</span>
                  </span>
                )}
                {profile.degree && (
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile.degree}</span>
                  </span>
                )}
                {profile.graduation_year && (
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Class of {profile.graduation_year}</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      <StudentProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        profile={profile}
      />
    </>
  );
};
