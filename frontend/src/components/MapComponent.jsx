import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, FeatureGroup, Tooltip, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

// Fix Leaflet marker icon issue with a more premium icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom component to handle map interaction and centering
const MapController = ({ position, autoCenter }) => {
  const map = useMap();
  useEffect(() => {
    if (position && autoCenter) {
      map.setView([position.latitude, position.longitude], 19, { animate: true });
    }
  }, [position, autoCenter, map]);
  return null;
};

// Custom Draw component using native Leaflet Draw
const DrawControl = ({ onBoundaryUpdate, isDrawing, setIsDrawing }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: { featureGroup: drawnItems },
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: true,
          drawError: { color: '#e1e100', message: '<strong>Oh no!<strong> you cannot draw that!' },
          shapeOptions: { color: 'var(--primary)', fillOpacity: 0.3 }
        },
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
        polyline: false
      }
    });

    map.addControl(drawControl);

    const onCreated = (e) => {
      drawnItems.clearLayers();
      const layer = e.layer;
      drawnItems.addLayer(layer);
      onBoundaryUpdate(layer.toGeoJSON());
      setIsDrawing(false);
    };

    const onEdited = (e) => {
      e.layers.eachLayer((layer) => {
        onBoundaryUpdate(layer.toGeoJSON());
      });
    };

    const onDeleted = () => {
      onBoundaryUpdate(null);
    };

    const onDrawStart = () => setIsDrawing(true);
    const onDrawStop = () => setIsDrawing(false);

    // Helper: Finish drawing on Enter key
    const onKeyPress = (e) => {
      if (e.key === 'Enter') {
        const polyDraw = drawControl._toolbars.draw._modes.polygon.handler;
        if (polyDraw && polyDraw._active) {
          polyDraw.completeShape();
        }
      }
    };

    map.on(L.Draw.Event.CREATED, onCreated);
    map.on(L.Draw.Event.EDITED, onEdited);
    map.on(L.Draw.Event.DELETED, onDeleted);
    map.on(L.Draw.Event.DRAWSTART, onDrawStart);
    map.on(L.Draw.Event.DRAWSTOP, onDrawStop);
    window.addEventListener('keydown', onKeyPress);

    // Expose a way to finish externally
    window.__finishDrawing = () => {
      const polyDraw = drawControl._toolbars.draw._modes.polygon.handler;
      if (polyDraw && polyDraw._active) {
        polyDraw.completeShape();
      }
    };

    return () => {
      map.removeControl(drawControl);
      map.off(L.Draw.Event.CREATED, onCreated);
      map.off(L.Draw.Event.EDITED, onEdited);
      map.off(L.Draw.Event.DELETED, onDeleted);
      map.off(L.Draw.Event.DRAWSTART, onDrawStart);
      map.off(L.Draw.Event.DRAWSTOP, onDrawStop);
      window.removeEventListener('keydown', onKeyPress);
      delete window.__finishDrawing;
    };
  }, [map, onBoundaryUpdate, setIsDrawing]);

  return null;
};

const MapComponent = ({ 
  gpsPosition, 
  accuracy, 
  onManualMove, 
  onBoundaryUpdate, 
  autoCenter,
  isManual
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const markerPosition = gpsPosition ? [gpsPosition.latitude, gpsPosition.longitude] : null;

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <MapContainer 
        center={[16.3067, 80.4365]} 
        zoom={20} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          maxZoom={22}
          attribution="Google Satellite"
        />

        <MapController position={gpsPosition} autoCenter={autoCenter} />
        <ZoomControl position="topleft" />

        {markerPosition && (
          <>
            <Marker 
              position={markerPosition} 
              draggable={true} 
              eventHandlers={{
                dragend: (e) => {
                  const pos = e.target.getLatLng();
                  onManualMove({ latitude: pos.lat, longitude: pos.lng });
                }
              }}
            >
              <Tooltip permanent={isManual} direction="top" offset={[0, -10]}>
                {isManual ? "📌 Land area fixed by user" : "🎯 DRAG TO FIX LAND AREA"}
              </Tooltip>
            </Marker>
            
            {!isManual && (
              <Circle 
                center={markerPosition} 
                radius={accuracy || 0} 
                pathOptions={{ 
                  color: '#3b82f6', 
                  fillColor: '#3b82f6', 
                  fillOpacity: 0.1, 
                  weight: 2, 
                  dashArray: '5, 10' 
                }} 
              />
            )}
          </>
        )}

        <DrawControl 
          onBoundaryUpdate={onBoundaryUpdate} 
          isDrawing={isDrawing}
          setIsDrawing={setIsDrawing}
        />
      </MapContainer>

      {/* High-visibility Finish Button */}
      {isDrawing && (
        <div style={{ position: 'absolute', top: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 2000 }}>
          <button 
            className="btn-premium btn-primary animate-in" 
            onClick={() => window.__finishDrawing && window.__finishDrawing()}
            style={{ padding: '0.8rem 2rem', boxShadow: '0 0 30px var(--primary-glow)', borderRadius: '30px' }}
          >
            ✅ FINISH BOUNDARY
          </button>
        </div>
      )}
      
      {/* Floating UI Helper for professional feedback */}
      <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 1000, pointerEvents: 'none' }}>
        <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', color: 'white', borderRadius: '12px', border: '1px solid var(--border-glass)', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
          {isManual ? "✅ LOCATION CONSOLIDATED" : "🛰️ TRACKING LIVE SATELLITE FEED"}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
