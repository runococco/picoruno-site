-- 誰かのメモ帳：返事のメモを引いたときに「ひとつ前のメモ」と「最初の質問」も見せる
-- Supabase の SQL Editor にこのファイルをまるごと貼りつけて Run してください。何度実行しても大丈夫です。
-- （memo-notes.sql を実行したあとに使う前提。テーブルやメモは変わりません）

-- あるメモの「ひとつ前」と「いちばん最初」の本文（通報で隠れたメモは出さない）
create or replace function public.memo_context(p_id bigint)
returns table(prev_body text, first_body text)
language sql security definer stable set search_path = public as $$
  with recursive up as (
    select n.id, n.parent_id, n.body, n.hidden, 0 as lvl from public.memo_notes n where n.id = p_id
    union all
    select p.id, p.parent_id, p.body, p.hidden, u.lvl + 1
      from public.memo_notes p join up u on p.id = u.parent_id
     where u.lvl < 500
  )
  select (select case when not u.hidden then u.body end from up u where u.lvl = 1),
         (select case when not u.hidden then u.body end from up u where u.lvl >= 2 and u.parent_id is null)
$$;

drop function if exists public.memo_draw(bigint[]);
create function public.memo_draw(p_exclude bigint[] default '{}')
returns table(id bigint, body text, depth int, ink smallint, reply_count int, created_at timestamptz, prev_body text, first_body text)
language plpgsql security definer set search_path = public as $$
declare picked bigint;
begin
  select s.id into picked
    from (select n.id, n.served_count from public.memo_notes n
           where not n.hidden and not (n.id = any(coalesce(p_exclude[1:200], '{}')))
           order by n.id desc limit 3000) s
   order by least(s.served_count, 30) + random() * 4
   limit 1;
  if picked is null then return; end if;
  update public.memo_notes set served_count = served_count + 1 where memo_notes.id = picked;
  return query select n.id, n.body, n.depth, n.ink, n.reply_count, n.created_at, c.prev_body, c.first_body
                 from public.memo_notes n cross join lateral public.memo_context(n.id) c where n.id = picked;
end $$;

drop function if exists public.memo_get(bigint);
create function public.memo_get(p_id bigint)
returns table(id bigint, body text, depth int, ink smallint, reply_count int, created_at timestamptz, prev_body text, first_body text)
language sql security definer stable set search_path = public as $$
  select n.id, n.body, n.depth, n.ink, n.reply_count, n.created_at, c.prev_body, c.first_body
    from public.memo_notes n cross join lateral public.memo_context(n.id) c
   where n.id = p_id and not n.hidden
$$;

revoke all on function public.memo_context(bigint) from public, anon, authenticated;
revoke all on function public.memo_draw(bigint[]), public.memo_get(bigint) from public;
grant execute on function public.memo_draw(bigint[]), public.memo_get(bigint) to anon, authenticated;
