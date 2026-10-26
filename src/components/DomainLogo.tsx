'use client';

import React from 'react';
import {
  Globe,
  Code2,
  Coffee,
  Cpu,
  Smartphone,
  Cloud,
  FileCode2,
  Palette,
  BarChart3,
  Layers,
  Database,
  Terminal,
  LineChart,
} from 'lucide-react';

interface LogoProps {
  className?: string;
}

export const AiLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Artificial Intelligence Logo"
  >
    <defs>
      <linearGradient id="aiGradComp" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6366F1" />
        <stop offset="50%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
      <linearGradient id="aiBgComp" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6366F1" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1" />
      </linearGradient>
      <radialGradient id="aiCoreComp" cx="24" cy="24" r="10" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#6366F1" />
      </radialGradient>
    </defs>

    {/* Housing */}
    <rect
      x="5"
      y="5"
      width="38"
      height="38"
      rx="10"
      fill="url(#aiBgComp)"
      stroke="url(#aiGradComp)"
      strokeWidth="2.2"
    />

    {/* Chip Pins */}
    <path
      d="M14 5V2M24 5V2M34 5V2M14 46V43M24 46V43M34 46V43M5 14H2M5 24H2M5 34H2M46 14H43M46 24H43M46 34H43"
      stroke="url(#aiGradComp)"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Synaptic Lines */}
    <line x1="15" y1="17" x2="24" y2="24" stroke="#8B5CF6" strokeWidth="1.5" strokeOpacity="0.8" />
    <line x1="15" y1="31" x2="24" y2="24" stroke="#8B5CF6" strokeWidth="1.5" strokeOpacity="0.8" />
    <line x1="33" y1="17" x2="24" y2="24" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.8" />
    <line x1="33" y1="31" x2="24" y2="24" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.8" />
    <line
      x1="15"
      y1="17"
      x2="24"
      y2="12"
      stroke="#8B5CF6"
      strokeWidth="1.2"
      strokeOpacity="0.6"
      strokeDasharray="2 2"
    />
    <line
      x1="33"
      y1="17"
      x2="24"
      y2="12"
      stroke="#06B6D4"
      strokeWidth="1.2"
      strokeOpacity="0.6"
      strokeDasharray="2 2"
    />
    <line
      x1="15"
      y1="31"
      x2="24"
      y2="36"
      stroke="#8B5CF6"
      strokeWidth="1.2"
      strokeOpacity="0.6"
      strokeDasharray="2 2"
    />
    <line
      x1="33"
      y1="31"
      x2="24"
      y2="36"
      stroke="#06B6D4"
      strokeWidth="1.2"
      strokeOpacity="0.6"
      strokeDasharray="2 2"
    />

    {/* Nodes */}
    <circle cx="24" cy="12" r="2.5" fill="#06B6D4" />
    <circle cx="24" cy="36" r="2.5" fill="#06B6D4" />
    <circle cx="15" cy="17" r="3" fill="#8B5CF6" />
    <circle cx="15" cy="31" r="3" fill="#8B5CF6" />
    <circle cx="33" cy="17" r="3" fill="#06B6D4" />
    <circle cx="33" cy="31" r="3" fill="#06B6D4" />

    {/* Central Core */}
    <rect
      x="18"
      y="18"
      width="12"
      height="12"
      rx="3.5"
      fill="url(#aiCoreComp)"
      stroke="#FFFFFF"
      strokeWidth="1.2"
    />
    <text
      x="24"
      y="27"
      textAnchor="middle"
      fill="#FFFFFF"
      fontSize="8.5"
      fontWeight="900"
      fontFamily="system-ui, -apple-system, sans-serif"
      letterSpacing="-0.5"
    >
      AI
    </text>
  </svg>
);

