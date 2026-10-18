import useSWR from 'swr';
import { openmrsFetch, restBaseUrl } from '@openmrs/esm-framework';

declare type fhirProfile = {
  uuid: string;
  name: string;
  url: string;
  profileEnabled: boolean;
  profileSearchable: boolean;
};

export function useGetPatientRegistries() {
  const apiUrl = `${restBaseUrl}/syncfhirprofile`;
  const { data, error, isLoading } = useSWR<{ data: { results: any } }, Error>(apiUrl, openmrsFetch);
  return {
    patientRegistries: data ? mapDataElements(data?.data['results']) : [],
    isError: error,
    isLoadingFhirProfiles: isLoading,
  };
}

export function mapDataElements(dataArray: Array<Record<string, string>>) {
  const arrayToReturn: Array<fhirProfile> = [];
  if (dataArray) {
    dataArray.map((profile: Record<string, any>) => {
      if (profile?.profileEnabled && profile?.searchable) {
        arrayToReturn.push({
          name: profile?.name,
          uuid: profile?.uuid,
          url: profile?.searchURL,
          profileEnabled: profile?.profileEnabled,
          profileSearchable: profile?.searchable,
        });
      }
    });
  }

  return arrayToReturn;
}
