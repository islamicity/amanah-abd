import React from 'react';
import { Complaint } from '../types';
import { ComplaintLeafletMap, ComplaintLeafletMapProps } from './ComplaintLeafletMap';

export interface ComplaintMapPlaceholderProps {
  complaints: Complaint[];
  selectedComplaintId?: string | null;
  onSelectComplaint: (id: string) => void;
  onSimulateProgress: (complaintId: string) => void;
  onOpenNewComplaintModal?: () => void;
  onFocusDetailView?: (id: string) => void;
}

/**
 * ComplaintMapPlaceholder now delegates directly to the interactive Leaflet GIS map component
 */
export const ComplaintMapPlaceholder: React.FC<ComplaintMapPlaceholderProps> = (props) => {
  return <ComplaintLeafletMap {...props} />;
};

export default ComplaintMapPlaceholder;
