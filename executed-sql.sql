create table points (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  image text,
  embedding vector(1536)  -- taille pour OpenAI embeddings
);

create or replace function match_points (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  name text,
  description text,
  image text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    p.id,
    p.name,
    p.description,
    p.image,
    1 - (p.embedding <=> query_embedding) as similarity
  from points p
  where 1 - (p.embedding <=> query_embedding) > match_threshold
  order by p.embedding <=> query_embedding
  limit match_count;
end;
$$;
