"use client";

// ********************************** Library Imports ******************************************
import React, { useState, useRef, useEffect } from "react";
import { Upload, X, Mail, Phone, Globe } from "lucide-react";

// ********************************** Constants ******************************************
const logoPositions = [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
];

const SchoolIdentity = ({
    schoolName, setSchoolName,
    academicYear, setAcademicYear,
    schoolAddress, setSchoolAddress,
    logo, setLogo,
    logoPosition, setLogoPosition,
    principalSign, setPrincipalSign,
    teacherSign, setTeacherSign,
    schoolEmail, setSchoolEmail,
    schoolPhone, setSchoolPhone,
    schoolWebsite, setSchoolWebsite,
}) => {
    // ********************************** State Management ******************************************
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoError, setLogoError] = useState("");
    const [principalPreview, setPrincipalPreview] = useState(null);
    const [teacherPreview, setTeacherPreview] = useState(null);
    
    // ********************************** Refs ******************************************
    const fileInputRef = useRef(null);
    const principalInputRef = useRef(null);
    const teacherInputRef = useRef(null);

    // ********************************** Effect Hooks ******************************************
    useEffect(() => {
        setLogoPreview(logo);
        setPrincipalPreview(principalSign);
        setTeacherPreview(teacherSign);
    }, [logo, principalSign, teacherSign]);

    // ********************************** Image Upload Handler ******************************************
    const handleImageUpload = (event, setPreview, setData, storageKey, maxMB = 2) => {
        const file = event.target.files[0];
        if (!file) return;

        const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setLogoError("Please upload PNG, JPG, SVG, or WebP format");
            return;
        }
        if (file.size > maxMB * 1024 * 1024) {
            setLogoError(`Image must be less than ${maxMB}MB`);
            return;
        }
        setLogoError("");

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Data = e.target.result;
            setPreview(base64Data);
            setData(base64Data);

            try {
                const currentSettings = JSON.parse(localStorage.getItem('schoolSettings') || '{}');
                currentSettings[storageKey] = base64Data;
                localStorage.setItem('schoolSettings', JSON.stringify(currentSettings));
            } catch (err) {
                console.error('Failed to auto-save:', err);
            }
        };
        reader.readAsDataURL(file);
    };

    // ********************************** Image Remove Handler ******************************************
    const handleRemove = (setPreview, setData, storageKey, inputRef) => {
        setPreview(null);
        setData(null);
        if (inputRef.current) inputRef.current.value = '';

        try {
            const currentSettings = JSON.parse(localStorage.getItem('schoolSettings') || '{}');
            currentSettings[storageKey] = null;
            localStorage.setItem('schoolSettings', JSON.stringify(currentSettings));
        } catch (err) {
            console.error('Failed to auto-remove:', err);
        }
    };

    // ********************************** Contact Field Auto-Save Handler ******************************************
    const handleContactChange = (key, value, setter) => {
        setter(value);
        try {
            const currentSettings = JSON.parse(localStorage.getItem('schoolSettings') || '{}');
            currentSettings[key] = value;
            localStorage.setItem('schoolSettings', JSON.stringify(currentSettings));
        } catch (err) {
            console.error('Failed to auto-save contact:', err);
        }
    };

    // ********************************** Signature Field Sub-Component ******************************************
    const SignatureField = ({ label, preview, inputRef, onUpload, onRemove }) => (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-700 tracking-wide">{label}</label>
            <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={onUpload} className="hidden" />
            {preview ? (
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <div className="w-28 h-14 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden">
                            <img src={preview} alt={label} className="max-w-full max-h-full object-contain p-1" />
                        </div>
                        <button onClick={onRemove}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow-md hover:bg-red-500">
                            <X size={11} />
                        </button>
                    </div>
                    <button onClick={() => inputRef.current?.click()} className="text-xs font-medium text-blue-600 hover:text-blue-700">Change</button>
                </div>
            ) : (
                <button onClick={() => inputRef.current?.click()}
                    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-xs">
                    <Upload size={13} /> Upload {label}
                </button>
            )}
        </div>
    );

    // ********************************** Component Render ******************************************
    return (
        <div className="pb-6 w-full">
            {/* ********************************** School Info Fields ****************************************** */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 tracking-wide">School Name</label>
                    <input type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl outline-none transition-all focus:border-[#0256b1] focus:bg-white focus:ring-4 focus:ring-[#0256b1]/5 placeholder:text-slate-400"
                        placeholder="Enter school name" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 tracking-wide">Academic Year</label>
                    <input type="text" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl outline-none transition-all focus:border-[#0256b1] focus:bg-white focus:ring-4 focus:ring-[#0256b1]/5 placeholder:text-slate-400"
                        placeholder="2023-2024" />
                </div>
                <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700 tracking-wide">School Address</label>
                    <input type="text" value={schoolAddress} onChange={(e) => setSchoolAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl outline-none transition-all focus:border-[#0256b1] focus:bg-white focus:ring-4 focus:ring-[#0256b1]/5 placeholder:text-slate-400"
                        placeholder="Enter school address" />
                </div>
            </div>

            {/* ********************************** School Contact Section ****************************************** */}
            <div className="mt-6 pt-6 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-3">School Contact Information</label>
                <p className="text-[11px] text-slate-400 -mt-2 mb-4">Displayed below the school address on result cards</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Email Field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
                            <Mail size={12} className="text-slate-400" /> Email Address
                        </label>
                        <input
                            type="email"
                            value={schoolEmail || ''}
                            onChange={(e) => handleContactChange('schoolEmail', e.target.value, setSchoolEmail)}
                            className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg outline-none transition-all focus:border-[#0256b1] focus:bg-white focus:ring-2 focus:ring-[#0256b1]/10 placeholder:text-slate-400"
                            placeholder="school@example.com"
                        />
                    </div>
                    {/* Phone Field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
                            <Phone size={12} className="text-slate-400" /> Phone Number
                        </label>
                        <input
                            type="tel"
                            value={schoolPhone || ''}
                            onChange={(e) => handleContactChange('schoolPhone', e.target.value, setSchoolPhone)}
                            className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg outline-none transition-all focus:border-[#0256b1] focus:bg-white focus:ring-2 focus:ring-[#0256b1]/10 placeholder:text-slate-400"
                            placeholder="+92 300 1234567"
                        />
                    </div>
                    {/* Website Field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
                            <Globe size={12} className="text-slate-400" /> Website
                        </label>
                        <input
                            type="url"
                            value={schoolWebsite || ''}
                            onChange={(e) => handleContactChange('schoolWebsite', e.target.value, setSchoolWebsite)}
                            className="w-full px-3 py-2 text-sm text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg outline-none transition-all focus:border-[#0256b1] focus:bg-white focus:ring-2 focus:ring-[#0256b1]/10 placeholder:text-slate-400"
                            placeholder="www.school.edu.pk"
                        />
                    </div>
                </div>
            </div>

            {/* ********************************** Logo Section ****************************************** */}
            <div className="mt-6 pt-6 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-3">School Logo</label>
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    onChange={(e) => handleImageUpload(e, setLogoPreview, setLogo, 'logo')} className="hidden" />
                <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-6">
                    {logoPreview ? (
                        <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
                            {/* Logo Preview */}
                            <div className="relative group shrink-0">
                                <div className="w-24 h-24 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-center p-3">
                                    <img src={logoPreview} alt="School Logo" className="max-w-full max-h-full object-contain" />
                                </div>
                                <button onClick={() => handleRemove(setLogoPreview, setLogo, 'logo', fileInputRef)}
                                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all shadow-md hover:bg-red-500">
                                    <X size={13} />
                                </button>
                            </div>
                            {/* Logo Actions */}
                            <div className="flex flex-col justify-center gap-1.5 text-center sm:text-left w-full sm:w-auto">
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold text-[#0256b1] hover:text-[#024995]">Update logo</button>
                                <button type="button" onClick={() => handleRemove(setLogoPreview, setLogo, 'logo', fileInputRef)} className="text-xs font-medium text-slate-400 hover:text-red-500">Remove</button>
                            </div>
                        </div>
                    ) : (
                        // Upload Button
                        <div className="w-full">
                            <button type="button" onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-3 px-5 py-5 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all">
                                <Upload size={16} className="text-slate-400" />
                                <span className="text-sm font-medium">Upload school logo</span>
                            </button>
                        </div>
                    )}
                    {/* Logo Position Selector */}
                    {logoPreview && (
                        <div className="w-full sm:w-auto sm:ml-auto flex flex-col gap-2">
                            <label className="text-xs font-semibold text-slate-500 tracking-wide">Position</label>
                            <div className="flex bg-slate-100 p-1 rounded-xl gap-0.5">
                                {logoPositions.map((pos) => (
                                    <button key={pos.value} type="button" onClick={() => setLogoPosition(pos.value)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${logoPosition === pos.value ? 'bg-white text-[#0256b1] shadow-sm' : 'text-slate-500'}`}>
                                        {pos.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ********************************** Signatures Section ****************************************** */}
            <div className="mt-6 pt-6 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-3">Authorized Signatures</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <SignatureField
                        label="Principal Signature"
                        preview={principalPreview}
                        inputRef={principalInputRef}
                        onUpload={(e) => handleImageUpload(e, setPrincipalPreview, setPrincipalSign, 'principalSign', 5)}
                        onRemove={() => handleRemove(setPrincipalPreview, setPrincipalSign, 'principalSign', principalInputRef)}
                    />
                    <SignatureField
                        label="Class Teacher Signature"
                        preview={teacherPreview}
                        inputRef={teacherInputRef}
                        onUpload={(e) => handleImageUpload(e, setTeacherPreview, setTeacherSign, 'teacherSign', 5)}
                        onRemove={() => handleRemove(setTeacherPreview, setTeacherSign, 'teacherSign', teacherInputRef)}
                    />
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Recommended: Transparent PNG, max 5MB each</p>
            </div>

            {/* ********************************** Error Message ****************************************** */}
            {logoError && (
                <div className="mt-3 p-3 bg-red-50/50 border border-red-100 rounded-xl">
                    <p className="text-xs font-medium text-red-600">{logoError}</p>
                </div>
            )}
        </div>
    );
};

export default SchoolIdentity;