create table if not exists projects (
  id uuid primary key,
  name text not null,
  description text not null default '',
  status text not null default 'PLANNING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists agents (
  id uuid primary key,
  name text not null,
  role text not null,
  status text not null default 'IDLE',
  color text not null,
  created_at timestamptz not null default now()
);

create table if not exists project_agents (
  project_id uuid not null references projects(id) on delete cascade,
  agent_id uuid not null references agents(id) on delete cascade,
  role text not null,
  primary key (project_id, agent_id)
);

create table if not exists conversations (
  id uuid primary key,
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key,
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null,
  content text not null,
  sequence integer not null,
  created_at timestamptz not null default now(),
  unique (conversation_id, sequence)
);

create table if not exists tasks (
  id uuid primary key,
  project_id uuid not null references projects(id) on delete cascade,
  assignee_agent_id uuid references agents(id),
  title text not null,
  description text not null default '',
  status text not null default 'TODO',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists task_dependencies (
  task_id uuid not null references tasks(id) on delete cascade,
  depends_on_task_id uuid not null references tasks(id) on delete cascade,
  primary key (task_id, depends_on_task_id),
  check (task_id <> depends_on_task_id)
);

create table if not exists agent_runs (
  id uuid primary key,
  task_id uuid not null references tasks(id) on delete cascade,
  agent_id uuid not null references agents(id),
  status text not null,
  input jsonb not null default '{}',
  output jsonb,
  error text,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists meetings (
  id uuid primary key,
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  status text not null default 'SCHEDULED',
  agenda text not null default '',
  summary text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists meeting_participants (
  meeting_id uuid not null references meetings(id) on delete cascade,
  agent_id uuid not null references agents(id),
  primary key (meeting_id, agent_id)
);

create table if not exists meeting_messages (
  id uuid primary key,
  meeting_id uuid not null references meetings(id) on delete cascade,
  agent_id uuid references agents(id),
  role text not null,
  content text not null,
  sequence integer not null,
  created_at timestamptz not null default now(),
  unique (meeting_id, sequence)
);

create table if not exists approvals (
  id uuid primary key,
  target_type text not null,
  target_id uuid not null,
  status text not null default 'PENDING',
  decided_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists tool_runs (
  id uuid primary key,
  tool_id text not null,
  project_id uuid not null references projects(id) on delete cascade,
  requested_by uuid references agents(id),
  status text not null default 'PENDING_APPROVAL',
  input jsonb not null default '{}',
  output jsonb,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists preferences (
  id boolean primary key default true check (id = true),
  overlay_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists events (
  id uuid primary key,
  type text not null,
  project_id uuid references projects(id) on delete cascade,
  payload jsonb not null default '{}',
  occurred_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key,
  github_id text unique not null,
  login text not null,
  display_name text not null default '',
  role text not null default 'CEO',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists sessions (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  token_hash text unique not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists decisions (
  id uuid primary key,
  project_id uuid not null references projects(id) on delete cascade,
  meeting_id uuid references meetings(id) on delete set null,
  question text not null,
  options jsonb not null default '[]',
  chosen_option text,
  rationale text not null default '',
  decided_by uuid references agents(id),
  confidence numeric,
  created_at timestamptz not null default now()
);

create table if not exists action_items (
  id uuid primary key,
  project_id uuid not null references projects(id) on delete cascade,
  meeting_id uuid references meetings(id) on delete set null,
  task_id uuid references tasks(id) on delete set null,
  assignee_agent_id uuid references agents(id),
  title text not null,
  due_at timestamptz,
  status text not null default 'OPEN',
  created_at timestamptz not null default now()
);

create table if not exists qa_reviews (
  id uuid primary key,
  project_id uuid not null references projects(id) on delete cascade,
  task_id uuid references tasks(id) on delete cascade,
  reviewer_agent_id uuid references agents(id),
  result text not null check (result in ('PASS', 'FAIL')),
  evidence text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists memories (
  id uuid primary key,
  project_id uuid not null references projects(id) on delete cascade,
  type text not null,
  summary text not null,
  content jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_tasks_project_status on tasks(project_id, status);
create index if not exists idx_messages_conversation_sequence on messages(conversation_id, sequence);
create index if not exists idx_agent_runs_task_created on agent_runs(task_id, started_at);
create index if not exists idx_tool_runs_project_status on tool_runs(project_id, status);
create index if not exists idx_events_project_occurred on events(project_id, occurred_at);
create index if not exists idx_sessions_token_hash on sessions(token_hash);
create index if not exists idx_memories_project_type on memories(project_id, type);
create index if not exists idx_decisions_project_created on decisions(project_id, created_at);
create index if not exists idx_meeting_messages_meeting_sequence on meeting_messages(meeting_id, sequence);
