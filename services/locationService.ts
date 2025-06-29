import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export class LocationService {
  private static lastKnownLocation: LocationCoords | null = null;
  private static locationWatchId: Location.LocationSubscription | null = null;

  static async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        return new Promise((resolve) => {
          if ('geolocation' in navigator) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
              if (result.state === 'granted') {
                resolve(true);
              } else {
                navigator.geolocation.getCurrentPosition(
                  () => resolve(true),
                  () => resolve(false),
                  { timeout: 10000 }
                );
              }
            }).catch(() => {
              navigator.geolocation.getCurrentPosition(
                () => resolve(true),
                () => resolve(false),
                { timeout: 10000 }
              );
            });
          } else {
            resolve(false);
          }
        });
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  static async getCurrentLocation(): Promise<LocationCoords | null> {
    try {
      if (Platform.OS === 'web') {
        return new Promise((resolve) => {
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const coords = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                };
                this.lastKnownLocation = coords;
                resolve(coords);
              },
              (error) => {
                console.error('Web geolocation error:', error);
                // Return last known location or default to Johannesburg
                resolve(this.lastKnownLocation || { latitude: -26.2041, longitude: 28.0473 });
              },
              { 
                enableHighAccuracy: true, 
                timeout: 15000, 
                maximumAge: 300000 // 5 minutes
              }
            );
          } else {
            // Fallback to Johannesburg coordinates
            resolve({ latitude: -26.2041, longitude: 28.0473 });
          }
        });
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        // Return last known location or default
        return this.lastKnownLocation || { latitude: -26.2041, longitude: 28.0473 };
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeout: 15000,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      this.lastKnownLocation = coords;
      return coords;
    } catch (error) {
      console.error('Error getting location:', error);
      // Return last known location or default to Johannesburg
      return this.lastKnownLocation || { latitude: -26.2041, longitude: 28.0473 };
    }
  }

  static async startLocationTracking(callback: (location: LocationCoords) => void): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      if (Platform.OS === 'web') {
        if ('geolocation' in navigator) {
          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              const coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              this.lastKnownLocation = coords;
              callback(coords);
            },
            (error) => console.error('Location tracking error:', error),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
          );
          // Store watchId for cleanup (web doesn't have the same subscription object)
        }
        return;
      }

      this.locationWatchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 30000, // Update every 30 seconds
          distanceInterval: 100, // Update every 100 meters
        },
        (location) => {
          const coords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          this.lastKnownLocation = coords;
          callback(coords);
        }
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
    }
  }

  static stopLocationTracking(): void {
    if (this.locationWatchId) {
      this.locationWatchId.remove();
      this.locationWatchId = null;
    }
  }

  static calculateDistance(
    coord1: LocationCoords,
    coord2: LocationCoords
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coord2.latitude - coord1.latitude);
    const dLon = this.toRadians(coord2.longitude - coord1.longitude);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.latitude)) *
        Math.cos(this.toRadians(coord2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static formatDistance(distance: number): string {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  }

  static isWithinRadius(
    center: LocationCoords,
    point: LocationCoords,
    radiusKm: number
  ): boolean {
    const distance = this.calculateDistance(center, point);
    return distance <= radiusKm;
  }

  static getLastKnownLocation(): LocationCoords | null {
    return this.lastKnownLocation;
  }

  // Get approximate location based on IP (fallback for web)
  static async getApproximateLocation(): Promise<LocationCoords | null> {
    if (Platform.OS !== 'web') return null;

    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        const coords = {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
        };
        this.lastKnownLocation = coords;
        return coords;
      }
    } catch (error) {
      console.error('Error getting IP-based location:', error);
    }

    return null;
  }
}