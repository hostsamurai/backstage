/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import {
  ApiEntityV1alpha1,
  Entity,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import {
  CodeSnippet,
  Table,
  TableState,
  useQueryParamState,
  WarningPanel,
} from '@backstage/core';
import {
  formatEntityRefTitle,
  getEntityRelations,
} from '@backstage/plugin-catalog-react';
import {
  CustomizableTableProps,
  defaultColumns,
  defaultFilters,
  EntityRow,
} from './defaults';
import { toTableColumnsArray, toTableFiltersArray } from './utils';

type ExplorerTableProps = CustomizableTableProps & {
  entities: Entity[];
  loading: boolean;
  error?: any;
};

export const ApiExplorerTable = ({
  entities,
  loading,
  error,
  columns: customColumns,
  filters: customFilters,
}: ExplorerTableProps) => {
  const [queryParamState, setQueryParamState] = useQueryParamState<TableState>(
    'apiTable',
  );

  if (error) {
    return (
      <WarningPanel severity="error" title="Could not fetch catalog entities.">
        <CodeSnippet language="text" text={error.toString()} />
      </WarningPanel>
    );
  }

  const filters = customFilters
    ? toTableFiltersArray(customFilters)
    : defaultFilters;
  const columns = customColumns
    ? toTableColumnsArray(customColumns)
    : defaultColumns;

  const rows = entities.map((entity: Entity) => {
    const partOfSystemRelations = getEntityRelations(entity, RELATION_PART_OF, {
      kind: 'system',
    });
    const ownedByRelations = getEntityRelations(entity, RELATION_OWNED_BY);

    return {
      entity: entity as ApiEntityV1alpha1,
      resolved: {
        name: formatEntityRefTitle(entity, {
          defaultKind: 'API',
        }),
        ownedByRelationsTitle: ownedByRelations
          .map(r => formatEntityRefTitle(r, { defaultKind: 'group' }))
          .join(', '),
        ownedByRelations,
        partOfSystemRelationTitle: partOfSystemRelations
          .map(r =>
            formatEntityRefTitle(r, {
              defaultKind: 'system',
            }),
          )
          .join(', '),
        partOfSystemRelations,
      },
    };
  });

  return (
    <Table<EntityRow>
      isLoading={loading}
      columns={columns}
      options={{
        paging: false,
        actionsColumnIndex: -1,
        loadingType: 'linear',
        padding: 'dense',
        showEmptyDataSourceMessage: !loading,
      }}
      data={rows}
      filters={filters}
      initialState={queryParamState}
      onStateChange={setQueryParamState}
    />
  );
};
