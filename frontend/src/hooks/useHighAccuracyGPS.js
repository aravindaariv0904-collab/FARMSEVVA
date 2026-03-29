import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook to track GPS with high accuracy and stabilization.
 * Follows the requirement of collecting best 3 readings below 30m accuracy.
 */
export const useHighAccuracyGPS = (options = {}) => {
  const [position, setPosition] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [status, setStatus] = useState('Wait...');
  const [readings, setReadings] = useState([]);
  const [stable, setStable] = useState(false);
  const watchId = useRef(null);

  // Requirement: Store last 5-10 readings, Filter accuracy > 30m, Average best 3
  const processReadings = useCallback((newReadings) => {
    // 1. Filter: Ignore readings with accuracy > 30 meters
    const goodReadings = newReadings.filter(r => r.accuracy <= 30);
    
    if (goodReadings.length < 3) {
      setStable(false);
      setStatus('Stabilizing (Wait)...');
      return null;
    }

    // 2. Sort by accuracy to find best 3
    const sortedReadings = [...goodReadings].sort((a, b) => a.accuracy - b.accuracy);
    const best3 = sortedReadings.slice(0, 3);

    // 3. Compute final position: Average best 3
    const avgLat = best3.reduce((sum, r) => sum + r.latitude, 0) / best3.length;
    const avgLng = best3.reduce((sum, r) => sum + r.longitude, 0) / best3.length;
    const avgAcc = best3.reduce((sum, r) => sum + r.accuracy, 0) / best3.length;

    setStable(true);
    setStatus(avgAcc < 15 ? 'High Accuracy' : 'Medium Accuracy');
    return { latitude: avgLat, longitude: avgLng, accuracy: avgAcc };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('GPS Not Supported');
      return;
    }

    // watchPosition settings as per requirements
    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
      ...options
    };

    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy: acc } = pos.coords;
        
        setReadings(prev => {
          const next = [...prev, { latitude, longitude, accuracy: acc }].slice(-10); // Keep last 10
          
          const stabilized = processReadings(next);
          if (stabilized) {
            setPosition(prevPos => {
                // Ignore small movements (<2 meters) to prevent jitter
                if (prevPos) {
                    const dist = calculateDistance(prevPos.latitude, prevPos.longitude, stabilized.latitude, stabilized.longitude);
                    if (dist < 0.002) return prevPos; // 2 meters approx
                }
                return stabilized;
            });
            setAccuracy(stabilized.accuracy);
          } else {
             // Even if not stable, update for immediate visual feedback if accuracy is okay-ish
             if (acc <= 50) {
                setAccuracy(acc);
                // setPosition({ latitude, longitude, accuracy: acc });
             }
          }
          return next;
        });

        if (acc > 30) setStatus('Low Accuracy');
      },
      (err) => {
        console.error('GPS Error:', err);
        setStatus('GPS Error');
      },
      geoOptions
    );

    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
    };
  }, [processReadings, options]);

  // Utility to calculate distance in km (Haversine simplified for small dist)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return { position, accuracy, status, stable, readings };
};
