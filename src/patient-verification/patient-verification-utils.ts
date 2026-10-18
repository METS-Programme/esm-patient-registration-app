import { age, formatDate, showModal } from '@openmrs/esm-framework';
import { FormikProps } from 'formik';
import { Address, AdvancedSearchParameters, ClientPostBody, RegistryResponse } from './verification-types';
import { FormValues } from '../patient-registration/patient-registration.types';
import capitalize from 'lodash-es/capitalize';
import { TableAction } from './verification-modal/multiple-patient.component';

export function handleRegistryResponse(clientResponse: RegistryResponse, props: FormikProps<FormValues>, values, UIC) {
  if (clientResponse?.total === 0) {
    const emrIdentifier = {
      ['patientUIC']: {
        initialValue: UIC,
        identifierUuid: undefined,
        selectedSource: { uuid: '', name: '' },
        preferred: false,
        required: false,
        identifierTypeUuid: '877169c4-92c6-4cc9-bf45-1ab95faea242',
        identifierName: 'Patient Unique ID Code (UIC)',
        identifierValue: UIC,
      },
    };
    const dispose = showModal('empty-registry-modal', {
      onConfirm: () => {
        props.setValues({
          ...props.values,
          familyName: values.familyName,
          middleName: values.otherName,
          givenName: values.firstName,
          gender: values.gender,
          birthdate: values.dateOfBirth,
          isDead: false,
          address: {
            country: values.country,
          },
          identifiers: { ...props.values.identifiers, ...emrIdentifier },
        });
        dispose();
      },
      close: () => dispose(),
    });
  } else if (clientResponse?.total === 1) {
    const {
      resource: { identifier, name, gender, birthDate, address, telecom },
    } = clientResponse.entry[0];

    const { family, given } = name[0];

    let patientUIC;
    identifier?.map((id) => {
      if (id['type']['text'] === 'Patient Unique  ID Code (UIC)') {
        return (patientUIC = id['type']['value']);
      }
    });

    let emrIdentifier;
    if (patientUIC) {
      emrIdentifier = {
        ['patientUIC']: {
          initialValue: patientUIC,
          identifierUuid: undefined,
          selectedSource: { uuid: '', name: '' },
          preferred: false,
          required: false,
          identifierTypeUuid: '877169c4-92c6-4cc9-bf45-1ab95faea242',
          identifierName: 'Patient Unique  ID Code (UIC)',
          identifierValue: patientUIC,
        },
      };
    }

    const dispose = showModal('confirm-registry-modal', {
      onConfirm: () => {
        props.setValues({
          ...props.values,
          familyName: family,
          middleName: given[1]?.length ? given[1] : '',
          givenName: given[0],
          gender: gender === 'male' ? 'Male' : 'Female',
          birthdate: new Date(birthDate),
          address: getAddress(address),
          identifiers: { ...props.values.identifiers, ...(emrIdentifier ?? {}) },
          attributes: {
            '14d4f066-15f5-102d-96e4-000c29c2a5d7': telecom?.find((item) => item.system === 'phone')?.value,
          },
        });
        dispose();
      },
      close: () => dispose(),
      patient: clientResponse.entry[0]['resource'],
    });
  } else {
    let patientData = [];
    clientResponse?.entry?.map((registryPatient) => {
      const {
        resource: { name, gender, birthDate, address, telecom },
      } = registryPatient;
      const { family, given } = name[0];

      patientData.push({
        names: `${family} ${given}`,
        age: age(birthDate),
        birthdate: formatDate(new Date(birthDate)),
        gender: capitalize(gender),
        actions: TableAction(() => {
          props.setValues({
            ...props.values,
            familyName: family,
            middleName: given[1]?.length ? given[1] : '',
            givenName: given[0],
            gender: gender === 'male' ? 'Male' : 'Female',
            birthdate: new Date(birthDate),
            address: getAddress(address),
            identifiers: { ...props.values.identifiers },
            attributes: {
              '14d4f066-15f5-102d-96e4-000c29c2a5d7': telecom?.find((item) => item.system === 'phone')?.value,
            },
          });
          dispose();
        }),
      });
    });

    const dispose = showModal('multiple-patient-modal', {
      onConfirm: () => dispose(),
      close: () => dispose(),
      patient: patientData,
    });
  }
}

const getAddress = (address) => {
  const { extension, district, country } = address[0];

  const county = extension[0].extension.find(
    (ext) => ext.url === 'http://fhir.openmrs.org/ext/address#county',
  )?.valueString;
  const subcounty = extension[0].extension.find(
    (ext) => ext.url === 'http://fhir.openmrs.org/ext/address#subcounty',
  )?.valueString;
  const parish = extension[0].extension.find(
    (ext) => ext.url === 'http://fhir.openmrs.org/ext/address#parish',
  )?.valueString;
  const village = extension[0].extension.find(
    (ext) => ext.url === 'http://fhir.openmrs.org/ext/address#village',
  )?.valueString;

  return {
    country: country,
    countyDistrict: district,
    stateProvince: county,
    address3: subcounty,
    address4: parish,
    address5: village,
  };
};

