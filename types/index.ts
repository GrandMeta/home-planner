// ─────────────────────────────────────────────────────────────────────────────
// Real Estate Decision Portal — Centralized TypeScript Types
// Source of truth: /docs/02_DATA_DICTIONARY.md, /docs/03_PROJECT_AND_UNIT_SCHEMA.md
//                  /docs/20_MEDIA_ASSETS_AND_GALLERY.md
// ─────────────────────────────────────────────────────────────────────────────

// ─── Enums ───────────────────────────────────────────────────────────────────

export type ProjectStatus =
  | "New Lead"
  | "Data Pending"
  | "Site Visit Planned"
  | "Site Visited"
  | "Under Comparison"
  | "Family Review Required"
  | "Financial Review Required"
  | "Legal Review Required"
  | "Watchlist"
  | "Shortlisted"
  | "Strong Shortlist"
  | "Negotiation"
  | "Booking Ready"
  | "Booked"
  | "Loan In Progress"
  | "Payment Tracking"
  | "Registration Pending"
  | "Registered"
  | "Possession Pending"
  | "Possession Received"
  | "Rejected"
  | "On Hold"
  | "Closed";

export type ProjectPurpose = "Living" | "Investment" | "Both" | "Undecided";

export type ProjectType = "Apartment" | "Villa" | "Plot" | "Mixed Use" | "Unknown";

export type CityZone =
  | "East Bangalore"
  | "North Bangalore"
  | "South Bangalore"
  | "West Bangalore"
  | "Central Bangalore"
  | "Other";

export type BHKConfig =
  | "1BHK"
  | "2BHK"
  | "2.5BHK"
  | "3BHK"
  | "3.5BHK"
  | "4BHK"
  | "4.5BHK"
  | "5BHK"
  | "Other";

export type Facing =
  | "East"
  | "West"
  | "North"
  | "South"
  | "North-East"
  | "North-West"
  | "South-East"
  | "South-West"
  | "Unknown";

export type RERStatus =
  | "Registered"
  | "Applied"
  | "Awaited"
  | "Not Applicable"
  | "Expired"
  | "Unknown";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical" | "Unknown";

export type DataConfidenceStatus =
  | "Unknown"
  | "User Estimate"
  | "Builder Provided"
  | "Site Visit Confirmed"
  | "Written Confirmation"
  | "Document Verified"
  | "Legal Verified"
  | "Manual Override";

export type MoneyTreatment =
  | "Separate"
  | "Included"
  | "Bundled"
  | "Not Applicable"
  | "Unknown"
  | "Estimated"
  | "Manual Override";

export type AmenityCategory =
  | "Sports"
  | "Wellness"
  | "Social"
  | "Children"
  | "Security"
  | "Utilities"
  | "Green"
  | "Connectivity"
  | "Other";

export type FollowUpCategory =
  | "Data Collection"
  | "Builder Commitment"
  | "Legal/RERA"
  | "Site Visit"
  | "Negotiation"
  | "Loan/Bank"
  | "Other";

export type FollowUpStatus = "Open" | "In Progress" | "Resolved" | "Cancelled";
export type FollowUpPriority = "High" | "Medium" | "Low";

export type PaymentMilestoneStatus =
  | "Pending"
  | "Due"
  | "Paid"
  | "Overdue"
  | "Not Applicable";

export type UnitDecisionStatus =
  | "Under Review"
  | "Shortlisted"
  | "Rejected"
  | "Watchlist";

// ─── Media Types ─────────────────────────────────────────────────────────────

export type ImageCategory =
  | "hero"
  | "gallery"
  | "elevation"
  | "floor-plan"
  | "master-plan"
  | "amenity-photo"
  | "site-photo"
  | "document-preview";

export type VideoType =
  | "walkthrough"
  | "aerial-view"
  | "testimonial"
  | "progress-update"
  | "other";

export type DocumentAssetType =
  | "brochure"
  | "floor-plan-pdf"
  | "cost-sheet"
  | "legal-doc"
  | "rera-certificate"
  | "agreement-draft"
  | "payment-schedule"
  | "other";

export interface ImageRecord {
  id: string;
  url: string;
  caption?: string;
  altText?: string;
  category: ImageCategory;
  /** For floor-plan images: "2BHK", "3BHK" etc. */
  unitType?: string;
  /** For floor-plan images: "Tower A", "Tower B" etc. */
  towerName?: string;
  sortOrder?: number;
  isCover?: boolean;
  sourceNote?: string;
  addedAt: string;
}

