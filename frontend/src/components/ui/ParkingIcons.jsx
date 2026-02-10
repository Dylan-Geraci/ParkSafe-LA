import React from 'react';

// Parking Meter Icon - For location factor
export const ParkingMeterIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Parking meter"
    role="img"
  >
    <rect x="9" y="2" width="6" height="12" rx="2" />
    <path d="M12 14v8" />
    <path d="M8 22h8" />
    <circle cx="12" cy="7" r="1.5" fill="currentColor" />
  </svg>
);

// Clock/Timer Icon - For time factor
export const ParkingTimerIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Parking timer"
    role="img"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 6v6l4 2" />
    <path d="M9 2h6" />
    <path d="M12 2v2" />
  </svg>
);

// Calendar with P - For day factor
export const ParkingCalendarIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Parking calendar"
    role="img"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M3 10h18" />
    <path d="M8 2v4" />
    <path d="M16 2v4" />
    <path d="M10 14h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2v-4z" strokeWidth="1.5" />
    <path d="M10 14v6" strokeWidth="1.5" />
  </svg>
);

// Parking Sign Icon - For recommendations
export const ParkingSignIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Parking sign"
    role="img"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M9 7h3a3 3 0 0 1 0 6H9V7z" strokeWidth="2.5" fill="none" />
    <path d="M9 7v10" strokeWidth="2.5" />
  </svg>
);

// Car Icon - For form submit button
export const CarIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Car"
    role="img"
  >
    <path d="M5 17h14v3a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-3z" />
    <path d="M5 17l1.5-5.5A2 2 0 0 1 8.4 10h7.2a2 2 0 0 1 1.9 1.5L19 17" />
    <circle cx="8" cy="17" r="1.5" fill="currentColor" />
    <circle cx="16" cy="17" r="1.5" fill="currentColor" />
    <path d="M7 10V7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3" />
  </svg>
);

// Parking Ticket Icon - For history
export const ParkingTicketIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Parking ticket"
    role="img"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M4 10h16" strokeWidth="1.5" strokeDasharray="2 2" />
    <path d="M9 14h6" strokeWidth="1.5" />
    <path d="M9 17h4" strokeWidth="1.5" />
    <circle cx="8" cy="7" r="0.5" fill="currentColor" />
    <circle cx="12" cy="7" r="0.5" fill="currentColor" />
    <circle cx="16" cy="7" r="0.5" fill="currentColor" />
  </svg>
);

// History Clock Icon - Alternative for history if needed
export const HistoryIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="History"
    role="img"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 6v6l4 2" />
    <path d="M3.5 9.5A9 9 0 0 1 12 3" />
    <path d="M3.5 9.5H7" />
    <path d="M3.5 9.5V6" />
  </svg>
);

// Export all icons as a collection for easy import
export const ParkingIcons = {
  ParkingMeter: ParkingMeterIcon,
  ParkingTimer: ParkingTimerIcon,
  ParkingCalendar: ParkingCalendarIcon,
  ParkingSign: ParkingSignIcon,
  Car: CarIcon,
  ParkingTicket: ParkingTicketIcon,
  History: HistoryIcon,
};

export default ParkingIcons;
