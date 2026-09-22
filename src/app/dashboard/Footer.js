"use client";

// ********************************** Library Imports ******************************************
import React from "react";
import { Zap, HeartHandshake, Lock } from 'lucide-react';

export default function Footer() {
    // ********************************** Component Render ******************************************
    return (
        <footer className="max-w-6xl w-full mx-auto border-t border-slate-200/60 mt-9 pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-500">
            {/* ********************************** Feature 1 - Fast Performance ****************************************** */}
            <div className="flex items-start gap-3.5">
                <Zap className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                    <h5 className="font-bold text-sm text-slate-800">Fast Performance</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Optimized for a smooth experience</p>
                </div>
            </div>

            {/* ********************************** Feature 2 - Easy to Use ****************************************** */}
            <div className="flex items-start gap-3.5">
                <HeartHandshake className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                    <h5 className="font-bold text-sm text-slate-800">Easy to Use</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Simple and intuitive interface</p>
                </div>
            </div>

            {/* ********************************** Feature 3 - Secure & Reliable ****************************************** */}
            <div className="flex items-start gap-3.5">
                <Lock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                    <h5 className="font-bold text-sm text-slate-800">Secure & Reliable</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Your data is kept safe and private</p>
                </div>
            </div>
        </footer>
    );
}