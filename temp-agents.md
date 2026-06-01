# Tech Review: Endpoints for AI Agents to Query Data and Build Charts

> 📋 **Jira:** https://trevorio.atlassian.net/browse/PROD-392
> 

## Overview

This feature introduces a set of public API endpoints (under `/ai/v1/*`) that allow customers to embed AI-powered data querying and chart/dashboard creation into their own products. The API is designed to be consumed by a **customer's AI agent** acting on behalf of **end users** (the customer's customers).

End users can describe what they want in natural language — *"show me sales performance this quarter"* — and the customer's AI translates that into fully rendered charts on their personal custom canvas, without any manual building. The AI reasoning stays with the customer; Embeddable provides the tools the AI needs: data access, chart rendering, and canvas management.

This tech review covers only the **API endpoints** to be exposed for AI agents. MCP server support may be layered on top of these endpoints in a future iteration if needed.

> 💡 **End users** in this context are our **customers' customers** — the people using the product that the customer has built on top of Embeddable.
> 

**In scope:**

- New read endpoints under `/ai/v1/*` for data models, queries, embeddable metadata, and custom canvas state
- New mutation endpoints under `/ai/v1/custom-canvas/*` for creating, reordering, resizing, updating, and deleting charts and dashboards on custom canvas
- Authorization via the existing security token API

## Services Affected

- Backend

## API Endpoints

### Read Endpoints

**Get available data models**

```
GET /ai/v1/models
```

Returns the list of all data models (dimensions, measures, descriptions) available for the published embeddable's model version, scoped by the security token. This gives the AI agent the full schema it needs to construct valid queries.

**Execute an ad-hoc query**

```
POST /ai/v1/query
```

Runs a query against a data model. Mirrors `POST /workspace/{workspaceId}/playground/query`. The AI agent constructs the query body from the model schema returned by `GET /ai/v1/models`.

**Get embeddable metadata**

```jsx
GET /ai/v1/embeddable/metadata
```

Returns all information about the embeddable — including available chart templates and the chart types that end users are allowed to create on their custom canvas. This gives the AI enough context to choose the right chart type and define it correctly.

**Get custom canvas state**

```
GET /ai/v1/custom-canvas/request-state
```

Returns the current state of the end user's custom canvas — the charts that currently exist, along with their positions, sizes, and configurations. This lets the AI see what the end user sees and know what it is editing. While the embeddable metadata provides the template and available chart types (shared across all users of an embeddable), the custom canvas state is per end user — each user's canvas is independent, scoped to their security token. This endpoint serves that per-user state.

### Mutation Endpoints (Custom Canvas)

