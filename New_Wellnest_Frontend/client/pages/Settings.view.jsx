import React from "react";
import Layout from "../components/Layout";
import SettingsSection from "../components/settings/SettingsSection";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import {
    User,
    Bell,
    Palette,
    Lock,
    Settings as SettingsIcon,
    Upload,
    Moon,
    Sun
} from "lucide-react";

const SettingsView = ({ formData, loading, handleChange, handleSubmit, handleSelectChange, handleSliderChange, handleToggle }) => {
    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-6 pb-12">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Settings
                    </h2>
                    <p className="text-slate-600 mt-2">Manage your profile, preferences, and account settings</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Profile Section */}
                    <SettingsSection
                        title="Personal Profile"
                        description="Update your personal information"
                        icon={User}
                    >
                        <div className="space-y-4">
                            {/* Profile Picture */}
                            <div className="flex items-center gap-4 pb-4 border-b">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                                    {formData.username?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Upload size={16} />
                                        Upload Photo
                                    </Button>
                                    <p className="text-xs text-slate-500 mt-1">JPG, PNG max 2MB</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Full Name</Label>
                                    <Input
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input
                                        id="dob"
                                        name="dob"
                                        type="date"
                                        value={formData.dob}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                        <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </SettingsSection>





                    {/* Notification Preferences Section */}
                    <SettingsSection
                        title="Notifications"
                        description="Manage your notification preferences"
                        icon={Bell}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="workoutReminders">Workout Reminders</Label>
                                    <p className="text-sm text-slate-500">Daily reminders to stay active</p>
                                </div>
                                <Switch
                                    id="workoutReminders"
                                    checked={formData.workoutReminders}
                                    onCheckedChange={(checked) => handleToggle('workoutReminders', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="meditationReminders">Meditation Reminders</Label>
                                    <p className="text-sm text-slate-500">Mindfulness check-in notifications</p>
                                </div>
                                <Switch
                                    id="meditationReminders"
                                    checked={formData.meditationReminders}
                                    onCheckedChange={(checked) => handleToggle('meditationReminders', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="moodCheckin">Daily Mood Check-in</Label>
                                    <p className="text-sm text-slate-500">Track your emotional wellness</p>
                                </div>
                                <Switch
                                    id="moodCheckin"
                                    checked={formData.moodCheckin}
                                    onCheckedChange={(checked) => handleToggle('moodCheckin', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="goalMilestones">Goal Milestones</Label>
                                    <p className="text-sm text-slate-500">Celebrate your achievements</p>
                                </div>
                                <Switch
                                    id="goalMilestones"
                                    checked={formData.goalMilestones}
                                    onCheckedChange={(checked) => handleToggle('goalMilestones', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="weeklySummary">Weekly Summary Reports</Label>
                                    <p className="text-sm text-slate-500">Your progress overview</p>
                                </div>
                                <Switch
                                    id="weeklySummary"
                                    checked={formData.weeklySummary}
                                    onCheckedChange={(checked) => handleToggle('weeklySummary', checked)}
                                />
                            </div>
                        </div>
                    </SettingsSection>

                    {/* App Preferences Section */}
                    <SettingsSection
                        title="App Preferences"
                        description="Customize your app experience"
                        icon={Palette}
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="theme">Theme</Label>
                                <Select value={formData.theme} onValueChange={(value) => handleSelectChange('theme', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">
                                            <div className="flex items-center gap-2">
                                                <Sun size={16} />
                                                Light
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="dark">
                                            <div className="flex items-center gap-2">
                                                <Moon size={16} />
                                                Dark
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="auto">Auto (System)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="measurementSystem">Measurement System</Label>
                                <Select value={formData.measurementSystem} onValueChange={(value) => handleSelectChange('measurementSystem', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select measurement system" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="metric">Metric (kg, cm)</SelectItem>
                                        <SelectItem value="imperial">Imperial (lbs, ft)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="firstDayOfWeek">First Day of Week</Label>
                                <Select value={formData.firstDayOfWeek} onValueChange={(value) => handleSelectChange('firstDayOfWeek', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select first day" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sunday">Sunday</SelectItem>
                                        <SelectItem value="monday">Monday</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timeFormat">Time Format</Label>
                                <Select value={formData.timeFormat} onValueChange={(value) => handleSelectChange('timeFormat', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select time format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                                        <SelectItem value="24h">24-hour</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </SettingsSection>

                    {/* Privacy & Security Section */}
                    <SettingsSection
                        title="Privacy & Security"
                        description="Protect your account and data"
                        icon={Lock}
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Leave blank to keep current"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div>
                                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                                    <p className="text-sm text-slate-500">Add extra security to your account</p>
                                </div>
                                <Switch
                                    id="twoFactorAuth"
                                    checked={formData.twoFactorAuth}
                                    onCheckedChange={(checked) => handleToggle('twoFactorAuth', checked)}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label htmlFor="dataSharing">Data Sharing</Label>
                                    <p className="text-sm text-slate-500">Share anonymous analytics</p>
                                </div>
                                <Switch
                                    id="dataSharing"
                                    checked={formData.dataSharing}
                                    onCheckedChange={(checked) => handleToggle('dataSharing', checked)}
                                />
                            </div>

                            <div className="pt-4 space-y-2">
                                <Button variant="outline" className="w-full">
                                    Download My Data
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Clear Cache
                                </Button>
                            </div>
                        </div>
                    </SettingsSection>

                    {/* Account Management Section */}
                    <SettingsSection
                        title="Account Management"
                        description="Manage your account and subscription"
                        icon={SettingsIcon}
                    >
                        <div className="space-y-4">
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-slate-600">Account Status</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Active</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Subscription Plan</span>
                                    <span className="font-semibold text-slate-900">Free Plan</span>
                                </div>
                            </div>

                            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                                Upgrade to Premium
                            </Button>

                            <div className="pt-4 border-t space-y-2">
                                <Button variant="outline" className="w-full">
                                    Export All Data
                                </Button>
                                <Button variant="outline" className="w-full text-orange-600 hover:bg-orange-50">
                                    Deactivate Account
                                </Button>
                                <Button variant="destructive" className="w-full">
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    </SettingsSection>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-6">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="btn-primary px-8 py-6 text-lg"
                        size="lg"
                    >
                        {loading ? "Saving..." : "Save All Changes"}
                    </Button>
                </div>
            </div>
        </Layout>
    );
};

export default SettingsView;