const extractAddress = (formAddressValue) => {
  let address: Address = {
    extension: [],
  };
  let extension = [];
  if (formAddressValue['country']) {
    address.country = formAddressValue['country'];
  }
  if (formAddressValue['city']) {
    address.city = formAddressValue['city'];
  }
  if (formAddressValue['countyDistrict']) {
    address.district = formAddressValue['countyDistrict'];
  }
  if (formAddressValue['stateProvince']) {
    extension.push({
      valueString: formAddressValue['stateProvince'],
      url: 'http://fhir.openmrs.org/ext/address#county',
    });
  }
  if (formAddressValue['address3']) {
    extension.push({
      valueString: formAddressValue['address3'],
      url: 'http://fhir.openmrs.org/ext/address#subcounty',
    });
  }
  if (formAddressValue['address4']) {
    extension.push({
      valueString: formAddressValue['address4'],
      url: 'http://fhir.openmrs.org/ext/address#parish',
    });
  }
  if (formAddressValue['address5']) {
    extension.push({
      valueString: formAddressValue['address5'],
      url: 'http://fhir.openmrs.org/ext/address#village',
    });
  }
  if (extension.length) {
    address.extension.push({
      extension: extension,
    });
  } else {
    delete address.extension;
  }

  return address;
};

const extractIdentifiers = (identifiers) => {
  let arr = [];
  Object.values(identifiers).forEach((id) => {
    arr.push({
      use: 'usual',
      id: id['identifierTypeUuid'],
      type: {
        text: id['identifierName'],
      },
      value: id['identifierValue'],
    });
  });
  return arr;
};

export function generateFHIRPayload(formValues: FormValues): ClientPostBody {
  return {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: [
      {
        resource: {
          name: [
            {
              family: formValues?.familyName,
              given: [formValues?.givenName, formValues?.middleName],
            },
          ],
          gender: formValues?.gender.toLowerCase(),
          birthDate: new Date(formValues?.birthdate).toISOString(),
          address: [extractAddress(formValues.address)],
          identifier: extractIdentifiers(formValues.identifiers),
          resourceType: 'Patient',
        },
        request: {
          method: 'PUT',
          url: `Patient/${formValues.patientUuid}`,
        },
      },
    ],
  };
}

function replaceLettersWithNumber(letter) {
  letter = letter.toUpperCase();
  let result = '';
  if (/^[A-Z]$/.test(letter)) {
    result = `${letter.charCodeAt(0) - 'A'.charCodeAt(0) + 1}`;
  } else {
    result = '00';
  }

  if (result.length < 2) {
    result = `0${result}`;
  }
  return result;
}

const generateUIC = (givenName, middleName, familyName, gender, dateOfBirth, country) => {
  let familyNameCode = '';
  let givenNameCode = '';
  let middleNameCode = '';
  let countryCode = '';
  let genderCode = '';
  let birthdate = dateOfBirth;

  let monthCode;

  if (birthdate == null) {
    return null;
  }

  let year = birthdate.getFullYear().toString().substring(2, 4);

  if (birthdate.getMonth() <= 8) {
    monthCode = '0' + (birthdate.getMonth() + 1);
  } else {
    monthCode = '' + (birthdate.getMonth() + 1);
  }

  if (gender === 'F') {
    genderCode = '2';
  } else {
    genderCode = '1';
  }

  if (country !== null && country !== '') {
    countryCode = country.substring(0, 2).toUpperCase();
  } else {
    countryCode = 'X';
  }

  if (familyName !== '' && familyName !== null) {
    let firstLetter = replaceLettersWithNumber(familyName.substring(0, 1));
    let secondLetter = replaceLettersWithNumber(familyName.substring(1, 2));
    let thirdLetter = replaceLettersWithNumber(familyName.substring(2, 3));
    familyNameCode = firstLetter + secondLetter + thirdLetter;
  } else {
    familyNameCode = 'X';
  }

  if (givenName !== '' && givenName !== null) {
    let firstLetter1 = replaceLettersWithNumber(givenName.substring(0, 1));
    let secondLetter1 = replaceLettersWithNumber(givenName.substring(1, 2));
    let thirdLetter1 = replaceLettersWithNumber(givenName.substring(2, 3));
    givenNameCode = firstLetter1 + secondLetter1 + thirdLetter1;
  } else {
    givenNameCode = 'X';
  }

  if (middleName !== '' && middleName !== null) {
    middleNameCode = replaceLettersWithNumber(middleName.substring(0, 1));
  } else {
    middleNameCode = 'X';
  }

  return (
    countryCode + '-' + monthCode + year + '-' + genderCode + '-' + givenNameCode + familyNameCode + middleNameCode
  );
};

export const generateUICFromFormValues = (formValues: FormValues) => {
  const { givenName, middleName, gender, birthdate, address, familyName } = formValues;
  const { country } = address;

  const UIC = generateUIC(givenName, middleName, familyName, gender, birthdate, country);
  return UIC;
};

export const generateUICFromVerification = (params: AdvancedSearchParameters) => {
  const givenName = params?.firstName;
  const middleName = params?.otherName;
  const familyName = params?.familyName;
  const gender = params?.gender.toLowerCase();
  const dateOfBirth = new Date(params?.dateOfBirth);
  const country = params?.country;

  const UIC = generateUIC(givenName, middleName, familyName, gender, dateOfBirth, country);
  return UIC;
};
