export interface CameraFilter {
  id: string;
  name: string;
  color: string | null;
  opacity: number;
}

export const CAMERA_FILTERS: CameraFilter[] = [
  {
    id: 'normal',
    name: 'Normal',
    color: null,
    opacity: 0,
  },
  {
    id: 'bw',
    name: 'B&W',
    color: '#000000',
    opacity: 0.5,
  },
  {
    id: 'vintage',
    name: 'Vintage',
    color: '#FFA500',
    opacity: 0.3,
  },
  {
    id: 'cool',
    name: 'Cool',
    color: '#0088FF',
    opacity: 0.25,
  },
  {
    id: 'warm',
    name: 'Warm',
    color: '#FF6B6B',
    opacity: 0.25,
  },
];
