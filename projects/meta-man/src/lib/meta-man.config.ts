export type MetaManConfig = Readonly<{
  /**
   * Fixed portion of the title, usually the website name.
   */
  baseTitle?: string;

  /**
   * Application host, used for building canonical urls.
   */
  host?: string;

  /**
   * Whether or not to include twitter tags.
   */
  includeTwitter?: boolean;
}>;
