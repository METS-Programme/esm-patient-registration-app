import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layer, Select, SelectItem, TextInput, DatePicker, DatePickerInput, Column, Stack, Form } from '@carbon/react';
import { countries } from '../assets/verification-assets';
import { generateFormatting } from '../../patient-registration/date-util';
import styles from '../patient-verification.scss';

const AdvancedSearchForm = ({ advancedSearchParams, setAdvancedSearchParams }) => {
  const { t } = useTranslation();
  const { firstName, familyName, otherName, gender, dateOfBirth, country } = advancedSearchParams;

  const genderSelectItems = [
    {
      id: 1,
      label: 'Female',
    },
    {
      id: 2,
      label: 'Male',
    },
  ];

  const { format, placeHolder, dateFormat } = generateFormatting(['d', 'm', 'Y'], '/');
  const today = new Date();
  return (
    <Form className={''}>
      <Stack gap={3}>
        <Column className={styles.verificationWrapper}>
          <Layer className={styles.layer}>
            <TextInput
              className={styles['fieldInput']}
              id="firstName"
              labelText={t('firstName', 'First Name')}
              onChange={(event) =>
                setAdvancedSearchParams({
                  ...advancedSearchParams,
                  firstName: event.target.value,
                })
              }
              value={firstName}
            />
          </Layer>
          <Layer className={styles.layer}>
            <TextInput
              className={styles['fieldInput']}
              id="lastName"
              labelText={t('lastName', 'Last Name')}
              onChange={(event) =>
                setAdvancedSearchParams({
                  ...advancedSearchParams,
                  familyName: event.target.value,
                })
              }
              value={familyName}
            />
          </Layer>
          <Layer className={styles.layer}>
            <TextInput
              className={styles['fieldInput']}
              id="otherName"
              labelText={t('otherName', 'Other Name')}
              onChange={(event) =>
                setAdvancedSearchParams({
                  ...advancedSearchParams,
                  otherName: event.target.value,
                })
              }
              value={otherName}
            />
          </Layer>
        </Column>
        <Column className={styles.verificationWrapper}>
          <Layer className={styles.layer}>
            <Select
              labelText={t('selectGender', 'Select Gender')}
              id="gender-select"
              invalidText="Required"
              className={styles['fieldInput']}
              value={gender}
              defaultValue={gender}
              onChange={(event) =>
                setAdvancedSearchParams({
                  ...advancedSearchParams,
                  gender: event.target.value,
                })
              }>
              <SelectItem key={'gender'} text={'Select Gender'} value={''}>
                {' '}
              </SelectItem>
              {genderSelectItems.map((g) => (
                <SelectItem key={g.id} text={g.label} value={g.label}>
                  {g.label}
                </SelectItem>
              ))}
            </Select>
          </Layer>
          <Layer className={styles.layer}>
            <DatePicker
              dateFormat={dateFormat}
              datePickerType="single"
              light={false}
              allowInput={true}
              maxDate={format(today)}
              onChange={(event) =>
                setAdvancedSearchParams({
                  ...advancedSearchParams,
                  dateOfBirth: event[0],
                })
              }>
              <DatePickerInput
                id="date-of-birth-picker"
                placeholder={placeHolder}
                labelText={t('dateOfBirth', 'Date of Birth')}
                type="text"
                size="md"
              />
            </DatePicker>
          </Layer>
          <Layer className={styles.layer}>
            <Select
              id={'countrySelect'}
              labelText={t('selectCountry', 'Select Country')}
              placeholder={t('selectCountry', 'Select Country')}
              className={styles['fieldInput']}
              invalidText="Required"
              value={country}
              defaultValue={country}
              onChange={(event) =>
                setAdvancedSearchParams({
                  ...advancedSearchParams,
                  country: event.target.value,
                })
              }>
              <SelectItem key={'select-country'} text={'Select Country'} value={''}>
                {' '}
              </SelectItem>
              {countries.map((country) => (
                <SelectItem key={country.name} text={country.name} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </Select>
          </Layer>
        </Column>
      </Stack>
    </Form>
  );
};

export default AdvancedSearchForm;
