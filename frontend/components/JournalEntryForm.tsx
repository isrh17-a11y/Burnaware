"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitJournalEntry } from "@/app/actions";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function JournalEntryForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    emotionTag: "",
    triggerCategory: "",
    content: ""
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

      const res = await submitJournalEntry({
        userId,
        userEmail: user.email,
        userName: user.username || user.name,
        emotionTag: formData.emotionTag,
        triggerCategory: formData.triggerCategory,
        content: formData.content,
      });

      if (res?.success) {
        alert("Journal entry saved!");
        router.push('/dashboard');
      } else {
        alert("Failed to save entry.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving journal entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>New Journal Entry</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Emotion Tag</Label>
            <Select 
              value={formData.emotionTag} 
              onValueChange={(val) => setFormData({...formData, emotionTag: val || ""})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an emotion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anxious">Anxious</SelectItem>
                <SelectItem value="overwhelmed">Overwhelmed</SelectItem>
                <SelectItem value="exhausted">Exhausted</SelectItem>
                <SelectItem value="motivated">Motivated</SelectItem>
                <SelectItem value="calm">Calm</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="triggerCategory">Trigger Category</Label>
            <Input 
              id="triggerCategory" 
              placeholder="e.g. Work, Study, Exams"
              value={formData.triggerCategory}
              onChange={(e) => setFormData({...formData, triggerCategory: e.target.value})}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Journal Content</Label>
            <Textarea 
              id="content" 
              placeholder="Write your thoughts here... (It will be encrypted safely)"
              className="min-h-[100px]"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required 
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Save Entry</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
