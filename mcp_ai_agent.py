import os
import json
import httpx
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("embeddable-ai-agent")

BASE_URL = os.getenv("EMBEDDABLE_BASE_URL", "")
TOKEN = os.getenv("EMBEDDABLE_TOKEN", "")


def headers():
    if not TOKEN:
        raise ValueError("EMBEDDABLE_TOKEN is not set. Please set it via environment variable or ask the user.")
    return {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}


@mcp.tool()
def get_models() -> str:
    """Returns available Cube data models with their dimensions and measures."""
    with httpx.Client() as client:
        response = client.get(f"{BASE_URL}/ai/v1/models", headers=headers())
        response.raise_for_status()
        return json.dumps(response.json(), indent=2)


@mcp.tool()
def execute_query(
    dataset_id: str,
    dimensions: list[str] | None = None,
    measures: list[str] | None = None,
    filters: list[dict] | None = None,
    time_dimensions: list[dict] | None = None,
    order: list[list[str]] | None = None,
    limit: int | None = None,
    offset: int | None = None,
    timezone: str | None = None,
    count_rows: bool = False,
) -> str:
    """
    Execute a data query against the embeddable's model.

    dataset_id: UUID of the dataset to query against.

    filters format: [{"member": "model.field", "operator": "equals", "values": ["value"]}]
    Operators: equals, notEquals, contains, notContains, startsWith, endsWith, gt, gte, lt, lte, set, notSet, inDateRange, notInDateRange, beforeDate, afterDate, measureFilter

    time_dimensions format: [{"dimension": "model.date", "dateRange": ["YYYY-MM-DD", "YYYY-MM-DD"], "granularity": "day"}]
    Granularity options: second, minute, hour, day, week, month, quarter, year

    order format: [["model.field", "asc"]]
    """
    body = {k: v for k, v in {
        "datasetId": dataset_id,
        "dimensions": dimensions,
        "measures": measures,
        "filters": filters,
        "timeDimensions": time_dimensions,
        "order": order,
        "limit": limit,
        "offset": offset,
        "timezone": timezone,
        "countRows": count_rows,
    }.items() if v is not None}

    with httpx.Client() as client:
        response = client.post(f"{BASE_URL}/ai/v1/query", headers=headers(), json=body)
        response.raise_for_status()
        return json.dumps(response.json(), indent=2)


@mcp.tool()
def get_datasets() -> str:
    """Returns available datasets with their id, name, model, and availableInCustomCanvas flag. Use this to resolve a datasetId before calling execute_query."""
    with httpx.Client() as client:
        response = client.get(f"{BASE_URL}/ai/v1/embeddable/metadata", headers=headers())
        response.raise_for_status()
        return json.dumps(response.json().get("datasets", []), indent=2)


@mcp.tool()
def get_embeddable_metadata() -> str:
    """
    Returns full embeddable config including:
    - widgets: configured chart/table widgets with their inputConfiguration
    - selfServeWidgets: self-serve widgets available for the canvas
    - templateWidgets: reusable template chart definitions
    - starterCanvasWidgets: pre-built starter layout widgets (each has id, templateId, inputConfiguration, filters, limit, order, w, h)
    - variables: dashboard variables (id, name, type, defaultValue, array)
    - variableListeners: variable dependency graph
    - dashboardParams: global dashboard parameters
    - datasets: available datasets (id, name, model, availableInCustomCanvas)
    - bundleHash: current bundle version hash
    """
    with httpx.Client() as client:
        response = client.get(f"{BASE_URL}/ai/v1/embeddable/metadata", headers=headers())
        response.raise_for_status()
        return json.dumps(response.json(), indent=2)


@mcp.tool()
def get_canvas_state() -> str:
    """
    Returns the current custom canvas state including:
    - components: list of widgets on the canvas, each with:
        - id (UUID), templateId (UUID), key (string)
        - inputConfiguration: Map<string, any> of input values
        - subInputConfiguration: nested per-value input overrides
        - filters: Map<datasetName, list of filters> where each filter has member, operator, value, valueType, nativeDataType
        - limit: Map<datasetName, int>
        - order: Map<datasetName, list of strings>
        - w (1–16), h (1–12), heightResolution (1–4), widthResolution (1–2)
    - version: canvas version number
    """
    with httpx.Client() as client:
        response = client.get(f"{BASE_URL}/ai/v1/custom-canvas/request-state", headers=headers())
        response.raise_for_status()
        return json.dumps(response.json(), indent=2)