export const CybersecurityLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Cybersecurity Logo"
  >
    <defs>
      <linearGradient id="cyberGradComp" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#059669" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
      <linearGradient id="cyberBgComp" x1="6" y1="4" x2="42" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#059669" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1" />
      </linearGradient>
      <linearGradient id="lockGradComp" x1="16" y1="20" x2="32" y2="36" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>

    {/* Shield */}
    <path
      d="M24 4L7 11V22C7 33.2 14.3 43.4 24 46C33.7 43.4 41 33.2 41 22V11L24 4Z"
      fill="url(#cyberBgComp)"
      stroke="url(#cyberGradComp)"
      strokeWidth="2.4"
      strokeLinejoin="round"
    />

    {/* Inner Matrix Dash */}
    <path
      d="M24 9L12 14V21.5C12 29.8 17.1 37.5 24 40.5C30.9 37.5 36 29.8 36 21.5V14L24 9Z"
      stroke="url(#cyberGradComp)"
      strokeWidth="1.2"
      strokeOpacity="0.5"
      strokeDasharray="3 2"
    />

    {/* Crest Node */}
    <circle cx="24" cy="9" r="2" fill="#10B981" />

    {/* Lock Shackle */}
    <path
      d="M19 22V17C19 14.2386 21.2386 12 24 12C26.7614 12 29 14.2386 29 17V22"
      stroke="url(#cyberGradComp)"
      strokeWidth="2.6"
      strokeLinecap="round"
    />

    {/* Lock Body */}
    <rect
      x="16.5"
      y="22"
      width="15"
      height="13"
      rx="3.5"
      fill="url(#lockGradComp)"
      stroke="#FFFFFF"
      strokeWidth="1.2"
    />

    {/* Keyhole */}
    <circle cx="24" cy="27" r="1.8" fill="#FFFFFF" />
    <path d="M23.2 27.5L22.8 31.5H25.2L24.8 27.5H23.2Z" fill="#FFFFFF" />
  </svg>
);

export const IotLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Internet of Things Logo"
  >
    <defs>
      <linearGradient id="iotGradComp" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="50%" stopColor="#0D9488" />
        <stop offset="100%" stopColor="#84CC16" />
      </linearGradient>
      <linearGradient id="iotBgComp" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0284C7" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#84CC16" stopOpacity="0.12" />
      </linearGradient>
      <linearGradient id="hubGradComp" x1="18" y1="18" x2="30" y2="30" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0284C7" />
        <stop offset="100%" stopColor="#0D9488" />
      </linearGradient>
    </defs>

    {/* Housing */}
    <rect
      x="5"
      y="5"
      width="38"
      height="38"
      rx="10"
      fill="url(#iotBgComp)"
      stroke="url(#iotGradComp)"
      strokeWidth="2.2"
    />

    {/* Radiating RF Signal Waves */}
    <path
      d="M14 15C16.8 12.2 20.3 10.5 24 10.5C27.7 10.5 31.2 12.2 34 15"
      stroke="url(#iotGradComp)"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <path
      d="M18 19C19.6 17.4 21.7 16.5 24 16.5C26.3 16.5 28.4 17.4 30 19"
      stroke="url(#iotGradComp)"
      strokeWidth="2.2"
      strokeLinecap="round"
    />

    {/* Sensor Edge Nodes */}
    <circle cx="12" cy="33" r="3.5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1" />
    <circle cx="36" cy="33" r="3.5" fill="#84CC16" stroke="#FFFFFF" strokeWidth="1" />
    <circle cx="12" cy="33" r="1.3" fill="#FFFFFF" />
    <circle cx="36" cy="33" r="1.3" fill="#FFFFFF" />

    {/* Telemetry Links */}
    <line
      x1="15"
      y1="31"
      x2="20"
      y2="28"
      stroke="url(#iotGradComp)"
      strokeWidth="1.8"
      strokeDasharray="2 2"
    />
    <line
      x1="33"
      y1="31"
      x2="28"
      y2="28"
      stroke="url(#iotGradComp)"
      strokeWidth="1.8"
      strokeDasharray="2 2"
    />

    {/* Center Gateway */}
    <rect
      x="19"
      y="22"
      width="10"
      height="10"
      rx="2.5"
      fill="url(#hubGradComp)"
      stroke="#FFFFFF"
      strokeWidth="1.2"
    />
    <circle cx="24" cy="27" r="1.8" fill="#FFFFFF" />

    {/* Ground Plane */}
    <path d="M24 32V38M17 38H31" stroke="url(#iotGradComp)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

