export type MetaData = Readonly<{
  title?: string | null;
  description?: string | null;
  image?: string | null;
  twitter?: Readonly<{ image?: string | null }>;
}>;