export interface VideoRecord {
  id: string;
  rawUrl: string;
  embedUrl?: string;
  platform: "youtube" | "vimeo" | "other";
  videoType: VideoType;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  addedAt: string;
}

export interface DocumentAsset {
  id: string;
  url: string;
  name: string;
  type: DocumentAssetType;
  projectId?: string;
  unitId?: string;
  collectionStatus: "Collected" | "Requested" | "Pending" | "Not Available";
  verificationStatus: "Unverified" | "Reviewed" | "Verified" | "Rejected";
  notes?: string;
  addedAt: string;
}

// ─── Money Fields ─────────────────────────────────────────────────────────────

export interface MoneyField {
  amount: number;
  treatment: MoneyTreatment;
  confidence?: DataConfidenceStatus;
  notes?: string;
}

export interface CalculatedMoneyField {
  calculatedAmount: number;
  manualOverrideAmount?: number;
  isManualOverride: boolean;
  finalAmount: number;
  currency: "INR";
  formulaName?: string;
  calculationNotes?: string;
}

// ─── Builder ──────────────────────────────────────────────────────────────────

export interface Builder {
  builderId: string;
  builderName: string;
  builderGroupName?: string;
  builderWebsite?: string;
  logoUrl?: string;
  logoInitials?: string;
  logoColor?: string;
  primarySalesContactName?: string;
  primarySalesContactPhone?: string;
  primarySalesContactEmail?: string;
  crmContactName?: string;
  crmContactPhone?: string;
  crmContactEmail?: string;
  builderCredibilityRating?: number;
  pastDeliveryReputation?: string;
  constructionQualityReputation?: string;
  resaleLiquidityPerception?: "High" | "Medium" | "Low" | "Unknown";
  builderRiskLevel?: RiskLevel;
  builderRiskNotes?: string;
  builderGallery?: ImageRecord[];
  createdAt: string;
  updatedAt: string;
}

// ─── Amenity ─────────────────────────────────────────────────────────────────

export interface Amenity {
  id: string;
  name: string;
  category: AmenityCategory;
  available: boolean;
  notes?: string;
}

// ─── Project ─────────────────────────────────────────────────────────────────

export interface Project {
  projectId: string;
  projectName: string;
  projectDisplayName?: string;
  projectShortName?: string;
  builderId?: string;
  builderName: string;
  projectType: ProjectType;
  projectPurpose: ProjectPurpose;
  projectStatus: ProjectStatus;

  // Location
  city: string;
  cityZone: CityZone;
  microMarket?: string;
  locality?: string;
  address?: string;
  latitude?: number;
  longitude?: number;

  // RERA
  reraNumber?: string;
  reraStatus?: RERStatus;
  reraWebsiteUrl?: string;

  // Scale
  totalLandAreaAcres?: number;
  totalTowers?: number;
  totalFloors?: number;
  totalUnits?: number;
  basementLevels?: number;
  openSpacePercentage?: number;

  // Possession
  estimatedPossessionDate?: string;
  possessionConfidence?: DataConfidenceStatus;

  // Price indication
  priceRangeMinPerSqft?: number;
  priceRangeMaxPerSqft?: number;
  indicativePriceMin?: number;
  indicativePriceMax?: number;

  // Available BHKs
  availableBHKs: BHKConfig[];

  // Source
  sourceOfLead?: string;
  sourceUrl?: string;

  // Media
  images: ImageRecord[];
  videos: VideoRecord[];
  documents: DocumentAsset[];

  // Media flags
  brochureCollected: boolean;
  floorPlansCollected: boolean;
  masterPlanCollected: boolean;
  reraCertificateCollected: boolean;

  // Amenities
  amenities: Amenity[];

  // Project highlights (marketing bullets)
  projectHighlights: string[];

  // Risk
  riskLevel?: RiskLevel;
  riskNotes?: string;

  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Unit ─────────────────────────────────────────────────────────────────────

export interface Unit {
  unitId: string;
  projectId: string;
  unitLabel?: string;
  bhkConfig: BHKConfig;
  unitType?: string;
  towerName?: string;
  floorNumber?: number;
  unitNumber?: string;
  facing?: Facing;
  viewType?: string;
  cornerUnit?: boolean;
  premiumUnit?: boolean;

  // Areas (sqft)
  superBuiltUpAreaSqft?: number;
  carpetAreaSqft?: number;
  carpetAreaUsableSqft?: number;
  balconyAreaSqft?: number;

  // Core pricing
  basePricePerSqft?: number;
  negotiatedPricePerSqft?: number;
  basicFlatCost?: number;

