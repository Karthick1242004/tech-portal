export interface Feedback {
  id: string;
  jobId: string;
  equipmentName: string;
  technicianName: string;
  feedbackText: string;
  hoursWorked: number;
  images: string[];
  createdAt: string;
}

const technicianNames = [
  'John Smith',
  'Sarah Johnson',
  'Michael Chen',
  'Emily Davis',
  'Robert Wilson',
  'Lisa Anderson',
  'David Martinez',
  'Jennifer Taylor',
  'James Brown',
  'Maria Garcia',
];

const equipmentNames = [
  'EQT-2041 - Hydraulic Pump',
  'EQT-4890 - Conveyor Belt Motor',
  'EQT-2156 - Welding Robot',
  'EQT-1205 - Air Compressor Unit',
  'EQT-5612 - Industrial Boiler',
  'EQT-3478 - CNC Milling Machine',
  'EQT-7823 - Cooling Tower',
  'EQT-9156 - Packaging Machine',
  'EQT-3891 - Hydraulic Press',
  'EQT-6234 - Assembly Line Robot',
];

const feedbackTexts = [
  'Maintenance completed successfully. All components inspected and found to be in good working condition. Replaced worn bearing assembly as preventive measure. System tested and operating within normal parameters.',
  'Routine service performed as scheduled. Lubrication points serviced, filters replaced, and system diagnostics completed. Minor wear noted on drive belt, recommend monitoring for next maintenance cycle.',
  'Identified and repaired faulty component causing intermittent shutdown. Replaced damaged sensor and recalibrated control system. All safety checks passed. Equipment ready for production.',
  'Preventive maintenance completed. All electrical connections inspected and tightened. Replaced aging components before failure could occur. System performance improved after calibration adjustments.',
  'Emergency repair completed. Isolated and fixed hydraulic leak in main pressure line. Replaced damaged seals and gaskets. Pressure tested and verified no additional leaks. System operational.',
  'Quarterly inspection completed. All safety systems verified and functional. Updated maintenance log with current readings. No immediate concerns identified. Next service due as per schedule.',
  'Performed comprehensive system overhaul. Replaced multiple worn components including bearings, seals, and drive mechanisms. Complete cleaning and lubrication performed. System tested extensively.',
  'Investigated reported vibration issue. Found misalignment in coupling assembly. Corrected alignment and replaced damaged coupling. Vibration eliminated and system running smoothly.',
  'Completed scheduled calibration. All sensors verified against standards and adjusted as needed. Control parameters optimized for current production requirements. Documentation updated.',
  'Responded to alarm condition. Diagnosed overheating issue caused by restricted airflow. Cleaned cooling vents and replaced clogged air filter. Temperature now within acceptable range.',
];

const sampleImages = [
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop',
];

function generateRandomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

export const mockFeedback: Feedback[] = Array.from({ length: 35 }, (_, index) => {
  const techIndex = index % technicianNames.length;
  const equipIndex = index % equipmentNames.length;
  const feedbackIndex = index % feedbackTexts.length;
  const daysAgo = Math.floor(Math.random() * 30);
  
  // Random number of images (0-3)
  const imageCount = Math.floor(Math.random() * 4);
  const feedbackImages = Array.from({ length: imageCount }, (_, i) => 
    `${sampleImages[i % sampleImages.length]}&sig=feedback-${index}-${i}`
  );

  return {
    id: `FB-${(index + 1).toString().padStart(5, '0')}`,
    jobId: `JOB-${(index + 1).toString().padStart(5, '0')}`,
    equipmentName: equipmentNames[equipIndex],
    technicianName: technicianNames[techIndex],
    feedbackText: feedbackTexts[feedbackIndex],
    hoursWorked: Math.floor(Math.random() * 8) + 1,
    images: feedbackImages,
    createdAt: generateRandomDate(daysAgo),
  };
});
