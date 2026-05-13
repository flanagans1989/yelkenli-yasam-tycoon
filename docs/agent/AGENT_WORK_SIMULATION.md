# Agent Work Simulation

## Morning start
- Agent starts the day by checking the current date and time.
- Ensures all necessary tools and dependencies are up to date.

## Read packet
- Agent reads the latest packet from the project management system.
- Confirms the contents of the packet with the team lead if any questions arise.

## Run Aider
- Agent runs the Aider tool to analyze the current state of the project.
- Reviews the output and identifies any potential issues or areas for improvement.

## Git status check after packet
- Agent checks the git status to ensure there are no uncommitted changes.
- If there are uncommitted changes, agent commits them with a descriptive message.

## Stop rule on forbidden changes
- Agent implements a stop rule that prevents any changes that could potentially break the system.
- Any changes that violate this rule must be reviewed and approved by the team lead before proceeding.

## Error logging to errors_log.md
- If an error occurs during the simulation, agent logs it in the errors_log.md file with all relevant details.
- Ensures that the error is properly documented and reported to the appropriate team members.

## Final report
- Agent prepares a final report summarizing the day's work.
- Includes any notable issues or areas for improvement identified during the simulation.
- Sends the report to the project manager for review.
