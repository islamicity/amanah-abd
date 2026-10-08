import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Filter,
  Search,
  RotateCcw,
  Maximize2,
  Navigation,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Truck,
  Flame,
  X,
  ChevronRight,
  Sparkles,
  Radio,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  Info,
  Building2,
  Eye,
  Check,
} from 'lucide-react';
import { Complaint, ComplaintStatus, UrgencyLevel, ComplaintCategory } from '../types';
import {
  MUNICIPAL_DISTRICTS,
  FIELD_UNIT_STATIONS,
  getComplaintCoordinates,
  calculateFieldPriorityScore,
  estimateDistanceKm,
  getStationCoordinates,
  getDistrictLatLngBounds,
} from '../utils/mapUtils';

export interface ComplaintLeafletMapProps {
  complaints: Complaint[];
  selectedComplaintId?: string | null;
  onSelectComplaint: (id: string) => void;
  onSimulateProgress: (complaintId: string) => void;
  onOpenNewComplaintModal?: () => void;
  onFocusDetailView?: (id: string) => void;
}

// Status definitions & visual themes for Leaflet markers & UI
export const STATUS_CONFIG: Record<
  ComplaintStatus,
  {
    label: string;
    shortLabel: string;
    description: string;
    color: string;
    hexColor: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    ringColor: string;
    icon: string;
  }
> = {
  Diajukan: {
    label: 'Diajukan (Baru)',
    shortLabel: 'Diajukan',
    description: 'Aduan baru masuk, menunggu verifikasi awal petugas',
    color: 'sky',
    hexColor: '#0284c7',
    badgeBg: 'bg-sky-500/15',
    badgeText: 'text-sky-300',
    badgeBorder: 'border-sky-500/30',
    ringColor: '#38bdf8',
    icon: '📝',
  },
  Diverifikasi_Shiddiq: {
    label: 'Diverifikasi Shiddiq',
    shortLabel: 'Diverifikasi',
    description: 'Fakta lapangan tervalidasi jujur & bebas manipulasi',
    color: 'purple',
    hexColor: '#8b5cf6',
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-300',
    badgeBorder: 'border-purple-500/30',
    ringColor: '#a78bfa',
    icon: '🔍',
  },
  Disposisi_Amanah: {
    label: 'Disposisi Amanah',
    shortLabel: 'Disposisi',
    description: 'Surat perintah tugas diterbitkan ke OPD terkait',
    color: 'amber',
    hexColor: '#d97706',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-300',
    badgeBorder: 'border-amber-500/30',
    ringColor: '#fbbf24',
    icon: '📋',
  },
  Pengerjaan_Khidmat: {
    label: 'Pengerjaan Khidmat',
    shortLabel: 'Pengerjaan',
    description: 'Unit reaksi cepat sedang aktif bekerja di lokasi fisik',
    color: 'blue',
    hexColor: '#2563eb',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-300',
    badgeBorder: 'border-blue-500/30',
    ringColor: '#60a5fa',
    icon: '⚡',
  },
  Audit_Validasi: {
    label: 'Audit Validasi',
    shortLabel: 'Audit',
    description: 'Pemeriksaan kualitas hasil kerja & konfirmasi kepuasan warga',
    color: 'orange',
    hexColor: '#ea580c',
    badgeBg: 'bg-orange-500/15',
    badgeText: 'text-orange-300',
    badgeBorder: 'border-orange-500/30',
    ringColor: '#fb923c',
    icon: '🛡️',
  },
  Selesai_Teruji: {
    label: 'Selesai Teruji',
    shortLabel: 'Selesai',
    description: 'Tuntas teruji, dicatat on-chain & bernilai berkah',
    color: 'emerald',
    hexColor: '#059669',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-500/30',
    ringColor: '#34d399',
    icon: '✅',
  },
};

type TileLayerType = 'dark' | 'light' | 'osm' | 'satellite';

const TILE_LAYERS: Record<TileLayerType, { url: string; attribution: string; name: string }> = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap contributors',
    name: 'Peta Khidmat Gelap',
  },
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; OpenStreetMap contributors',
    name: 'Peta Terang Kedinasan',
  },
  osm: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    name: 'OpenStreetMap Standar',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    name: 'Citra Satelit',
  },
};

