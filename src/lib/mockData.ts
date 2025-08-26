export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'discussed' | 'action-required';
  assignee?: string;
}

export interface Meeting {
  id: string;
  title: string;
  stakeholder: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  location: string;
  agenda: AgendaItem[];
  notes: string;
  nextMeeting?: string;
  attendees: string[];
}

export const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Q4 Strategy Review",
    stakeholder: "Acme Corporation",
    date: "2024-01-15",
    time: "10:00",
    duration: 60,
    status: "scheduled",
    location: "Conference Room A",
    agenda: [
      {
        id: "a1",
        title: "Q4 Performance Review",
        description: "Review quarterly metrics and KPIs",
        status: "pending"
      },
      {
        id: "a2",
        title: "2024 Budget Planning",
        description: "Discuss budget allocation for next year",
        status: "pending"
      },
      {
        id: "a3",
        title: "New Product Launch",
        description: "Timeline and resource requirements",
        status: "pending"
      }
    ],
    notes: "",
    nextMeeting: "2024-02-15",
    attendees: ["John Smith", "Sarah Johnson", "Mike Davis"]
  },
  {
    id: "2",
    title: "Project Kickoff",
    stakeholder: "TechStart Inc",
    date: "2024-01-12",
    time: "14:00",
    duration: 90,
    status: "completed",
    location: "Virtual - Zoom",
    agenda: [
      {
        id: "b1",
        title: "Project Scope Definition",
        description: "Define project boundaries and deliverables",
        status: "discussed"
      },
      {
        id: "b2",
        title: "Timeline & Milestones",
        description: "Establish key project milestones",
        status: "discussed"
      },
      {
        id: "b3",
        title: "Resource Allocation",
        description: "Team assignments and responsibilities",
        status: "action-required",
        assignee: "Project Manager"
      }
    ],
    notes: "Great kickoff meeting. Client is excited about the project. Need to finalize resource allocation by end of week.",
    nextMeeting: "2024-01-26",
    attendees: ["Alice Chen", "Bob Wilson", "Carol Brown"]
  },
  {
    id: "3",
    title: "Monthly Check-in",
    stakeholder: "Global Solutions Ltd",
    date: "2024-01-10",
    time: "09:00",
    duration: 45,
    status: "completed",
    location: "Client Office",
    agenda: [
      {
        id: "c1",
        title: "Progress Update",
        description: "Current project status and achievements",
        status: "discussed"
      },
      {
        id: "c2",
        title: "Issue Resolution",
        description: "Address any blockers or concerns",
        status: "discussed"
      }
    ],
    notes: "Project is on track. Minor delays in Phase 2 but should be resolved next week.",
    nextMeeting: "2024-02-10",
    attendees: ["David Lee", "Emma Thompson"]
  },
  {
    id: "4",
    title: "Contract Renewal Discussion",
    stakeholder: "Innovation Labs",
    date: "2024-01-08",
    time: "11:00",
    duration: 60,
    status: "rescheduled",
    location: "Conference Room B",
    agenda: [
      {
        id: "d1",
        title: "Contract Terms Review",
        description: "Review current contract terms and conditions",
        status: "pending"
      },
      {
        id: "d2",
        title: "Pricing Discussion",
        description: "Negotiate pricing for renewal period",
        status: "pending"
      }
    ],
    notes: "Rescheduled due to client's emergency. New date to be confirmed.",
    attendees: ["Frank Garcia", "Grace Kim"]
  },
  {
    id: "5",
    title: "Product Demo",
    stakeholder: "StartupCo",
    date: "2024-01-05",
    time: "15:30",
    duration: 30,
    status: "cancelled",
    location: "Virtual - Teams",
    agenda: [
      {
        id: "e1",
        title: "Feature Demonstration",
        description: "Show new product features",
        status: "pending"
      }
    ],
    notes: "Cancelled - client requested to postpone until next month.",
    attendees: ["Henry Park", "Ivy Zhang"]
  }
];