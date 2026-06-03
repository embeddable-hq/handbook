# Public AI Endpoints

These are the public AI endpoints exposed by Embeddable's backend. They are designed to be consumed by AI agents and MCP servers, enabling LLMs to query data, read dashboard configuration, and manage a custom canvas on behalf of users.

---

# Authentication

All endpoints require a **Security Token** issued by the Embeddable token API.

Pass it as a Bearer token in the `Authorization` header:

```
Authorization: Bearer <security-token-jwt>
```

The JWT payload contains a `securityTokenId` claim (UUID) that scopes every request to a specific embeddable + workspace.

---

# Base URL

```
EU: https://api.eu.embeddable.com
US: https://api.us.embeddable.com
```

All REST paths below are relative to this base.

---

# REST Endpoints

## 1. Get Embeddable Metadata

```
GET /ai/v1/embeddable/metadata
```

- Details
    
    Returns the full configuration for the embeddable associated with the security token — widgets, datasets, variables, and layout parameters. Use this as the starting point for any agent that needs to understand what charts and data sources exist.
    
    **Headers**
    
    | Header | Required | Description |
    | --- | --- | --- |
    | Authorization | ✅ | `Bearer <security-token-jwt>` |
    
    **Notes**
    
    - `datasets[].id` is the `datasetId` required by `POST /ai/v1/query`
    - `templateWidgets[].id` is the `templateId` used in `POST /ai/v1/custom-canvas/create`
    - `starterCanvasWidgets` are pre-built layout presets an agent can copy to seed the canvas
    
    **Response `200 OK`**
    
    ```json
    {
      "widgets": [
        {
          "id": "<uuid>",
          "name": "string",
          "inputConfiguration": { "<inputName>": "<value>" }
        }
      ],
      "selfServeWidgets": [ { "..." } ],
      "templateWidgets": [
        {
          "id": "<uuid>",
          "name": "string",
          "inputConfiguration": { "..." }
        }
      ],
      "starterCanvasWidgets": [
        {
          "id": "<uuid>",
          "templateId": "<uuid>",
          "inputConfiguration": { "..." },
          "filters": {},
          "limit": {},
          "order": {},
          "w": 4,
          "h": 3
        }
      ],
      "variables": [
        {
          "id": "<uuid>",
          "name": "string",
          "type": "string",
          "defaultValue": "string",
          "array": false
        }
      ],
      "variableListeners": { "<variableId>": ["<dependentVariableId>"] },
      "dashboardParams": { "..." },
      "datasets": [
        {
          "id": "<uuid>",
          "name": "string",
          "model": "string",
          "availableInCustomCanvas": true
        }
      ],
      "bundleHash": "string"
    }
    ```
    

---

## 2. Get Data Models

```
GET /ai/v1/models
```

- Details
    
    Returns all available Cube.js data models — the raw schema an agent needs to know before constructing a query (valid dimension/measure names, types, descriptions).
    
    **Headers**
    
    | Header | Required | Description |
    | --- | --- | --- |
    | Authorization | ✅ | `Bearer <security-token-jwt>` |
    
    **Notes**
    
    - `name` on dimensions/measures follows the pattern `<modelName>.<fieldName>` — use this exact string in query bodies
    - `__type__` is `"dimension"` or `"measure"`
    
    **Response `200 OK`**
    
    ```json
    [
      {
        "name": "orders",
        "title": "Orders",
        "connectedComponent": 1,
        "dimensions": [
          {
            "name": "orders.status",
            "title": "Status",
            "nativeType": "string",
            "description": "Order status",
            "meta": null,
            "__type__": "dimension"
          }
        ],
        "measures": [
          {
            "name": "orders.count",
            "title": "Count",
            "nativeType": "number",
            "description": null,
            "meta": null,
            "__type__": "measure"
          }
        ]
      }
    ]
    ```
    

---

## 3. Execute Query

```
POST /ai/v1/query
```

