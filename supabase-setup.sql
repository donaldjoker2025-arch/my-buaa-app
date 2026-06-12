-- 请复制以下所有代码，粘贴到 Supabase 左侧菜单的 [SQL Editor] -> [New Query] 中，并点击 [Run] 运行。

-- 1. 创建访问量表
CREATE TABLE IF NOT EXISTS public.page_visits (
  visit_date date PRIMARY KEY,
  visits integer DEFAULT 1
);

-- 2. 开启行级安全策略 (RLS)，允许所有人读取数据
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'page_visits' AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access" ON public.page_visits FOR SELECT USING (true);
  END IF;
END $$;

-- 3. 创建一个安全的“自动+1”函数，防止恶意刷数据
CREATE OR REPLACE FUNCTION increment_page_visit(p_date date)
RETURNS integer AS $$
DECLARE
  new_count integer;
BEGIN
  INSERT INTO public.page_visits (visit_date, visits)
  VALUES (p_date, 1)
  ON CONFLICT (visit_date) DO UPDATE
  SET visits = page_visits.visits + 1
  RETURNING visits INTO new_count;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
