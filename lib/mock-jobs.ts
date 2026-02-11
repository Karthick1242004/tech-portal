export interface Job {
  id: string;
  description: string;
  equipment: {
    id: string;
    name: string;
  };
  processFunction: {
    id: string;
    description: string;
  };
  status: string;
  jobInstruction: string;
  feedbackText: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  plannedStart: string;
  targetEnd: string;
  images: string[];
  contact: {
    name: string;
    phone: string;
  };
  hoursWorked: number;
}

const equipmentTypes = [
  { id: 'EQT-2041', name: 'Hydraulic Pump', process: 'Cooling System' },
  { id: 'EQT-4890', name: 'Conveyor Belt Motor', process: 'Material Handling' },
  { id: 'EQT-1205', name: 'Air Compressor Unit', process: 'Compressed Air Supply' },
  { id: 'EQT-3478', name: 'CNC Milling Machine', process: 'Precision Manufacturing' },
  { id: 'EQT-5612', name: 'Industrial Boiler', process: 'Steam Generation' },
  { id: 'EQT-7823', name: 'Cooling Tower', process: 'HVAC System' },
  { id: 'EQT-9034', name: 'Packaging Line', process: 'Product Packaging' },
  { id: 'EQT-2156', name: 'Welding Robot', process: 'Assembly Line' },
  { id: 'EQT-6789', name: 'Paint Booth', process: 'Surface Treatment' },
  { id: 'EQT-4321', name: 'Forklift Battery System', process: 'Material Transport' },
];

const descriptions = [
  'Routine pressure valve maintenance and inspection. Replace gasket seals if necessary.',
  'Quarterly lubrication and belt tension check. Clean sensor arrays.',
  'Filter replacement and system diagnostics. Check oil levels.',
  'Annual inspection and calibration. Test all safety interlocks.',
  'Monthly preventive maintenance. Inspect all moving parts.',
  'System upgrade and performance optimization. Test all components.',
  'Emergency repair required. Investigate unusual noise.',
  'Scheduled replacement of worn components. Update firmware.',
  'Complete overhaul and deep cleaning. Replace consumables.',
  'Diagnostic assessment and performance evaluation.',
  'Routine inspection and cleaning. Document findings.',
  'Critical system check before production run.',
  'Post-incident safety inspection and certification.',
  'Seasonal maintenance and winterization prep.',
  'Compliance inspection and documentation update.',
];

const priorities: Job['priority'][] = ['HIGH', 'MEDIUM', 'LOW'];

const contactPersons = [
  { name: 'John Smith - Sr Engineer', phone: '(555) 123-4567' },
  { name: 'Sarah Johnson - Maintenance Lead', phone: '(555) 234-5678' },
  { name: 'Michael Chen - Operations Manager', phone: '(555) 345-6789' },
  { name: 'Emily Davis - Technical Supervisor', phone: '(555) 456-7890' },
  { name: 'Robert Wilson - Plant Manager', phone: '(555) 567-8901' },
  { name: 'Lisa Anderson - Safety Officer', phone: '(555) 678-9012' },
  { name: 'David Martinez - Equipment Specialist', phone: '(555) 789-0123' },
  { name: 'Jennifer Taylor - Quality Engineer', phone: '(555) 890-1234' },
];

const jobInstructions = [
  'Follow lockout/tagout procedures. Wear proper PPE including safety glasses and gloves. Ensure equipment is de-energized before starting work.',
  'Coordinate with production team before starting. Document all findings and take photos of any issues discovered during inspection.',
  'Use calibrated tools only. Refer to equipment manual section 4.2 for detailed procedures. Update maintenance log upon completion.',
  'Work must be completed during scheduled downtime. Test all safety features after maintenance. Report any abnormalities immediately.',
  'Follow manufacturer guidelines strictly. Use only approved replacement parts. Verify all connections before re-energizing equipment.',
];

