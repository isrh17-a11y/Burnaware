"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitBurnoutAssessment } from "@/app/actions";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BurnoutAssessmentForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    exhaustionScore: "",
    cynicismScore: "",
    professionalEfficacy: "",
    phq4Score: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        alert("Please log in first!");
        router.push('/login');
        return;
      }
      const user = JSON.parse(storedUser);
      const userId = user.id || user.user_id;

      const res = await submitBurnoutAssessment({
        userId,
        userEmail: user.email,
        userName: user.username || user.name,
        exhaustionScore: parseFloat(formData.exhaustionScore),
        cynicismScore: parseFloat(formData.cynicismScore),
        professionalEfficacy: parseFloat(formData.professionalEfficacy),
        phq4Score: parseFloat(formData.phq4Score),
      });

      if (res?.success) {
        alert("Assessment submitted successfully!");
        router.push('/dashboard');
      } else {
        alert("Failed to submit assessment.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting assessment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Burnout & PHQ-4 Assessment</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="exhaustionScore">Exhaustion Score (0-30)</Label>
            <Input 
              id="exhaustionScore" 
              type="number" 
              min="0" max="30"
              value={formData.exhaustionScore}
              onChange={(e) => setFormData({...formData, exhaustionScore: e.target.value})}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cynicismScore">Cynicism Score (0-30)</Label>
            <Input 
              id="cynicismScore" 
              type="number" 
              min="0" max="30"
              value={formData.cynicismScore}
              onChange={(e) => setFormData({...formData, cynicismScore: e.target.value})}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="professionalEfficacy">Professional Efficacy (0-30)</Label>
            <Input 
              id="professionalEfficacy" 
              type="number" 
              min="0" max="30"
              value={formData.professionalEfficacy}
              onChange={(e) => setFormData({...formData, professionalEfficacy: e.target.value})}
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phq4Score">PHQ-4 Score (0-12)</Label>
            <Input 
              id="phq4Score" 
              type="number" 
              min="0" max="12"
              value={formData.phq4Score}
              onChange={(e) => setFormData({...formData, phq4Score: e.target.value})}
              required 
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Submit Assessment</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
