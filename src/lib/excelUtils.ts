import * as XLSX from 'xlsx';
import { type Meeting, type AgendaItem } from './mockData';

export interface ExcelMeetingRow {
  'Meeting Title': string;
  'Stakeholder': string;
  'Date': string;
  'Time': string;
  'Duration (minutes)': number;
  'Status': 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  'Location': string;
  'Attendees': string;
  'Agenda Items': string;
  'Agenda Statuses': string;
  'Agenda Descriptions': string;
  'Notes': string;
  'Next Meeting': string;
}

export const parseExcelFile = (file: File): Promise<Meeting[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: ExcelMeetingRow[] = XLSX.utils.sheet_to_json(worksheet);
        
        const meetings: Meeting[] = jsonData.map((row, index) => {
          // Parse attendees (comma-separated)
          const attendees = row.Attendees 
            ? row.Attendees.split(',').map(a => a.trim()).filter(a => a)
            : [];
          
          // Parse agenda items
          const agendaTitles = row['Agenda Items'] 
            ? row['Agenda Items'].split('|').map(a => a.trim()).filter(a => a)
            : [];
          const agendaStatuses = row['Agenda Statuses']
            ? row['Agenda Statuses'].split('|').map(a => a.trim()).filter(a => a)
            : [];
          const agendaDescriptions = row['Agenda Descriptions']
            ? row['Agenda Descriptions'].split('|').map(a => a.trim()).filter(a => a)
            : [];
          
          const agenda: AgendaItem[] = agendaTitles.map((title, idx) => ({
            id: `${index}-${idx}`,
            title,
            description: agendaDescriptions[idx] || '',
            status: (agendaStatuses[idx] as AgendaItem['status']) || 'pending',
            assignee: undefined
          }));
          
          return {
            id: (index + 1).toString(),
            title: row['Meeting Title'] || '',
            stakeholder: row.Stakeholder || '',
            date: formatExcelDate(row.Date),
            time: row.Time || '',
            duration: row['Duration (minutes)'] || 60,
            status: row.Status || 'scheduled',
            location: row.Location || '',
            attendees,
            agenda,
            notes: row.Notes || '',
            nextMeeting: row['Next Meeting'] ? formatExcelDate(row['Next Meeting']) : undefined
          };
        });
        
        resolve(meetings);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const exportToExcel = (meetings: Meeting[], filename: string = 'meetings.xlsx') => {
  const excelData: ExcelMeetingRow[] = meetings.map(meeting => ({
    'Meeting Title': meeting.title,
    'Stakeholder': meeting.stakeholder,
    'Date': meeting.date,
    'Time': meeting.time,
    'Duration (minutes)': meeting.duration,
    'Status': meeting.status,
    'Location': meeting.location,
    'Attendees': meeting.attendees.join(', '),
    'Agenda Items': meeting.agenda.map(item => item.title).join(' | '),
    'Agenda Statuses': meeting.agenda.map(item => item.status).join(' | '),
    'Agenda Descriptions': meeting.agenda.map(item => item.description).join(' | '),
    'Notes': meeting.notes,
    'Next Meeting': meeting.nextMeeting || ''
  }));
  
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Meetings');
  
  // Auto-adjust column widths
  const colWidths = [
    { wch: 30 }, // Meeting Title
    { wch: 20 }, // Stakeholder
    { wch: 12 }, // Date
    { wch: 8 },  // Time
    { wch: 12 }, // Duration
    { wch: 12 }, // Status
    { wch: 25 }, // Location
    { wch: 30 }, // Attendees
    { wch: 50 }, // Agenda Items
    { wch: 30 }, // Agenda Statuses
    { wch: 50 }, // Agenda Descriptions
    { wch: 50 }, // Notes
    { wch: 12 }  // Next Meeting
  ];
  worksheet['!cols'] = colWidths;
  
  XLSX.writeFile(workbook, filename);
};

export const createSampleExcel = () => {
  const sampleData: ExcelMeetingRow[] = [
    {
      'Meeting Title': 'Q4 Strategy Review',
      'Stakeholder': 'Acme Corporation',
      'Date': '2024-01-15',
      'Time': '10:00',
      'Duration (minutes)': 60,
      'Status': 'scheduled',
      'Location': 'Conference Room A',
      'Attendees': 'John Smith, Sarah Johnson, Mike Davis',
      'Agenda Items': 'Q4 Performance Review | 2024 Budget Planning | New Product Launch',
      'Agenda Statuses': 'pending | pending | pending',
      'Agenda Descriptions': 'Review quarterly metrics and KPIs | Discuss budget allocation for next year | Timeline and resource requirements',
      'Notes': '',
      'Next Meeting': '2024-02-15'
    },
    {
      'Meeting Title': 'Project Kickoff',
      'Stakeholder': 'TechStart Inc',
      'Date': '2024-01-12',
      'Time': '14:00',
      'Duration (minutes)': 90,
      'Status': 'completed',
      'Location': 'Virtual - Zoom',
      'Attendees': 'Alice Chen, Bob Wilson, Carol Brown',
      'Agenda Items': 'Project Scope Definition | Timeline & Milestones | Resource Allocation',
      'Agenda Statuses': 'discussed | discussed | action-required',
      'Agenda Descriptions': 'Define project boundaries and deliverables | Establish key project milestones | Team assignments and responsibilities',
      'Notes': 'Great kickoff meeting. Client is excited about the project. Need to finalize resource allocation by end of week.',
      'Next Meeting': '2024-01-26'
    },
    {
      'Meeting Title': 'Monthly Check-in',
      'Stakeholder': 'Global Solutions Ltd',
      'Date': '2024-01-10',
      'Time': '09:00',
      'Duration (minutes)': 45,
      'Status': 'completed',
      'Location': 'Client Office',
      'Attendees': 'David Lee, Emma Thompson',
      'Agenda Items': 'Progress Update | Issue Resolution',
      'Agenda Statuses': 'discussed | discussed',
      'Agenda Descriptions': 'Current project status and achievements | Address any blockers or concerns',
      'Notes': 'Project is on track. Minor delays in Phase 2 but should be resolved next week.',
      'Next Meeting': '2024-02-10'
    }
  ];
  
  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Meetings');
  
  // Auto-adjust column widths
  const colWidths = [
    { wch: 30 }, // Meeting Title
    { wch: 20 }, // Stakeholder
    { wch: 12 }, // Date
    { wch: 8 },  // Time
    { wch: 12 }, // Duration
    { wch: 12 }, // Status
    { wch: 25 }, // Location
    { wch: 30 }, // Attendees
    { wch: 50 }, // Agenda Items
    { wch: 30 }, // Agenda Statuses
    { wch: 50 }, // Agenda Descriptions
    { wch: 50 }, // Notes
    { wch: 12 }  // Next Meeting
  ];
  worksheet['!cols'] = colWidths;
  
  XLSX.writeFile(workbook, 'sample-meetings-template.xlsx');
};

// Helper function to format Excel date
const formatExcelDate = (dateValue: any): string => {
  if (!dateValue) return '';
  
  // If it's already a string in YYYY-MM-DD format, return as is
  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }
  
  // If it's an Excel serial date number
  if (typeof dateValue === 'number') {
    const date = XLSX.SSF.parse_date_code(dateValue);
    return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
  }
  
  // Try to parse as Date
  const date = new Date(dateValue);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }
  
  return '';
};