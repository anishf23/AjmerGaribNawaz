import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppTheme } from './theme';
import { useLocalization } from './localization';
import type { RootStackParamList } from '../App';

const { width } = Dimensions.get('window');

type Place = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  distance: number;
  address?: string;
  tags?: Record<string, string>;
};

type PlaceCategory = {
  id: string;
  title: string;
  icon: string;
  query: string;
};

const PLACE_CATEGORIES: PlaceCategory[] = [
  {
    id: 'fuel',
    title: 'Petrol Pump',
    icon: '🚗',
    query: 'node["amenity"="fuel"]',
  },
  {
    id: 'hotel',
    title: 'Hotel',
    icon: '🏨',
    query: 'node["tourism"="hotel"]',
  },
  {
    id: 'restaurant',
    title: 'Restaurant',
    icon: '🍽️',
    query: 'node["amenity"="restaurant"]',
  },
  {
    id: 'mosque',
    title: 'Mosque',
    icon: '🕌',
    query: 'node["amenity"="place_of_worship"]["religion"="muslim"]',
  },
  {
    id: 'garden',
    title: 'Garden',
    icon: '🌳',
    query: 'node["leisure"="park"]',
  },
  {
    id: 'gym',
    title: 'Gym',
    icon: '💪',
    query: 'node["leisure"="fitness_centre"]',
  },
];

