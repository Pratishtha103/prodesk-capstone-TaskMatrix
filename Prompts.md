# Week 13
"Give a brief intro for tool like Jira and Asana."

"What are the common features seen in tools like Jira?"

"As a Frontend Developer, what features, I should focus on, for example and including Drag-and-drop Kanban boards, task assignment logic, deadline chron jobs, priority tagging, role management, and a real-time activity feed."

"What is a PRD? Give a small example."

"What AI Feature can a tool like Jira have except for AI Chatbots?"

"what should the admin dashboard include"

"what should team member dashboard include"

"admin will be able to create task, edit them, delete them and memebers can move tasks in todo progress and done right"

"if i keep multiple team, then there will have to be a team member related to a team, if task is assigned to team, how would the team member know what task they are assigned to? how to map this"

"I was thinking admin should be able to create, assign member, due date, edit and delete task, isn't kanban just for member, admin can see the status the task is in"

"if the manager is moving the same task the member is moving, wouldn't that create conflict"

"what should the task modal include"

"what about priority tagging, should that be admins feature or members too?"

"What is deadline chron jobs and how can it be implemented in frontend"

"What is real-time activity feed and how is it utilized in jira"

"when the assignment says Design a minimum of 3 core viewports (e.g., Auth Screen, Main Dashboard, Data Details View). what does data details view mean"

"help me decide
Primary brand color
Background
Surface (cards)
Success (Done)
Warning (Due Soon)
Danger (Overdue/Delete)"

"give me a font"

# Week 14

"Analyze phase 1 requirement a device an implementation plan to execute it based on last week's task
Phase 1: Base Routing & Form Scaffolding (P0 - Mandatory) Completing this fulfills your minimum functional requirement.

Routing: Scaffolding the core viewports within the Next.js App Router (/login, /register, /dashboard).

UI Architecture: Construct the Login and Registration forms. High-fidelity styling is not required this sprint, but state management and input handling must be fully functional.
"

"Mention all the files and folders that need to be created/ edited and remember to keep client and server side rendering seperate"

"What validation does a login / signup form need in an app like taskmatrix?"

"Create Login and Register form with minimal function, utilize the figma wireframes for input fields. Do not improve UI yet."

"make a summarized testing checklist for login and signup form"

"For Phase 2
Phase 2: BaaS Integration (P1 - Priority) We strongly recommend completing this to secure your auth pipeline.

Authentication Logic: Interface your forms with Firebase Auth, Supabase Auth, or NextAuth.js.

Verification: Prove that a user payload can successfully register an account and establish a logged-in state.,
what are the steps to establish a Firebase Auth with TaskMatrix"

"Implement each step and explain the code block by block"

"Give a short test checklist for this phase"

"create an implementation plan for Phase 3: Route Protection & Global State (P2 - Advanced) Engineers aiming for top performance reviews should execute these features. Protected Routes: Implement Next.js middleware or route guards. If an unauthenticated user attempts to hit /dashboard, the system must intercept and redirect them to /login. State Sync: Upon successful authentication, serialize the user's payload (Name, Email, UID) into your Redux/Zustand global store to hydrate the dashboard UI."

"Implement each step and explain the code block by block"

"Seperate client side components and routing pages"

"Give a short test checklist for this phase"

"implement usable kanban column"

# Week 15

"Analyze the requirements for this sprint and make a comprehensive implementation plan for the requirements mentioned, including every file changed/created and why"

"Implement Phase 1 read and create task features and give a testing checklist to manually test the features"

"Implement Phase 2 update and delete task features and give a testing checklist to manually test the features"

"Create an implementation plan for filtering and introducing charts"

"Implement and provide manual testing checklist to test the feature"

"Create an implementation plan for drag and drop"

"Implement and provide manual testing checklist to test the feature"

"I had initially created this store, how is this mapped with my current store, what new things are added or old are updated?"

"is the deadline crossed job feature implemented? has it been mentioned in the readme? when a task exceeds the duedate, a small yellow triangle with ! appears in the task item, indicating overdue, tell me where is this mentioned in the project?"

"If this feature were to be implemented, how would it be done?"

"Create a detailed implementation plan for part 1 and part 2 approach B"

"Proceed with the implementation"

"Instead of showing the medium/high batch on the task card, let the color of the border tell the user what priority it is. currently the Ui shows only a a left border, make it a full border"

"How can I make the sidebar non-scrollable with the dashboard/ other components ( like activity dashboard...), however, inside the sidebar, user can scroll, if the number of members increase."

"the taskmatrix beside the logo, make its color like the blue in the logo"

"do not hardcode the color"

"are there other hardcoded colors in the project"

"create a color for secondary, text and text-muted in globals.css. use these colors in entire project, secondary for borders(header + sidebar), text and text muted for text, except for priority bagde, charts, overdue tasks"

"Replace the logout text in header with a logout icon from lucide-react library I installed"

"what borders radius are being used for different components"

"link logo to dashboard, when logo is clicked dashboard url with dashboard panel opens"

"keep the dashboard background muted, but other components like search and filter, knaban boards, should have a white bg so it looks separate"

# Week 16

"What mock api endpoints in the current project am i using?"

"If you were to map the api endpoints from my readme.md what has been implemented?"

"What other AI integration I can perform for this project, except desc suggestion."

"I like the second one, which one do you think is best for a project like this?"

"These are the figma design for login and register page, create an implementation plan for phase one, include the login, register page styling too"

"Every task, has to have a unique id and duedate can't be optional, only desc can be optional, every task will have an assignee id and name, to which the task is being assigned to"

"proceed with the implementation plan and create a manual testing checklist to test the feature"

"when a task is deleted, and the task modal is opened for another task, the delete and saving button, say delteing and saving, why is the save and delete not happening instantly"

"when a task is added in the column, the length must not increase for all the column, if a task is added in todo, only todo column should expand to contain the task"

"the delete confirmation should be a modal of itself, do not use window.confirm()"

"implement toast for all success and error message across the application"

"create reusable footer content that will stay with each page"

"how to implement loading skeleton screens"

"what can an empty screen look like, for tasks"

"implement toast notification for error and success messages"

"create a global footer component with relevant copyright text TaskMatrix 2026"

"how to achieve similar behaviour for footer as other children components"

"how to implement scroll behaviour of footer exactly like the children components"

"Create a empty task banner for kanban boards when tasks are not present"

"the sign in and sign up form will have inline form validation, device a plan and test checklist"

"Create a Global theme toggle implementation plan and testing checklist"

"the metric cards and analytic charts appear a little bright in the dark theme, make their bg a little darker"

"update the implementation plan for activity feed to include only the past 24 hr activities visible in the feed"

# Week 17

"what is expected of this task Phase 3: The Lighthouse Audit (P2 - Advanced) Performance Profiling: Navigate to your LIVE URL in Chromium. Open DevTools → Lighthouse → "Analyze page load". Optimization Target: You must achieve a score of 90+ in both "Performance" and "Accessibility"

"current score 94 Performance 95 Accessibility, will adding aria labels in select for filter dropdowns increase this score
Failing Elements
All Priorities Low Priority Medium Priority High Priority
<select class="w-full sm:w-auto rounded-md border border-secondary px-3 py-2 text-sm text…">
All Assignees Me (AdminTaskMatrix) Membertest
<select class="w-full sm:w-auto rounded-md border border-secondary px-3 py-2 text-sm text…">"