- Details
    
    Execute a structured data query against a dataset. Returns raw rows plus optional total count.
    
    **Headers**
    
    | Header | Required | Default | Description |
    | --- | --- | --- | --- |
    | Authorization | ✅ | — | `Bearer <security-token-jwt>` |
    | External-System-Request-Id | ☐ | random UUID | Client-assigned idempotency UUID for this request |
    | External-System-Request-Sequence-Number | ☐ | `1` | Sequence number for ordering requests within the same logical operation |
    
    **Body Fields**
    
    | Field | Type | Required | Description |
    | --- | --- | --- | --- |
    | datasetId | UUID | ✅ | ID of the dataset to query (from `GET /ai/v1/embeddable/metadata`) |
    | dimensions | string[] | ☐ | List of dimension names (`model.field`) |
    | measures | string[] | ☐ | List of measure names (`model.field`) |
    | filters | Filter[] | ☐ | Array of filter conditions (see Filter Object below) |
    | timeDimensions | TimeDimension[] | ☐ | Time-based filters with optional granularity |
    | order | string[][] | ☐ | Sort order: `[["model.field", "asc"]]` |
    | limit | integer | ☐ | Max rows to return |
    | offset | long | ☐ | Number of rows to skip (pagination) |
    | timezone | string | ☐ | IANA timezone (e.g. `"America/New_York"`) |
    | countRows | boolean | ☐ | If `true`, include `total` count in response. Default: `false` |
    
    **Filter Object** — `filters[]`
    
    | Field | Type | Required | Description |
    | --- | --- | --- | --- |
    | member | string | ✅ | Dimension or measure name (`model.field`) |
    | operator | string | ✅ | One of: `equals`, `notEquals`, `contains`, `notContains`, `startsWith`, `endsWith`, `gt`, `gte`, `lt`, `lte`, `set`, `notSet`, `inDateRange`, `notInDateRange`, `beforeDate`, `afterDate`, `measureFilter` |
    | values | any[] | ☐ | Filter values. Omit for `set` / `notSet` operators |
    
    **TimeDimension Object** — `timeDimensions[]`
    
    | Field | Type | Required | Description |
    | --- | --- | --- | --- |
    | dimension | string | ✅ | Date/time dimension name |
    | dateRange | string or string[2] | ☐ | Named range (e.g. `"last 7 days"`) or `["YYYY-MM-DD", "YYYY-MM-DD"]` |
    | granularity | string | ☐ | `second`, `minute`, `hour`, `day`, `week`, `month`, `quarter`, `year` |
    
    **Request Body — example**
    
    ```json
    {
      "datasetId": "<uuid>",
      "dimensions": ["orders.status", "orders.createdAt"],
      "measures": ["orders.count", "orders.revenue"],
      "filters": [
        {
          "member": "orders.status",
          "operator": "equals",
          "values": ["completed"]
        }
      ],
      "timeDimensions": [
        {
          "dimension": "orders.createdAt",
          "dateRange": ["2024-01-01", "2024-12-31"],
          "granularity": "month"
        }
      ],
      "order": [["orders.createdAt", "asc"]],
      "limit": 100,
      "offset": 0,
      "timezone": "America/New_York",
      "countRows": false
    }
    ```
    
    **Response `200 OK`**
    
    ```json
    {
      "cubeRequestId": "<uuid>",
      "externalRequestId": "<uuid>",
      "requestSequenceNumber": 1,
      "data": [
        { "orders.status": "completed", "orders.count": 142 }
      ],
      "total": 142,
      "error": null,
      "preAggregationTriggered": false
    }
    ```
    
    | Field | Type | Description |
    | --- | --- | --- |
    | cubeRequestId | UUID | Internal request ID assigned by Cube |
    | externalRequestId | UUID | Echoes back the `External-System-Request-Id` header |
    | requestSequenceNumber | integer | Echoes back the sequence number header |
    | data | object[] | Result rows. Keys are `model.field` strings |
    | total | long | Total row count (only present when `countRows: true`) |
    | error | string | Error message if query failed; otherwise null |
    | preAggregationTriggered | boolean | Whether a pre-aggregation was triggered |

---

## 4. Get Canvas State

```
GET /ai/v1/custom-canvas/request-state
```

