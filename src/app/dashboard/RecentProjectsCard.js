"use client";

// ********************************** Library Imports ******************************************
import React from "react";
import { Clock, History } from 'lucide-react';

export default function RecentProjectsCard({ projects, onOpenProject }) {
    // ********************************** Color Mapping ******************************************
    const colorMap = { 0: "emerald", 1: "blue", 2: "purple" };

    // ********************************** Component Render ******************************************
    return (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            {/* ********************************** Card Header ****************************************** */}
            <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-slate-800">Recent Projects</h3>
            </div>

            {/* ********************************** Projects List ****************************************** */}
            {projects.length > 0 ? (
                <div className="space-y-5">
                    {projects.map((project, idx) => (
                        <button
                            key={project.id}
                            onClick={() => onOpenProject(project)}
                            className="flex items-start gap-4 w-full text-left hover:bg-slate-50 rounded-lg p-2 -m-2 transition-colors"
                        >
                            {/* ********************************** Color Indicator ****************************************** */}
                            <div className={`w-1.5 h-10 bg-${colorMap[idx] || 'slate'}-600 rounded-full mt-0.5`} />
                            
                            {/* ********************************** Project Details ****************************************** */}
                            <div>
                                <h4 className="font-bold text-sm text-slate-800">{project.name}</h4>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {project.students > 0 ? `${project.students} students • ` : ''}{project.timeAgo}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                // ********************************** Empty State ******************************************
                <div className="text-center py-6">
                    <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">No recent projects yet</p>
                    <p className="text-xs text-slate-300 mt-0.5">Upload a file to get started</p>
                </div>
            )}
        </div>
    );
}