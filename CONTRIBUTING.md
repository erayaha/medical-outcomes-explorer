# Contributing

Thanks for helping improve Medical Outcomes Explorer.

## Development workflow

1. Install dependencies with `yarn install`.
2. Refresh or inspect local data with `yarn data:refresh` when needed.
3. Run the site locally with `yarn dev` and verify the affected route in a browser.
4. Keep changes static-hosting friendly: no runtime server code and no private data.

## Data update playbook

- CMS hospital general information should remain joinable by CCN/provider ID.
- Outcome and intervention snapshots should be versioned under `/data/YYYY-MM`.
- Device mappings should be updated in `data/2026-05/device_to_measure_map.json` until a richer curation flow exists.
- Clearly document heuristic links between devices and hospital measures.
