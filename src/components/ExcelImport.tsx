import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle } from "lucide-react";
import { parseExcelFile, exportToExcel, createSampleExcel } from "@/lib/excelUtils";
import { type Meeting } from "@/lib/mockData";

interface ExcelImportProps {
  onMeetingsImported: (meetings: Meeting[]) => void;
  currentMeetings: Meeting[];
}

export const ExcelImport = ({ onMeetingsImported, currentMeetings }: ExcelImportProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileUrl, setFileUrl] = useState("");
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const meetings = await parseExcelFile(file);
      onMeetingsImported(meetings);
      setSuccess(`Successfully imported ${meetings.length} meetings from Excel file.`);
    } catch (err) {
      setError(`Failed to parse Excel file: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUrlImport = async () => {
    if (!fileUrl) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
      }
      const blob = await response.blob();
      const file = new File([blob], "meetings.xlsx");
      const meetings = await parseExcelFile(file);
      onMeetingsImported(meetings);
      setSuccess(`Successfully imported ${meetings.length} meetings from URL.`);
    } catch (err) {
      setError(`Failed to import from URL: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExport = () => {
    try {
      exportToExcel(currentMeetings, `meetings-export-${new Date().toISOString().split('T')[0]}.xlsx`);
      setSuccess('Meetings exported successfully!');
      setError(null);
    } catch (err) {
      setError(`Failed to export meetings: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDownloadTemplate = () => {
    try {
      createSampleExcel();
      setSuccess('Sample template downloaded successfully!');
      setError(null);
    } catch (err) {
      setError(`Failed to create template: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Card className="border-border shadow-[var(--shadow-card)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          Excel Import/Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success && (
          <Alert className="border-accent text-accent-foreground">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Import Section */}
        <div className="space-y-3">
          <Label htmlFor="excel-file">Import Meetings from Excel</Label>
          <div className="flex gap-2">
            <Input
              id="excel-file"
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isLoading ? 'Processing...' : 'Upload'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Accepts .xlsx and .xls files. This will replace all current meetings with data from the Excel file.
          </p>
        </div>

        {/* URL Import Section */}
        <div className="space-y-3">
          <Label htmlFor="excel-url">Import Meetings from URL</Label>
          <div className="flex gap-2">
            <Input
              id="excel-url"
              type="url"
              placeholder="https://example.com/meetings.xlsx"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={handleUrlImport}
              disabled={isLoading || !fileUrl}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isLoading ? 'Processing...' : 'Import'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Provide a direct link to an Excel file.
          </p>
        </div>
        
        {/* Template and Export Section */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={handleDownloadTemplate}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={currentMeetings.length === 0}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Current Data
          </Button>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
          <h4 className="font-medium text-sm text-foreground">Excel Format Instructions:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Use the template for correct column headers</li>
            <li>• Separate multiple attendees with commas</li>
            <li>• Separate agenda items with pipes (|)</li>
            <li>• Agenda statuses: pending, discussed, action-required</li>
            <li>• Date format: YYYY-MM-DD</li>
            <li>• Time format: HH:MM (24-hour)</li>
          </ul>
        </div>

        {(error || success) && (
          <Button variant="ghost" onClick={clearMessages} className="w-full">
            Clear Messages
          </Button>
        )}
      </CardContent>
    </Card>
  );

};
