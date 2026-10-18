# Config migration: fork v11 → upstream v12.1.1 schema

This app was rebased onto the upstream OpenMRS `esm-patient-registration-app`
v12.1.1 implementation. The config schema changed shape. Deployed config JSON
(frontend config for `@ugandaemr/esm-patient-registration-app`) must be migrated
as below — merging the new code without migrating the config will break photo
saving and non-coded cause of death.

## Removed keys

| Old key | What happened |
| --- | --- |
| `concepts.patientPhotoUuid` | Removed. The photo concept now comes from `@openmrs/esm-styleguide` config (`patientPhotoConceptUuid`). Delete this key from deployed config. |
| `fieldConfigurations.gender[].id` | The `Gender` type no longer has an `id` field. Remove `id` from gender entries. |
| `fieldConfigurations.causeOfDeath.freeTextFieldConceptUuid` | **Moved** to top-level `freeTextFieldConceptUuid` (see below). |
| (routes.json) `online` / `offline` flags | Offline registration was dropped in this port; the flags are no longer declared. |

## Moved keys

| Old key | New key |
| --- | --- |
| `fieldConfigurations.causeOfDeath.freeTextFieldConceptUuid` | `freeTextFieldConceptUuid` (top level, default `5622AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`) |

## New optional keys

| Key | Default | Purpose |
| --- | --- | --- |
| `fieldConfigurations.identifier.allowPreferredSelection` | `false` | Shows a "Preferred" radio per identifier (upstream v12 feature). |
| `fieldConfigurations.identifier.enableFingerprintCapture` | `false` | Shows the "Add FingerPrint" UI in the identifiers section. **UgandaEMR fork feature — currently a UI stub with no biometric integration. Do not enable in production until a real capture integration exists.** |
| `fieldDefinitions[].allowFutureDates` / `allowPastDates` | `false` | Date-boundary validation for date fields (upstream v12). |
| `fieldDefinitions[].locationTag` | — | Location-attribute person fields (upstream v12). |
| `fieldConfigurations.causeOfDeath.conceptUuid` | now has a default (`9272a14b-…`) | Previously required with no default. |

## Loosened keys (previously required, now optional)

- `fieldDefinitions[].placeholder`
- `fieldDefinitions[].customConceptAnswers`
- `fieldDefinitions[].validation`
- `fieldConfigurations.phone.validation.required` / `.matches`
- `fieldConfigurations.causeOfDeath.required`

## Unchanged

`registrationObs`, `defaultPatientIdentifierTypes`, `links.submitButton`,
`fieldConfigurations.{name, address, dateOfBirth}` keep their shape.

## Registry configuration (patient verification)

Unchanged: registries are configured **server-side** via the `syncfhirprofile`
FHIR sync profiles resource (enabled + searchable profiles appear in the
verification dropdown). No frontend config keys are involved.

## Package rename

The npm package is now `@ugandaemr/esm-patient-registration-app` (was
`@openmrs/esm-patient-registration-app`). The built bundle filename is now
`dist/esm-patient-registration-app.js` — update the import map entry in the
frontend shell accordingly.
