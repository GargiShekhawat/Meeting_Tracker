import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, Users, Clock, Search, Plus, Filter, FileSpreadsheet } from "lucide-react";
import { MeetingCard } from "./MeetingCard";
import { MeetingForm } from "./MeetingForm";
import { ExcelImport } from "./ExcelImport";
import { mockMeetings, type Meeting } from "@/lib/mockData";
import { exportToExcel } from "@/lib/excelUtils";

export const MeetingDashboard = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [showExcelImport, setShowExcelImport] = useState(false);

  // Load mock data on initial load if no data exists
  useEffect(() => {
    if (meetings.length === 0) {
      setMeetings(mockMeetings);
    }
  }, []);

  const filteredMeetings = meetings.filter(meeting => {
    const matchesSearch = meeting.stakeholder.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || meeting.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const upcomingMeetings = meetings.filter(m => m.status === "scheduled").length;
  const completedMeetings = meetings.filter(m => m.status === "completed").length;
  const totalStakeholders = new Set(meetings.map(m => m.stakeholder)).size;

  const handleAddMeeting = (newMeeting: Omit<Meeting, 'id'>) => {
    const meeting: Meeting = {
      ...newMeeting,
      id: Date.now().toString()
    };
    setMeetings([meeting, ...meetings]);
    setShowForm(false);
  };

  const handleEditMeeting = (updatedMeeting: Meeting) => {
    setMeetings(meetings.map(m => m.id === updatedMeeting.id ? updatedMeeting : m));
    setEditingMeeting(null);
  };

  const handleDeleteMeeting = (id: string) => {
    setMeetings(meetings.filter(m => m.id !== id));
  };

  const handleMeetingsImported = (importedMeetings: Meeting[]) => {
    setMeetings(importedMeetings);
    setShowExcelImport(false);
  };

  const handleExportToExcel = () => {
    exportToExcel(meetings, `meetings-export-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (showExcelImport) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setShowExcelImport(false)}>
              <Plus className="w-4 h-4 mr-2 rotate-45" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Excel Import/Export</h1>
              <p className="text-muted-foreground">Import meetings from Excel or export current data</p>
            </div>
          </div>
          <ExcelImport 
            onMeetingsImported={handleMeetingsImported}
            currentMeetings={meetings}
          />
        </div>
      </div>
    );
  }

  if (showForm || editingMeeting) {
    return (
      <MeetingForm
        meeting={editingMeeting}
        onSave={editingMeeting ? handleEditMeeting : handleAddMeeting}
        onCancel={() => {
          setShowForm(false);
          setEditingMeeting(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Stakeholder Meeting Tracker</h1>
            <p className="text-muted-foreground">Manage your stakeholder meetings and agenda items with Excel import/export</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowExcelImport(true)}
              className="bg-background hover:bg-accent/10"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Excel Import/Export
            </Button>
            <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Meeting
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-border shadow-[var(--shadow-card)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Meetings</CardTitle>
              <CalendarDays className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{upcomingMeetings}</div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-[var(--shadow-card)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed This Month</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{completedMeetings}</div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-[var(--shadow-card)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Stakeholders</CardTitle>
              <Users className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalStakeholders}</div>
            </CardContent>
          </Card>
        </div>

        {/* Excel Notice */}
        <Card className="border-primary/20 bg-primary/5 shadow-[var(--shadow-card)]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Excel-Based Meeting Tracker
                </p>
                <p className="text-xs text-muted-foreground">
                  Import your meetings from Excel files, edit them here, and export back to Excel. 
                  Click "Excel Import/Export" to get started with your own data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="border-border shadow-[var(--shadow-card)]">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search meetings or stakeholders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Meetings List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Recent Meetings ({filteredMeetings.length})
          </h2>
          {filteredMeetings.length === 0 ? (
            <Card className="border-border shadow-[var(--shadow-card)]">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No meetings found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredMeetings.map((meeting) => (
                <MeetingCard
                  key={meeting.id}
                  meeting={meeting}
                  onEdit={setEditingMeeting}
                  onDelete={handleDeleteMeeting}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};