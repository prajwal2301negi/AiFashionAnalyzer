import { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { Pose, PoseNet, BodyMeasurements, FittingAnalysis } from '../types/pose';

export const usePoseDetection = () => {
  const [model, setModel] = useState<PoseNet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPose, setCurrentPose] = useState<Pose | null>(null);
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurements | null>(null);
  const [fittingAnalysis, setFittingAnalysis] = useState<FittingAnalysis | null>(null);
  const [gestureState, setGestureState] = useState<{
    leftHandUp: boolean;
    rightHandUp: boolean;
    leftCounter: number;
    rightCounter: number;
    thumbsUp: boolean;
    peace: boolean;
    wave: boolean;
  }>({
    leftHandUp: false,
    rightHandUp: false,
    leftCounter: 0,
    rightCounter: 0,
    thumbsUp: false,
    peace: false,
    wave: false,
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const poseHistoryRef = useRef<Pose[]>([]);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const net = await posenet.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          inputResolution: { width: 640, height: 480 },
          multiplier: 0.75,
        });
        setModel(net);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading PoseNet model:', error);
        setIsLoading(false);
      }
    };

    loadModel();
  }, []);

  const calculateBodyMeasurements = useCallback((pose: Pose): BodyMeasurements | null => {
    const leftShoulder = pose.keypoints.find(kp => kp.part === 'leftShoulder');
    const rightShoulder = pose.keypoints.find(kp => kp.part === 'rightShoulder');
    const leftHip = pose.keypoints.find(kp => kp.part === 'leftHip');
    const rightHip = pose.keypoints.find(kp => kp.part === 'rightHip');
    const leftElbow = pose.keypoints.find(kp => kp.part === 'leftElbow');
    const leftWrist = pose.keypoints.find(kp => kp.part === 'leftWrist');

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return null;

    const shoulderWidth = Math.abs(leftShoulder.position.x - rightShoulder.position.x);
    const chestWidth = shoulderWidth * 0.85; // Approximate chest width
    const waistWidth = Math.abs(leftHip.position.x - rightHip.position.x);
    const torsoLength = Math.abs(leftShoulder.position.y - leftHip.position.y);
    
    let armLength = 0;
    if (leftElbow && leftWrist && leftShoulder.score > 0.5) {
      const upperArm = Math.sqrt(
        Math.pow(leftShoulder.position.x - leftElbow.position.x, 2) +
        Math.pow(leftShoulder.position.y - leftElbow.position.y, 2)
      );
      const foreArm = Math.sqrt(
        Math.pow(leftElbow.position.x - leftWrist.position.x, 2) +
        Math.pow(leftElbow.position.y - leftWrist.position.y, 2)
      );
      armLength = upperArm + foreArm;
    }

    const confidence = Math.min(
      leftShoulder.score,
      rightShoulder.score,
      leftHip.score,
      rightHip.score
    );

    return {
      shoulderWidth,
      chestWidth,
      waistWidth,
      armLength,
      torsoLength,
      confidence,
    };
  }, []);

  const analyzeFit = useCallback((measurements: BodyMeasurements, clothingType: string): FittingAnalysis => {
    // Simplified fit analysis based on measurements
    const shoulderRatio = measurements.shoulderWidth / 200; // Normalized to average
    const chestRatio = measurements.chestWidth / 170;
    
    let fit: 'perfect' | 'good' | 'loose' | 'tight' = 'good';
    let confidence = 0.8;
    const recommendations: string[] = [];

    if (shoulderRatio > 1.2) {
      fit = 'tight';
      recommendations.push('Consider a larger size for better shoulder fit');
    } else if (shoulderRatio < 0.8) {
      fit = 'loose';
      recommendations.push('Consider a smaller size for better fit');
    } else {
      fit = 'perfect';
      confidence = 0.95;
    }

    if (clothingType === 'shirt' && chestRatio > 1.1) {
      recommendations.push('This shirt may be tight around the chest');
    }

    return { fit, confidence, recommendations };
  }, []);

  const detectAdvancedGestures = useCallback((pose: Pose) => {
    const leftWrist = pose.keypoints.find(kp => kp.part === 'leftWrist');
    const rightWrist = pose.keypoints.find(kp => kp.part === 'rightWrist');
    const leftShoulder = pose.keypoints.find(kp => kp.part === 'leftShoulder');
    const rightShoulder = pose.keypoints.find(kp => kp.part === 'rightShoulder');
    const leftElbow = pose.keypoints.find(kp => kp.part === 'leftElbow');
    const rightElbow = pose.keypoints.find(kp => kp.part === 'rightElbow');

    let newGestureState = { ...gestureState };

    // Basic hand raising detection
    if (leftWrist && leftShoulder && leftWrist.score > 0.3 && leftShoulder.score > 0.3) {
      const isLeftHandUp = leftWrist.position.y < leftShoulder.position.y - 50;
      if (isLeftHandUp && !gestureState.leftHandUp) {
        newGestureState.leftCounter += 1;
      } else if (!isLeftHandUp) {
        newGestureState.leftCounter = 0;
      }
      newGestureState.leftHandUp = isLeftHandUp;
    }

    if (rightWrist && rightShoulder && rightWrist.score > 0.3 && rightShoulder.score > 0.3) {
      const isRightHandUp = rightWrist.position.y < rightShoulder.position.y - 50;
      if (isRightHandUp && !gestureState.rightHandUp) {
        newGestureState.rightCounter += 1;
      } else if (!isRightHandUp) {
        newGestureState.rightCounter = 0;
      }
      newGestureState.rightHandUp = isRightHandUp;
    }

    // Thumbs up detection (simplified)
    if (rightWrist && rightElbow && rightShoulder) {
      const armAngle = Math.atan2(
        rightWrist.position.y - rightElbow.position.y,
        rightWrist.position.x - rightElbow.position.x
      );
      newGestureState.thumbsUp = Math.abs(armAngle) < 0.5 && rightWrist.position.y < rightElbow.position.y;
    }

    // Wave detection (hand moving side to side)
    if (poseHistoryRef.current.length > 10) {
      const recentPoses = poseHistoryRef.current.slice(-10);
      const wristPositions = recentPoses.map(p => 
        p.keypoints.find(kp => kp.part === 'rightWrist')?.position.x || 0
      );
      const variance = wristPositions.reduce((acc, x, i, arr) => {
        const mean = arr.reduce((a, b) => a + b) / arr.length;
        return acc + Math.pow(x - mean, 2);
      }, 0) / wristPositions.length;
      
      newGestureState.wave = variance > 1000; // Threshold for wave detection
    }

    return newGestureState;
  }, [gestureState]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          detectPose();
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const detectPose = async () => {
    if (!model || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const detect = async () => {
      if (video.readyState === 4) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        try {
          const pose = await model.estimateSinglePose(video, {
            flipHorizontal: true,
          });

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (pose.score > 0.3) {
            setCurrentPose(pose);
            
            // Store pose history for gesture analysis
            poseHistoryRef.current.push(pose);
            if (poseHistoryRef.current.length > 30) {
              poseHistoryRef.current.shift();
            }

            // Calculate body measurements
            const measurements = calculateBodyMeasurements(pose);
            if (measurements && measurements.confidence > 0.5) {
              setBodyMeasurements(measurements);
            }

            // Detect gestures
            const newGestureState = detectAdvancedGestures(pose);
            setGestureState(newGestureState);

            drawPose(ctx, pose);
            drawGestureIndicators(ctx, newGestureState, canvas.width, canvas.height);
            drawBodyMeasurements(ctx, measurements, canvas.width, canvas.height);
          }
        } catch (error) {
          console.error('Error during pose detection:', error);
        }
      }

      animationFrameRef.current = requestAnimationFrame(detect);
    };

    detect();
  };

  const drawPose = (ctx: CanvasRenderingContext2D, pose: Pose) => {
    // Enhanced pose drawing with confidence-based styling
    pose.keypoints.forEach((keypoint) => {
      if (keypoint.score > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 6, 0, 2 * Math.PI);
        
        // Color coding based on keypoint type and confidence
        if (keypoint.part.includes('Wrist')) {
          ctx.fillStyle = keypoint.score > 0.7 ? '#F59E0B' : '#FCD34D';
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.fill();
          ctx.stroke();
        } else if (keypoint.part.includes('Shoulder') || keypoint.part.includes('Hip')) {
          ctx.fillStyle = keypoint.score > 0.7 ? '#EF4444' : '#F87171';
          ctx.fill();
        } else {
          ctx.fillStyle = keypoint.score > 0.7 ? '#6366F1' : '#A5B4FC';
          ctx.fill();
        }
      }
    });

    // Enhanced skeleton with confidence-based line thickness
    const adjacentKeyPoints = [
      ['leftShoulder', 'rightShoulder'],
      ['leftShoulder', 'leftElbow'],
      ['leftElbow', 'leftWrist'],
      ['rightShoulder', 'rightElbow'],
      ['rightElbow', 'rightWrist'],
      ['leftShoulder', 'leftHip'],
      ['rightShoulder', 'rightHip'],
      ['leftHip', 'rightHip'],
      ['leftHip', 'leftKnee'],
      ['leftKnee', 'leftAnkle'],
      ['rightHip', 'rightKnee'],
      ['rightKnee', 'rightAnkle'],
    ];

    adjacentKeyPoints.forEach(([from, to]) => {
      const fromPoint = pose.keypoints.find(kp => kp.part === from);
      const toPoint = pose.keypoints.find(kp => kp.part === to);

      if (fromPoint && toPoint && fromPoint.score > 0.3 && toPoint.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(fromPoint.position.x, fromPoint.position.y);
        ctx.lineTo(toPoint.position.x, toPoint.position.y);
        
        const avgConfidence = (fromPoint.score + toPoint.score) / 2;
        ctx.strokeStyle = avgConfidence > 0.7 ? '#F97316' : '#FDBA74';
        ctx.lineWidth = avgConfidence > 0.7 ? 4 : 2;
        ctx.stroke();
      }
    });
  };

  const drawGestureIndicators = (
    ctx: CanvasRenderingContext2D, 
    gestureState: any, 
    width: number, 
    height: number
  ) => {
    const buttonSize = 80;
    const margin = 40;

    // Left gesture indicator
    if (gestureState.leftHandUp) {
      ctx.beginPath();
      ctx.arc(margin + buttonSize/2, height/2, buttonSize/2, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.fill();
      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = 4;
      ctx.stroke();

      const progress = Math.min(gestureState.leftCounter * 0.2, 1);
      ctx.beginPath();
      ctx.arc(margin + buttonSize/2, height/2, buttonSize/2 - 10, -Math.PI/2, -Math.PI/2 + (progress * 2 * Math.PI));
      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = 8;
      ctx.stroke();
    }

    // Right gesture indicator
    if (gestureState.rightHandUp) {
      ctx.beginPath();
      ctx.arc(width - margin - buttonSize/2, height/2, buttonSize/2, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
      ctx.fill();
      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = 4;
      ctx.stroke();

      const progress = Math.min(gestureState.rightCounter * 0.2, 1);
      ctx.beginPath();
      ctx.arc(width - margin - buttonSize/2, height/2, buttonSize/2 - 10, -Math.PI/2, -Math.PI/2 + (progress * 2 * Math.PI));
      ctx.strokeStyle = '#22C55E';
      ctx.lineWidth = 8;
      ctx.stroke();
    }

    // Special gesture indicators
    if (gestureState.thumbsUp) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
      ctx.fillRect(width/2 - 50, 20, 100, 30);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('👍 Great!', width/2, 40);
    }

    if (gestureState.wave) {
      ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
      ctx.fillRect(width/2 - 50, 60, 100, 30);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('👋 Hello!', width/2, 80);
    }

    // Navigation arrows
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('←', margin + buttonSize/2, height/2 + 8);
    ctx.fillText('→', width - margin - buttonSize/2, height/2 + 8);
  };

  const drawBodyMeasurements = (
    ctx: CanvasRenderingContext2D,
    measurements: BodyMeasurements | null,
    width: number,
    height: number
  ) => {
    if (!measurements || measurements.confidence < 0.5) return;

    // Draw measurement overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, height - 120, 200, 110);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Body Measurements', 20, height - 100);
    
    ctx.font = '12px Arial';
    ctx.fillText(`Shoulder: ${Math.round(measurements.shoulderWidth)}px`, 20, height - 80);
    ctx.fillText(`Chest: ${Math.round(measurements.chestWidth)}px`, 20, height - 65);
    ctx.fillText(`Waist: ${Math.round(measurements.waistWidth)}px`, 20, height - 50);
    ctx.fillText(`Torso: ${Math.round(measurements.torsoLength)}px`, 20, height - 35);
    ctx.fillText(`Confidence: ${Math.round(measurements.confidence * 100)}%`, 20, height - 20);
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const takeScreenshot = useCallback((): string | null => {
    if (!canvasRef.current || !videoRef.current) return null;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    ctx.drawImage(videoRef.current, 0, 0);
    if (canvasRef.current) {
      ctx.drawImage(canvasRef.current, 0, 0);
    }
    
    return canvas.toDataURL('image/png');
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
      if (model) {
        model.dispose();
      }
    };
  }, [model]);

  return {
    videoRef,
    canvasRef,
    currentPose,
    gestureState,
    bodyMeasurements,
    fittingAnalysis,
    isLoading,
    startCamera,
    stopCamera,
    takeScreenshot,
    analyzeFit,
  };
};