import * as XLSX from 'xlsx';

export interface StaffUserExportRow {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  location: string;
  user_type: string;
  industries: string;
  skills: string;
  date_registered: string;
  profile_status: string;
  vetting_status: string;
}

const EXPORT_HEADERS: { key: keyof StaffUserExportRow; label: string }[] = [
  { key: 'first_name', label: 'First name' },
  { key: 'last_name', label: 'Surname' },
  { key: 'email', label: 'Email address' },
  { key: 'phone', label: 'Phone number' },
  { key: 'location', label: 'Location' },
  { key: 'user_type', label: 'User Type' },
  { key: 'industries', label: 'Industries' },
  { key: 'skills', label: 'Skills' },
  { key: 'date_registered', label: 'Date Registered' },
  { key: 'profile_status', label: 'Profile Status' },
  { key: 'vetting_status', label: 'Vetting Status' },
];

export function downloadStaffUserExportXlsx(rows: StaffUserExportRow[]) {
  const sheetRows = rows.map((row) => {
    const out: Record<string, string> = {};
    for (const { key, label } of EXPORT_HEADERS) {
      out[label] = row[key] ?? '';
    }
    return out;
  });

  const worksheet = XLSX.utils.json_to_sheet(sheetRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

  const stamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `gigexecs-users-${stamp}.xlsx`);
}
