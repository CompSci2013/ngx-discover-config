# @halolabs/ngx-discover-config

Configuration schema and generic adapters for the ngx-discover library suite.

## What This Library Provides

This is the **leaf dependency** in the ngx-discover stack. It defines the configuration interfaces that all other libraries depend on, plus generic adapter implementations that eliminate domain-specific boilerplate.

### Key Exports

| Export | Purpose |
|--------|---------|
| `ResourceDefinition` | Single source of truth for a domain's fields. Drives URL mappers, API adapters, table configs, and filter definitions from one declaration. |
| `DomainConfig<TFilters, TData, TStatistics>` | Complete domain wiring: adapters, UI configs, feature flags. Injected via `DOMAIN_CONFIG` token. |
| `GenericUrlMapper` | Configuration-driven URL parameter mapping — reads `ResourceDefinition` fields automatically. |
| `GenericApiAdapter` | Configuration-driven API adapter — reads `ResourceDefinition` fields to map filters to API params. |
| `generateTableConfig()` | Generates `TableConfig` from a `ResourceDefinition`. |
| `generateTableFilterDefinitions()` | Generates inline table filter definitions from a `ResourceDefinition`. |
| `FilterDefinition<T>` | Query Control chip-dialog filters (multiselect, range, text, date). |
| `TableFilterDefinition` | Inline table column filters (text, number, autocomplete). |
| `PickerConfig<T>` | Multi-select table picker with pagination, serialization, caching. |
| `IFilterUrlMapper<T>` | Interface: filter object to/from URL parameters. |
| `IApiAdapter<T, D, S>` | Interface: fetch data from API given filters. |
| `ICacheKeyBuilder<T>` | Interface: build cache keys from filters. |
| `DomainConfigRegistry` | Multi-domain registry for apps serving multiple domains. |
| `PickerConfigRegistry` | Registry for picker configurations. |
| `DOMAIN_CONFIG` | Injection token for `DomainConfig`. |
| `ENVIRONMENT_CONFIG` | Injection token for environment configuration. |

## Installation

### From GitLab npm Registry

Add to your project's `.npmrc`:

```
@halolabs:registry=http://gitlab.minilab/api/v4/groups/7/-/packages/npm/
//gitlab.minilab/api/v4/groups/7/-/packages/npm/:_authToken=YOUR_TOKEN
```

Then install:

```bash
npm install @halolabs/ngx-discover-config
```

### Peer Dependencies

| Dependency | Version |
|------------|---------|
| `@angular/core` | `^14.0.0` |
| `@angular/router` | `^14.0.0` |
| `rxjs` | `^7.0.0` |

## Usage

### Define a Resource

```typescript
import { ResourceDefinition, ResourceField } from '@halolabs/ngx-discover-config';

const nameField: ResourceField = {
  name: 'name',
  label: 'Name',
  type: 'string',
  filterable: true,
  sortable: true,
  visible: true,
  filterType: 'autocomplete',
  autocompleteEndpoint: 'filters/names'
};

export const MY_RESOURCE: ResourceDefinition = {
  name: 'my-domain',
  label: 'My Domain',
  fields: [nameField, /* ... */],
  endpoints: { search: '/items', stats: '/items/statistics' },
  pagination: { defaultSize: 20, sizeOptions: [10, 20, 50] },
  sorting: { defaultField: 'name', defaultDirection: 'asc' },
  dataKey: 'id'
};
```

### Use Generic Adapters

```typescript
import {
  GenericUrlMapper,
  GenericApiAdapter,
  generateTableConfig,
  generateTableFilterDefinitions
} from '@halolabs/ngx-discover-config';

// One ResourceDefinition drives everything:
const urlMapper = new GenericUrlMapper(MY_RESOURCE);
const apiAdapter = new GenericApiAdapter(apiService, MY_RESOURCE, {
  baseUrl: 'http://api.example.com',
  dataTransformer: MyItem.fromApiResponse,
  statisticsTransformer: MyStats.fromApiResponse
});
const tableConfig = generateTableConfig(MY_RESOURCE);
const filterDefs = generateTableFilterDefinitions(MY_RESOURCE);
```

## Architecture

This library is pure TypeScript — no `NgModule`. It has no runtime Angular dependencies beyond `@angular/core` (for `InjectionToken` and `Injectable`).

```
@halolabs/ngx-discover-config  <-- you are here (leaf)
         ^
@halolabs/ngx-discover-state   (depends on config)
         ^
@halolabs/ngx-discover-framework (depends on config + state)
```

## Building

```bash
npm install
npm run build   # ng build config --configuration production
```

Output goes to `dist/ngx-discover-config/`.

## Publishing

See the [GitLab npm registry publishing procedure](http://gitlab.minilab/halo/ngx-discover-config/-/blob/main/PUBLISHING.md).
