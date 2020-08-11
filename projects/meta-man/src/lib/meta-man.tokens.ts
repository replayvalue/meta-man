import { InjectionToken } from "@angular/core";
import { MetaManConfig } from "./meta-man.config";

export const META_MAN_CONFIG_TOKEN = new InjectionToken<MetaManConfig>(
  "meta-man.config"
);