interface DomainLogoProps {
  slug?: string;
  iconName?: string;
  className?: string;
}

export const DomainLogo: React.FC<DomainLogoProps> = ({
  slug = '',
  iconName = '',
  className = 'w-6 h-6',
}) => {
  const normalizedSlug = slug.toLowerCase().trim();

  // 1. Check for dedicated domain logos first
  if (
    normalizedSlug === 'artificial-intelligence' ||
    normalizedSlug === 'ai' ||
    iconName === 'Brain'
  ) {
    return <AiLogo className={className} />;
  }

  if (
    normalizedSlug === 'cybersecurity' ||
    normalizedSlug === 'cyber-security' ||
    iconName === 'ShieldCheck'
  ) {
    return <CybersecurityLogo className={className} />;
  }

  if (
    normalizedSlug === 'iot' ||
    normalizedSlug === 'iot-embedded-systems' ||
    iconName === 'Wifi'
  ) {
    return <IotLogo className={className} />;
  }

  // 2. Slug-based fallbacks for other standard domains
  switch (normalizedSlug) {
    case 'web-development':
    case 'web-dev':
      return <Globe className={`${className} text-blue-600 dark:text-blue-400`} />;
    case 'python-programming':
    case 'python':
      return <FileCode2 className={`${className} text-blue-600 dark:text-blue-400`} />;
    case 'java-programming':
    case 'java':
      return <Coffee className={`${className} text-amber-600 dark:text-amber-400`} />;
    case 'cpp-programming':
    case 'cpp':
      return <Terminal className={`${className} text-pink-600 dark:text-pink-400`} />;
    case 'machine-learning':
      return <Cpu className={`${className} text-cyan-600 dark:text-cyan-400`} />;
    case 'data-science':
      return <Database className={`${className} text-purple-600 dark:text-purple-400`} />;
    case 'data-analytics':
      return <BarChart3 className={`${className} text-teal-600 dark:text-teal-400`} />;
    case 'android-development':
    case 'android':
      return <Smartphone className={`${className} text-rose-600 dark:text-rose-400`} />;
    case 'ui-ux-design':
    case 'ui-ux':
      return <Palette className={`${className} text-fuchsia-600 dark:text-fuchsia-400`} />;
    case 'cloud-computing':
    case 'cloud':
      return <Cloud className={`${className} text-sky-600 dark:text-sky-400`} />;
    case 'database-management':
    case 'database':
      return <Layers className={`${className} text-violet-600 dark:text-violet-400`} />;
    default:
      break;
  }

  // 3. IconName-based fallbacks
  switch (iconName) {
    case 'Globe':
      return <Globe className={`${className} text-blue-600`} />;
    case 'Code2':
      return <Code2 className={`${className} text-indigo-600`} />;
    case 'Coffee':
      return <Coffee className={`${className} text-amber-600`} />;
    case 'Cpu':
      return <Cpu className={`${className} text-purple-600`} />;
    case 'LineChart':
      return <LineChart className={`${className} text-teal-600`} />;
    case 'BarChart3':
      return <BarChart3 className={`${className} text-cyan-600`} />;
    case 'Smartphone':
      return <Smartphone className={`${className} text-rose-600`} />;
    case 'Palette':
      return <Palette className={`${className} text-pink-600`} />;
    case 'Cloud':
      return <Cloud className={`${className} text-sky-600`} />;
    case 'Database':
      return <Database className={`${className} text-violet-600`} />;
    default:
      return <Code2 className={`${className} text-blue-600 dark:text-blue-400`} />;
  }
};
