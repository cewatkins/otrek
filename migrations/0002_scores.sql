create table if not exists scores (
  user_id    text primary key,
  callsign   text not null,
  code       text not null,
  gold       integer not null,
  dmg        integer not null default 0,
  kills      integer not null default 0,
  breaks     integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists scores_gold_idx on scores (gold desc);