function NearbyPlaces() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors } = useAppTheme();
  const { t } = useLocalization();
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [currentLocationAddress, setCurrentLocationAddress] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('fuel');
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestLocationPermission = useCallback(async () => {
    if (Platform.OS === 'ios') {
      try {
        await Geolocation.requestAuthorization();
        // For iOS, we'll assume permission is granted after request
        // The actual location request will fail if permission is denied
        setLocationPermissionGranted(true);
        return true;
      } catch (error) {
        console.warn('iOS location permission error:', error);
        setLocationPermissionGranted(false);
        return false;
      }
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location to find nearby places.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
      console.log('Android location permission result:', granted, 'isGranted:', isGranted);
      setLocationPermissionGranted(isGranted);
      return isGranted;
    } catch (err) {
      console.warn('Android location permission error:', err);
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    return new Promise<{ lat: number; lon: number }>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        (position: any) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lon: longitude });
        },
        (error: any) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
      );
    });
  }, []);

  const reverseGeocode = useCallback(async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'MyGNI-App/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();
      return data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    } catch (error) {
      console.warn('Reverse geocoding failed:', error);
      return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    }
  }, []);

  const fetchNearbyPlaces = useCallback(async (categoryId: string, retryCount = 0) => {
    if (!currentLocation) return;

    setLoading(true);
    setError(null);

    try {
      const category = PLACE_CATEGORIES.find(cat => cat.id === categoryId);
      if (!category) {
        setError('Invalid category selected');
        return;
      }

      const query = `
        [out:json][timeout:25];
        ${category.query}(around:5000,${currentLocation.lat},${currentLocation.lon});
        out meta;
      `;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.elements || !Array.isArray(data.elements)) {
        throw new Error('Invalid response format from API');
      }

      const placesData: Place[] = data.elements
        .filter((element: any) => element.tags && element.tags.name)
        .map((element: any) => {
          const distance = calculateDistance(
            currentLocation.lat,
            currentLocation.lon,
            element.lat,
            element.lon,
          );

          return {
            id: element.id.toString(),
            name: element.tags.name,
            lat: element.lat,
            lon: element.lon,
            distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
            address: undefined, // Will be populated later
            tags: element.tags,
          };
        })
        .sort((a: Place, b: Place) => a.distance - b.distance)
        .slice(0, 20); // Limit to 20 results

      setPlaces(placesData);

      // Fetch addresses for the places in the background
      fetchAddressesForPlaces(placesData);
    } catch (error: any) {
      console.error('Error fetching places:', error);

      let errorMessage = 'Failed to fetch nearby places. Please try again.';

      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your internet connection.';
      } else if (error.message.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message.includes('HTTP')) {
        errorMessage = 'Server error. Please try again later.';
      }

      setError(errorMessage);

      // Auto-retry once for network errors
      if (retryCount === 0 && (error.name === 'AbortError' || error.message.includes('Network'))) {
        setTimeout(() => {
          fetchNearbyPlaces(categoryId, 1);
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  }, [currentLocation]);

  const fetchAddressesForPlaces = useCallback(async (placesToUpdate: Place[]) => {
    if (!placesToUpdate.length) return;

    // Process addresses in batches to avoid overwhelming the API
    const batchSize = 3;
    for (let i = 0; i < placesToUpdate.length; i += batchSize) {
      const batch = placesToUpdate.slice(i, i + batchSize);

      const addressPromises = batch.map(async (place) => {
        if (place.address === undefined) { // Only fetch if not already fetched
          const address = await reverseGeocode(place.lat, place.lon);
          return { ...place, address };
        }
        return place;
      });

      const updatedBatch = await Promise.all(addressPromises);

      // Update the places state with the new addresses
      setPlaces(currentPlaces =>
        currentPlaces.map(currentPlace => {
          const updated = updatedBatch.find(p => p.id === currentPlace.id);
          return updated || currentPlace;
        })
      );

      // Small delay between batches to be respectful to the API
      if (i + batchSize < placesToUpdate.length) {
        await new Promise<void>(resolve => setTimeout(resolve, 100));
      }
    }
  }, [reverseGeocode]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const openInMaps = useCallback(async (place: Place) => {
    const lat = place.lat;
    const lon = place.lon;
    const label = encodeURIComponent(place.name);

    // Try Google Maps first
    const googleMapsUrl = Platform.select({
      ios: `comgooglemaps://?daddr=${lat},${lon}&directionsmode=driving`,
      android: `google.navigation:q=${lat},${lon}`,
      default: `geo:${lat},${lon}?q=${lat},${lon}(${label})`,
    });

    try {
      const canOpenGoogleMaps = await Linking.canOpenURL(googleMapsUrl);
      if (canOpenGoogleMaps) {
        await Linking.openURL(googleMapsUrl);
        return;
      }
    } catch (error) {
      console.warn('Google Maps not available, falling back to default maps');
    }

    // Fallback to default maps app
    const fallbackUrl = Platform.select({
      ios: `maps:///?daddr=${lat},${lon}`,
      android: `geo:${lat},${lon}?q=${lat},${lon}(${label})`,
      default: `geo:${lat},${lon}?q=${lat},${lon}(${label})`,
    });

    await Linking.openURL(fallbackUrl);
  }, []);

  useEffect(() => {
    const initializeLocation = async () => {
      setLocationLoading(true);
      setError(null);

      try {
        const hasPermission = await requestLocationPermission();
        if (hasPermission) {
          const location = await getCurrentLocation();
          setCurrentLocation(location);
          setLocationPermissionGranted(true);
          
          // Fetch address for current location
          const address = await reverseGeocode(location.lat, location.lon);
          setCurrentLocationAddress(address);
        } else {
          setLocationPermissionGranted(false);
          setError('Location permission is required to find nearby places.');
        }
      } catch (error) {
        console.error('Location initialization error:', error);
        setLocationPermissionGranted(false);
        setError('Unable to get your current location. Please enable location services and try again.');
      } finally {
        setLocationLoading(false);
      }
    };

    initializeLocation();
  }, [requestLocationPermission, getCurrentLocation]);

  useEffect(() => {
    if (currentLocation && selectedCategory) {
      fetchNearbyPlaces(selectedCategory);
    }
  }, [currentLocation, selectedCategory, fetchNearbyPlaces]);

  const styles = createStyles(colors);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.bgOrbA} />
      <View style={styles.bgOrbB} />

      {/* Header with Back Button */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Nearby Places</Text>
          <Text style={styles.subtitle}>
            {locationLoading
              ? 'Getting your location...'
              : currentLocationAddress
                ? `Around ${currentLocationAddress}`
                : currentLocation
                  ? `Around ${currentLocation.lat.toFixed(4)}, ${currentLocation.lon.toFixed(4)}`
                  : 'Location unavailable'}
          </Text>
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {PLACE_CATEGORIES.map((category) => (
          <Pressable
            key={category.id}
            style={[
              styles.tab,
              selectedCategory === category.id && styles.tabActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.tabIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.tabText,
                selectedCategory === category.id && styles.tabTextActive,
              ]}
            >
              {category.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Places List */}
      <ScrollView
        style={styles.placesContainer}
        contentContainerStyle={styles.placesContent}
        showsVerticalScrollIndicator={false}
      >
        {locationLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Getting your location...</Text>
          </View>
        )}

        {!locationPermissionGranted && !locationLoading && (
          <View style={styles.permissionContainer}>
            <Icon name="location-outline" size={48} color={colors.textMuted} />
            <Text style={styles.permissionTitle}>Location Permission Required</Text>
            <Text style={styles.permissionText}>
              Please enable location permissions to find nearby places.
            </Text>
            <Pressable
              style={styles.permissionButton}
              onPress={async () => {
                setError(null);
                setLocationLoading(true);

                try {
                  console.log('Requesting location permission...');
                  const hasPermission = await requestLocationPermission();
                  console.log('Permission result:', hasPermission);

                  if (hasPermission) {
                    console.log('Permission granted, getting location...');
                    // Add a small delay to ensure permission is propagated
                    await new Promise<void>(resolve => setTimeout(resolve, 500));
                    
                    const location = await getCurrentLocation();
                    console.log('Location obtained:', location);
                    setCurrentLocation(location);
                    setLocationPermissionGranted(true);
                  } else {
                    console.log('Permission denied');
                    setError('Location permission is required to find nearby places. Please grant permission and try again.');
                  }
                } catch (error) {
                  console.error('Permission/location error:', error);
                  setLocationPermissionGranted(false);
                  
                  // Check if it's a location services disabled error
                  const err = error as any;
                  if (err.code === 2 || err.message?.includes('location') || err.message?.includes('denied')) {
                    setError('Location services are disabled or permission denied. Please enable location services and grant permission.');
                  } else {
                    setError('Unable to access location. Please enable location services and grant permission.');
                  }
                } finally {
                  setLocationLoading(false);
                }
              }}
            >
              <Text style={styles.permissionButtonText}>Grant Permission</Text>
            </Pressable>
          </View>
        )}

        {locationPermissionGranted && !locationLoading && loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Finding nearby places...</Text>
          </View>
        )}

        {locationPermissionGranted && !locationLoading && !loading && error && (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle-outline" size={48} color="#ff6b6b" />
            <Text style={styles.errorTitle}>Unable to Load Places</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              style={styles.retryButton}
              onPress={() => fetchNearbyPlaces(selectedCategory)}
            >
              <Icon name="refresh" size={20} color={colors.surface} />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </Pressable>
          </View>
        )}

        {locationPermissionGranted && !locationLoading && !loading && !error && places.length === 0 && (
          <View style={styles.emptyContainer}>
            <Icon name="search-outline" size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Places Found</Text>
            <Text style={styles.emptyText}>No places found in this category nearby. Try a different category or check back later.</Text>
          </View>
        )}

        {locationPermissionGranted && !locationLoading && !loading && !error && places.map((place) => (
          <Pressable
            key={place.id}
            style={styles.placeCard}
            onPress={() => openInMaps(place)}
          >
            <View style={styles.placeHeader}>
              <Text style={styles.placeName}>{place.name}</Text>
              <Text style={styles.placeDistance}>{place.distance} km</Text>
            </View>
            <View style={styles.placeFooter}>
              <Text style={styles.placeCoords} numberOfLines={2}>
                {place.address || `${place.lat.toFixed(4)}, ${place.lon.toFixed(4)}`}
              </Text>
              <Icon name="navigate-outline" size={20} color={colors.accent} />
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bgOrbA: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.orbPrimary,
    opacity: 0.3,
  },
  bgOrbB: {
    position: 'absolute',
    top: 200,
    right: -80,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.orbSecondary,
    opacity: 0.2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
  tabsContainer: {
    maxHeight: 60,
    marginBottom: 10,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 80,
  },
  tabActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textAlign: 'center',
  },
  tabTextActive: {
    color: colors.accent,
  },
  placesContainer: {
    flex: 1,
  },
  placesContent: {
    paddingHorizontal: 20,
    paddingBottom: 108, // Account for bottom tab
  },
  permissionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Dimensions.get('window').height * 0.5,
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textMuted,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
  placeCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 12,
  },
  placeDistance: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
  },
  placeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placeCoords: {
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
    marginRight: 8,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  retryButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default NearbyPlaces;