import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { type Meeting, type AgendaItem } from "@/lib/mockData";

interface MeetingFormProps {
  meeting?: Meeting | null;
  onSave: (meeting: Meeting | Omit<Meeting, 'id'>) => void;
  onCancel: () => void;
}

export const MeetingForm = ({ meeting, onSave, onCancel }: MeetingFormProps) => {
  const [formData, setFormData] = useState<Omit<Meeting, 'id'>>({
    title: meeting?.title || "",
    stakeholder: meeting?.stakeholder || "",
    date: meeting?.date || "",
    time: meeting?.time || "",
    duration: meeting?.duration || 60,
    status: meeting?.status || "scheduled",
    location: meeting?.location || "",
    agenda: meeting?.agenda || [],
    notes: meeting?.notes || "",
    nextMeeting: meeting?.nextMeeting || "",
    attendees: meeting?.attendees || []
  });

  const [newAttendee, setNewAttendee] = useState("");
  const [newAgendaItem, setNewAgendaItem] = useState<Omit<AgendaItem, 'id'>>({
    title: "",
    description: "",
    status: "pending"
  });

  const handleInputChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addAttendee = () => {
    if (newAttendee.trim()) {
      setFormData(prev => ({
        ...prev,
        attendees: [...prev.attendees, newAttendee.trim()]
      }));
      setNewAttendee("");
    }
  };

  const removeAttendee = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.filter((_, i) => i !== index)
    }));
  };

  const addAgendaItem = () => {
    if (newAgendaItem.title.trim()) {
      const agendaItem: AgendaItem = {
        ...newAgendaItem,
        id: Date.now().toString()
      };
      setFormData(prev => ({
        ...prev,
        agenda: [...prev.agenda, agendaItem]
      }));
      setNewAgendaItem({
        title: "",
        description: "",
        status: "pending"
      });
    }
  };

  const removeAgendaItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda.filter((_, i) => i !== index)
    }));
  };

  const updateAgendaItem = (index: number, field: keyof AgendaItem, value: any) => {
    setFormData(prev => ({
      ...prev,
      agenda: prev.agenda.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (meeting) {
      onSave({ ...formData, id: meeting.id });
    } else {
      onSave(formData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-muted text-muted-foreground';
      case 'discussed':
        return 'bg-status-completed text-white';
      case 'action-required':
        return 'bg-warning text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {meeting ? 'Edit Meeting' : 'New Meeting'}
            </h1>
            <p className="text-muted-foreground">
              {meeting ? 'Update meeting details and agenda' : 'Create a new stakeholder meeting'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-border shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Meeting Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Meeting Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Q4 Strategy Review"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stakeholder">Stakeholder</Label>
                  <Input
                    id="stakeholder"
                    value={formData.stakeholder}
                    onChange={(e) => handleInputChange('stakeholder', e.target.value)}
                    placeholder="e.g., Acme Corporation"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                    min="15"
                    step="15"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Conference Room A or Virtual - Zoom"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="rescheduled">Rescheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextMeeting">Next Meeting Date (Optional)</Label>
                <Input
                  id="nextMeeting"
                  type="date"
                  value={formData.nextMeeting}
                  onChange={(e) => handleInputChange('nextMeeting', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Attendees */}
          <Card className="border-border shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Attendees</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newAttendee}
                  onChange={(e) => setNewAttendee(e.target.value)}
                  placeholder="Add attendee name"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
                />
                <Button type="button" onClick={addAttendee} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.attendees.map((attendee, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {attendee}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttendee(index)}
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Agenda */}
          <Card className="border-border shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Agenda Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Agenda Item */}
              <div className="border border-border rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-foreground">Add New Item</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    value={newAgendaItem.title}
                    onChange={(e) => setNewAgendaItem(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Agenda item title"
                  />
                  <Select 
                    value={newAgendaItem.status} 
                    onValueChange={(value) => setNewAgendaItem(prev => ({ ...prev, status: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="discussed">Discussed</SelectItem>
                      <SelectItem value="action-required">Action Required</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  value={newAgendaItem.description}
                  onChange={(e) => setNewAgendaItem(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description or details"
                  rows={2}
                />
                <Button type="button" onClick={addAgendaItem} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Agenda Item
                </Button>
              </div>

              {/* Existing Agenda Items */}
              <div className="space-y-3">
                {formData.agenda.map((item, index) => (
                  <div key={item.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">Item {index + 1}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAgendaItem(index)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Input
                        value={item.title}
                        onChange={(e) => updateAgendaItem(index, 'title', e.target.value)}
                        placeholder="Agenda item title"
                      />
                      <Select 
                        value={item.status} 
                        onValueChange={(value) => updateAgendaItem(index, 'status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="discussed">Discussed</SelectItem>
                          <SelectItem value="action-required">Action Required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Textarea
                      value={item.description}
                      onChange={(e) => updateAgendaItem(index, 'description', e.target.value)}
                      placeholder="Description or details"
                      rows={2}
                    />
                    {item.assignee && (
                      <Input
                        value={item.assignee}
                        onChange={(e) => updateAgendaItem(index, 'assignee', e.target.value)}
                        placeholder="Assignee (for action items)"
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="border-border shadow-[var(--shadow-card)]">
            <CardHeader>
              <CardTitle>Meeting Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add meeting notes, decisions, action items, or follow-up tasks..."
                rows={6}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              {meeting ? 'Update Meeting' : 'Create Meeting'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
