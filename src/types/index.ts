export type Position = 'goalkeeper' | 'defender' | 'midfielder' | 'forward';

export interface Player {
  id: string;
  name: string;
  position: Position;
  rating: number; // 0-5 stars
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  players: Player[];
  createdAt: Date;
}

export interface SplitOptions {
  considerRating: boolean;
  considerPosition: boolean;
  numberOfTeams: number;
}

export interface GeneratedTeam {
  id: string;
  name: string;
  players: Player[];
  totalRating: number;
  averageRating: number;
  positionCount: Record<Position, number>;
}