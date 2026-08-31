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

create index if not exists idx_tasks_project_status on tasks(project_id, status);
create index if not exists idx_messages_conversation_sequence on messages(conversation_id, sequence);
create index if not exists idx_agent_runs_task_created on agent_runs(task_id, started_at);
create index if not exists idx_tool_runs_project_status on tool_runs(project_id, status);

