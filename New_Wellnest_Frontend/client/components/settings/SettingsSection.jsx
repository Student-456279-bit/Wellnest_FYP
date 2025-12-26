import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const SettingsSection = ({ title, description, icon: Icon, children }) => {
    return (
        <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
                <div className="flex items-center gap-3">
                    {Icon && <Icon className="text-purple-600" size={24} />}
                    <div>
                        <CardTitle className="text-xl">{title}</CardTitle>
                        {description && <CardDescription className="mt-1">{description}</CardDescription>}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-6">
                {children}
            </CardContent>
        </Card>
    );
};

export default SettingsSection;
