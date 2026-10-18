export interface VerificationSearchParams {
  registry: string;
  identifier: string;
}

export interface RegistryResponse {
  resourceType?: string;
  type?: string;
  total?: number;
  entry?: [CRPatientResult];
}

export interface PatientIdentifier {
  id?: string;
  use?: string;
  type?: {
    coding?: [
      {
        system: string;
        code: string;
      },
    ];
    text?: string;
  };
  value?: string;
}

export interface ClientName {
  id?: string;
  use?: string;
  family: string;
  given: Array<string>;
}

export interface CRPatientResult {
  // fullUrl;
  resource: CRPatientDetails;
  // search:
}

export interface CRPatientDetails {
  resourceType: string;
  id: string;
  // meta: ;
  // contained: ;
  identifier?: Array<PatientIdentifier>;
  active?: boolean;
  name?: Array<ClientName>;
  gender?: string;
  birthDate?: string;
  deceasedBoolean?: boolean;
  address?: Array<{
    id: string;
    use: string;
    city: string;
    country: string;
  }>;
  telecom?: Array<{
    system: string;
    value: string;
  }>;
  managingOrganization?: {
    reference: string;
    type: string;
    identifier: {
      use: string;
      system: string;
      value: string;
    };
    display: string;
  };
}

export interface Entry {
  resource: PatientResource;
  request: Request;
}

export interface ClientPostBody {
  entry: Array<Entry>;
  resourceType?: string;
  type?: string;
}

export interface PatientResource {
  identifier?: Array<IdentifierBody>;
  deceasedBoolean?: boolean;
  address?: Array<Address>;
  // managingOrganization: ManagingOrganization
  gender?: string;
  meta?: Meta;
  name?: Array<ClientName>;
  active?: boolean;
  id?: string;
  birthDate?: string;
  resourceType?: string;
  type?: string;
}

export interface ManagingOrganization {}

export interface Meta {
  lastUpdated?: string;
}

export interface Request {
  method?: string;
  url?: string;
}

export interface Address {
  country?: string;
  extension?: Extension[];
  use?: string;
  district?: string;
  id?: string;
  city?: string;
}

export interface Extension {
  extension?: Extension2[];
  url?: string;
}

export interface Extension2 {
  valueString?: string;
  url?: string;
}

export interface Extension3 {
  valueReference?: {
    reference?: string;
    display?: string;
    type?: string;
  };
  url?: string;
}

export interface Coding {
  system?: string;
  code?: string;
}

export interface IdentifierBody {
  extension?: Array<Extension3>;
  use?: string;
  id?: string;
  type?: Type;
  value?: string;
}

export interface Type {
  coding?: Array<Coding>;
  text?: string;
}

export interface PostToRegistryBody {
  resourceType?: string;
  type?: string;
  entry?: Array<{
    resource?: {
      identifier?: Array<IdentifierBody>;
      deceasedBoolean?: false;
      address?: Array<Address>;
      managingOrganization?: {};
      gender?: string;
      meta?: Meta;
      name?: ClientName;
      active?: boolean;
      id?: string;
      birthDate?: string;
      resourceType?: string;
    };
    request: Request;
  }>;
}
export interface AdvancedSearchParameters {
  firstName?: string;
  familyName?: string;
  otherName?: string;
  dateOfBirth?: string;
  gender?: string;
  country?: string;
}
