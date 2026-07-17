# Container & Terminal AI Tools

- **Status**: Planned
- **Priority**: P1 - quick win; the system prompt currently apologizes that these tools "are not yet exposed" while intermodal is one of our differentiators
- **Effort**: S
- **Category**: AI differentiation / intermodal

## Why

`AiDispatchSystemPrompt` tells the agent to treat `Container` / `OriginTerminal` / `DestinationTerminal`
as "informational metadata." An intermodal-aware agent (only ContainerTrucks, terminal hours, box
availability) is table stakes for the [drayage vertical](drayage-vertical.md) and cheap to ship now.

## What to build

- `GetContainerStatusTool` (`get_container_status`): ISO 6346 lookup → status, current terminal, seal, B/L, linked load. Read tool via the `add-dispatch-tool` skill.
- `GetTerminalInfoTool` (`get_terminal_info`): UN/LOCODE lookup → name, type (port/rail/depot), address for deadhead calcs.
- Update the "Container & Terminal entities" section of `AiDispatchSystemPrompt` to describe the tools and intermodal assignment rules (ContainerTruck-only, factor terminal location into deadhead).
- Both tools appear on the MCP server automatically via `AiDispatchToolRegistry`.
- Later (with drayage vertical): demurrage-deadline awareness in assignment priority.

## Acceptance

Given an unassigned intermodal load, the agent reasons about the container's terminal location in its deadhead comparison and cites container status in its suggestion reasoning.

## Notes

_(add dated implementation notes here)_
