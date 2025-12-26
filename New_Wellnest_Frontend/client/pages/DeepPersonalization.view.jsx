import React from "react";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { FileText, Heart, Bell, Shield } from "lucide-react";

export default function DeepPersonalizationView({ form, handle, handleCheckbox, handleFileChange, submit, goBack, fileInputRef }) {
    const SectionHeader = ({ icon: Icon, title, color }) => (
        <div className="flex items-center gap-3 mb-6">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white ${color}`}>
                <Icon size={20} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        </div>
    );

    return (
        <Layout>
            <div>
                <h1 className="text-2xl font-bold mb-2 text-slate-900">Deep Personalization</h1>
                <p className="mb-8 text-slate-600">
                    Step 6 of 6 — Final step! Help us personalize your experience even further.
                </p>

                <form onSubmit={submit} className="space-y-8">
                    {/* Medical Reports Section */}
                    <section className="bg-white p-6 rounded-lg shadow-sm">
                        <SectionHeader icon={FileText} title="Medical Information" color="bg-indigo-500" />
                        <div className="space-y-6">
                            <div>
                                <label className="text-sm text-slate-600 block mb-2">Upload Medical Reports (optional)</label>
                                <p className="text-xs text-slate-500 mb-2">Supported: PDF, JPG, PNG (Max 16MB)</p>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    name="medical_report"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                {form.fileName && (
                                    <p className="mt-2 text-sm text-green-600">✓ {form.fileName}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm text-slate-600">Current Medications (optional)</label>
                                <textarea
                                    name="current_medications"
                                    value={form.current_medications}
                                    onChange={handle}
                                    placeholder="List any medications you're currently taking..."
                                    className="input-underline mt-2 w-full min-h-20"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Tracking Preferences Section */}
                    <section className="bg-white p-6 rounded-lg shadow-sm">
                        <SectionHeader icon={Heart} title="Health Tracking" color="bg-pink-500" />
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="mood_tracking"
                                name="mood_tracking_enabled"
                                checked={form.mood_tracking_enabled}
                                onChange={handleCheckbox}
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="mood_tracking" className="text-sm text-slate-700">
                                Enable Mood & Stress Tracking
                            </label>
                        </div>
                    </section>

                    {/* Notifications Section */}
                    <section className="bg-white p-6 rounded-lg shadow-sm">
                        <SectionHeader icon={Bell} title="Notifications" color="bg-orange-500" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-slate-600">Preferred Notification Language</label>
                                <select
                                    name="notification_language"
                                    value={form.notification_language}
                                    onChange={handle}
                                    className="input-underline mt-2 w-full"
                                >
                                    <option value="English">English</option>
                                    <option value="Roman Urdu">Roman Urdu</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Interaction Preference Section */}
                    <section className="bg-white p-6 rounded-lg shadow-sm">
                        <SectionHeader icon={Bell} title="Interaction Preference" color="bg-indigo-600" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-slate-600">How would you like to interact with Wellnest?</label>
                                <select
                                    name="interaction_preference"
                                    value={form.interaction_preference}
                                    onChange={handle}
                                    className="input-underline mt-2 w-full"
                                >
                                    <option value="Forms Only">Forms Only</option>
                                    <option value="Chatbot Only">Chatbot Only</option>
                                    <option value="Both">Both</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Consents Section */}
                    <section className="bg-white p-6 rounded-lg shadow-sm">
                        <SectionHeader icon={Shield} title="Consents & Privacy" color="bg-red-500" />
                        <div className="space-y-4">
                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    id="ai_consent"
                                    name="ai_consent"
                                    checked={form.ai_consent}
                                    onChange={handleCheckbox}
                                    className="h-4 w-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    required
                                />
                                <label htmlFor="ai_consent" className="text-sm text-slate-700">
                                    I consent to AI personalization of my wellness recommendations <span className="text-red-500">*</span>
                                </label>
                            </div>

                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    id="data_sharing_consent"
                                    name="data_sharing_consent"
                                    checked={form.data_sharing_consent}
                                    onChange={handleCheckbox}
                                    className="h-4 w-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    required
                                />
                                <label htmlFor="data_sharing_consent" className="text-sm text-slate-700">
                                    I agree to share anonymized data to improve Wellnest's services <span className="text-red-500">*</span>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Required Fields Notice */}
                    {(!form.ai_consent || !form.data_sharing_consent) && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                            <p className="font-medium">Required Consents</p>
                            <p className="text-amber-700 mt-1">
                                Please accept both consent agreements to complete your setup.
                            </p>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center pt-4">
                        <button
                            type="button"
                            onClick={goBack}
                            className="px-6 py-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                        >
                            ← Back
                        </button>

                        <button
                            type="submit"
                            disabled={!form.ai_consent || !form.data_sharing_consent}
                            className={`btn-primary ${(!form.ai_consent || !form.data_sharing_consent) ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                            Complete Setup
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}
