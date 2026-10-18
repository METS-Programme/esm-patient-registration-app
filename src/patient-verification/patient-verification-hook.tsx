import { FetchResponse, openmrsFetch, showNotification, showToast, showModal } from '@openmrs/esm-framework';
import { generateFHIRPayload } from './patient-verification-utils';
import useSWR from 'swr';
import { ConceptAnswers, ConceptResponse, FormValues } from '../patient-registration/patient-registration.types';
// import { patientRegistries } from './verification-constants';

export const searchRegistry = async (searchParams, advancedSearchParams) => {
  const { registry, identifier } = searchParams;
  const { firstName, familyName, otherName } = advancedSearchParams;
  let enteredFields = [];
  let urlParams = '';

  // let selectedRegistry = patientRegistries.filter((r) => r.name === registry);
  if (registry) {
    if (identifier) {
      urlParams = `?identifier=${identifier.toUpperCase()}`;
    } else {
      const fields = [firstName, familyName, otherName].filter(Boolean);
      const filledCount = fields.length;

      if (filledCount === 1) {
        urlParams = `?phonetic=${fields[0]}`;
      } else if (filledCount === 2) {
        urlParams = `?name=${fields[0]}&name=${fields[1]}`;
      } else if (filledCount === 3) {
        urlParams = `?name=${fields[0]}&name=${fields[1]}&name=${fields[2]}`;
      }
    }
    urlParams = urlParams + '&_tag:not=5c827da5-4858-4f3d-a50c-62ece001efea';

    const query = `${registry}` + urlParams;
    try {
      let res = await fetch(query);
      return await res.json();
    } catch (error) {
      showNotification({ kind: 'error', title: `Error connecting to ${registry}`, description: JSON.stringify(error) });
    }
  }
};

export function useConceptAnswers(conceptUuid: string): { data: Array<ConceptAnswers>; isLoading: boolean } {
  const { data, error, isLoading } = useSWR<FetchResponse<ConceptResponse>, Error>(
    `/ws/rest/v1/concept/${conceptUuid}`,
    openmrsFetch,
  );
  if (error) {
    showToast({
      title: error.name,
      description: error.message,
      kind: 'error',
    });
  }
  return { data: data?.data?.answers ?? [], isLoading };
}

export function savePatientToRegistry(formValues: FormValues, registry) {
  const createdRegistryPatient = generateFHIRPayload(formValues);
  if (registry) {
    return fetch(`${registry}`, {
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(createdRegistryPatient),
    });
  }
}

async function postToRegistry(
  formValues: FormValues,
  setValues: (values: FormValues, shouldValidate?: boolean) => void,
  selectedRegistry,
) {
  try {
    const registryResponse = await savePatientToRegistry(formValues, selectedRegistry);
    if (registryResponse.status === 200) {
      setValues({ ...formValues, identifiers: { ...formValues.identifiers } });
      showToast({
        title: `Posted patient to ${selectedRegistry} successfully`,
        description: `The patient has been saved to ${selectedRegistry}`,
        kind: 'success',
      });
    } else {
      const responseError = await registryResponse.json();
      const errorMessage = Object.values(responseError.errors ?? {})
        .map((error: any) => error.join())
        .toString();
      setValues({
        ...formValues,
        attributes: {
          ...formValues.attributes,
          ['869f623a-f78e-4ace-9202-0bed481822f5']: 'Failed validation',
          ['752a0331-5293-4aa5-bf46-4d51aaf2cdc5']: 'Failed',
        },
      });
      showNotification({
        title: responseError.title,
        description: errorMessage,
        kind: 'warning',
        millis: 1500000,
      });
    }
  } catch (error) {
    showNotification({
      kind: 'error',
      title: `Post to ${selectedRegistry} failed`,
      description: JSON.stringify(error),
    });
  }
}

export async function handleSavePatientToRegistry(
  formValues: FormValues,
  setValues: (values: FormValues, shouldValidate?: boolean) => void,
  selectedRegistry,
) {
  try {
    await postToRegistry(formValues, setValues, selectedRegistry);
  } catch (error) {
    showToast({
      title: `${selectedRegistry} error`,
      description: `${error}`,
      kind: 'error',
      critical: true,
    });
  }
  return;
}