const feedbackTemplates = [
  'Maintenance completed successfully. All components inspected and found to be in good working condition. No issues detected.',
  'Routine service performed as scheduled. Minor wear noted on bearing assembly, recommend monitoring for next cycle.',
  'Identified and replaced faulty component. System tested and operating within normal parameters. Additional follow-up recommended in 30 days.',
  'Preventive maintenance completed. All lubrication points serviced. Equipment ready for operation.',
  'Inspection revealed no immediate concerns. All safety systems verified and functional. Next service due as per schedule.',
];

const sampleImages = [
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122',
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837',
];

const maintenanceTasks = [
  ['Replace air filters', 'Inspect ductwork for leaks', 'Calibrate thermostats', 'Check refrigerant levels', 'Clean condenser coils'],
  ['Check oil levels', 'Replace seals', 'Verify pressure readings', 'Document findings'],
  ['Inspect belts', 'Lubricate moving parts', 'Check alignment', 'Clean debris'],
  ['Test safety interlocks', 'Verify calibration', 'Check all sensors', 'Document test results'],
  ['Inspect for wear', 'Replace damaged parts', 'Verify operations', 'Clean and test'],
  ['Performance testing', 'System diagnostics', 'Component verification', 'Final inspection'],
  ['Diagnostic assessment', 'Identify issues', 'Create repair plan', 'Schedule follow-up'],
];

function generateRandomDate(startDays: number, endDays: number): string {
  const start = new Date();
  start.setDate(start.getDate() + startDays);

  const end = new Date();
  end.setDate(end.getDate() + endDays);

  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const randomDate = new Date(randomTime);

  // Format: "03 Feb 2026 - 10:30 AM"
  const day = randomDate.getDate().toString().padStart(2, '0');
  const month = randomDate.toLocaleDateString('en-US', { month: 'short' });
  const year = randomDate.getFullYear();
  const hours = randomDate.getHours();
  const minutes = randomDate.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;

  return `${day} ${month} ${year} - ${displayHours}:${minutes} ${ampm}`;
}

export const mockJobs: Job[] = Array.from({ length: 50 }, (_, index) => {
  const equipment = equipmentTypes[index % equipmentTypes.length];
  const priorityIndex = Math.floor(Math.random() * 3);
  const descriptionIndex = Math.floor(Math.random() * descriptions.length);
  const contactIndex = index % contactPersons.length;
  const instructionIndex = index % jobInstructions.length;
  const feedbackIndex = index % feedbackTemplates.length;
  const plannedStartDate = generateRandomDate(0, 14);
  const targetEndDate = generateRandomDate(0, 14);

  // Random number of images (0-3)
  const imageCount = Math.floor(Math.random() * 4);
  const jobImages = Array.from({ length: imageCount }, (_, i) =>
    `${sampleImages[i % sampleImages.length]}?w=400&h=300&fit=crop&q=80&sig=${index}-${i}`
  );

  return {
    id: `JOB-${(index + 1).toString().padStart(5, '0')}`,
    description: descriptions[descriptionIndex],
    equipment: {
      id: equipment.id,
      name: equipment.name,
    },
    processFunction: {
      id: `PROC-${(index + 1).toString().padStart(3, '0')}`,
      description: equipment.process,
    },
    status: 'In progress',
    jobInstruction: jobInstructions[instructionIndex],
    feedbackText: feedbackTemplates[feedbackIndex],
    priority: priorities[priorityIndex],
    plannedStart: plannedStartDate,
    targetEnd: targetEndDate,
    images: jobImages,
    contact: contactPersons[contactIndex],
    hoursWorked: Math.floor(Math.random() * 8) + 1,
  };
});

// Sort by priority (HIGH first) and then by planned start
mockJobs.sort((a, b) => {
  const priorityWeight = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  if (priorityWeight[a.priority] !== priorityWeight[b.priority]) {
    return priorityWeight[b.priority] - priorityWeight[a.priority];
  }
  return a.plannedStart.localeCompare(b.plannedStart);
});
