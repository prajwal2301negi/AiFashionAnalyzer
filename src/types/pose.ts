export interface Keypoint {
  position: {
    x: number;
    y: number;
  };
  score: number;
  part: string;
}

export interface Pose {
  keypoints: Keypoint[];
  score: number;
}

export interface PoseNet {
  estimateSinglePose: (
    input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
    config?: any
  ) => Promise<Pose>;
  dispose: () => void;
}

export interface ClothingItem {
  id: string;
  name: string;
  type: 'shirt' | 'dress' | 'jacket' | 'pants';
  image: string;
  color: string;
  price: number;
  brand?: string;
  size?: string;
  material?: string;
  rating?: number;
  reviews?: number;
}

export interface OutfitRecommendation {
  id: string;
  name: string;
  items: ClothingItem[];
  occasion: string;
  confidence: number;
}

export interface BodyMeasurements {
  shoulderWidth: number;
  chestWidth: number;
  waistWidth: number;
  armLength: number;
  torsoLength: number;
  confidence: number;
}

export interface FittingAnalysis {
  fit: 'perfect' | 'good' | 'loose' | 'tight';
  confidence: number;
  recommendations: string[];
}

export interface VirtualTryOnSession {
  id: string;
  startTime: Date;
  triedItems: ClothingItem[];
  favorites: ClothingItem[];
  measurements: BodyMeasurements | null;
  screenshots: string[];
}