- Details
    
    Returns the current state of the custom canvas — every widget currently placed, including its position, size, configuration, and applied filters.
    
    **Headers**
    
    | Header | Required | Description |
    | --- | --- | --- |
    | Authorization | ✅ | `Bearer <security-token-jwt>` |
    
    **Notes**
    
    - `version` increments on every mutation — use it to detect stale reads
    - `components[].id` is the widget instance UUID needed by update / delete / resize / reorder
    
    **Response `200 OK`**
    
    ```json
    {
      "components": [
        {
          "id": "<uuid>",
          "templateId": "<uuid>",
          "key": "string",
          "inputConfiguration": { "<inputName>": "<value>" },
          "subInputConfiguration": {
            "<parentInputName>": {
              "<parentValue>": { "<subInputName>": "<value>" }
            }
          },
          "filters": {
            "<datasetName>": [
              {
                "member": "model.field",
                "operator": "equals",
                "value": "x",
                "valueType": "string",
                "nativeDataType": "string"
              }
            ]
          },
          "limit": { "<datasetName>": 100 },
          "order": { "<datasetName>": ["model.field asc"] },
          "w": 4,
          "h": 3,
          "heightResolution": null,
          "widthResolution": null
        }
      ],
      "version": 5
    }
    ```
    

---

## 5. Create Canvas Widget

```
POST /ai/v1/custom-canvas/create
```

- Details
    
    Add a new widget to the custom canvas.
    
    **Headers**
    
    | Header | Required | Description |
    | --- | --- | --- |
    | Authorization | ✅ | `Bearer <security-token-jwt>` |
    
    **Body Fields**
    
    | Field | Type | Required | Constraints | Description |
    | --- | --- | --- | --- | --- |
    | id | UUID | ✅ | — | Client-assigned UUID for the new widget instance |
    | templateId | UUID | ✅ | — | UUID of a template widget (from `templateWidgets` in metadata) |
    | requestId | UUID | ✅ | — | Idempotency key for this request |
    | inputConfiguration | Map<string, any> | ✅ | — | Input values keyed by input name |
    | subInputConfiguration | Map<string, Map<string, Map<string, any>>> | ☐ | — | Nested per-value input overrides |
    | filters | Map<string, Filter[]> | ☐ | — | Per-dataset filter overrides. Key = dataset name |
    | limit | Map<string, int> | ☐ | — | Per-dataset row limit |
    | order | Map<string, string[]> | ☐ | — | Per-dataset sort order |
    | w | integer | ☐ | 1–16 | Width in grid columns. Default: `1` |
    | h | integer | ☐ | 1–12 | Height in grid rows. Default: `1` |
    | heightResolution | integer | ☐ | 1–4 | Height resolution multiplier |
    | widthResolution | integer | ☐ | 1–2 | Width resolution multiplier |
    
    **Request Body — example**
    
    ```json
    {
      "id": "<uuid>",
      "templateId": "<uuid>",
      "requestId": "<uuid>",
      "inputConfiguration": { "datasetId": "<uuid>", "metric": "orders.count" },
      "subInputConfiguration": null,
      "filters": {},
      "limit": {},
      "order": {},
      "w": 4,
      "h": 3,
      "heightResolution": null,
      "widthResolution": null
    }
    ```
    
    **Response `201 Created`** — empty body
    

---

## 6. Update Canvas Widget

```
PUT /ai/v1/custom-canvas/update
```

- Details
    
    Replace the configuration of an existing canvas widget. All supplied fields overwrite the current values.
    
    **Headers**
    
    | Header | Required | Description |
    | --- | --- | --- |
    | Authorization | ✅ | `Bearer <security-token-jwt>` |
    
    **Body Fields**
    
    | Field | Type | Required | Description |
    | --- | --- | --- | --- |
    | id | UUID | ✅ | UUID of the widget to update (from `GET /ai/v1/custom-canvas/request-state`) |
    | requestId | UUID | ✅ | Idempotency key |
    | inputConfiguration | Map<string, any> | ✅ | Full replacement input configuration |
    | subInputConfiguration | Map<string, Map<string, Map<string, any>>> | ☐ | Full replacement sub-input configuration |
    | filters | Map<string, Filter[]> | ☐ | Full replacement per-dataset filters |
    | limit | Map<string, int> | ☐ | Full replacement per-dataset limits |
    | order | Map<string, string[]> | ☐ | Full replacement per-dataset sort orders |
    
    **Request Body — example**
    
    ```json
    {
      "id": "<uuid>",
      "requestId": "<uuid>",
      "inputConfiguration": { "datasetId": "<uuid>", "metric": "orders.revenue" },
      "subInputConfiguration": null,
      "filters": {},
      "limit": {},
      "order": {}
    }
    ```
    
    **Response `204 No Content`**
    

---

## 7. Delete Canvas Widget

```
DELETE /ai/v1/custom-canvas/delete
```