  // Additional builder charges
  carParkingCharges?: MoneyField;
  clubhouseCharges?: MoneyField;
  bwssbCharges?: MoneyField;
  bescomCharges?: MoneyField;
  powerBackupCharges?: MoneyField;
  evChargerCharges?: MoneyField;
  plcCharges?: MoneyField;
  floorRisePremium?: MoneyField;
  otherBuilderCharges?: MoneyField;

  // Statutory
  gstPercentage?: number;
  gstAmount?: MoneyField;
  stampDutyPercentage?: number;
  stampDutyAmount?: MoneyField;
  registrationAmount?: MoneyField;
  legalCharges?: MoneyField;
  corpusFund?: MoneyField;
  maintenanceAdvance?: MoneyField;

  // Post-possession costs
  interiorsEstimate?: number;
  movingCost?: number;

  // Parking
  parkingType?: "Covered" | "Open" | "Stacked" | "Not Available" | "Unknown";
  parkingCount?: number;
  parkingIncluded?: boolean;
  parkingNotes?: string;

  // Media
  floorPlanImages: ImageRecord[];

  // Decision
  isShortlisted?: boolean;
  isSelectedForComparison?: boolean;
  decisionStatus?: UnitDecisionStatus;

  // Scores (0-100)
  livingScore?: number;
  investmentScore?: number;

  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Site Visit ───────────────────────────────────────────────────────────────

export interface SiteVisit {
  visitId: string;
  projectId: string;
  unitId?: string;
  visitDate: string;
  visitType: "First Look" | "Second Visit" | "Negotiation" | "Booking" | "Other";
  attendees?: string;
  overallImpression?: "Excellent" | "Good" | "Average" | "Poor";
  constructionProgress?: string;
  sampleFlatViewed?: boolean;
  parkingChecked?: boolean;
  surroundingsObserved?: boolean;
  observations?: string;
  photos: ImageRecord[];
  followUpsRaised?: string[];
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Follow-Up ────────────────────────────────────────────────────────────────

export interface FollowUpTask {
  taskId: string;
  projectId: string;
  unitId?: string;
  title: string;
  description?: string;
  category: FollowUpCategory;
  priority: FollowUpPriority;
  status: FollowUpStatus;
  dueDate?: string;
  resolvedDate?: string;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Payment Milestone ────────────────────────────────────────────────────────

export interface PaymentMilestone {
  milestoneId: string;
  projectId: string;
  unitId: string;
  stage: string;
  description?: string;
  percentageOfCost?: number;
  amount?: number;
  dueDate?: string;
  paidDate?: string;
  paidAmount?: number;
  status: PaymentMilestoneStatus;
  receiptUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── App Settings ─────────────────────────────────────────────────────────────

export interface AppSettings {
  defaultCity: string;
  defaultCityZone: CityZone;
  primaryWorkplaceAddress?: string;
  primaryWorkplaceLat?: number;
  primaryWorkplaceLng?: number;
  gstDefaultPercentage: number;
  stampDutyDefaultPercentage: number;
  registrationDefaultPercentage: number;
}

// ─── Derived / Calculated Types ───────────────────────────────────────────────

export interface CalculatedCost {
  basicFlatCost: number | null;
  additionalBuilderCharges: number;
  agreementValue: number | null;
  gstAmount: number | null;
  stampDutyAmount: number | null;
  registrationAmount: number | null;
  legalCharges: number | null;
  corpusFund: number | null;
  maintenanceAdvance: number | null;
  interiorsEstimate: number | null;
  movingCost: number | null;
  totalLandingCost: number | null;
  trueCostPerSBASqft: number | null;
  trueCostPerCarpetSqft: number | null;
  hiddenCostPercentage: number | null;
  carpetEfficiencyRatio: number | null;
  hasDataGaps: boolean;
  missingFields: string[];
}

// ─── Score Types ──────────────────────────────────────────────────────────────

export interface ScoreBreakdown {
  financialScore: number;
  locationScore: number;
  parkingScore: number;
  legalScore: number;
  amenitiesScore: number;
  constructionScore: number;
  dataCompletenessScore: number;
  riskPenalty: number;
}

export interface ProjectScore {
  livingScore: number;
  investmentScore: number;
  breakdown: ScoreBreakdown;
  recommendation:
    | "Strong Shortlist"
    | "Shortlist"
    | "Revisit"
    | "Watchlist"
    | "Avoid for Now"
    | "Rejected"
    | "On Hold"
    | "Insufficient Data";
  strengths: string[];
  weaknesses: string[];
  missingData: string[];
}
