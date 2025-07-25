import React, { useEffect } from 'react';
import { loadModules } from 'esri-loader';
import { db } from '../firebase';

const PlayerMap = () => {
  useEffect(() => {
    loadModules(['esri/Map', 'esri/views/MapView', 'esri/layers/FeatureLayer'])
      .then(([Map, MapView, FeatureLayer]) => {
        const map = new Map({ basemap: 'topo-vector' });
        const view = new MapView({
          container: 'mapView',
          map: map,
          center: [28, -25], // Centered on SA
          zoom: 6
        });
        
        // Get player data from Firestore
        db.collection('players').onSnapshot(snapshot => {
          const players = snapshot.docs.map(doc => doc.data());
          
          // Create feature layer
          const featureLayer = new FeatureLayer({
            source: players.map(player => ({
              geometry: {
                type: 'point',
                longitude: player.lng,
                latitude: player.lat
              },
              attributes: {
                name: player.country,
                players: 1
              }
            })),
            objectIdField: 'oid',
            fields: [{
              name: 'oid',
              type: 'oid'
            }, {
              name: 'players',
              type: 'integer'
            }]
          });
          
          map.add(featureLayer);
        });
      });
  }, []);

  return <div id="mapView" style={{ height: '500px', width: '100%' }} />;
};

export default PlayerMap;
