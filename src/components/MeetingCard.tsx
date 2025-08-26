import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { CalendarDays, Clock, MapPin, Users, Edit, Trash2, FileText, ChevronDown, ChevronUp, AlertCircle, CheckCircle, Clock3 } from "lucide-react";
import { type Meeting } from "@/lib/mockData";
import { useState } from "react";

interface MeetingCardProps {
  meeting: Meeting;
  onEdit: (meeting: Meeting) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'bg-status-scheduled text-white';
    case 'completed':
      return 'bg-status-completed text-white';
    case 'cancelled':
      return 'bg-status-cancelled text-white';
    case 'rescheduled':
      return 'bg-status-rescheduled text-white';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getAgendaStatusColor = (status: string) => {
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

export const MeetingCard = ({ meeting, onEdit, onDelete }: MeetingCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const pendingItems = meeting.agenda.filter(item => item.status === 'pending').length;
  const actionItems = meeting.agenda.filter(item => item.status === 'action-required').length;

  const getAgendaIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock3 className="h-4 w-4" />;
      case 'discussed':
        return <CheckCircle className="h-4 w-4" />;
      case 'action-required':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-foreground">{meeting.title}</CardTitle>
            <p className="text-sm font-medium text-primary">{meeting.stakeholder}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(meeting.status)}>
              {meeting.status}
            </Badge>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(meeting)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(meeting.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Meeting Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>{formatDate(meeting.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{meeting.time} ({meeting.duration}min)</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{meeting.location}</span>
          </div>
        </div>

        {/* Attendees */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-1">
            {meeting.attendees.map((attendee, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {attendee}
              </Badge>
            ))}
          </div>
        </div>

        {/* Agenda Section */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <div className="space-y-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    Agenda ({meeting.agenda.length} items)
                  </span>
                </div>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            
            <div className="flex flex-wrap gap-2">
              {pendingItems > 0 && (
                <Badge className={getAgendaStatusColor('pending')}>
                  {pendingItems} Pending
                </Badge>
              )}
              {actionItems > 0 && (
                <Badge className={getAgendaStatusColor('action-required')}>
                  {actionItems} Action Items
                </Badge>
              )}
              {meeting.agenda.filter(item => item.status === 'discussed').length > 0 && (
                <Badge className={getAgendaStatusColor('discussed')}>
                  {meeting.agenda.filter(item => item.status === 'discussed').length} Discussed
                </Badge>
              )}
            </div>

            <CollapsibleContent className="space-y-3 pt-2">
              {/* Detailed Agenda Items */}
              <div className="space-y-2">
                {meeting.agenda.map((item) => (
                  <div key={item.id} className="bg-muted/30 rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getAgendaIcon(item.status)}
                        <h4 className="font-medium text-foreground text-sm">{item.title}</h4>
                      </div>
                      <Badge className={getAgendaStatusColor(item.status)} variant="outline">
                        {item.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">{item.description}</p>
                    {item.assignee && (
                      <div className="flex items-center gap-2 pl-6">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Assigned to: {item.assignee}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Detailed Notes */}
              {meeting.notes && (
                <div className="bg-muted/30 rounded-lg p-3">
                  <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Meeting Notes
                  </h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{meeting.notes}</p>
                </div>
              )}
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Notes Preview (when collapsed) */}
        {!isExpanded && meeting.notes && (
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {meeting.notes}
            </p>
          </div>
        )}

        {/* Next Meeting */}
        {meeting.nextMeeting && (
          <div className="flex items-center gap-2 text-sm text-accent">
            <CalendarDays className="h-4 w-4" />
            <span>Next meeting: {formatDate(meeting.nextMeeting)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};