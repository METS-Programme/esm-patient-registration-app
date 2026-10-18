import React, { useCallback, useEffect, useId, useState } from 'react';
import { ActionableNotification, Button, Layer, Select, SelectItem, SkeletonText } from '@carbon/react';
import { TrashCan, UserMultiple } from '@carbon/react/icons';
import { FieldArray } from 'formik';
import { useTranslation } from 'react-i18next';
import { Autosuggest } from '../../input/custom-input/autosuggest/autosuggest.component';
import { usePatientRegistrationContext } from '../../patient-registration-context';
import { fetchPerson } from '../../patient-registration.resource';
import { useResourcesContext } from '../../../resources-context';
import { type RelationshipValue } from '../../patient-registration.types';
import styles from './relationships.scss';

interface RelationshipType {
  display: string;
  uuid: string;
  direction: string;
}

interface RelationshipViewProps {
  relationship: RelationshipValue;
  index: number;
  displayRelationshipTypes: RelationshipType[];
  remove: <T>(index: number) => T;
}

const RelationshipView: React.FC<RelationshipViewProps> = ({
  relationship,
  index,
  displayRelationshipTypes,
  remove,
}) => {
  const { t } = useTranslation();
  const { setFieldValue } = usePatientRegistrationContext();
  const [isInvalid, setIsInvalid] = useState(false);
  const newRelationship = !relationship.uuid;
  const selectId = useId();

  const handleRelationshipTypeChange = useCallback(
    (event) => {
      const { target } = event;
      const field = target.name;
      const value = target.options[target.selectedIndex].value;
      setFieldValue(field, value);
      if (!relationship?.action) {
        setFieldValue(`relationships[${index}].action`, 'UPDATE');
      }
    },
    [index, relationship?.action, setFieldValue],
  );

  const handleSuggestionSelected = useCallback(
    (field: string, selectedSuggestion: string) => {
      setIsInvalid(!selectedSuggestion);
      setFieldValue(field, selectedSuggestion);
    },
    [setFieldValue],
  );

  const searchPerson = async (query: string) => {
    const abortController = new AbortController();
    return await fetchPerson(query, abortController);
  };

  const deleteRelationship = useCallback(() => {
    if (relationship.action === 'ADD') {
      remove(index);
    } else {
      setFieldValue(`relationships[${index}].action`, 'DELETE');
    }
  }, [relationship, index, remove, setFieldValue]);

  const restoreRelationship = useCallback(() => {
    setFieldValue(`relationships[${index}]`, {
      ...relationship,
      action: undefined,
      relationshipType: relationship.initialrelationshipTypeValue,
    });
  }, [index, setFieldValue, relationship]);

  return relationship.action !== 'DELETE' ? (
    <tr className={styles.relationshipRow}>
      <td className={styles.nameCell}>
        {newRelationship ? (
          <Autosuggest
            id={`relationships[${index}].relatedPersonUuid`}
            labelText={t('relativeFullNameLabelText', 'Full name')}
            placeholder={t('relativeNamePlaceholder', 'Firstname Familyname')}
            defaultValue={relationship.relatedPersonName}
            onSuggestionSelected={handleSuggestionSelected}
            invalid={isInvalid}
            invalidText={t('relationshipPersonMustExist', 'Related person must be an existing person')}
            getSearchResults={searchPerson}
            getDisplayValue={(item) => item.display}
            getFieldValue={(item) => item.uuid}
          />
        ) : (
          <span className={styles.cellText}>{relationship.relatedPersonName}</span>
        )}
      </td>
      <td className={styles.typeCell}>
        <Select
          id={selectId}
          hideLabel
          labelText={t('relationshipTypeHeaderText', 'Relationship type')}
          onChange={handleRelationshipTypeChange}
          name={`relationships[${index}].relationshipType`}
          value={relationship.relationshipType || 'placeholder-item'}>
          <SelectItem
            disabled
            hidden
            value="placeholder-item"
            text={t('relationshipToPatient', 'Relationship to patient')}
          />
          {displayRelationshipTypes.map((relationshipType, index) => (
            <SelectItem
              text={relationshipType.display}
              value={`${relationshipType.uuid}/${relationshipType.direction}`}
              key={`relationship-${relationshipType.uuid}-${index}`}
            />
          ))}
        </Select>
      </td>
      <td className={styles.contactCell}>
        <span className={styles.cellMuted}>&mdash;</span>
      </td>
      <td className={styles.actionsCell}>
        <Button
          kind="ghost"
          hasIconOnly
          iconDescription={t('deleteRelationshipTooltipText', 'Delete')}
          onClick={deleteRelationship}
          renderIcon={(props) => <TrashCan size={16} {...props} className={styles.trashCan} />}
        />
      </td>
    </tr>
  ) : (
    <tr>
      <td colSpan={4}>
        <ActionableNotification
          kind="info"
          title={t('relationshipRemovedText', 'Relationship removed')}
          actionButtonLabel={t('restoreRelationshipActionButton', 'Undo')}
          onActionButtonClick={restoreRelationship}
        />
      </td>
    </tr>
  );
};

export const RelationshipsSection = () => {
  const { relationshipTypes } = useResourcesContext();
  const [displayRelationshipTypes, setDisplayRelationshipTypes] = useState<RelationshipType[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (relationshipTypes) {
      const tmp: RelationshipType[] = [];
      relationshipTypes.results.forEach((type) => {
        const aIsToB = {
          display: type.displayAIsToB ? type.displayAIsToB : type.displayBIsToA,
          uuid: type.uuid,
          direction: 'aIsToB',
        };
        const bIsToA = {
          display: type.displayBIsToA ? type.displayBIsToA : type.displayAIsToB,
          uuid: type.uuid,
          direction: 'bIsToA',
        };
        if (aIsToB.display === bIsToA.display) {
          tmp.push(aIsToB);
        } else if (bIsToA.display === 'Patient') {
          tmp.push(aIsToB, { display: `Patient (${aIsToB.display})`, uuid: type.uuid, direction: 'bIsToA' });
        } else {
          tmp.push(aIsToB, bIsToA);
        }
      });
      setDisplayRelationshipTypes(tmp);
    }
  }, [relationshipTypes]);

  if (!relationshipTypes) {
    return (
      <section aria-label="Loading relationships section">
        <div role="progressbar" aria-label={t('loading', 'Loading')}>
          <SkeletonText />
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Relationships section">
      <FieldArray name="relationships">
        {({
          remove,
          form: {
            values: { relationships },
          },
        }) => (
          <table className={styles.relationshipsTable}>
            <thead>
              <tr>
                <th scope="col">{t('nameHeaderText', 'Name')}</th>
                <th scope="col">{t('relationshipTypeHeaderText', 'Relationship type')}</th>
                <th scope="col">{t('contactHeaderText', 'Contact')}</th>
                <th scope="col" className={styles.actionsHeader}>
                  {t('actionsHeaderText', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {relationships && relationships.length > 0 ? (
                relationships.map((relationship: RelationshipValue, index) => (
                  <RelationshipView
                    key={relationship.uuid ?? relationship.clientId}
                    relationship={relationship}
                    index={index}
                    displayRelationshipTypes={displayRelationshipTypes}
                    remove={remove}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <div className={styles.emptyState}>
                      <UserMultiple size={20} className={styles.emptyStateIcon} />
                      <div>
                        <p className={styles.emptyStateTitle}>{t('noRelationshipsAdded', 'No relationships added')}</p>
                        <p className={styles.emptyStateHint}>
                          {t('addRelationshipHint', 'Add a guardian, caregiver, or related person where applicable.')}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </FieldArray>
    </section>
  );
};
