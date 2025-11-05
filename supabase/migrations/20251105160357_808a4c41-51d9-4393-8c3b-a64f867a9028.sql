-- Add DELETE policy for cases (only admins can delete)
CREATE POLICY "Admins can delete cases"
  ON public.cases FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));