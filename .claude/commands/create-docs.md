# Create Documentation

You are creating new documentation for the Embeddable handbook. Follow this workflow:

## Step 1: Gather Requirements

Ask the user these questions using AskUserQuestion (can ask multiple at once):

1. **Topic**: What is the documentation about?
2. **Section**: Where should this page live? (Reference the handbook sections and their audiences from STYLEGUIDE.md)
3. **Context**: Are there existing pages to reference or adapt from? (Ask for file paths)
4. **Goal**: What should readers be able to do after reading this?

## Step 2: Research

Before writing anything:

1. Read the referenced context files the user provided
2. Read STYLEGUIDE.md to understand writing conventions
3. Read the `_meta.json` for the target section to understand structure
4. Look at 1-2 similar pages in that section to match the tone and format

## Step 3: Create a Plan

Enter plan mode and create a plan that includes:

- Page title and filename
- Target audience (from STYLEGUIDE.md personas)
- Page structure (headings outline)
- Files to create/modify (including _meta.json)
- Key content points

Present the plan to the user for feedback. Iterate until approved.

## Step 4: Write the Documentation

Follow these principles:

- **Task-oriented**: Organize by what users want to achieve
- **Scannable**: Use clear headings, bullet points, tables
- **Practical**: Lead with common use cases, put exhaustive references at the end
- **Concise**: This is a reference manual, not a blog post

Writing style:
- Write TO the audience, not about them
- Link important concepts rather than just bolding
- Include code examples when explaining SDK/technical features
- Include screenshots/visuals when discussing the platform UI

## Step 5: Iterate

After the first draft:

1. Show the user what was created
2. Ask for feedback
3. Make revisions as needed
4. Repeat until the user is satisfied

## Step 6: Verify

Once the user approves the content:

1. Update the section's `_meta.json` to include the new page
2. Add cross-links from related pages if appropriate
3. Run `pnpm dev` to verify the page renders correctly

## Reference Files

- Writing guidelines: STYLEGUIDE.md
- Project context: .claude/claude.md
- Example well-structured page: pages/component-libraries/custom-canvas-components.mdx