All mutation endpoints use **existing custom canvas services**, exposed via REST under `/ai/v1/custom-canvas/*`. Custom canvas is the self-service space for end-user charts — whether created manually or via AI, they appear in the same place.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/ai/v1/custom-canvas/create` | Create a new chart (or full dashboard with multiple charts) on the end user's custom canvas |
| `POST` | `/ai/v1/custom-canvas/reorder` | Reorder charts on the custom canvas |
| `POST` | `/ai/v1/custom-canvas/resize` | Resize a chart on the custom canvas |
| `PUT` | `/ai/v1/custom-canvas/update` | Update or edit an existing chart on the custom canvas |
| `DELETE` | `/ai/v1/custom-canvas/delete` | Delete a chart or dashboard from the custom canvas |

## Authorization Flow

All `/ai/v1/*` endpoints are authenticated using the **existing security token API**. The security token already contains:

- Which data models the end user is allowed to see (row-level security / security context)
- Which custom canvas chart types and widgets are available to the end user
- The embeddable context the token is scoped to

No new authentication mechanism is needed. Customers generate a security token for their end user (as they do today) and pass it to their AI agent, which uses it for all `/ai/v1/*` calls. Every response is automatically scoped to that end user's security context.

## Scenarios

**Scenario 1: Customer wants AI only for data querying (no existing embeddable)**

Some customers may want to use the AI data query endpoints without an existing embeddable for their end users. They can achieve this by **creating a dummy embeddable** and using it solely to generate security tokens for AI agent use.

**Scenario 2: Customer has multiple embeddables on the same screen**

When a customer renders multiple embeddables simultaneously on a single page — each with its own security token — they would need to **provide all tokens to the AI agent**. The assumption is that the AI agent is smart enough to identify and use the correct token for each operation, for example by correlating chart types and model availability to the right token.

## Flow Diagrams

### End-to-end: AI agent builds a chart for an end user

```jsx
End User (Customer's Customer)
        │
        │  1. "Show me sales performance this quarter"
        ▼
Customer's AI Agent
        │
        │  2. GET /ai/v1/models              → understand available data models
        │  3. GET /ai/v1/embeddable/metadata → understand available chart types
        │  4. POST /ai/v1/query              → run data query
        │  6. GET /ai/v1/custom-canvas/request-state → see current canvas state
        │  7. POST /ai/v1/custom-canvas/create       → create chart on canvas
        ▼
Embeddable API  (authenticated via Security Token)
        │
        │  8. Applies end user's security context (row-level security)
        │  9. Delegates to existing custom canvas service
        │  10. Writes chart to end user's Custom Canvas
        ▼
End User's Custom Canvas
        │
        │  11. Chart appears and is interactive — same as manually created charts
        ▼
End User sees the chart
```

### Authorization flow

```
Customer's Backend
        │
        │  1. Generate security token for end user
        │     (same as today — encodes models, canvas widgets, RLS context)
        ▼
Customer's AI Agent
        │
        │  2. Attach token to all /ai/v1/* requests
        ▼
Embeddable API
        │
        │  3. Validates token
        │  4. Derives workspace, embeddable, and end-user context from token
        │  5. Scopes all responses to end user's security context
        ▼
Response  (models / query results / canvas state / mutation result)
```

### Multi-embeddable on same screen

```
Customer's AI Agent
        │
        │  Receives tokens:  [token_A (embeddable A), token_B (embeddable B)]
        │
        ├─── GET /ai/v1/embeddable/metadata (token_A) → chart types for embeddable A
        ├─── GET /ai/v1/embeddable/metadata (token_B) → chart types for embeddable B
        │
        │  AI identifies which embeddable is relevant for the operation
        │
        ├─── POST /ai/v1/custom-canvas/create (token_A) → chart on embeddable A canvas
        └─── POST /ai/v1/custom-canvas/create (token_B) → chart on embeddable B canvas
```

## Backend Changes

### New Endpoints

All new endpoints live under `/ai/v1/*` and are authenticated via the existing security token. A new controller (e.g. `AiApiController`) should be created to keep AI-facing concerns separated from other public API surfaces.

- `GET /ai/v1/models` — delegates to existing model/cube service, scoped by token
- `POST /ai/v1/query` — delegates to `SyncCubeQueryService.executeQuery()`, mirrors playground query
- `GET /ai/v1/embeddable/metadata` — returns embeddable template and available chart type definitions
- `GET /ai/v1/custom-canvas/request-state` — returns current custom canvas state for the end user
- `POST /ai/v1/custom-canvas/create` — delegates to existing custom canvas creation service
- `POST /ai/v1/custom-canvas/reorder` — delegates to existing custom canvas reorder service
- `POST /ai/v1/custom-canvas/resize` — delegates to existing custom canvas resize service
- `PUT /ai/v1/custom-canvas/update` — delegates to existing custom canvas update service
- `DELETE /ai/v1/custom-canvas/delete` — delegates to existing custom canvas delete service

### Implementation Notes

- The security token provides workspace, embeddable, and end-user context — no additional path parameters needed.
- Mutation endpoints reuse existing custom canvas services; no new business logic is required.

## Database Changes

None. These endpoints are a new surface over existing services.

## Security Considerations

- **Authentication:** Security token only (scoped to embeddable + end user). No unauthenticated access.
- **Authorization:** The token is scoped to a specific embeddable and end user — queries and canvas operations are implicitly restricted to that context. No cross-user or cross-workspace data leakage is possible.
- **Row-level security:** The security context embedded in the token is applied on every data query. The AI cannot access data the end user is not allowed to see.

Questions:
- How to notify the frontend when mutation happens on custom canvas by AI agent?