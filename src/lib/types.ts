import type { Book } from 'lucide-svelte';

export interface RaceSession {
  status: string;
  vm_credentials: {
    username: string;
    password: string;
    guacToken?: string;
    guacConnectionId?: string;
    guacURL?: string;
    guacClientId?: string;
  };
  created_at: string;
  updated_at: string;
}

interface WhitelistEntry {
  username: string;
  address: string;
  viral_balance: number;
  signature: string;
  _id: string;
}

type IDLAccountField = {
  name: string;
  writable?: boolean;
  signer?: boolean;
  address?: string;
  pda?: {
    seeds: Array<{
      kind: string;
      value: number[];
    }>;
  };
};

type IDLArgument = {
  name: string;
  type: { array?: [string, number]; } | string;
};

type IDLMetadata = {
  name: string;
  version: string;
  spec: string;
  description: string;
};

type IDL = {
  address: string;
  metadata: IDLMetadata;
  instructions: Array<{
    name: string;
    discriminator: number[];
    accounts: IDLAccountField[];
    args: IDLArgument[];
  }>;
  accounts: Array<{
    name: string;
    discriminator: number[];
  }>;
  events: Array<{
    name: string;
    discriminator: number[];
  }>;
  errors: Array<{
    code: number;
    name: string;
    msg: string;
  }>;
  types: Array<{
    name: string;
    type: {
      kind: string;
      fields?: Array<{
        name: string;
        type: string | { array: [string, number] } | { defined: { name: string } };
      }>;
      variants?: Array<{
        name: string;
      }>;
    };
  }>;
};

interface Score {
  _id: string;
  account: string;
  score: number;
  timestamp: Date;
}

export interface Challenge {
  _id?: string;
  id?: string;
  title: string;
  name: string;
  description?: string;
  image: string;
  pfp: string;
  task?: string;
  label: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  status: 'upcoming' | 'active' | 'concluded' | 'expired';
  system_message?: string;
  deployed?: boolean;
  idl?: IDL;
  entryFee: number;
  characterLimit?: number;
  contextLimit?: number;
  chatLimit?: number;
  expiry: string;
  start_date: string;
  win_condition?: string;
  prize?: number;
  usdPrize?: number;
  initial_pool_size?: number;
  developer_fee: number;
  tools?: any[];
  winning_message?: string;
  winning_prize?: number;
  disable?: unknown[];
  tool_choice?: 'auto' | 'none' | 'function';
  expiry_logic?: 'time' | 'solved';
  scores?: Score[];
  __v?: number;
  tournamentPDA?: string;
  game?: string;
  stream_src?: string;
  game_ip?: string;
  game_secret?: string;
  max_actions?: number;
  whitelist?: WhitelistEntry[];
  stream_url?: string;
  winning_address?: string;
  winning_txn?: string;
}

export interface SettingsRes {
  activeChallenge?: Challenge;
  concludedChallenges: Challenge[];
  challenges: Challenge[];
  faq: { question: string; answer: string }[];
  breakAttempts: number;
  jailToken: { address: string };
  solPrice: number;
  total_payout: number;
  treasury: number;
}

export const colorSchemes = {
  pink: {
    icon: 'text-pink-400',
    bg: 'bg-gradient-to-br from-pink-900/40 via-purple-800/30 to-purple-900/40',
    hover: 'hover:from-pink-900/40 hover:via-purple-800/30 hover:to-purple-900/40',
    iconBg: 'rgb(var(--pink-400))'
  },
  blue: {
    icon: 'text-blue-400',
    bg: 'bg-gradient-to-br from-blue-900/40 via-indigo-800/30 to-purple-900/40',
    hover: 'hover:from-blue-900/40 hover:via-indigo-800/30 hover:to-purple-900/40',
    iconBg: 'rgb(var(--blue-400))'
  },
  purple: {
    icon: 'text-purple-400',
    bg: 'bg-gradient-to-br from-purple-900/40 via-indigo-800/30 to-stone-900/40',
    hover: 'hover:from-purple-900/40 hover:via-indigo-800/30 hover:to-stone-900/40',
    iconBg: 'rgb(var(--purple-400))'
  },
  orange: {
    icon: 'text-orange-400',
    bg: 'bg-gradient-to-br from-orange-900/40 via-red-800/30 to-purple-900/40',
    hover: 'hover:from-orange-900/40 hover:via-red-800/30 hover:to-purple-900/40',
    iconBg: 'rgb(var(--orange-400))'
  },
  indigo: {
    icon: 'text-indigo-400',
    bg: 'bg-gradient-to-br from-indigo-900/40 via-blue-800/30 to-purple-900/40',
    hover: 'hover:from-indigo-900/40 hover:via-blue-800/30 hover:to-purple-900/40',
    iconBg: 'rgb(var(--indigo-400))'
  },
  emerald: {
    icon: 'text-emerald-400',
    bg: 'bg-gradient-to-br from-emerald-900/40 via-green-800/30 to-purple-900/40',
    hover: 'hover:from-emerald-900/40 hover:via-green-800/30 hover:to-purple-900/40',
    iconBg: 'rgb(var(--emerald-400))'
  }
} as const;

export type ColorScheme = keyof typeof colorSchemes;

export interface Race {
  id: string;
  title: string;
  description: string;
  category: 'creative' | 'mouse' | 'slacker' | 'gaming' | 'wildcard';
  icon?: string;
  colorScheme?: ColorScheme;
  prompt?: string;
  reward?: number;
  buttonText: string;
  stakeRequired?: number;
  href?: string;
}

export interface Category {
  id: string;
  title: string;
  icon: any;
  races: Race[];
}

export interface CarouselSlides {
  id: string;
  title: string;
  description: string;
  icon: typeof Book;
  iconColor: string;
  iconBgColor: string;
  bgGradient: string;
  hoverGradient: string;
  buttonText: string;
  href: string;
}