- Details
    
    Remove a widget from the canvas.
    
    **Headers**
    
    | Header | Required | Description |
    | --- | --- | --- |
    | Authorization | ✅ | `Bearer <security-token-jwt>` |
    
    **Body Fields**
    
    | Field | Type | Required | Description |
    | --- | --- | --- | --- |
    | id | UUID | ✅ | UUID of the widget to delete |
    | requestId | UUID | ✅ | Idempotency key |
    
    **Request Body — example**
    
    ```json
    {
      "id": "<uuid>",
      "requestId": "<uuid>"
    }
    ```
    
    **Response `204 No Content`**
    

---

## 8. Reorder Canvas Widgets

```
POST /ai/v1/custom-canvas/reorder
```

- Details
    
    Change the display order of widgets on the canvas.
    
    **Headers**
    
    | Header | Required | Description |
    | --- | --- | --- |
    | Authorization | ✅ | `Bearer <security-token-jwt>` |
    
    **Body Fields**
    
    | Field | Type | Required | Description |
    | --- | --- | --- | --- |
    | updates | Map<UUID, int> | ✅ | Map of widget UUID → new zero-based display index |
    | requestId | UUID | ✅ | Idempotency key |
    
    **Request Body — example**
    
    ```json
    {
      "updates": {
        "<widget-uuid>": 0,
        "<widget-uuid-2>": 1
      },
      "requestId": "<uuid>"
    }
    ```
    
    **Response `204 No Content`**
    

---

## 9. Resize Canvas Widget

```
POST /ai/v1/custom-canvas/resize
```

- Details
    
    Change the dimensions of a canvas widget within the grid.
    
    **Headers**
    
    | Header | Required | Description |
    | --- | --- | --- |
    | Authorization | ✅ | `Bearer <security-token-jwt>` |
    
    **Body Fields**
    
    | Field | Type | Required | Constraints | Description |
    | --- | --- | --- | --- | --- |
    | id | UUID | ✅ | — | UUID of the widget to resize |
    | requestId | UUID | ✅ | — | Idempotency key |
    | w | integer | ✅ | 1–16 | New width in grid columns |
    | h | integer | ✅ | 1–12 | New height in grid rows |
    | heightResolution | integer | ☐ | 1–4 | Height resolution multiplier |
    | widthResolution | integer | ☐ | 1–2 | Width resolution multiplier |
    
    **Request Body — example**
    
    ```json
    {
      "id": "<uuid>",
      "requestId": "<uuid>",
      "w": 8,
      "h": 4,
      "heightResolution": null,
      "widthResolution": null
    }
    ```
    
    **Response `204 No Content`**
    

---

# Error Handling

All REST errors return `400 Bad Request` with:

```json
{
  "errorType": "PROBLEM_LOADING_DATA",
  "message": "...",
  "retryMessage": "Try again later"
}
```

---

# MCP Quick-Start

A ready-to-use MCP server (Python / FastMCP) implementing all tools above is available at **`mcp_ai_agent.py`** in the backend repository.

**Environment variables**

| Variable | Description |
| --- | --- |
| `EMBEDDABLE_BASE_URL` | Base URL of the Embeddable instance |
| `EMBEDDABLE_TOKEN` | Security token JWT |

**Run**

```bash
pip install fastmcp httpx
python mcp_ai_agent.py
```

**Available MCP tools**

| Tool | Maps to |
| --- | --- |
| `get_embeddable_metadata` | `GET /ai/v1/embeddable/metadata` |
| `get_datasets` | `GET /ai/v1/embeddable/metadata` (returns `datasets` only) |
| `get_models` | `GET /ai/v1/models` |
| `execute_query` | `POST /ai/v1/query` |
| `get_canvas_state` | `GET /ai/v1/custom-canvas/request-state` |
| `create_canvas_widget` | `POST /ai/v1/custom-canvas/create` |
| `update_canvas_widget` | `PUT /ai/v1/custom-canvas/update` |
| `delete_canvas_widget` | `DELETE /ai/v1/custom-canvas/delete` |
| `reorder_canvas_widgets` | `POST /ai/v1/custom-canvas/reorder` |
| `resize_canvas_widget` | `POST /ai/v1/custom-canvas/resize` |

### Sample MCP Code

[mcp_ai_agent.py.zip](Public%20AI%20Endpoints/mcp_ai_agent.py.zip)