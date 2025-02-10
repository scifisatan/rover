import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

// Replace with your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiZ3dhY2giLCJhIjoiY200MTI4bnBtMDZpeDJqcjJodzlsbG12ayJ9.Xa2O7gqDu4IPYxSfjsY6WQ'

interface MapProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void
  initialLat?: number
  initialLng?: number
}

export const Map = ({ onLocationSelect, initialLat, initialLng }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const marker = useRef<mapboxgl.Marker | null>(null)

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();
      const address = data.features[0]?.place_name || '';
      return address;
    } catch (error) {
      console.error('Error fetching address:', error);
      return '';
    }
  };

  const handleLocationUpdate = async (lat: number, lng: number) => {
    const address = await getAddressFromCoordinates(lat, lng);
    onLocationSelect(lat, lng, address);
  };

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          initializeMap(latitude, longitude);
          handleLocationUpdate(latitude, longitude);
        },
        () => {
          initializeMap(initialLat || 0, initialLng || 0);
        }
      );
    }
  }, [initialLat, initialLng]);

  const initializeMap = (lat: number, lng: number) => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: 13
    });

    marker.current = new mapboxgl.Marker({ draggable: true })
      .setLngLat([lng, lat])
      .addTo(map.current);

    marker.current.on('dragend', () => {
      const lngLat = marker.current!.getLngLat();
      handleLocationUpdate(lngLat.lat, lngLat.lng);
    });

    map.current.on('click', (e) => {
      marker.current!.setLngLat(e.lngLat);
      handleLocationUpdate(e.lngLat.lat, e.lngLat.lng);
    });
  };

  return <div ref={mapContainer} className="h-[400px] w-full rounded-md" />;
};