@mcp.tool()
def create_canvas_widget(
    id: str,
    template_id: str,
    request_id: str,
    input_configuration: dict,
    sub_input_configuration: dict | None = None,
    filters: dict | None = None,
    limit: dict | None = None,
    order: dict | None = None,
    w: int = 1,
    h: int = 1,
    height_resolution: int | None = None,
    width_resolution: int | None = None,
) -> str:
    """
    Add a new widget to the custom canvas.

    id: UUID for the new widget instance.
    template_id: UUID of the template chart to instantiate (from get_embeddable_metadata templateWidgets).
    request_id: Unique UUID for this request (for idempotency).
    input_configuration: Map of input name -> value (e.g. {"datasetId": "<uuid>", "metric": "orders.count"}).
    sub_input_configuration: Optional nested per-value input overrides. Key is parent input name (e.g. "columns"),
        value is Map<parentValue, Map<inputName, any>>.
    filters: Optional Map<datasetName, list of filters>. Each filter: {"member": "model.field", "operator": "equals", "value": "x", "valueType": "...", "nativeDataType": "..."}.
    limit: Optional Map<datasetName, int> row limits per dataset.
    order: Optional Map<datasetName, list of strings> sort order per dataset.
    w: Width in grid columns (1–16, default 1).
    h: Height in grid rows (1–12, default 1).
    height_resolution: Optional height resolution multiplier (1–4).
    width_resolution: Optional width resolution multiplier (1–2).
    """
    body = {k: v for k, v in {
        "id": id,
        "templateId": template_id,
        "requestId": request_id,
        "inputConfiguration": input_configuration,
        "subInputConfiguration": sub_input_configuration,
        "filters": filters,
        "limit": limit,
        "order": order,
        "w": w,
        "h": h,
        "heightResolution": height_resolution,
        "widthResolution": width_resolution,
    }.items() if v is not None}
    with httpx.Client() as client:
        response = client.post(f"{BASE_URL}/ai/v1/custom-canvas/create", headers=headers(), json=body)
        response.raise_for_status()
        return json.dumps(response.json(), indent=2)


@mcp.tool()
def update_canvas_widget(
    id: str,
    request_id: str,
    input_configuration: dict,
    sub_input_configuration: dict | None = None,
    filters: dict | None = None,
    limit: dict | None = None,
    order: dict | None = None,
) -> str:
    """
    Update an existing widget on the custom canvas.

    id: UUID of the widget to update (from get_canvas_state components).
    request_id: Unique UUID for this request (for idempotency).
    input_configuration: Full replacement Map of input name -> value.
    sub_input_configuration: Optional nested per-value input overrides (replaces existing).
    filters: Optional Map<datasetName, list of filters> (replaces existing).
    limit: Optional Map<datasetName, int> (replaces existing).
    order: Optional Map<datasetName, list of strings> (replaces existing).
    """
    body = {k: v for k, v in {
        "id": id,
        "requestId": request_id,
        "inputConfiguration": input_configuration,
        "subInputConfiguration": sub_input_configuration,
        "filters": filters,
        "limit": limit,
        "order": order,
    }.items() if v is not None}
    with httpx.Client() as client:
        response = client.put(f"{BASE_URL}/ai/v1/custom-canvas/update", headers=headers(), json=body)
        response.raise_for_status()
        return json.dumps(response.json(), indent=2)


@mcp.tool()
def delete_canvas_widget(id: str, request_id: str) -> str:
    """
    Remove a widget from the custom canvas.

    id: UUID of the widget to delete (from get_canvas_state components).
    request_id: Unique UUID for this request (for idempotency).
    """
    body = {"id": id, "requestId": request_id}
    with httpx.Client() as client:
        response = client.request("DELETE", f"{BASE_URL}/ai/v1/custom-canvas/delete", headers=headers(), json=body)
        response.raise_for_status()
        return "Deleted successfully"


@mcp.tool()
def reorder_canvas_widgets(updates: dict, request_id: str) -> str:
    """
    Reorder widgets on the custom canvas.

    updates: Map of widget UUID -> new zero-based index position (e.g. {"<uuid>": 0, "<uuid2>": 1}).
    request_id: Unique UUID for this request (for idempotency).
    """
    body = {"updates": updates, "requestId": request_id}
    with httpx.Client() as client:
        response = client.post(f"{BASE_URL}/ai/v1/custom-canvas/reorder", headers=headers(), json=body)
        response.raise_for_status()
        return "Reordered successfully"


@mcp.tool()
def resize_canvas_widget(
    id: str,
    request_id: str,
    w: int,
    h: int,
    height_resolution: int | None = None,
    width_resolution: int | None = None,
) -> str:
    """
    Resize a widget on the custom canvas.

    id: UUID of the widget to resize (from get_canvas_state components).
    request_id: Unique UUID for this request (for idempotency).
    w: New width in grid columns (1–16).
    h: New height in grid rows (1–12).
    height_resolution: Optional height resolution multiplier (1–4).
    width_resolution: Optional width resolution multiplier (1–2).
    """
    body = {k: v for k, v in {
        "id": id,
        "requestId": request_id,
        "w": w,
        "h": h,
        "heightResolution": height_resolution,
        "widthResolution": width_resolution,
    }.items() if v is not None}
    with httpx.Client() as client:
        response = client.post(f"{BASE_URL}/ai/v1/custom-canvas/resize", headers=headers(), json=body)
        response.raise_for_status()
        return "Resized successfully"


if __name__ == "__main__":
    mcp.run()
