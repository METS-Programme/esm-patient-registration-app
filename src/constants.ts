export const personRelationshipRepresentation =
  'custom:(display,uuid,' +
  'personA:(age,display,birthdate,uuid),' +
  'personB:(age,display,birthdate,uuid),' +
  'relationshipType:(uuid,display,description,aIsToB,bIsToA))';

// UgandaEMR module identity. Must match the package name and the key used for
// this module in the deployed frontend config (config.json) and import map.
export const moduleName = '@ugandaemr/esm-patient-registration-app';