export const ComplaintLeafletMap: React.FC<ComplaintLeafletMapProps> = ({
  complaints,
  selectedComplaintId,
  onSelectComplaint,
  onSimulateProgress,
  onOpenNewComplaintModal,
  onFocusDetailView,
}) => {
  // DOM References
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const stationsLayerRef = useRef<L.LayerGroup | null>(null);
  const districtsLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map());

  // Interactive Filter States
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<ComplaintStatus | 'SEMUA'>('SEMUA');
  const [activeUrgencyFilter, setActiveUrgencyFilter] = useState<string>('SEMUA');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('SEMUA');
  const [activeSectorFilter, setActiveSectorFilter] = useState<string>('SEMUA');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTileType, setActiveTileType] = useState<TileLayerType>('dark');
  const [showStations, setShowStations] = useState<boolean>(true);
  const [showDistricts, setShowDistricts] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activePinId, setActivePinId] = useState<string | null>(selectedComplaintId || null);
  const [dispatchedSuccessId, setDispatchedSuccessId] = useState<string | null>(null);

  // Sync active pin with incoming selectedComplaintId prop
  useEffect(() => {
    if (selectedComplaintId) {
      setActivePinId(selectedComplaintId);
    }
  }, [selectedComplaintId]);

  // Enrich complaints with coordinates and field priority score
  const enrichedComplaints = useMemo(() => {
    return complaints.map((c) => {
      const coords = getComplaintCoordinates(c);
      const priority = calculateFieldPriorityScore(c);
      return {
        ...c,
        computedCoords: coords,
        fieldPriority: priority,
      };
    });
  }, [complaints]);

  // Status counts for real-time dashboard badges directly on the map UI
  const statusCounts = useMemo(() => {
    const counts: Record<ComplaintStatus | 'SEMUA' | 'AKTIF' | 'SELESAI', number> = {
      SEMUA: complaints.length,
      AKTIF: complaints.filter((c) => c.status !== 'Selesai_Teruji').length,
      SELESAI: complaints.filter((c) => c.status === 'Selesai_Teruji').length,
      Diajukan: 0,
      Diverifikasi_Shiddiq: 0,
      Disposisi_Amanah: 0,
      Pengerjaan_Khidmat: 0,
      Audit_Validasi: 0,
      Selesai_Teruji: 0,
    };

    complaints.forEach((c) => {
      if (counts[c.status] !== undefined) {
        counts[c.status]++;
      }
    });

    return counts;
  }, [complaints]);

  // Filtered complaints based on all direct map controls (Status, Urgency, Category, Sector, Search)
  const filteredComplaints = useMemo(() => {
    return enrichedComplaints.filter((item) => {
      // Direct Status Filter
      if (selectedStatusFilter !== 'SEMUA' && item.status !== selectedStatusFilter) {
        return false;
      }

      // Urgency Filter
      if (activeUrgencyFilter === 'DARURAT_TINGGI') {
        if (item.urgency !== 'Darurat' && item.urgency !== 'Tinggi') return false;
      } else if (activeUrgencyFilter !== 'SEMUA' && item.urgency !== activeUrgencyFilter) {
        return false;
      }

      // Category Filter
      if (selectedCategoryFilter !== 'SEMUA' && item.category !== selectedCategoryFilter) {
        return false;
      }

      // Sector/District Filter
      if (activeSectorFilter !== 'SEMUA') {
        const matchesSector = item.computedCoords.districtName.includes(activeSectorFilter);
        if (!matchesSector) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.id.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.citizenName.toLowerCase().includes(q) ||
          item.assignedDepartment.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [
    enrichedComplaints,
    selectedStatusFilter,
    activeUrgencyFilter,
    selectedCategoryFilter,
    activeSectorFilter,
    searchQuery,
  ]);

  // Focused complaint data
  const focusedComplaint = useMemo(() => {
    return enrichedComplaints.find((c) => c.id === activePinId) || null;
  }, [enrichedComplaints, activePinId]);

  // Nearest field response unit station to focused complaint
  const closestStationInfo = useMemo(() => {
    if (!focusedComplaint) return null;
    let minDistance = Infinity;
    let closest = FIELD_UNIT_STATIONS[0];

    FIELD_UNIT_STATIONS.forEach((station) => {
      const dist = estimateDistanceKm(
        focusedComplaint.computedCoords.xPercent,
        focusedComplaint.computedCoords.yPercent,
        station.xPercent,
        station.yPercent
      );
      if (dist < minDistance) {
        minDistance = dist;
        closest = station;
      }
    });

    const etaMinutes = Math.max(7, Math.round(minDistance * 2.5));
    return {
      station: closest,
      distanceKm: minDistance,
      etaMinutes,
    };
  }, [focusedComplaint]);

  // Priority queue for emergency dispatcher drawer
  const emergencyQueue = useMemo(() => {
    return [...filteredComplaints]
      .filter((c) => c.status !== 'Selesai_Teruji')
      .sort((a, b) => b.fieldPriority.score - a.fieldPriority.score);
  }, [filteredComplaints]);

  // Quick Dispatch Handler
  const handleQuickDispatch = (complaintId: string) => {
    setDispatchedSuccessId(complaintId);
    onSimulateProgress(complaintId);
    setTimeout(() => {
      setDispatchedSuccessId(null);
    }, 3500);
  };

  // Focus and fly to a complaint on Leaflet map
  const flyToComplaint = useCallback((c: typeof enrichedComplaints[0]) => {
    setActivePinId(c.id);
    onSelectComplaint(c.id);

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([c.computedCoords.lat, c.computedCoords.lng], 16, {
        duration: 1.2,
      });

      const marker = markersMapRef.current.get(c.id);
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 1250);
      }
    }
  }, [onSelectComplaint]);

  // Fit bounds to all currently visible filtered complaints
  const handleFitAllBounds = useCallback(() => {
    if (!mapInstanceRef.current || filteredComplaints.length === 0) return;

    const latLngs = filteredComplaints.map((c) => [c.computedCoords.lat, c.computedCoords.lng] as [number, number]);
    const bounds = L.latLngBounds(latLngs);
    mapInstanceRef.current.fitBounds(bounds, {
      padding: [45, 45],
      maxZoom: 16,
      duration: 1.0,
    });
  }, [filteredComplaints]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center of Kota Amanah Sejahtera / Central Jakarta coordinates
    const initialCenter: [number, number] = [-6.2000, 106.8300];
    const initialZoom = 13;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false, // We use custom styled control buttons
      attributionControl: false,
    });

    // Add selected Tile Layer
    const tileConfig = TILE_LAYERS[activeTileType];
    const tileLayer = L.tileLayer(tileConfig.url, {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: tileConfig.attribution,
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Layer Groups
    const districtsLayer = L.layerGroup().addTo(map);
    const stationsLayer = L.layerGroup().addTo(map);
    const markersLayer = L.layerGroup().addTo(map);

    districtsLayerRef.current = districtsLayer;
    stationsLayerRef.current = stationsLayer;
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // ResizeObserver to handle layout container expansion/tabs
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when tile type changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    const tileConfig = TILE_LAYERS[activeTileType];
    tileLayerRef.current.setUrl(tileConfig.url);
  }, [activeTileType]);

  // Render Municipal District Polygons
  useEffect(() => {
    if (!districtsLayerRef.current) return;
    districtsLayerRef.current.clearLayers();

    if (!showDistricts) return;

    MUNICIPAL_DISTRICTS.forEach((district) => {
      const bounds = getDistrictLatLngBounds(district);
      const rect = L.rectangle(bounds, {
        color: district.color,
        weight: 1.5,
        opacity: 0.7,
        fillColor: district.color,
        fillOpacity: 0.07,
        dashArray: '4, 6',
      });

      rect.bindTooltip(
        `<div style="font-family: sans-serif; font-size: 11px; font-weight: bold; color: #f8fafc;">
          <span style="color:${district.color}">●</span> ${district.name}
          <div style="font-size: 9px; font-weight: normal; color: #94a3b8;">${district.headquarters}</div>
        </div>`,
        { sticky: true, opacity: 0.95, className: 'leaflet-custom-dark-tooltip' }
      );

      rect.addTo(districtsLayerRef.current!);
    });
  }, [showDistricts]);

  // Render Field Stations
  useEffect(() => {
    if (!stationsLayerRef.current) return;
    stationsLayerRef.current.clearLayers();

    if (!showStations) return;

    FIELD_UNIT_STATIONS.forEach((station) => {
      const coords = getStationCoordinates(station);

      const stationIcon = L.divIcon({
        className: 'station-div-icon',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            border-radius: 8px;
            background: #0f172a;
            border: 2px solid #38bdf8;
            box-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
            cursor: pointer;
          ">
            <span style="font-size: 14px;">🏢</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(coords, { icon: stationIcon });
      marker.bindPopup(`
        <div style="font-family: sans-serif; min-width: 200px; color: #0f172a; padding: 4px;">
          <div style="font-size: 11px; font-weight: bold; color: #0284c7; text-transform: uppercase;">Posko Lapangan Amanah</div>
          <div style="font-size: 13px; font-weight: bold; margin-top: 2px;">${station.name}</div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">${station.sector} • ${station.assignedTeam}</div>
          <div style="margin-top: 6px; padding: 4px 8px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; font-size: 11px; color: #166534; font-weight: 600;">
            🚗 Armada Siaga: ${station.availableVehicles} Unit TRC
          </div>
        </div>
      `);

      marker.addTo(stationsLayerRef.current!);
    });
  }, [showStations]);

  // Render Complaint Markers when filteredComplaints or activePinId changes
  useEffect(() => {
    if (!markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    markersMapRef.current.clear();

    filteredComplaints.forEach((c) => {
      const coords: [number, number] = [c.computedCoords.lat, c.computedCoords.lng];
      const isSelected = c.id === activePinId;
      const statusCfg = STATUS_CONFIG[c.status];
      const isUrgent = c.urgency === 'Darurat' || c.urgency === 'Tinggi';

      // Pulse animation effect for emergency or selected pins
      const pulseHtml = isUrgent
        ? `<div style="
            position: absolute;
            top: -6px;
            left: -6px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: ${c.urgency === 'Darurat' ? 'rgba(244, 63, 94, 0.35)' : 'rgba(245, 158, 11, 0.3)'};
            animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            z-index: 1;
            pointer-events: none;
          "></div>`
        : '';

      const markerHtml = `
        <div style="position: relative; width: 32px; height: 32px; cursor: pointer;">
          ${pulseHtml}
          <div style="
            position: relative;
            z-index: 2;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: ${isSelected ? '#ffffff' : '#0f172a'};
            border: 3px solid ${isSelected ? '#10b981' : statusCfg.hexColor};
            box-shadow: 0 4px 14px ${statusCfg.ringColor}60;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: ${isSelected ? 'scale(1.22)' : 'scale(1)'};
            transition: transform 0.2s ease, border-color 0.2s ease;
          ">
            <span style="font-size: 13px; line-height: 1;">${statusCfg.icon}</span>
          </div>
          ${
            c.urgency === 'Darurat'
              ? `<div style="
                  position: absolute;
                  top: -4px;
                  right: -4px;
                  z-index: 3;
                  width: 13px;
                  height: 13px;
                  border-radius: 50%;
                  background: #f43f5e;
                  border: 1.5px solid #ffffff;
                "></div>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'complaint-marker-pin',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const marker = L.marker(coords, { icon: customIcon });

      // Fast tooltip on hover
      marker.bindTooltip(
        `<div style="font-family: sans-serif; font-size: 11px; padding: 2px;">
          <div style="font-weight: bold; color: ${statusCfg.hexColor};">#${c.id} • ${statusCfg.shortLabel}</div>
          <div style="font-size: 12px; font-weight: 600; color: #f8fafc; margin-top: 1px;">${c.title}</div>
          <div style="font-size: 10px; color: #94a3b8; margin-top: 2px;">📍 ${c.location}</div>
        </div>`,
        {
          direction: 'top',
          offset: [0, -16],
          opacity: 0.95,
          className: 'leaflet-custom-dark-tooltip',
        }
      );

      // Rich interactive Leaflet popup
      const popupHtml = `
        <div class="leaflet-popup-card" style="font-family: system-ui, -apple-system, sans-serif; width: 270px; color: #0f172a; padding: 2px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">
            <span style="font-family: monospace; font-weight: bold; font-size: 11px; color: #0284c7;">${c.id}</span>
            <span style="font-size: 10px; font-weight: bold; padding: 2px 8px; border-radius: 9999px; background: ${statusCfg.badgeBg}; color: ${statusCfg.hexColor}; border: 1px solid ${statusCfg.badgeBorder};">
              ${statusCfg.label}
            </span>
          </div>

          <div style="font-size: 13px; font-weight: bold; color: #0f172a; line-height: 1.35; margin-bottom: 4px;">
            ${c.title}
          </div>

          <div style="font-size: 11px; color: #475569; line-height: 1.4; margin-bottom: 8px; max-height: 48px; overflow: hidden; text-overflow: ellipsis;">
            ${c.description}
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px 8px; margin-bottom: 8px; font-size: 11px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
            <div>
              <span style="color: #64748b; font-size: 10px;">Pelapor:</span><br/>
              <strong style="color: #1e293b;">${c.citizenName}</strong>
            </div>
            <div>
              <span style="color: #64748b; font-size: 10px;">OPD Khidmat:</span><br/>
              <strong style="color: #1e293b;">${c.assignedDepartment}</strong>
            </div>
            <div style="grid-column: span 2; margin-top: 2px;">
              <span style="color: #64748b; font-size: 10px;">📍 Lokasi:</span><br/>
              <span style="color: #334155; font-weight: 500;">${c.location}</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-size: 11px;">
            <span style="display: inline-flex; align-items: center; gap: 4px; font-weight: 600; color: ${c.urgency === 'Darurat' ? '#e11d48' : c.urgency === 'Tinggi' ? '#d97706' : '#16a34a'};">
              ${c.urgency === 'Darurat' ? '🚨' : '⏱️'} Urgensi: ${c.urgency}
            </span>
            <span style="color: #64748b; font-size: 10px;">
              SLA: <strong>${c.elapsedHours}j / ${c.slaTargetHours}j</strong>
            </span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 5px;">
            <button
              id="btn-popup-dispatch-${c.id}"
              style="width: 100%; padding: 6px 10px; background: linear-gradient(to right, #059669, #0d9488); color: #ffffff; border: none; border-radius: 6px; font-weight: 600; font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px;"
            >
              <span>⚡ Tindak Lanjut Khidmat</span>
            </button>
            <button
              id="btn-popup-detail-${c.id}"
              style="width: 100%; padding: 5px 10px; background: #e2e8f0; color: #1e293b; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 600; font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px;"
            >
              <span>🔍 Buka Detail Lengkap Tiket</span>
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 300,
        className: 'leaflet-custom-popup-box',
      });

      // Attach DOM button event handlers when popup opens
      marker.on('popupopen', () => {
        setActivePinId(c.id);
        onSelectComplaint(c.id);

        const dispatchBtn = document.getElementById(`btn-popup-dispatch-${c.id}`);
        if (dispatchBtn) {
          dispatchBtn.onclick = (e) => {
            e.stopPropagation();
            handleQuickDispatch(c.id);
          };
        }

        const detailBtn = document.getElementById(`btn-popup-detail-${c.id}`);
        if (detailBtn) {
          detailBtn.onclick = (e) => {
            e.stopPropagation();
            if (onFocusDetailView) {
              onFocusDetailView(c.id);
            } else {
              onSelectComplaint(c.id);
            }
          };
        }
      });

      marker.on('click', () => {
        setActivePinId(c.id);
        onSelectComplaint(c.id);
      });

      marker.addTo(markersLayerRef.current!);
      markersMapRef.current.set(c.id, marker);
    });
  }, [filteredComplaints, activePinId, onSelectComplaint, onFocusDetailView]);

  return (
    <div className="space-y-4">
      {/* Top Header Card: Title, Status Filtering Control Bar, and Live Metrics */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                  <span>Peta Interaktif Sebaran Pengaduan Warga</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-700/80">
                    LEAFLET GIS ENGINE
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Visualisasi geospatial terhubung langsung dengan koordinat titik lokasi aduan &amp; pelacakan status on-chain
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleFitAllBounds}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-semibold transition-colors cursor-pointer shadow-sm"
              id="btn-leaflet-fit-bounds"
              title="Pusatkan peta ke seluruh pengaduan yang tampil"
            >
              <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pusatkan Semua Titik</span>
            </button>

            {onOpenNewComplaintModal && (
              <button
                onClick={onOpenNewComplaintModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-900/30 cursor-pointer"
                id="btn-leaflet-new-complaint"
              >
                <span>+ Buat Aduan Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* PRIMARY REQUIREMENT: Status Filter Directly on the Map Interface */}
        <div className="pt-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Filter Status Pengaduan Langsung dari Peta:</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Menampilkan <strong className="text-emerald-400">{filteredComplaints.length}</strong> dari{' '}
              {complaints.length} aduan
            </span>
          </div>

          {/* Status Filter Button Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
            {/* All Statuses Button */}
            <button
              onClick={() => setSelectedStatusFilter('SEMUA')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                selectedStatusFilter === 'SEMUA'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 ring-2 ring-emerald-400/40'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750'
              }`}
              id="btn-filter-status-semua"
            >
              <span>Semua Status</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  selectedStatusFilter === 'SEMUA' ? 'bg-emerald-700 text-white' : 'bg-slate-700 text-slate-300'
                }`}
              >
                {statusCounts.SEMUA}
              </span>
            </button>

            {/* Individual Status Buttons */}
            {(Object.keys(STATUS_CONFIG) as ComplaintStatus[]).map((statusKey) => {
              const cfg = STATUS_CONFIG[statusKey];
              const count = statusCounts[statusKey] || 0;
              const isSelected = selectedStatusFilter === statusKey;

              return (
                <button
                  key={statusKey}
                  onClick={() => setSelectedStatusFilter(statusKey)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-slate-800 text-white font-bold border-2 shadow-md'
                      : 'bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-750'
                  }`}
                  style={{
                    borderColor: isSelected ? cfg.hexColor : undefined,
                  }}
                  id={`btn-filter-status-${statusKey.toLowerCase()}`}
                  title={cfg.description}
                >
                  <span style={{ color: cfg.hexColor }}>{cfg.icon}</span>
                  <span>{cfg.shortLabel}</span>
                  <span
                    className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full"
                    style={{
                      backgroundColor: isSelected ? cfg.hexColor : '#1e293b',
                      color: isSelected ? '#ffffff' : '#cbd5e1',
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Secondary Quick Search & Map Layer Control Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari kata kunci, ID tiket (#ADU-..), nama warga, OPD, atau jalan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-8 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            id="input-leaflet-search"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Urgency Filter Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px] font-semibold">Urgensi:</span>
          <select
            value={activeUrgencyFilter}
            onChange={(e) => setActiveUrgencyFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            id="select-leaflet-urgency"
          >
            <option value="SEMUA">Semua Tingkat Urgensi</option>
            <option value="DARURAT_TINGGI">🚨 Darurat &amp; Tinggi</option>
            <option value="Darurat">🚨 Hanya Darurat</option>
            <option value="Tinggi">⚠️ Hanya Tinggi</option>
            <option value="Sedang">🟢 Sedang</option>
            <option value="Rendah">ℹ️ Rendah</option>
          </select>
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px] font-semibold">Kategori:</span>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
            id="select-leaflet-category"
          >
            <option value="SEMUA">Semua Kategori</option>
            <option value="Infrastruktur Jalan">Infrastruktur Jalan</option>
            <option value="Bansos & Bantuan Sosial">Bansos &amp; Sosial</option>
            <option value="Kesehatan & Puskesmas">Kesehatan &amp; Puskesmas</option>
            <option value="Perizinan Usaha & UMKM">Perizinan UMKM</option>
            <option value="Laporan Pungli & Integritas">Integritas / Anti-Pungli</option>
            <option value="Administrasi Kependudukan">Adminduk &amp; KTP</option>
          </select>
        </div>

        {/* Tile Layer & Toggles */}
        <div className="flex items-center gap-2">
          {/* Base Layer Switcher */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
            <button
              onClick={() => setActiveTileType('dark')}
              className={`px-2 py-0.8 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                activeTileType === 'dark' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tampilan Peta Gelap"
            >
              Gelap
            </button>
            <button
              onClick={() => setActiveTileType('light')}
              className={`px-2 py-0.8 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                activeTileType === 'light' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tampilan Peta Terang"
            >
              Terang
            </button>
            <button
              onClick={() => setActiveTileType('satellite')}
              className={`px-2 py-0.8 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                activeTileType === 'satellite' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tampilan Citra Satelit"
            >
              Satelit
            </button>
          </div>

          {/* Reset Filters */}
          {(selectedStatusFilter !== 'SEMUA' ||
            activeUrgencyFilter !== 'SEMUA' ||
            selectedCategoryFilter !== 'SEMUA' ||
            searchQuery) && (
            <button
              onClick={() => {
                setSelectedStatusFilter('SEMUA');
                setActiveUrgencyFilter('SEMUA');
                setSelectedCategoryFilter('SEMUA');
                setSearchQuery('');
              }}
              className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-300 font-semibold cursor-pointer px-2 py-1 rounded bg-rose-950/30 border border-rose-800/40"
              id="btn-reset-map-filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Map Stage + Floating HUD & Collapsible Side Panel */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
        {/* Leaflet Map Stage */}
        <div
          ref={mapContainerRef}
          className="w-full h-[580px] md:h-[650px] z-10"
          id="leaflet-complaints-map-container"
          style={{ background: '#090d16' }}
        />

        {/* Floating Map Controls HUD (Top Left Overlay) */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          {/* Zoom Buttons */}
          <div className="bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-xl overflow-hidden shadow-lg flex flex-col">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="p-2 hover:bg-slate-800 text-slate-200 font-bold transition-colors cursor-pointer flex items-center justify-center"
              title="Perbesar Peta"
              id="btn-leaflet-zoom-in"
            >
              +
            </button>
            <div className="h-[1px] bg-slate-800" />
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="p-2 hover:bg-slate-800 text-slate-200 font-bold transition-colors cursor-pointer flex items-center justify-center"
              title="Perkecil Peta"
              id="btn-leaflet-zoom-out"
            >
              −
            </button>
          </div>

          {/* Toggle Layers Overlay Pills */}
          <div className="bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-xl p-1.5 shadow-lg flex flex-col gap-1 text-[10px]">
            <button
              onClick={() => setShowDistricts((prev) => !prev)}
              className={`px-2 py-1 rounded-md font-semibold transition-colors text-left flex items-center justify-between gap-1.5 cursor-pointer ${
                showDistricts ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60' : 'text-slate-400 hover:text-white'
              }`}
              id="toggle-districts-layer"
            >
              <span>Batas Sektor Kota</span>
              <span>{showDistricts ? '✓' : ''}</span>
            </button>
            <button
              onClick={() => setShowStations((prev) => !prev)}
              className={`px-2 py-1 rounded-md font-semibold transition-colors text-left flex items-center justify-between gap-1.5 cursor-pointer ${
                showStations ? 'bg-sky-950/80 text-sky-300 border border-sky-700/60' : 'text-slate-400 hover:text-white'
              }`}
              id="toggle-stations-layer"
            >
              <span>Posko Respon TRC</span>
              <span>{showStations ? '✓' : ''}</span>
            </button>
          </div>
        </div>

        {/* Floating Sidebar Toggle Button (Top Right Overlay) */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/95 backdrop-blur border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold shadow-xl transition-all cursor-pointer"
            id="btn-toggle-map-sidebar"
          >
            <span>{isSidebarOpen ? 'Sembunyikan Panel' : 'Buka Antrean Lapangan'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </div>

        {/* Floating Bottom Legend HUD */}
        <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-3 bg-slate-900/90 backdrop-blur border border-slate-800 px-3.5 py-2 rounded-xl text-[11px] text-slate-300 shadow-xl pointer-events-auto">
          <span className="font-bold text-slate-400">Legenda Titik:</span>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
            <span>Diajukan</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span>
            <span>Shiddiq</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            <span>Disposisi</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
            <span>Khidmat</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block"></span>
            <span>Audit</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span>Selesai</span>
          </div>
          <div className="h-3 w-[1px] bg-slate-700 mx-1"></div>
          <div className="flex items-center gap-1 text-rose-400 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block"></span>
            <span>Darurat (Prioritas)</span>
          </div>
        </div>

        {/* Collapsible Slide-Out Inspector & Emergency Dispatcher Panel (Right Side) */}
        {isSidebarOpen && (
          <div className="absolute top-0 right-0 bottom-0 w-full sm:w-88 md:w-96 bg-slate-900/95 backdrop-blur-md border-l border-slate-800 z-20 flex flex-col shadow-2xl transition-transform animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <h3 className="font-bold text-sm text-white">Antrean Penanganan Lapangan</h3>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {emergencyQueue.length} aduan aktif menanti respon tim
                </p>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Tutup Panel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification alert on quick dispatch */}
            {dispatchedSuccessId && (
              <div className="mx-3 mt-3 p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-600/80 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Status berhasil dimajukan sesuai komitmen integritas khidmat!</span>
              </div>
            )}

            {/* Drawer Content: Focused Complaint Detail OR Queue List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {focusedComplaint ? (
                /* Card for currently focused complaint */
                <div className="space-y-3">
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400">
                        #{focusedComplaint.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          STATUS_CONFIG[focusedComplaint.status].badgeBg
                        } ${STATUS_CONFIG[focusedComplaint.status].badgeText} border ${
                          STATUS_CONFIG[focusedComplaint.status].badgeBorder
                        }`}
                      >
                        {STATUS_CONFIG[focusedComplaint.status].label}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-white leading-snug">
                      {focusedComplaint.title}
                    </h4>

                    <p className="text-[11px] text-slate-300 line-clamp-3">
                      {focusedComplaint.description}
                    </p>

                    <div className="pt-2 border-t border-slate-700/70 grid grid-cols-2 gap-2 text-[10px]">
                      <div>
                        <span className="text-slate-400">Pelapor:</span>
                        <p className="font-semibold text-slate-200">{focusedComplaint.citizenName}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">OPD Bertanggung Jawab:</span>
                        <p className="font-semibold text-slate-200">{focusedComplaint.assignedDepartment}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400">Titik Koordinat:</span>
                        <p className="font-mono text-slate-300">
                          {focusedComplaint.computedCoords.lat.toFixed(4)}, {focusedComplaint.computedCoords.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>

                    {/* Nearest Station & Dispatch Info */}
                    {closestStationInfo && (
                      <div className="mt-2 p-2 rounded-lg bg-sky-950/40 border border-sky-800/50 text-[11px] text-sky-200 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-sky-400" />
                          <span>{closestStationInfo.station.name}</span>
                        </div>
                        <span className="font-mono font-bold text-sky-300">
                          {closestStationInfo.distanceKm} km (~{closestStationInfo.etaMinutes} mnt)
                        </span>
                      </div>
                    )}

                    {/* Dispatch Simulation & View Detail Action Buttons */}
                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        onClick={() => handleQuickDispatch(focusedComplaint.id)}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                        id="btn-sidebar-dispatch"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Simulasikan Progres (Amanah)</span>
                      </button>

                      {onFocusDetailView && (
                        <button
                          onClick={() => onFocusDetailView(focusedComplaint.id)}
                          className="w-full py-1.5 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer border border-slate-600/60"
                          id="btn-sidebar-view-detail"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Buka Lembar Tiket Lengkap</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                    <span>Aduan lain dalam filter:</span>
                    <button
                      onClick={() => setActivePinId(null)}
                      className="text-emerald-400 hover:underline cursor-pointer"
                    >
                      Lihat Semua Antrean
                    </button>
                  </div>
                </div>
              ) : null}

              {/* List of complaints matching the current filter */}
              <div className="space-y-2">
                {emergencyQueue.map((item) => {
                  const isSelected = item.id === activePinId;
                  const cfg = STATUS_CONFIG[item.status];

                  return (
                    <div
                      key={item.id}
                      onClick={() => flyToComplaint(item)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                          : 'bg-slate-800/50 border-slate-750 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="font-mono text-[11px] font-bold text-slate-300">
                          #{item.id}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${cfg.badgeBg} ${cfg.badgeText} border ${cfg.badgeBorder}`}
                          >
                            {cfg.shortLabel}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                              item.urgency === 'Darurat'
                                ? 'bg-rose-900/60 text-rose-300 border border-rose-700'
                                : item.urgency === 'Tinggi'
                                ? 'bg-amber-900/60 text-amber-300 border border-amber-700'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {item.urgency}
                          </span>
                        </div>
                      </div>

                      <h5 className="font-bold text-xs text-white line-clamp-1 mb-1">
                        {item.title}
                      </h5>

                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="truncate max-w-[170px]">📍 {item.location}</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-0.5 shrink-0">
                          <span>Lihat di Peta</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}

                {emergencyQueue.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs bg-slate-800/30 rounded-xl p-4 border border-dashed border-slate-800">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                    <p className="font-semibold text-slate-200">Tidak ada aduan yang cocok</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Seluruh aduan dengan status yang dipilih telah selesai atau tidak sesuai filter.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Metrics Card: SLA & Transparency Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-400 text-[10px]">Total Titik Terplot</span>
            <p className="font-bold text-sm text-white">{filteredComplaints.length} Lokasi</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-400 text-[10px]">Filter Status Aktif</span>
            <p className="font-bold text-sm text-amber-300">
              {selectedStatusFilter === 'SEMUA' ? 'Semua Status' : STATUS_CONFIG[selectedStatusFilter].shortLabel}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-400 text-[10px]">Prioritas Darurat</span>
            <p className="font-bold text-sm text-rose-300">
              {complaints.filter((c) => c.urgency === 'Darurat' && c.status !== 'Selesai_Teruji').length} Tiket
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-slate-400 text-[10px]">Validasi Kriptografi</span>
            <p className="font-bold text-sm text-emerald-300">100% On-Chain</p>
          </div>
        </div>
      </div>
    </div>
  );
};
