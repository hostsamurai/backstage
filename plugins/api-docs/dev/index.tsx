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
import { createDevApp } from '@backstage/dev-utils';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { ApiExplorerPage, apiDocsPlugin } from '../src/plugin';
import streetlightsApiEntity from './example-api-with-custom-fields.yaml';
import petstoreApiEntity from './example-api.yaml';
import { customColumns, customFilters } from './customizations';

createDevApp()
  .registerApi({
    api: catalogApiRef,
    deps: {},
    factory: () =>
      (({
        async getEntities() {
          return { items: [petstoreApiEntity, streetlightsApiEntity] };
        },
      } as unknown) as typeof catalogApiRef.T),
  })
  .registerPlugin(apiDocsPlugin)
  .addPage({ element: <ApiExplorerPage /> })
  .addPage({
    path: '/api-docs/custom',
    element: (
      <ApiExplorerPage columns={customColumns} filters={customFilters} />
    ),
  })
  .render();
