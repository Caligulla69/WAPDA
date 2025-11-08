// ============================================
// FILE: src/hooks/useDataStore.js
// ============================================
import { useState } from 'react';

const INITIAL_REPORTS = [
  {
    id: 'TR-001',
    serialNo: 'TR-2025-001',
    date: '2025-10-29',
    time: '08:30',
    apparatus: 'Transformer T1',
    description: 'Unusual heating detected in transformer',
    recommendation: 'Immediate inspection and load reduction',
    operationAction: 'Load reduced by 30%',
    notifiedBy: 'Ali Khan',
    referTo: 'Electrical',
    means: 'Telephone',
    currentStage: 'Department',
    status: 'In Progress',
    createdBy: 'Ali Khan',
    remarks: [
      { by: 'Ali Khan (Shift Engineer)', text: 'Report generated', time: '08:30', date: '2025-10-29' }
    ]
  },
  {
    id: 'TR-002',
    serialNo: 'TR-2025-002',
    date: '2025-10-28',
    time: '14:20',
    apparatus: 'Pump P2',
    description: 'Vibration levels exceeding normal range',
    recommendation: 'Check alignment and bearings',
    operationAction: 'Pump switched to backup',
    notifiedBy: 'Sara Ahmed',
    referTo: 'Mechanical',
    means: 'Telephone',
    currentStage: 'OE Department',
    status: 'In Progress',
    createdBy: 'Sara Ahmed',
    remarks: [
      { by: 'Sara Ahmed (Shift Engineer)', text: 'Report generated', time: '14:20', date: '2025-10-28' },
      { by: 'Mechanical Department', text: 'Bearings replaced, alignment checked. Ready for verification.', time: '16:45', date: '2025-10-28' }
    ]
  }
];

export const useDataStore = () => {
  const [reports, setReports] = useState(INITIAL_REPORTS);
  return { reports, setReports };
};